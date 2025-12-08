import { AppError } from '../middleware/errorHandler.js';
import { pool } from '../config/database.js';

export const getStats = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }

    const userStats = await pool.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
    `);

    const certStats = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM certificates
      GROUP BY status
    `);

    const totalCerts = await pool.query('SELECT COUNT(*) as total FROM certificates');

    res.status(200).json({
      success: true,
      data: {
        users: userStats.rows,
        certificates: {
          byStatus: certStats.rows,
          total: parseInt(totalCerts.rows[0].total)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }

    const result = await pool.query(`
      SELECT id, name, email, role, institution, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: {
        users: result.rows,
        count: result.rows.length
      }
    });
  } catch (error) {
    next(error);
  }
};
