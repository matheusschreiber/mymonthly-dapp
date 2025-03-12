//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Service.sol";

contract ServiceFactory {
    Service[] public services;
    mapping(address => bool) public authorizedAddresses; // endereços autorizados
    mapping(address => Service[]) public sellerServices;   // associação de vendedores aos seus serviços

    address private immutable ownerDeploy;

    // ####################### CONSTRUCTOR #########################

    event ServiceCreated(address indexed vendor, address serviceAddress);

    // event DataUpdated();

    // ####################### CONSTRUCTOR #########################
    constructor() {
        ownerDeploy = msg.sender;

        authorizedAddresses[0xaffcae52D32B42A21803774c449D7d437178d4af] = true;
        authorizedAddresses[0xaa928a7d6acAB9e4F9f2c77b25E72fAb5e6D25aa] = true;
        authorizedAddresses[ownerDeploy] = true;
    }

    // ####################### MODIFIERS ###########################

    // Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == ownerDeploy, "Only owner is allowed");
        _;
    }
    // Modifier to check if the address is a authorized address
    modifier onlyAuthorizedStaff(){
        require(authorizedAddresses[msg.sender], "Unauthorized address");
        _;
    }

    // ####################### FUNCTIONS ###########################

    function createNewService(
        string memory _servicename,
        string memory _servicedescription
    ) public onlyAuthorizedStaff {

        Service service = new Service(msg.sender, _servicename, _servicedescription);
        services.push(service);
        sellerServices[msg.sender].push(service);

        emit ServiceCreated(msg.sender, address(service));
    }

    function getServices() public view onlyAuthorizedStaff returns (Service[] memory) {
        return services;
    }
}
