// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SkillValidator
 * @dev Store validated skills on blockchain
 */

contract SkillValidator {
    struct SkillValidation {
        string skillName;
        string proficiencyLevel;
        bytes32 certificateHash;
        address student;
        uint256 validatedAt;
    }

    mapping(address => mapping(string => SkillValidation)) public studentSkills;
    mapping(address => string[]) public studentSkillsList;
    
    event SkillValidated(
        address indexed student,
        string skillName,
        string proficiencyLevel,
        uint256 timestamp
    );

    function validateSkill(
        address _student,
        string memory _skillName,
        string memory _proficiencyLevel,
        bytes32 _certificateHash
    ) external {
        studentSkills[_student][_skillName] = SkillValidation({
            skillName: _skillName,
            proficiencyLevel: _proficiencyLevel,
            certificateHash: _certificateHash,
            student: _student,
            validatedAt: block.timestamp
        });
        
        // Add to list if not already present
        bool exists = false;
        for (uint i = 0; i < studentSkillsList[_student].length; i++) {
            if (keccak256(abi.encodePacked(studentSkillsList[_student][i])) == 
                keccak256(abi.encodePacked(_skillName))) {
                exists = true;
                break;
            }
        }
        
        if (!exists) {
            studentSkillsList[_student].push(_skillName);
        }
        
        emit SkillValidated(_student, _skillName, _proficiencyLevel, block.timestamp);
    }

    function getStudentSkills(address _student) external view returns (string[] memory) {
        return studentSkillsList[_student];
    }

    function getSkillDetail(address _student, string memory _skillName) external view returns (SkillValidation memory) {
        return studentSkills[_student][_skillName];
    }
}
