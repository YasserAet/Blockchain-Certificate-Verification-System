// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CertificateRegistry
 * @dev Stores immutable certificate records on blockchain
 */

contract CertificateRegistry {
    struct Certificate {
        bytes32 certificateHash;
        address issuer;
        address student;
        uint256 issuedAt;
        string certificateType;
        bool isRevoked;
    }

    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public verifiedIssuers;
    
    event CertificateIssued(
        bytes32 indexed certificateHash,
        address indexed issuer,
        address indexed student,
        uint256 timestamp
    );
    
    event CertificateRevoked(
        bytes32 indexed certificateHash,
        uint256 timestamp
    );
    
    event IssuerVerified(
        address indexed issuer,
        uint256 timestamp
    );

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyVerifiedIssuer() {
        require(verifiedIssuers[msg.sender], "Issuer not verified");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function issueCertificate(
        bytes32 _certificateHash,
        address _student,
        string memory _certificateType
    ) external onlyVerifiedIssuer {
        require(certificates[_certificateHash].issuer == address(0), "Certificate already exists");
        
        certificates[_certificateHash] = Certificate({
            certificateHash: _certificateHash,
            issuer: msg.sender,
            student: _student,
            issuedAt: block.timestamp,
            certificateType: _certificateType,
            isRevoked: false
        });
        
        emit CertificateIssued(_certificateHash, msg.sender, _student, block.timestamp);
    }

    function verifyCertificate(bytes32 _certificateHash) external view returns (bool) {
        Certificate memory cert = certificates[_certificateHash];
        return cert.issuer != address(0) && !cert.isRevoked;
    }

    function getCertificate(bytes32 _certificateHash) external view returns (Certificate memory) {
        return certificates[_certificateHash];
    }

    function revokeCertificate(bytes32 _certificateHash) external {
        Certificate memory cert = certificates[_certificateHash];
        require(msg.sender == cert.issuer || msg.sender == admin, "Not authorized");
        require(!cert.isRevoked, "Already revoked");
        
        certificates[_certificateHash].isRevoked = true;
        emit CertificateRevoked(_certificateHash, block.timestamp);
    }

    function verifyIssuer(address _issuer) external onlyAdmin {
        verifiedIssuers[_issuer] = true;
        emit IssuerVerified(_issuer, block.timestamp);
    }
}
