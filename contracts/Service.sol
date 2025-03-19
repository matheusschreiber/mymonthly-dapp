// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Service {
    
    address private immutable ownerDeploy;
    string public name;
    string public description;
    bool public isActive = true;

    enum Status {
        New,
        Ongoing,
        Expired,
        Cancelled
    }

    struct Subscription {
        address user;
        uint256 tokenId;
        uint256 price;
        uint256 duration; // duration in days
        uint256 startDate; // timestamp in milliseconds (from January 1st, 1970)
        uint256 endDate; // timestamp in milliseconds (from January 1st, 1970)
        Status status;
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

    // ######################## EVENTS ########################

    event SubscriptionCreated(uint256 indexed tokenId);
    event SubscriptionPaid(uint256 indexed tokenId);
    event SubscriptionBought(uint256 indexed tokenId);
    event SubscriptionCancelled(uint256 indexed tokenId);
    event ServiceDeactivated(address serviceAddress);
    event ServiceUpdated(address serviceAddress, string name);

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
        require(
            subscriptions[_tokenId].user != address(0),
            "Subscription does not exist"
        );
        _;
    }

    // Modifier to check if the sent value is greater than zero
    modifier valueGreaterThanZero(uint256 _value) {
        require(_value > 0, "Value must be greater than zero");
        _;
    }

    // Ensures that only the subscriber can call the function
    modifier onlySubscriberOrSeller(uint256 _tokenId) {
        require(
            subscriptions[_tokenId].user == msg.sender ||
                msg.sender == ownerDeploy,
            "Caller is not the subscriber"
        );
        _;
    }

    // Modifier to check if the subscriber already exists
    modifier subscriberNotSubscribed(address _user) {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            if (
                subscriptions[i].user == _user && 
                (subscriptions[i].status == Status.Ongoing || 
                (subscriptions[i].status == Status.New && block.timestamp < subscriptions[i].endDate))
            ) {
                revert("Subscriber already has an active subscription");
            }
        }
        _;
    }

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
        address _user,
        uint256 _price,
        uint256 _duration
    )
        public
        subscriberNotSubscribed(_user)
        valueGreaterThanZero(_price)
        isActiveService
    {
        Subscription memory newSubscription = Subscription({
            user: _user,
            tokenId: subscriptionCounter,
            price: _price,
            duration: _duration,
            startDate: 0,
            endDate: 0,
            status: Status.New
        });

        subscriptions[subscriptionCounter] = newSubscription;
        emit SubscriptionCreated(subscriptionCounter);
        subscriptionCounter++;
    }

    // Allows a subscriber to pay for the subscription
    function paySubscription(
        uint256 _tokenId
    )
        public
        payable
        subscriptionExists(_tokenId)
        onlySubscriberOrSeller(_tokenId)
        isActiveService
    {
        uint256 _valuePaid = msg.value;
        uint256 _valueToPay = subscriptions[_tokenId].price;
        require(_valuePaid == _valueToPay, "Invalid amount");

        subscriptions[_tokenId].startDate = block.timestamp * 1000;
        subscriptions[_tokenId].endDate =
            (block.timestamp + (subscriptions[_tokenId].duration * 1 days)) *
            1000;
        subscriptions[_tokenId].status = Status.Ongoing;

        emit SubscriptionPaid(_tokenId);
    }

    // Allows a subscriber to buy a subscription (first payment)
    function buySubscription(
        address _user,
        uint256 _price,
        uint256 _duration
    )
        public
        payable
        subscriberNotSubscribed(_user)
        valueGreaterThanZero(_price)
        isActiveService
    {
        Subscription memory newSubscription = Subscription({
            user: _user,
            tokenId: subscriptionCounter,
            price: _price,
            duration: _duration,
            startDate: block.timestamp * 1000,
            endDate: (block.timestamp + (_duration * 1 days)) * 1000,
            status: Status.Ongoing
        });

        subscriptions[subscriptionCounter] = newSubscription;
        emit SubscriptionBought(subscriptionCounter);
        subscriptionCounter++;
    }

    // Subscriber can cancel its own subscription or Seller can cancel subscriber's subscription
    function cancelSubscription(
        uint256 _tokenId
    )
        public
        subscriptionExists(_tokenId)
        onlySubscriberOrSeller(_tokenId)
        isActiveService
    {
        subscriptions[_tokenId].endDate = block.timestamp * 1000;
        subscriptions[_tokenId].status = Status.Cancelled;
        emit SubscriptionCancelled(_tokenId);
    }

    // Allows the owner to deactivate the service
    function deactivateService() public onlyOwner isActiveService {
        isActive = false;
        emit ServiceDeactivated(address(this));
    }

    // Allows the owner to update the service
    function updateService(
        string memory _newname,
        string memory _newdescription
    ) public onlyOwner isActiveService {
        name = _newname;
        description = _newdescription;
        emit ServiceUpdated(address(this), name);
    }

    // Function to check the subscriptions
    function checkSubscriptions() public {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            if (block.timestamp * 1000 > subscriptions[i].endDate && subscriptions[i].status == Status.Ongoing) {
                subscriptions[i].status = Status.Expired;
                emit ServiceUpdated(address(this), name);
            }
        }
    }

    // Function to add an expired subscription for testing purposes
    function addExpiredSubscription() public {
        Subscription memory newSubscription = Subscription({
            user: msg.sender,
            tokenId: subscriptionCounter,
            price: 1 * 10**18,
            duration: 30,
            startDate: (block.timestamp - (60 days)) * 1000, 
            endDate: (block.timestamp - (30 days)) * 1000,
            status: Status.Ongoing
        });

        subscriptions[subscriptionCounter] = newSubscription;
        emit SubscriptionCreated(subscriptionCounter);
        subscriptionCounter++;
    }
}
