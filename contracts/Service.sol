// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Service {
    
    // ####################### VARIABLES #######################
    
    address private immutable ownerDeploy;
    string public name;
    string public description;
    bool public isActive = true;

    struct Subscription {
        address user;
        uint256 tokenId;
        uint256 price;
        uint256 duration; // duration in days
        uint256 startDate; // timestamp in milliseconds (from January 1st, 1970)
        uint256 endDate; // timestamp in milliseconds (from January 1st, 1970)
    }

    uint256 private subscriptionCounter = 0;
    mapping(uint256 => Subscription) private subscriptions;

    // ###################### CONSTRUCTOR ######################
    
    constructor(
        address _deployeraddress,
        string memory _name,
        string memory _description
    ) {
        ownerDeploy = _deployeraddress;
        name = _name;
        description = _description;
    }

    // ####################### MODIFIERS #######################

    // Modifier to check if the service is active
    modifier isActiveService() {
        require(isActive, "Service is not active");
        _;
    }

    // Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == ownerDeploy, "Only owner is allowed");
        _;
    }

    // Modifier to check if the subscription exists
    modifier subscriptionExists(uint256 _tokenId) {
        require(subscriptions[_tokenId].user != address(0), "Subscription does not exist");
        _;
    }

    // Modifier to check if the subscription is active
    modifier onlyActiveSubscription(uint256 _tokenId) {
        require(block.timestamp < subscriptions[_tokenId].endDate, "Subscription has expired");
        _;
    }

    // Modifier to check if the sent value is greater than zero
    modifier valueGreaterThanZero(uint256 _value) {
        require(_value > 0, "Value must be greater than zero");
        _;
    }

    // Ensures that only the subscriber can call the function
    modifier onlySubscriberOrSeller(uint256 _tokenId) {
        require(subscriptions[_tokenId].user == msg.sender || msg.sender == ownerDeploy, "Caller is not the subscriber");
        _;
    }

    // Modifier to check if the subscriber already exists
    modifier subscriberNotSubscribed(address _user) {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            if (subscriptions[i].user == _user && block.timestamp * 1000 < subscriptions[i].endDate) {
                revert("Subscriber already has an active subscription");
            }
        }
        _;
    }

    // ######################## EVENTS ########################
    
    event SubscriptionCreated(uint256 indexed tokenId);
    event SubscriptionPaid(uint256 indexed tokenId);
    event SubscriptionCancelled(uint256 indexed tokenId);

    // ####################### GETTERS AND SETTERS #######################
    
    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory _name) public onlyOwner isActiveService {
        name = _name;
    }

    function getDescription() public view returns (string memory) {
        return description;
    }

    function setDescription(string memory _description) public onlyOwner isActiveService {
        description = _description;
    }

    function getIsActive() public view returns (bool) {
        return isActive;
    }

    function setIsActive(bool _isActive) public onlyOwner {
        isActive = _isActive;
    }

    function getSubscriptions() public view returns (address[] memory, uint256[] memory, uint256[] memory, uint256[] memory, uint256[] memory, uint256[] memory) {
        address[] memory subscriptionUser = new address[](subscriptionCounter);
        uint256[] memory subscriptionTokenId = new uint256[](subscriptionCounter);
        uint256[] memory subscriptionPrice = new uint256[](subscriptionCounter);
        uint256[] memory subscriptionDuration = new uint256[](subscriptionCounter);
        uint256[] memory subscriptionStartDate = new uint256[](subscriptionCounter);
        uint256[] memory subscriptionEndDate = new uint256[](subscriptionCounter);

        for (uint i = 0; i < subscriptionCounter; i++) {
            subscriptionUser[i] = subscriptions[i].user;
            subscriptionTokenId[i] = subscriptions[i].tokenId;
            subscriptionPrice[i] = subscriptions[i].price;
            subscriptionDuration[i] = subscriptions[i].duration;
            subscriptionStartDate[i] = subscriptions[i].startDate;
            subscriptionEndDate[i] = subscriptions[i].endDate;
        }
        return (subscriptionUser, subscriptionTokenId, subscriptionPrice, subscriptionDuration, subscriptionStartDate, subscriptionEndDate);
    }

    function getOwner() public view returns (address) {
        return ownerDeploy;
    }

    // ####################### FUNCTIONS #######################

    // Allows a subscriber to subscribe to the service
    function createSubscription(
        address _user,
        uint256 _price,
        uint256 _duration
    ) public
        subscriberNotSubscribed(_user)
        valueGreaterThanZero(_price)
        isActiveService {

        Subscription memory newSubscription = Subscription({
            user: _user,
            tokenId: subscriptionCounter,
            price: _price,
            duration: _duration,
            startDate: 0,
            endDate: 0
        });

        subscriptions[subscriptionCounter] = newSubscription;
        emit SubscriptionCreated(subscriptionCounter);
        subscriptionCounter++;
    }

    // Allows a subscriber to pay for the subscription
    function paySubscription(
        uint256 _tokenId
    ) public
        subscriptionExists(_tokenId)
        onlySubscriberOrSeller(_tokenId)
        isActiveService
        payable {

        uint256 _valuePaid = msg.value;
        uint256 _valueToPay = subscriptions[_tokenId].price;
        require(_valuePaid == _valueToPay, "Invalid amount");

        subscriptions[_tokenId].startDate = block.timestamp * 1000;
        subscriptions[_tokenId].endDate = (block.timestamp + (subscriptions[_tokenId].duration * 1 days)) * 1000;

        emit SubscriptionPaid(_tokenId);
    }

    // Allows a subscriber to buy a subscription (first payment)
    function buySubscription(
        address _user,
        uint256 _price,
        uint256 _duration
    ) public
        subscriberNotSubscribed(_user)
        valueGreaterThanZero(_price)
        isActiveService
        payable {

        Subscription memory newSubscription = Subscription({
            user: _user,
            tokenId: subscriptionCounter,
            price: _price,
            duration: _duration,
            startDate: block.timestamp * 1000,
            endDate: (block.timestamp + (_duration * 1 days)) * 1000
        });

        subscriptions[subscriptionCounter] = newSubscription;
        emit SubscriptionCreated(subscriptionCounter);
        emit SubscriptionPaid(subscriptionCounter);
        subscriptionCounter++;
    }

    // Subscriber can cancel its own subscription or Seller can cancel subscriber's subscription
    function cancelSubscription(
        uint256 _tokenId
    ) public
        subscriptionExists(_tokenId)
        onlySubscriberOrSeller(_tokenId)
        isActiveService {

        subscriptions[_tokenId].endDate = block.timestamp * 1000;
        emit SubscriptionCancelled(_tokenId);
    }
}
