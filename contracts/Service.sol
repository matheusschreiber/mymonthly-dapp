// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Service {
    address public immutable ownerDeploy;
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
        uint256 duration;
        uint256 startDate;
        uint256 endDate;
        Status status;
    }

    uint256 private subscriptionCounter = 0;
    mapping(uint256 => Subscription) public subscriptions;

    event SubscriptionCreated(uint256 indexed tokenId);
    event SubscriptionPaid(uint256 indexed tokenId);
    event SubscriptionBought(uint256 indexed tokenId);
    event SubscriptionCancelled(uint256 indexed tokenId);
    event ServiceDeactivated(address indexed serviceAddress);
    event ServiceUpdated(address indexed serviceAddress, string name);

    modifier onlyOwner() {
        require(msg.sender == ownerDeploy, "Only owner is allowed");
        _;
    }

    modifier isActiveService() {
        require(isActive, "Service is not active");
        _;
    }

    modifier subscriptionExists(uint256 _tokenId) {
        require(subscriptions[_tokenId].user != address(0), "Subscription does not exist");
        _;
    }

    modifier onlySubscriberOrSeller(uint256 _tokenId) {
        require(
            subscriptions[_tokenId].user == msg.sender || msg.sender == ownerDeploy,
            "Caller is not the subscriber or owner"
        );
        _;
    }

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

    constructor(address _deployeraddress, string memory _name, string memory _description) {
        ownerDeploy = _deployeraddress;
        name = _name;
        description = _description;
    }

    function buySubscription(address _user, uint256 _price, uint256 _duration) public payable isActiveService subscriberNotSubscribed(_user) {
        require(_price > 0, "Price must be greater than zero");
        require(msg.value == _price, "Incorrect payment amount");
        subscriptions[subscriptionCounter] = Subscription(
            _user,
            subscriptionCounter,
            _price,
            _duration,
            block.timestamp,
            block.timestamp + (_duration * 1 days),
            Status.Ongoing
        );
        emit SubscriptionBought(subscriptionCounter);
        subscriptionCounter++;
    }

    function createSubscription(address _user, uint256 _price, uint256 _duration) public onlyOwner isActiveService subscriberNotSubscribed(_user) {
        require(_price > 0, "Price must be greater than zero");
        subscriptions[subscriptionCounter] = Subscription(
            _user,
            subscriptionCounter,
            _price,
            _duration,
            block.timestamp,
            block.timestamp + (_duration * 1 days),
            Status.New
        );
        emit SubscriptionCreated(subscriptionCounter);
        subscriptionCounter++;
    }

    function paySubscription(uint256 _tokenId) public payable subscriptionExists(_tokenId) onlySubscriberOrSeller(_tokenId) isActiveService {
        require(msg.value == subscriptions[_tokenId].price, "Invalid payment amount");
        subscriptions[_tokenId].status = Status.Ongoing;
        emit SubscriptionPaid(_tokenId);
    }

    function cancelSubscription(uint256 _tokenId) public subscriptionExists(_tokenId) onlySubscriberOrSeller(_tokenId) {
        subscriptions[_tokenId].status = Status.Cancelled;
        emit SubscriptionCancelled(_tokenId);
    }

    function deactivateService() public onlyOwner {
        isActive = false;
        emit ServiceDeactivated(address(this));
    }

    function updateService(string memory _newName, string memory _newDescription) public onlyOwner isActiveService {
        name = _newName;
        description = _newDescription;
        emit ServiceUpdated(address(this), _newName);
    }

    function checkSubscriptions() public {
        for (uint256 i = 0; i < subscriptionCounter; i++) {
            if (subscriptions[i].status == Status.Ongoing && block.timestamp > subscriptions[i].endDate) {
                subscriptions[i].status = Status.Expired;
            }
        }
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
    uint256[] memory tokenIds = new uint256[](subscriptionCounter);
    uint256[] memory prices = new uint256[](subscriptionCounter);
    uint256[] memory durations = new uint256[](subscriptionCounter);
    uint256[] memory startDates = new uint256[](subscriptionCounter);
    uint256[] memory endDates = new uint256[](subscriptionCounter);
    string[] memory statuses = new string[](subscriptionCounter);

    for (uint256 i = 0; i < subscriptionCounter; i++) {
        users[i] = subscriptions[i].user;
        tokenIds[i] = subscriptions[i].tokenId;
        prices[i] = subscriptions[i].price;
        durations[i] = subscriptions[i].duration;
        startDates[i] = subscriptions[i].startDate;
        endDates[i] = subscriptions[i].endDate;

        if (subscriptions[i].status == Status.New) {
            statuses[i] = "New";
        } else if (subscriptions[i].status == Status.Ongoing) {
            statuses[i] = "Ongoing";
        } else if (subscriptions[i].status == Status.Expired) {
            statuses[i] = "Expired";
        } else {
            statuses[i] = "Cancelled";
        }
    }

    return (users, tokenIds, prices, durations, startDates, endDates, statuses);
}

}
