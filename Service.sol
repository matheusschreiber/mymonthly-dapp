// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Service {
    
    // ####################### VARIABLES ###########################

    address private immutable ownerDeploy;
    string private name;
    string private description;

    struct Subscription {
        uint256 id;
        address user;
        uint256 tokenId;
        uint256 price;
        uint256 duration;
        uint256 startDate;
        uint256 endDate;
    }

    uint256[] private subscribersTokensIds;
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

    modifier onlyOwner() {
        require(msg.sender == ownerDeploy, "Only owner is allowed");
        _;
    }

    modifier onlyActiveSubscription(uint256 _tokenId) {
        require(
            subscriptions[_tokenId].endDate 
            &
            block.timestamp < subscriptions[_tokenId].endDate,
            "Subscription has expired");
        _;
    }

    modifier valueGreaterThanZero(uint256 _value) {
        require(_value > 0, "Value must be greater than zero");
        _;
    }

    modifier subscriptionExists(uint256 _tokenId) {
        require(subscriptions[_tokenId].id != 0, "Subscription does not exist");
        _;
    }

    // ####################### EVENTS ##############################
    
    event DataUpdated();

    // ####################### FUNCTIONS ###########################

    function getSubscriptions() public view returns (Subscription[] memory) {
        Subscription[] memory _subscriptions = new Subscription[](subscribersTokensIds.length);
        for (uint256 i = 0; i < subscribersTokensIds.length; i++) {
            _subscriptions[i] = subscriptions[subscribersTokensIds[i]];
        }
        return _subscriptions;
    }

    function addSubscription(
        address _user,
        uint256 _price,
        uint256 _duration
    ) public onlyOwner {

        Subscription memory newSubscription = Subscription({
            id: block.timestamp,
            user: _user,
            tokenId: subscribersTokensIds.length,
            price: _price,
            duration: _duration,
            startDate: block.timestamp,
            endDate: 0
        });

        subscriptions[subscribersTokensIds.length] = newSubscription;
        
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
        
        require(msg.value == subscriptions[_tokenId].price, "Invalid amount");
        subscriptions[_tokenId].endDate = 0;

        emit DataUpdated();
    }
}
