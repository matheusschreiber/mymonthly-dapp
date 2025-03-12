//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Service.sol";

contract ServiceFactory {
   Service[] public services;

   function CreateNewService(string memory _servicename, string memory _servicedescription) public {
     Service service = new Service(_servicename, _servicedescription);
     services.push(service);
   }

   function gfSetter(uint256 _serviceIndex, string memory _service) public {
    //  Service(address(ServicesArray[_serviceIndex])).setGreeting(_service);
   }

   function gfGetter(uint256 _serviceIndex) public view returns (string memory) {
    // return Service(address(ServicesArray[_ServiceIndex])).greet();
   }
}