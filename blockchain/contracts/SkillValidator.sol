// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkillValidator
 * @dev Validate and endorse skills from certificates
 */
contract SkillValidator is Ownable {
    
    struct Skill {
        string skillName;
        string certificateId;
        address student;
        uint256 validatedDate;
        uint256 endorsementCount;
        bool exists;
    }
    
    struct Endorsement {
        address endorser;
        string endorserName;
        uint256 timestamp;
        string comment;
    }
    
    // Mapping from skillId (hash of student address + skillName) to Skill
    mapping(bytes32 => Skill) public skills;
    
    // Mapping from skillId to endorsements
    mapping(bytes32 => Endorsement[]) public endorsements;
    
    // Mapping from student to their skill IDs
    mapping(address => bytes32[]) public studentSkills;
    
    // Events
    event SkillValidated(
        bytes32 indexed skillId,
        address indexed student,
        string skillName,
        string certificateId,
        uint256 timestamp
    );
    
    event SkillEndorsed(
        bytes32 indexed skillId,
        address indexed endorser,
        uint256 timestamp
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Generate skill ID from student address and skill name
     * @param student Student address
     * @param skillName Name of the skill
     * @return Skill ID
     */
    function getSkillId(address student, string memory skillName) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(student, skillName));
    }
    
    /**
     * @dev Validate a skill from a certificate
     * @param skillName Name of the skill
     * @param certificateId Associated certificate ID
     * @param student Address of the student
     */
    function validateSkill(
        string memory skillName,
        string memory certificateId,
        address student
    ) external {
        require(bytes(skillName).length > 0, "Skill name cannot be empty");
        require(student != address(0), "Invalid student address");
        
        bytes32 skillId = getSkillId(student, skillName);
        
        if (!skills[skillId].exists) {
            skills[skillId] = Skill({
                skillName: skillName,
                certificateId: certificateId,
                student: student,
                validatedDate: block.timestamp,
                endorsementCount: 0,
                exists: true
            });
            
            studentSkills[student].push(skillId);
            
            emit SkillValidated(skillId, student, skillName, certificateId, block.timestamp);
        }
    }
    
    /**
     * @dev Endorse a skill
     * @param student Student address
     * @param skillName Name of the skill
     * @param endorserName Name of the endorser
     * @param comment Optional comment
     */
    function endorseSkill(
        address student,
        string memory skillName,
        string memory endorserName,
        string memory comment
    ) external {
        bytes32 skillId = getSkillId(student, skillName);
        require(skills[skillId].exists, "Skill not validated");
        require(msg.sender != student, "Cannot endorse your own skill");
        
        endorsements[skillId].push(Endorsement({
            endorser: msg.sender,
            endorserName: endorserName,
            timestamp: block.timestamp,
            comment: comment
        }));
        
        skills[skillId].endorsementCount++;
        
        emit SkillEndorsed(skillId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get skill details
     * @param student Student address
     * @param skillName Name of the skill
     * @return Skill struct
     */
    function getSkill(address student, string memory skillName) 
        external 
        view 
        returns (Skill memory) 
    {
        bytes32 skillId = getSkillId(student, skillName);
        require(skills[skillId].exists, "Skill not found");
        return skills[skillId];
    }
    
    /**
     * @dev Get all endorsements for a skill
     * @param student Student address
     * @param skillName Name of the skill
     * @return Array of endorsements
     */
    function getSkillEndorsements(address student, string memory skillName) 
        external 
        view 
        returns (Endorsement[] memory) 
    {
        bytes32 skillId = getSkillId(student, skillName);
        return endorsements[skillId];
    }
    
    /**
     * @dev Get all skills for a student
     * @param student Student address
     * @return Array of skill IDs
     */
    function getStudentSkills(address student) external view returns (bytes32[] memory) {
        return studentSkills[student];
    }
    
    /**
     * @dev Get endorsement count for a skill
     * @param student Student address
     * @param skillName Name of the skill
     * @return Number of endorsements
     */
    function getEndorsementCount(address student, string memory skillName) 
        external 
        view 
        returns (uint256) 
    {
        bytes32 skillId = getSkillId(student, skillName);
        if (!skills[skillId].exists) {
            return 0;
        }
        return skills[skillId].endorsementCount;
    }
}
