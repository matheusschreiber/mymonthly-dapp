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
    modifier onlySubscriber(uint256 _tokenId) {
        require(subscriptions[_tokenId].user == msg.sender, "Caller is not the subscriber");
        _;
    }

    // Modifier to check if the subscriber already exists
    modifier subscriberNotSubscribed(address _user) {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            if (subscriptions[i].user == _user && block.timestamp < subscriptions[i].endDate) {
                revert("Subscriber already has an active subscription");
            }
        }
        _;
    }

    // ######################## EVENTS ########################
    
    event DataUpdated();
    event SubscriptionAdded(uint256 indexed tokenId, address indexed user);
    event SubscriptionPaid(uint256 indexed tokenId, address indexed user, uint256 newEndDate);
    event SubscriptionCancelled(uint256 indexed tokenId, address indexed user);

    // ####################### GETTERS AND SETTERS #######################
    
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

    function getSubscriptions() public view isActiveService returns (Subscription[] memory) {
        Subscription[] memory _subscriptions = new Subscription[](subscriptionCounter);
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            _subscriptions[i] = subscriptions[i];
        }
        return _subscriptions;
    }

    function getOwner() public view returns (address) {
        return ownerDeploy;
    }

    // ####################### FUNCTIONS #######################

    // Allows a subscriber to subscribe to the service
    function createSubscription(
        uint256 _price,
        uint256 _duration
    ) public
        subscriberNotSubscribed(msg.sender)
        valueGreaterThanZero(_price)
        isActiveService {

        Subscription memory newSubscription = Subscription({
            user: msg.sender,
            tokenId: subscriptionCounter,
            price: _price,
            duration: _duration,
            startDate: 0,
            endDate: 0
        });

        subscriptions[subscriptionCounter] = newSubscription;
        emit SubscriptionAdded(subscriptionCounter, msg.sender);
        subscriptionCounter++;
    }

    // Allows a subscriber to pay for the subscription
    function paySubscription(
        uint256 _tokenId
    ) public
        subscriptionExists(_tokenId)
        onlySubscriber(_tokenId)
        isActiveService
        payable {

        uint256 _valuePaid = msg.value;
        uint256 _valueToPay = subscriptions[_tokenId].price;
        require(_valuePaid == _valueToPay, "Invalid amount");

        subscriptions[_tokenId].startDate = block.timestamp;
        subscriptions[_tokenId].endDate = block.timestamp + (subscriptions[_tokenId].duration * 1 days);

        emit SubscriptionPaid(_tokenId, msg.sender, subscriptions[_tokenId].endDate);
    }

    // Subscriber can cancel its own subscription
    function cancelSubscriptionBySubscriber(
        uint256 _tokenId
    ) public
        subscriptionExists(_tokenId)
        onlySubscriber(_tokenId)
        isActiveService {

        subscriptions[_tokenId].endDate = block.timestamp;
        emit SubscriptionCancelled(_tokenId, msg.sender);
    }

    // Seller owner of the service can cancel a subscription
    function cancelSubscriptionBySeller(
        uint256 _tokenId
    ) public 
        onlyOwner
        isActiveService
    {
        
        subscriptions[_tokenId].endDate = block.timestamp;
        emit SubscriptionCancelled(_tokenId, msg.sender);
    }

    // Update subscriptions to check if they have expired
    function updateSubscriptions() public isActiveService {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            // Se a assinatura já tiver sido paga e expirou, pode emitir um evento ou executar ações adicionais.
            if (subscriptions[i].endDate != 0 && block.timestamp >= subscriptions[i].endDate) {
                // Aqui, poderia ser feito algo como revogar acesso (por exemplo, removendo um NFT de credencial)
                // emit algum evento ou realizar uma chamada para notificar uma interface.
            }
        }
    }
}
