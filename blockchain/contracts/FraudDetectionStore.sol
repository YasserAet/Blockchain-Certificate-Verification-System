// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FraudDetectionStore
 * @dev Store ML fraud detection results on blockchain
 */

contract FraudDetectionStore {
    struct FraudDetectionResult {
        bytes32 certificateHash;
        bool isFraudDetected;
        uint8 fraudConfidence;
        string fraudType;
        uint256 detectedAt;
        address detector;
    }

    mapping(bytes32 => FraudDetectionResult) public fraudResults;
    
    event FraudDetected(
        bytes32 indexed certificateHash,
        bool isFraud,
        uint8 confidence,
        uint256 timestamp
    );

    address public mlServiceAddress;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyMLService() {
        require(msg.sender == mlServiceAddress, "Not authorized");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function recordFraudDetection(
        bytes32 _certificateHash,
        bool _isFraud,
        uint8 _confidence,
        string memory _fraudType
    ) external onlyMLService {
        fraudResults[_certificateHash] = FraudDetectionResult({
            certificateHash: _certificateHash,
            isFraudDetected: _isFraud,
            fraudConfidence: _confidence,
            fraudType: _fraudType,
            detectedAt: block.timestamp,
            detector: msg.sender
        });
        
        emit FraudDetected(_certificateHash, _isFraud, _confidence, block.timestamp);
    }

    function getFraudResult(bytes32 _certificateHash) external view returns (FraudDetectionResult memory) {
        return fraudResults[_certificateHash];
    }

    function setMLServiceAddress(address _address) external onlyAdmin {
        mlServiceAddress = _address;
    }
}
