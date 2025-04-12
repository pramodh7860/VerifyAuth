// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IdentityRegistry
 * @dev A smart contract for managing decentralized identities linked to IPFS
 */
contract IdentityRegistry {
    // Identity mapping: user address => IPFS CID
    mapping(address => string) private identities;
    
    // Array of all registered addresses for enumeration
    address[] private registeredAddresses;

    // Events
    event IdentityRegistered(address indexed user, string ipfsCid);
    event IdentityUpdated(address indexed user, string oldIpfsCid, string newIpfsCid);

    /**
     * @dev Register a new identity
     * @param ipfsCid The IPFS CID where the identity data is stored
     */
    function registerIdentity(string memory ipfsCid) external {
        require(bytes(identities[msg.sender]).length == 0, "Identity already registered");
        require(bytes(ipfsCid).length > 0, "CID cannot be empty");
        
        identities[msg.sender] = ipfsCid;
        registeredAddresses.push(msg.sender);
        
        emit IdentityRegistered(msg.sender, ipfsCid);
    }

    /**
     * @dev Update an existing identity
     * @param newIpfsCid The new IPFS CID
     */
    function updateIdentity(string memory newIpfsCid) external {
        require(bytes(identities[msg.sender]).length > 0, "Identity not registered");
        require(bytes(newIpfsCid).length > 0, "CID cannot be empty");
        
        string memory oldCid = identities[msg.sender];
        identities[msg.sender] = newIpfsCid;
        
        emit IdentityUpdated(msg.sender, oldCid, newIpfsCid);
    }

    /**
     * @dev Get the CID of a user's identity
     * @param user The address of the user
     * @return The IPFS CID
     */
    function getIdentityCID(address user) external view returns (string memory) {
        return identities[user];
    }

    /**
     * @dev Check if a user has registered an identity
     * @param user The address to check
     * @return Boolean indicating if identity exists
     */
    function hasIdentity(address user) external view returns (bool) {
        return bytes(identities[user]).length > 0;
    }

    /**
     * @dev Get the total number of registered identities
     * @return The count of registered identities
     */
    function getRegisteredCount() external view returns (uint256) {
        return registeredAddresses.length;
    }

    /**
     * @dev Get a registered address by index
     * @param index The index in the registered addresses array
     * @return The address at that index
     */
    function getRegisteredAddressAtIndex(uint256 index) external view returns (address) {
        require(index < registeredAddresses.length, "Index out of bounds");
        return registeredAddresses[index];
    }
}
