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

    // Function to deploy child contract
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

    // Function to check if the service name is available
    function checkNameAvailability(
        string memory _servicename
    ) public view returns (bool) {
        // Usa a mesma lógica do modificador, mas retorna um booleano
        for (uint i = 0; i < services.length; i++) {
            if (
                keccak256(abi.encodePacked(services[i].getName())) == 
                keccak256(abi.encodePacked(_servicename))
            ) {
                return false; // Nome já existe
            }
        }
        return true; // Nome disponível
    }

    // Function to get the addresses of all deployed contracts
    function getServicesAddresses() public view returns (address[] memory) {
        address[] memory deployedServices = new address[](services.length);

        for (uint i = 0; i < services.length; i++) {
            deployedServices[i] = address(services[i]);
        }

        return deployedServices;
    }

    // Function to check for expired subscriptions on each service
    function checkServices() public {
        for (uint i = 0; i < services.length; i++) {
            services[i].checkSubscriptions();
        }
    }
}
