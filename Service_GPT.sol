// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Service {
    
    // ####################### VARIABLES #######################
    address private immutable ownerDeploy;
    string private name;
    string private description;
    bool private isActive = true;

    struct Subscription {
        address user;
        uint256 tokenId;
        uint256 price;
        uint256 duration;      // duração em dias
        uint256 startDate;
        uint256 endDate;       // data de expiração (não zero se a assinatura estiver paga)
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

    // ####################### FUNCTIONS #######################

    function subscribe(
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
            startDate: 0,      // Ainda não paga
            endDate: 0         // Ainda não ativa
        });

        subscriptions[subscriptionCounter] = newSubscription;
        emit SubscriptionAdded(subscriptionCounter, msg.sender);
        subscriptionCounter++;
    }

    /// @notice Permite que o assinante pague por sua assinatura, ativando-a ou renovando-a.
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

        // Atualiza a data de início e a data de expiração
        subscriptions[_tokenId].startDate = block.timestamp;
        subscriptions[_tokenId].endDate = block.timestamp + (subscriptions[_tokenId].duration * 1 days);

        emit SubscriptionPaid(_tokenId, msg.sender, subscriptions[_tokenId].endDate);
    }

    /// @notice Permite que o assinante cancele sua assinatura.
    function cancelSubscription(
        uint256 _tokenId
    ) public
        subscriptionExists(_tokenId)
        onlySubscriber(_tokenId)
        isActiveService {

        // Define a data de expiração como o momento atual, cancelando a assinatura
        subscriptions[_tokenId].endDate = block.timestamp;
        emit SubscriptionCancelled(_tokenId, msg.sender);
    }

    /// @notice Atualiza o status das assinaturas, revogando as que expiraram.
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
