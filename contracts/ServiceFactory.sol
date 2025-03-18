//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Service.sol";

contract ServiceFactory {
    Service[] public services;

    // ####################### CONSTRUCTOR #########################

    event ServiceCreated(address serviceAddress);
    event ServiceNotFound(address serviceAddress);

    // ####################### CONSTRUCTOR #########################

    constructor() {}

    // ####################### MODIFIERS ###########################

    // Ensures that only the seller that owns the service can call the function
    modifier onlySellerOwner(address _serviceaddress) {
        bool serviceFound = false;
        for (uint i = 0; i < services.length; i++) {
            if (address(services[i]) == _serviceaddress) {
                require(
                    msg.sender == services[i].getOwner(),
                    "Only the seller that owns the service can call this function"
                );
                serviceFound = true;
                break;
            }
        }
        require(serviceFound, "Service not found");
        _;
    }

    // Ensures that only active services can call the function
    modifier onlyActiveService(address _serviceaddress) {
        bool serviceFound = false;
        for (uint i = 0; i < services.length; i++) {
            if (address(services[i]) == _serviceaddress) {
                require(services[i].isActive(), "Service is not active");
                serviceFound = true;
                break;
            }
        }
        require(serviceFound, "Service not found");
        _;
    }

    // Ensures that the service name is available
    modifier nameAvailable(string memory _newname) {
        for (uint i = 0; i < services.length; i++) {
            require(
                keccak256(abi.encodePacked(services[i].getName())) !=
                    keccak256(abi.encodePacked(_newname)),
                "Service name is already taken"
            );
        }
        _;
    }

    // ####################### FUNCTIONS ###########################

    function createService(
        string memory _servicename,
        string memory _servicedescription
    ) public nameAvailable(_servicename) {
        Service service = new Service(
            msg.sender,
            _servicename,
            _servicedescription
        );
        services.push(service);

        emit ServiceCreated(address(service));
    }

    function checkNameAvailability(
        string memory _servicename
    ) public view nameAvailable(_servicename) returns (bool) {
        return true;
    }

    function getServicesAddresses() public view returns (address[] memory) {
        address[] memory deployedServices = new address[](services.length);

        for (uint i = 0; i < services.length; i++) {
            deployedServices[i] = address(services[i]);
        }

        return deployedServices;
    }
}
