//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Service.sol";

contract ServiceFactory {
    Service[] public services;

    // ####################### CONSTRUCTOR #########################

    event ServiceCreated(address serviceAddress);
    event ServiceDeactivated(address serviceAddress);
    event ServiceUpdated(address serviceAddress);

    // ####################### CONSTRUCTOR #########################
    
    constructor() {}

    // ####################### MODIFIERS ###########################

    // Ensures that only the seller that owns the service can call the function
    modifier onlySellerOwner(address _serviceaddress) {
        bool serviceFound = false;
        for (uint i = 0; i < services.length; i++) {
            if (address(services[i]) == _serviceaddress) {
                require(msg.sender == services[i].getOwner(), "Only the seller that owns the service can call this function");
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

    // ####################### FUNCTIONS ###########################

    function createService(
        string memory _servicename,
        string memory _servicedescription
    ) public {
        Service service = new Service(
            msg.sender,
            _servicename,
            _servicedescription
        );
        services.push(service);
        
        emit ServiceCreated(address(service));
    }

    function deactivateService(
        address _serviceaddress
    ) public 
        onlySellerOwner(_serviceaddress)
        onlyActiveService(_serviceaddress)
    {
        for (uint i = 0; i < services.length; i++) {
            if (address(services[i]) == _serviceaddress) {
                require(msg.sender == services[i].getOwner(), "Only the seller that owns the service can call this function");
                services[i].setIsActive(false);

                emit ServiceDeactivated(address(services[i]));
                break;
            }
        }
    }

    function updateService(
        address _serviceaddress,
        string memory _newname,
        string memory _newdescription
    ) public 
        onlySellerOwner(_serviceaddress)
        onlyActiveService(_serviceaddress)
    {
        for (uint i = 0; i < services.length; i++) {
            if (address(services[i]) == _serviceaddress) {
                require(msg.sender == services[i].getOwner(), "Only the seller that owns the service can call this function");
                services[i].setName(_newname);
                services[i].setDescription(_newdescription);

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
