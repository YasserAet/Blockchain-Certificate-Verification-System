// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FraudDetectionStore
 * @dev Store and retrieve fraud detection scores from ML model
 */
contract FraudDetectionStore is Ownable {
    
    struct FraudReport {
        string certificateId;
        uint256 fraudScore; // Score from 0-100
        string mlModelVersion;
        uint256 timestamp;
        bool isFlagged;
        address reportedBy;
    }
    
    // Mapping from certificateId to FraudReport
    mapping(string => FraudReport) public fraudReports;
    
    // Authorized ML service addresses
    mapping(address => bool) public authorizedServices;
    
    // Flagged certificates
    mapping(string => bool) public flaggedCertificates;
    
    // Events
    event FraudScoreStored(
        string indexed certificateId,
        uint256 fraudScore,
        bool isFlagged,
        uint256 timestamp
    );
    
    event CertificateFlagged(
        string indexed certificateId,
        address indexed flaggedBy,
        uint256 timestamp
    );
    
    event ServiceAuthorized(address indexed service, uint256 timestamp);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Authorize ML service to store fraud scores
     * @param service Address of the ML service
     */
    function authorizeService(address service) external onlyOwner {
        require(service != address(0), "Invalid service address");
        authorizedServices[service] = true;
        emit ServiceAuthorized(service, block.timestamp);
    }
    
    /**
     * @dev Store fraud detection score
     * @param certificateId Certificate ID
     * @param fraudScore Score from 0-100 (100 = definite fraud)
     * @param mlModelVersion Version of the ML model used
     */
    function storeFraudScore(
        string memory certificateId,
        uint256 fraudScore,
        string memory mlModelVersion
    ) external {
        require(
            authorizedServices[msg.sender] || msg.sender == owner(),
            "Only authorized services can store scores"
        );
        require(fraudScore <= 100, "Fraud score must be 0-100");
        
        bool isFlagged = fraudScore > 70; // Flag if score > 70%
        
        fraudReports[certificateId] = FraudReport({
            certificateId: certificateId,
            fraudScore: fraudScore,
            mlModelVersion: mlModelVersion,
            timestamp: block.timestamp,
            isFlagged: isFlagged,
            reportedBy: msg.sender
        });
        
        if (isFlagged) {
            flaggedCertificates[certificateId] = true;
        }
        
        emit FraudScoreStored(certificateId, fraudScore, isFlagged, block.timestamp);
    }
    
    /**
     * @dev Manually flag a certificate
     * @param certificateId Certificate ID to flag
     */
    function flagCertificate(string memory certificateId) external onlyOwner {
        flaggedCertificates[certificateId] = true;
        
        if (fraudReports[certificateId].timestamp > 0) {
            fraudReports[certificateId].isFlagged = true;
        }
        
        emit CertificateFlagged(certificateId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get fraud score for a certificate
     * @param certificateId Certificate ID
     * @return fraudScore The fraud score
     * @return isFlagged Whether it's flagged
     * @return timestamp When it was analyzed
     */
    function getFraudScore(string memory certificateId) 
        external 
        view 
        returns (
            uint256 fraudScore,
            bool isFlagged,
            uint256 timestamp
        ) 
    {
        FraudReport memory report = fraudReports[certificateId];
        return (report.fraudScore, report.isFlagged, report.timestamp);
    }
    
    /**
     * @dev Check if certificate is flagged
     * @param certificateId Certificate ID
     * @return Whether the certificate is flagged
     */
    function isCertificateFlagged(string memory certificateId) external view returns (bool) {
        return flaggedCertificates[certificateId];
    }
}
