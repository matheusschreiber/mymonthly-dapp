// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SubscriptionService is ERC721 {
    using Counters for Counters.Counter;
    
    // ####################### STRUCTS & ENUMS #######################
    enum SubscriptionStatus { New, Ongoing, Expired, Cancelled }

    struct Subscription {
        address subscriber;
        uint256 price;
        uint256 duration;
        uint256 startDate;
        uint256 endDate;
        SubscriptionStatus status;
    }

    // ####################### STATE VARIABLES #######################
    address private immutable owner;
    string private serviceName;
    string private serviceDescription;
    bool private serviceActive;

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => Subscription) private subscriptions;

    // ###################### CONSTRUCTOR ######################

    constructor(
        string memory _name,
        string memory _description
    ) ERC721("ServiceSubscription", "SUBS") {
        owner = msg.sender;
        serviceName = _name;
        serviceDescription = _description;
        serviceActive = true;
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

    modifier validSubscription(uint256 tokenId) {
        require(_exists(tokenId), "Invalid subscription");
        _;
    }

    modifier subscriptionOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not subscription owner");
        _;
    }

    // Modifier to check if the sent value is greater than zero
    modifier valueGreaterThanZero(uint256 _value) {
        require(_value > 0, "Value must be greater than zero");
        _;
    }

    modifier onlySubscriberOrSeller(uint256 _tokenId) {
        require(
            ownerOf(_tokenId) == msg.sender || msg.sender == ownerDeploy,
            "Caller is not the subscriber or owner"
        );
        _;
    }

    // Modifier to check if the subscriber already exists
    modifier subscriberNotSubscribed(address _user) {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            if (
                subscriptions[i].user == _user &&
                block.timestamp * 1000 < subscriptions[i].endDate
            ) {
                revert("Subscriber already has an active subscription");
            }
        }
        _;
    }

    // ####################### EVENTS #######################

    event SubscriptionCreated(uint256 indexed tokenId);
    event SubscriptionPaid(uint256 indexed tokenId);
    event SubscriptionTransferred(uint256 indexed tokenId, address from, address to);
    event SubscriptionCancelled(uint256 indexed tokenId);
    event ServiceStatusChanged(bool newStatus);
    event ServiceMetadataUpdated();

    // ####################### GETTERS AND SETTERS ######################

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory _name) public onlyOwner isActiveService {
        name = _name;
    }

    function getDescription() public view returns (string memory) {
        return description;
    }

    function setDescription(
        string memory _description
    ) public onlyOwner isActiveService {
        description = _description;
    }

    function getIsActive() public view returns (bool) {
        return isActive;
    }

    function setIsActive(bool _isActive) public onlyOwner {
        isActive = _isActive;
    }

    function getSubscriptions()
        public
        view
        returns (
            address[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            string[] memory
        )
    {
        address[] memory users = new address[](subscriptionCounter);
        uint256[] memory tokensids = new uint256[](subscriptionCounter);
        uint256[] memory prices = new uint256[](subscriptionCounter);
        uint256[] memory durations = new uint256[](subscriptionCounter);
        uint256[] memory startdates = new uint256[](subscriptionCounter);
        uint256[] memory enddates = new uint256[](subscriptionCounter);
        string[] memory statuses = new string[](subscriptionCounter);

        for (uint i = 0; i < subscriptionCounter; i++) {
            users[i] = subscriptions[i].user;
            tokensids[i] = subscriptions[i].tokenId;
            prices[i] = subscriptions[i].price;
            durations[i] = subscriptions[i].duration;
            startdates[i] = subscriptions[i].startDate;
            enddates[i] = subscriptions[i].endDate;
            
            statuses[i] = subscriptions[i].status == Status.New
                ? "New"
                : subscriptions[i].status == Status.Ongoing
                ? "Ongoing"
                : subscriptions[i].status == Status.Expired
                ? "Expired"
                : "Cancelled";
        }

        return (users, tokensids, prices, durations, startdates, enddates, statuses);
    }

    function getOwner() public view returns (address) {
        return ownerDeploy;
    }

    // ####################### FUNCTIONS #######################

    // Allows a subscriber to subscribe to the service
     function createSubscription(
        address subscriber,
        uint256 price,
        uint256 durationDays
    ) external onlyOwner activeService {
        require(subscriber != address(0), "Invalid address");
        
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        
        _mint(subscriber, newTokenId);
        
        subscriptions[newTokenId] = Subscription({
            subscriber: subscriber,
            price: price,
            duration: durationDays,
            startDate: 0,
            endDate: 0,
            status: SubscriptionStatus.New
        });

        emit SubscriptionCreated(newTokenId);
    }

    // Allows a subscriber to pay for the subscription
    function paySubscription(uint256 tokenId)
        public
        payable
        validSubscription(tokenId)
        subscriptionOwner(tokenId)
        activeService
    {
        Subscription storage sub = subscriptions[tokenId];
        require(msg.value == sub.price, "Invalid amount");
        require(sub.status == Status.New, "Invalid status");

        sub.startDate = block.timestamp * 1000;
        sub.endDate = (block.timestamp + sub.duration * 1 days) * 1000;
        sub.status = Status.Ongoing;

        emit SubscriptionPaid(tokenId);
    }


    // Allows a subscriber to buy a subscription (first payment)
   function buySubscription(uint256 duration)
        public
        payable
        activeService
    {
        require(msg.value > 0, "Invalid payment");
        
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        
        _mint(msg.sender, newTokenId);
        
        subscriptions[newTokenId] = Subscription({
            subscriber: msg.sender,
            price: msg.value,
            duration: duration,
            startDate: block.timestamp * 1000,
            endDate: (block.timestamp + duration * 1 days) * 1000,
            status: Status.Ongoing
        });

        emit SubscriptionBought(newTokenId);
    }

    // Subscriber can cancel its own subscription or Seller can cancel subscriber's subscription
    function cancelSubscription(uint256 tokenId)
        public
        validSubscription(tokenId)
        activeService
    {
        require(
            msg.sender == owner || ownerOf(tokenId) == msg.sender,
            "Unauthorized"
        );
        
        Subscription storage sub = subscriptions[tokenId];
        sub.endDate = block.timestamp * 1000;
        sub.status = Status.Cancelled;
        
        emit SubscriptionCancelled(tokenId);
    }

    // Allows the owner to deactivate the service
   function deactivateService() public onlyOwner {
        serviceActive = false;
        emit ServiceDeactivated(address(this));
    }

    // Allows the owner to update the service
    function updateService(string memory newName, string memory newDescription) 
        public 
        onlyOwner 
        activeService
    {
        name = newName;
        description = newDescription;
        emit ServiceUpdated(address(this), newName);
    }

    // Function to check the subscriptions
    function checkSubscriptions() public {
        uint256 currentTokenId = _tokenIdCounter.current();
        for (uint256 i = 1; i <= currentTokenId; i++) {
            if (_exists(i) && subscriptions[i].status == Status.Ongoing) {
                if (block.timestamp * 1000 > subscriptions[i].endDate) {
                    subscriptions[i].status = Status.Expired;
                }
            }
        }
    }

    // Function to add an expired subscription for testing purposes
function addExpiredSubscription() public {
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        
        _mint(msg.sender, newTokenId);
        
        subscriptions[newTokenId] = Subscription({
            subscriber: msg.sender,
            price: 1 ether,
            duration: 30,
            startDate: (block.timestamp - 60 days) * 1000,
            endDate: (block.timestamp - 30 days) * 1000,
            status: Status.Ongoing
        });
        
        emit SubscriptionCreated(newTokenId);
    }
