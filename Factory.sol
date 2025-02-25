//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Service.sol";

contract SubscriptionFactory {
   Service[] public services;

   function CreateNewService(string memory _subscription) public {
     Service subscription = new Service(_subscription);
     SubscriptionsArray.push(subscription);
   }

   function gfSetter(uint256 _subscriptionIndex, string memory _subscription) public {
    //  Service(address(SubscriptionsArray[_subscriptionIndex])).setGreeting(_subscription);
   }

   function gfGetter(uint256 _subscriptionIndex) public view returns (string memory) {
    // return Service(address(SubscriptionsArray[_subscriptionIndex])).greet();
   }
}