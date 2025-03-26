// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Service.sol";

contract ServiceFactory {
    address[] public services;
    mapping(address => address) public serviceOwners;
    mapping(string => bool) public serviceNames;

    event ServiceCreated(address indexed serviceAddress);
    event ServiceNotFound(address serviceAddress);

    modifier onlySellerOwner(address _serviceAddress) {
        require(serviceOwners[_serviceAddress] == msg.sender, "Only the seller that owns the service can call this function");
        _;
    }

    modifier onlyActiveService(address _serviceAddress) {
        require(Service(_serviceAddress).isActive(), "Service is not active");
        _;
    }

    modifier nameAvailable(string memory _newName) {
        require(!serviceNames[_newName], "Service name is already taken");
        _;
    }

    function createService(
        string memory _serviceName,
        string memory _serviceDescription
    ) public nameAvailable(_serviceName) {
        Service service = new Service(msg.sender, _serviceName, _serviceDescription);
        address serviceAddress = address(service);

        services.push(serviceAddress);
        serviceOwners[serviceAddress] = msg.sender;
        serviceNames[_serviceName] = true;

        emit ServiceCreated(serviceAddress);
    }

    function checkNameAvailability(
        string memory _serviceName
    ) public view returns (bool) {
        return !serviceNames[_serviceName];
    }

    function getServicesAddresses() public view returns (address[] memory) {
        return services;
    }

    function checkServices() public {
        for (uint i = 0; i < services.length; i++) {
            Service(services[i]).checkSubscriptions();
        }
    }
}
