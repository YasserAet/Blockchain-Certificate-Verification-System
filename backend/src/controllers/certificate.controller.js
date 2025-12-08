import { AppError } from '../middleware/errorHandler.js';
import { pool } from '../config/database.js';
import { getCertificateRegistryContract, getFraudDetectionContract, getCertificateRegistry, getWallet } from '../config/blockchain.js';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

export const uploadCertificate = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { studentId, recipientEmail, recipientName, title, description, issueDate, expiryDate, courseId } = req.body;

    if (req.user.role !== 'institution') {
      throw new AppError('Only institutions can upload certificates', 403);
    }

    const institutionResult = await pool.query(
      'SELECT id, name FROM users WHERE id = $1 AND role = $2',
      [req.user.id, 'institution']
    );

    if (institutionResult.rows.length === 0) {
      throw new AppError('Institution not found', 404);
    }

    const institutionName = institutionResult.rows[0].name;

    // Find or create student by email
    let studentIdToUse = studentId;
    
    if (!studentIdToUse && recipientEmail) {
      // Try to find existing student
      const studentResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [recipientEmail]
      );

      if (studentResult.rows.length > 0) {
        studentIdToUse = studentResult.rows[0].id;
      } else {
        // Create a new student account if not exists
        const newStudentResult = await pool.query(
          `INSERT INTO users (email, name, role, password, created_at, updated_at)
           VALUES ($1, $2, 'student', 'pending', NOW(), NOW())
           RETURNING id`,
          [recipientEmail, recipientName || recipientEmail.split('@')[0]]
        );
        studentIdToUse = newStudentResult.rows[0].id;
      }
    }

    if (!studentIdToUse) {
      throw new AppError('Student ID or recipient email is required', 400);
    }

    // Insert certificate into database with verified status
    const certificateResult = await pool.query(
      `INSERT INTO certificates (student_id, institution_id, title, description, issue_date, expiry_date, status, recipient_name, recipient_email, institution_name, course_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
       RETURNING *`,
      [studentIdToUse, req.user.id, title, description || null, issueDate, expiryDate || null, 'verified', recipientName, recipientEmail, institutionName, courseId || null]
    );

    const certificate = certificateResult.rows[0];

    // Store certificate on blockchain
    let blockchainTxHash = null;
    try {
      const certificateRegistry = getCertificateRegistry();
      const wallet = getWallet();
      
      if (!certificateRegistry || !wallet) {
        throw new Error('Blockchain not configured');
      }
      
      // Generate certificate hash from certificate data
      const certData = JSON.stringify({
        id: certificate.id,
        title: certificate.title,
        recipientName: certificate.recipient_name,
        recipientEmail: certificate.recipient_email,
        institutionName: certificate.institution_name,
        issueDate: certificate.issue_date
      });
      const dataHash = crypto.createHash('sha256').update(certData).digest('hex');
      
      // For student address, we'll use a deterministic address based on student email
      // In production, students would have their own wallet addresses
      const studentAddress = '0x' + crypto.createHash('sha256').update(recipientEmail).digest('hex').substring(0, 40);
      
      // Convert expiry date to timestamp (0 if no expiry)
      const expiryTimestamp = expiryDate ? Math.floor(new Date(expiryDate).getTime() / 1000) : 0;
      
      console.log(`Issuing certificate ${certificate.id} to ${studentAddress} on blockchain...`);
      
      // Issue certificate on blockchain
      const tx = await certificateRegistry.issueCertificate(
        certificate.id.toString(),
        studentAddress,
        dataHash,
        expiryTimestamp
      );
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      blockchainTxHash = receipt.hash;
      
      console.log(`✅ Certificate ${certificate.id} stored on blockchain: ${blockchainTxHash}`);
      
      // Update certificate with blockchain hash
      await pool.query(
        'UPDATE certificates SET blockchain_tx_hash = $1 WHERE id = $2',
        [blockchainTxHash, certificate.id]
      );
      
      certificate.blockchain_tx_hash = blockchainTxHash;
    } catch (blockchainError) {
      console.error('Blockchain storage failed:', blockchainError.message);
      // Continue even if blockchain storage fails - certificate is in database
    }

    // Call ML service for fraud detection (async, non-blocking)
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://ml-service:8000';
    
    try {
      // Generate sample features for fraud detection (replace with actual feature extraction)
      const features = [
        Math.random() * 5, // Replace with actual certificate features
        Math.random() * 5,
        Math.random() * 5,
        Math.random() * 5,
        Math.random() * 5,
        Math.random() * 5,
        Math.random() * 5,
        Math.random() * 5,
        Math.random() * 5,
        Math.random() * 5
      ];

      const fraudResponse = await fetch(`${ML_SERVICE_URL}/fraud-detection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          features,
          certificate_id: certificate.id.toString()
        })
      });

      if (fraudResponse.ok) {
        const fraudData = await fraudResponse.json();
        
        // Update certificate with fraud score (ML service returns 0-100, store as-is)
        await pool.query(
          'UPDATE certificates SET fraud_score = $1, updated_at = NOW() WHERE id = $2',
          [fraudData.fraud_score, certificate.id]
        );

        // If high fraud score, store in blockchain
        if (fraudData.fraud_score > 70) {
          try {
            const fraudContract = getFraudDetectionContract();
            const certHash = crypto.createHash('sha256').update(certificate.id.toString()).digest('hex');
            await fraudContract.storeFraudScore('0x' + certHash, Math.floor(fraudData.fraud_score));
          } catch (blockchainError) {
            console.error('Blockchain fraud storage failed:', blockchainError);
          }
        }
      }
    } catch (mlError) {
      console.error('ML service error:', mlError);
      // Continue even if ML service fails
    }

    res.status(201).json({
      success: true,
      message: 'Certificate uploaded successfully',
      data: { certificate }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCertificates = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    let query = `
      SELECT c.*, 
             s.name as student_name, s.email as student_email,
             i.name as institution_name, i.institution
      FROM certificates c
      JOIN users s ON c.student_id = s.id
      JOIN users i ON c.institution_id = i.id
    `;
    const params = [];

    if (req.user.role === 'student') {
      query += ' WHERE c.student_id = $1';
      params.push(req.user.id);
    } else if (req.user.role === 'institution') {
      query += ' WHERE c.institution_id = $1';
      params.push(req.user.id);
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      data: {
        certificates: result.rows,
        count: result.rows.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCertificateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT c.*, 
              s.name as student_name, s.email as student_email,
              i.name as institution_name, i.institution
       FROM certificates c
       JOIN users s ON c.student_id = s.id
       JOIN users i ON c.institution_id = i.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Certificate not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { certificate: result.rows[0] }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCertificate = async (req, res, next) => {
  try {
    const { id, hash } = req.params;

    let query;
    let params;

    if (hash) {
      // Search by blockchain hash
      query = `SELECT c.* 
       FROM certificates c
       WHERE c.blockchain_tx_hash = $1`;
      params = [hash];
    } else {
      // Search by ID
      query = `SELECT c.* 
       FROM certificates c
       WHERE c.id = $1`;
      params = [id];
    }

    const dbResult = await pool.query(query, params);

    if (dbResult.rows.length === 0) {
      throw new AppError('Certificate not found', 404);
    }

    const certificate = dbResult.rows[0];
    let blockchainVerified = false;
    let txHash = certificate.blockchain_tx_hash;
    let blockNumber = null;

    // Try to verify on blockchain if transaction hash exists
    if (certificate.blockchain_tx_hash) {
      try {
        const certContract = getCertificateRegistryContract();
        if (certContract) {
          const certHash = crypto.createHash('sha256').update(certificate.id.toString()).digest('hex');
          blockchainVerified = await certContract.verifyCertificate('0x' + certHash);
        }
      } catch (blockchainError) {
        console.error('Blockchain verification failed:', blockchainError);
      }
    }

    // Determine if certificate is valid
    const isValid = certificate.status === 'verified' || certificate.status === 'pending';
    const result = isValid ? 'valid' : 'invalid';

    // Save verification history if user is employer
    if (req.user && req.user.role === 'employer') {
      try {
        await pool.query(
          `INSERT INTO verification_history (employer_id, certificate_id, verified_at, result, certificate_title)
           VALUES ($1, $2, NOW(), $3, $4)`,
          [req.user.id, certificate.id, result, certificate.title]
        );
      } catch (historyError) {
        console.error('Failed to save verification history:', historyError);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        certificate: certificate,
        blockchain: {
          isVerified: blockchainVerified,
          txHash: txHash,
          blockNumber: blockNumber
        },
        isValid: isValid,
        message: isValid ? 'Certificate is valid and verified' : 'Certificate is invalid or revoked'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getVerificationHistory = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      throw new AppError('Only employers can view verification history', 403);
    }

    const result = await pool.query(
      `SELECT vh.id, vh.certificate_id, vh.verified_at, vh.result, vh.certificate_title
       FROM verification_history vh
       WHERE vh.employer_id = $1
       ORDER BY vh.verified_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

export const downloadCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    // Get certificate details
    const certResult = await pool.query(
      'SELECT * FROM certificates WHERE id = $1',
      [id]
    );

    if (certResult.rows.length === 0) {
      throw new AppError('Certificate not found', 404);
    }

    const certificate = certResult.rows[0];

    // Check authorization - student can download their own, institution can download their issued certs
    if (req.user.role === 'student' && certificate.student_id !== req.user.id) {
      throw new AppError('Not authorized to download this certificate', 403);
    }
    if (req.user.role === 'institution' && certificate.institution_id !== req.user.id) {
      throw new AppError('Not authorized to download this certificate', 403);
    }

    // Check if file exists
    const uploadsDir = process.env.UPLOADS_DIR || '/app/uploads/certificates';
    const files = fs.readdirSync(uploadsDir);
    const certFile = files.find(f => f.includes(`cert-`) && f.includes(id));

    if (!certFile) {
      throw new AppError('Certificate file not found', 404);
    }

    const filePath = path.join(uploadsDir, certFile);

    // Send file
    res.download(filePath, `${certificate.title.replace(/\s+/g, '_')}_certificate.pdf`, (err) => {
      if (err) {
        console.error('Download error:', err);
        next(new AppError('Failed to download certificate', 500));
      }
    });
  } catch (error) {
    next(error);
  }
};
