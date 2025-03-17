//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Service.sol";

contract ServiceFactory {
    Service[] public services;

    address private immutable ownerDeploy;

    // ####################### CONSTRUCTOR #########################

    event ServiceCreated(address serviceAddress);
    event ServiceDeactivated(address serviceAddress);
    event ServiceUpdated(address serviceAddress);

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

    // Ensures that only the seller that owns the service can call the function
    modifier onlySellerOwner(string memory _servicename) {
        bool serviceFound = false;
        for (uint i = 0; i < services.length; i++) {
            if (keccak256(abi.encodePacked(services[i].name())) == keccak256(abi.encodePacked(_servicename))) {
                require(msg.sender == services[i].getOwner(), "Only the seller that owns the service can call this function");
                serviceFound = true;
                break;
            }
        }
        require(serviceFound, "Service not found");
        _;
    }

    // Ensures that only active services can call the function
    modifier onlyActiveService(string memory _servicename) {
        bool serviceFound = false;
        for (uint i = 0; i < services.length; i++) {
            if (keccak256(abi.encodePacked(services[i].name())) == keccak256(abi.encodePacked(_servicename))) {
                require(services[i].isActive(), "Service is not active");
                serviceFound = true;
                break;
            }
        }
        require(serviceFound, "Service not found");
        _;
    }

    // ####################### FUNCTIONS ###########################

    function createService(
        string memory _servicename,
        string memory _servicedescription
    ) public {

        Service service = new Service(msg.sender, _servicename, _servicedescription);
        services.push(service);
        
        emit ServiceCreated(address(service));

    }

    function deactivateService(
        string memory _servicename
    ) public 
        onlySellerOwner(_servicename)
        onlyActiveService(_servicename)
    {

        for (uint i = 0; i < services.length; i++) {
            if (keccak256(abi.encodePacked(services[i].name())) == keccak256(abi.encodePacked(_servicename))) {
                require(msg.sender == services[i].getOwner(), "Only the seller that owns the service can call this function");
                services[i].setIsActive(false);

                emit ServiceDeactivated(address(services[i]));
                break;
            }
        }
    }

    function updateService(
        string memory _servicename,
        string memory _servicedescription
    ) public 
        onlySellerOwner(_servicename)
        onlyActiveService(_servicename)
    {

        for (uint i = 0; i < services.length; i++) {
            if (keccak256(abi.encodePacked(services[i].name())) == keccak256(abi.encodePacked(_servicename))) {
                require(msg.sender == services[i].getOwner(), "Only the seller that owns the service can call this function");
                services[i].setName(_servicename);
                services[i].setDescription(_servicedescription);

                emit ServiceUpdated(address(services[i]));
                break;
            }
        }

    }

    function getServicesAddresses() public view returns (address[] memory) {
        
        address[] memory deployedServices = new address[](services.length);

        for (uint i = 0; i < services.length; i++) {
            deployedServices[i] = address(services[i]);
        }

        return deployedServices;
    }
}
