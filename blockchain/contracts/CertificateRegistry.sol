// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CertificateRegistry
 * @dev Smart contract for issuing, verifying, and revoking certificates on blockchain
 */
contract CertificateRegistry is Ownable, ReentrancyGuard {
    
    struct Certificate {
        string certificateId;
        address student;
        address institution;
        string dataHash;
        uint256 issueDate;
        uint256 expiryDate;
        bool isRevoked;
        bool exists;
    }
    
    // Mapping from certificateId to Certificate
    mapping(string => Certificate) public certificates;
    
    // Mapping from student address to their certificate IDs
    mapping(address => string[]) public studentCertificates;
    
    // Mapping from institution address to their issued certificate IDs
    mapping(address => string[]) public institutionCertificates;
    
    // Authorized institutions
    mapping(address => bool) public authorizedInstitutions;
    
    // Events
    event CertificateIssued(
        string indexed certificateId,
        address indexed student,
        address indexed institution,
        uint256 issueDate
    );
    
    event CertificateRevoked(
        string indexed certificateId,
        address indexed revokedBy,
        uint256 revokeDate
    );
    
    event InstitutionAuthorized(address indexed institution, uint256 timestamp);
    event InstitutionRevoked(address indexed institution, uint256 timestamp);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Authorize an institution to issue certificates
     * @param institution Address of the institution
     */
    function authorizeInstitution(address institution) external onlyOwner {
        require(institution != address(0), "Invalid institution address");
        require(!authorizedInstitutions[institution], "Institution already authorized");
        
        authorizedInstitutions[institution] = true;
        emit InstitutionAuthorized(institution, block.timestamp);
    }
    
    /**
     * @dev Revoke institution's authorization
     * @param institution Address of the institution
     */
    function revokeInstitutionAuth(address institution) external onlyOwner {
        require(authorizedInstitutions[institution], "Institution not authorized");
        
        authorizedInstitutions[institution] = false;
        emit InstitutionRevoked(institution, block.timestamp);
    }
    
    /**
     * @dev Issue a new certificate
     * @param certificateId Unique identifier for the certificate
     * @param student Address of the student
     * @param dataHash IPFS hash or SHA256 hash of certificate data
     * @param expiryDate Expiry date timestamp (0 if no expiry)
     */
    function issueCertificate(
        string memory certificateId,
        address student,
        string memory dataHash,
        uint256 expiryDate
    ) external nonReentrant {
        require(authorizedInstitutions[msg.sender], "Only authorized institutions can issue certificates");
        require(student != address(0), "Invalid student address");
        require(bytes(certificateId).length > 0, "Certificate ID cannot be empty");
        require(bytes(dataHash).length > 0, "Data hash cannot be empty");
        require(!certificates[certificateId].exists, "Certificate already exists");
        
        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            student: student,
            institution: msg.sender,
            dataHash: dataHash,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            isRevoked: false,
            exists: true
        });
        
        studentCertificates[student].push(certificateId);
        institutionCertificates[msg.sender].push(certificateId);
        
        emit CertificateIssued(certificateId, student, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Verify a certificate
     * @param certificateId Certificate ID to verify
     * @return isValid Whether the certificate is valid
     * @return student Address of the student
     * @return institution Address of the issuing institution
     * @return dataHash Hash of certificate data
     * @return issueDate When the certificate was issued
     */
    function verifyCertificate(string memory certificateId) 
        external 
        view 
        returns (
            bool isValid,
            address student,
            address institution,
            string memory dataHash,
            uint256 issueDate
        ) 
    {
        Certificate memory cert = certificates[certificateId];
        
        if (!cert.exists) {
            return (false, address(0), address(0), "", 0);
        }
        
        bool valid = !cert.isRevoked;
        
        // Check expiry if set
        if (cert.expiryDate > 0 && block.timestamp > cert.expiryDate) {
            valid = false;
        }
        
        return (valid, cert.student, cert.institution, cert.dataHash, cert.issueDate);
    }
    
    /**
     * @dev Revoke a certificate (only by issuing institution or contract owner)
     * @param certificateId Certificate ID to revoke
     */
    function revokeCertificate(string memory certificateId) external {
        Certificate storage cert = certificates[certificateId];
        
        require(cert.exists, "Certificate does not exist");
        require(!cert.isRevoked, "Certificate already revoked");
        require(
            msg.sender == cert.institution || msg.sender == owner(),
            "Only institution or owner can revoke"
        );
        
        cert.isRevoked = true;
        emit CertificateRevoked(certificateId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get all certificates for a student
     * @param student Address of the student
     * @return Array of certificate IDs
     */
    function getStudentCertificates(address student) external view returns (string[] memory) {
        return studentCertificates[student];
    }
    
    /**
     * @dev Get all certificates issued by an institution
     * @param institution Address of the institution
     * @return Array of certificate IDs
     */
    function getInstitutionCertificates(address institution) external view returns (string[] memory) {
        return institutionCertificates[institution];
    }
    
    /**
     * @dev Get certificate details
     * @param certificateId Certificate ID
     * @return Certificate struct
     */
    function getCertificate(string memory certificateId) external view returns (Certificate memory) {
        require(certificates[certificateId].exists, "Certificate does not exist");
        return certificates[certificateId];
    }
}
