//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Service.sol";

contract ServiceFactory {
    Service[] public services;

	address private immutable ownerDeploy;

	// ####################### CONSTRUCTOR #########################

	constructor() {
        ownerDeploy = msg.sender;
    }

    // ####################### MODIFIERS ###########################

	// Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == ownerDeploy, "Only owner is allowed");
        _;
    }

	modifier onlyAuthorizedStaff(){
		// TODO: Implement this modifier
		_;
	}

	// ####################### EVENTS ##############################
    
    event DataUpdated();

    // ####################### FUNCTIONS ###########################

	function CreateNewService(
        string memory _servicename,
        string memory _servicedescription
    ) public {
        Service service = new Service(msg.sender, _servicename, _servicedescription);
        services.push(service);
    }

	function getServices() public view returns (Service[] memory) {
		return services;
	}


}
