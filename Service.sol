// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Service {
    
    // ####################### VARIABLES ###########################

    address private immutable ownerDeploy;
    string private name;
    string private description;

    struct Subscription {
        address user;
        uint256 tokenId;
        uint256 price;
        uint256 duration;
        uint256 startDate;
        uint256 endDate;
    }

    uint256 private subscriptionCounter = 0;
    mapping(uint256 => Subscription) private subscriptions;

    // ####################### CONSTRUCTOR #########################

    constructor(
        string memory _name,
        string memory _description
    ) {
        ownerDeploy = msg.sender;
        name = _name;
        description = _description;
    }

    // ####################### MODIFIERS ###########################

    // Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == ownerDeploy, "Only owner is allowed");
        _;
    }

    // Modifier to check if the end date of subscription hasnt expired
    modifier onlyActiveSubscription(uint256 _tokenId) {
        require(
            subscriptions[_tokenId].endDate == 0 || block.timestamp < subscriptions[_tokenId].endDate,
            "Subscription has expired"
        );
        _;
    }

    // Modifier to check if the value is greater than zero
    modifier valueGreaterThanZero(uint256 _value) {
        require(_value > 0, "Value must be greater than zero");
        _;
    }

    // Modifier to check if the subscription exists
    modifier subscriptionExists(uint256 _tokenId) {
        require(subscriptions[_tokenId].user != address(0), "Subscription does not exist");
        _;
    }

    // Modifier to check if the subscriber already exists
    modifier subscriberAlreadyExists(address _user) {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            require(subscriptions[i].user != _user, "Subscriber already exists");
        }
        _;
    }

    // ####################### EVENTS ##############################
    
    event DataUpdated();

    // ####################### FUNCTIONS ###########################

    function getSubscriptions() public view returns (Subscription[] memory) {
        Subscription[] memory _subscriptions = new Subscription[](subscriptionCounter);
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            _subscriptions[i] = subscriptions[i];
        }
        return _subscriptions;
    }

    function addSubscription(
        address _user,
        uint256 _price,
        uint256 _duration
    ) public onlyOwner subscriberAlreadyExists(_user) valueGreaterThanZero(_price) {
        
        Subscription memory newSubscription = Subscription({
            user: _user,
            tokenId: subscriptionCounter,
            price: _price,
            duration: _duration,
            startDate: block.timestamp,
            endDate: 0
        });

        subscriptions[subscriptionCounter] = newSubscription;
        subscriptionCounter++;
        
        emit DataUpdated();
    }

    function cancelSubscription(
        uint256 _tokenId
    ) public 
        onlyActiveSubscription(_tokenId)
        subscriptionExists(_tokenId) {
        
        subscriptions[_tokenId].endDate = block.timestamp;

        emit DataUpdated();
    }

    function paySubscription(
        uint256 _tokenId
    ) public 
        onlyActiveSubscription(_tokenId)
        subscriptionExists(_tokenId)
        payable {
        
        uint256 _valuePaid = msg.value;
        uint256 _valueToPay = subscriptions[_tokenId].price;
        require(_valuePaid == _valueToPay, "Invalid amount");
        subscriptions[_tokenId].endDate = 0;
        subscriptions[_tokenId].startDate = block.timestamp + (subscriptions[_tokenId].duration * 1 days);

        emit DataUpdated();
    }
}
