// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Service {
    
    // ####################### VARIABLES #######################

    address private immutable ownerDeploy;
    // TODO: id? picture?
    string private name;
    string private description;
    bool private isActive = true;

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

    // ###################### CONSTRUCTOR ######################

    constructor(
        address _authorizedaddress,
        string memory _name,
        string memory _description
    ) {
        ownerDeploy = _authorizedaddress;
        name = _name;
        description = _description;
    }

    // ####################### MODIFIERS #######################

    modifier isActiveService() {
        require(isActive, "Service is not active");
        _;
    }

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

    // ################# GETTERS AND SETTERS #################

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory _name) public onlyOwner isActiveService {
        name = _name;
        emit DataUpdated();
    }

    function getDescription() public view returns (string memory) {
        return description;
    }

    function setDescription(string memory _description) public onlyOwner isActiveService {
        description = _description;
        emit DataUpdated();
    }

    function getIsActive() public view returns (bool) {
        return isActive;
    }

    function setIsActive(bool _isActive) public onlyOwner {
        isActive = _isActive;
        emit DataUpdated();
    }

    // ######################## EVENTS ########################
    
    event DataUpdated();

    // ####################### FUNCTIONS #######################

    function getSubscriptions() isActiveService public view returns (Subscription[] memory) {
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
    ) public 
        onlyOwner
        subscriberAlreadyExists(_user)
        valueGreaterThanZero(_price)
        isActiveService {
        
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
        subscriptionExists(_tokenId)
        isActiveService {
        
        subscriptions[_tokenId].endDate = block.timestamp;

        emit DataUpdated();
    }

    function paySubscription(
        uint256 _tokenId
    ) public 
        onlyActiveSubscription(_tokenId)
        subscriptionExists(_tokenId)
        isActiveService
        payable {
        
        uint256 _valuePaid = msg.value;
        uint256 _valueToPay = subscriptions[_tokenId].price;
        require(_valuePaid == _valueToPay, "Invalid amount");
        subscriptions[_tokenId].endDate = 0;
        subscriptions[_tokenId].startDate = block.timestamp + (subscriptions[_tokenId].duration * 1 days);

        emit DataUpdated();
    }
    
    function updateSubscriptions() public {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            if (subscriptions[i].endDate == 0 && block.timestamp > subscriptions[i].startDate) {
                subscriptions[i].endDate = block.timestamp;
            }
        }
    }
}
