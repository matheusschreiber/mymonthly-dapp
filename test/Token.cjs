// test/service.test.cjs
const { expect } = require("chai");
const { ethers } = require("hardhat");

/*
 * Test Suite for Service Contracts
 * This suite tests the functionalities of the ServiceFactory and Service contracts.
 */
describe("Service Contracts", function () {
  // Declare contract variables and testing accounts.
  let factory, service; // Removed unnecessary "Factory" and "Service" variables.
  let owner, user1, user2;

  // The "before" hook deploys the ServiceFactory and creates a service before running tests.
  before(async () => {
    // Retrieve the signer accounts.
    [owner, user1, user2] = await ethers.getSigners();

    // Modern deployment of the ServiceFactory contract.
    factory = await ethers.deployContract("ServiceFactory");
    await factory.waitForDeployment();

    // Create a service using the factory contract.
    await factory.createService("Test Service", "Test Description");
    const services = await factory.getServicesAddresses();

    // Obtain the deployed Service contract instance.
    service = await ethers.getContractAt("Service", services[0]);
  });

  /*
   * Tests for the Factory Contract functionalities.
   */
  describe("Factory Contract", () => {
    // Test that a new service can be created and emits the correct event.
    it("Should create new service", async () => {
      const tx = await factory.createService("New Service", "New Description");
      const services = await factory.getServicesAddresses();
      const newServiceAddress = services[services.length - 1]; // Last created service address.
      
      // Verify that the "ServiceCreated" event is emitted with the correct service address.
      await expect(tx)
        .to.emit(factory, "ServiceCreated")
        .withArgs(newServiceAddress);
    });

    // Test that creating a service with a duplicate name fails.
    it("Should prevent duplicate service names", async () => {
      await expect(
        factory.createService("Test Service", "Duplicate")
      ).to.be.revertedWith("Service name is already taken");
    });

    // Test to check the availability of a service name.
    it("Should check name availability", async () => {
      // "Test Service" already exists (created in the before() hook).
      expect(await factory.checkNameAvailability("Test Service")).to.be.false;
    
      // "Novo Serviço" is available.
      expect(await factory.checkNameAvailability("Novo Serviço")).to.be.true;
    });

    // Test to verify that the factory returns the correct number of deployed services.
    it("Should return deployed services", async () => {
      const services = await factory.getServicesAddresses();
      expect(services.length).to.equal(2);
    });
  });

  /*
   * Tests for the Service Contract functionalities.
   */
  describe("Service Contract", () => {
    // Test that the service contract is initialized with the correct name and owner.
    it("Should initialize correctly", async () => {
      expect(await service.name()).to.equal("Test Service");
      expect(await service.description()).to.equal("Test Description");
      expect(await service.ownerDeploy()).to.equal(owner.address);
    });

    // Test the creation of a subscription and verify that the subscriber's address is recorded.
    it("Should create subscription", async () => {
      await service.connect(owner).createSubscription(user1.address, 100, 30);
      const subs = await service.getSubscriptions();
      expect(subs[0].toString()).to.equal(user1.address);
    });

    // Test that paying a subscription updates its status to "Ongoing".
    it("Should pay subscription", async () => {
      await service.connect(user1).paySubscription(0, { value: 100 });
      // Retrieve the subscription statuses (7th element in the subscriptions array).
      const [,,,,,, statuses] = await service.getSubscriptions();
      expect(statuses[0]).to.equal("Ongoing");
    });

    // Test that buying a subscription updates the subscriber's address accordingly.
    it("Should buy subscription", async () => {
      await service.connect(user2).buySubscription(user2.address, 200, 60, {
        value: 200,
      });
      const subs = await service.getSubscriptions();
      // Verify that the subscriber address is updated to user2's address.
      expect(subs[0][1]).to.equal(user2.address);
    });

    // Test the cancellation of a subscription and verify its status is updated to "Cancelled".
    it("Should cancel subscription", async () => {
      await service.connect(user1).cancelSubscription(0);
      // Retrieve the subscription statuses (7th element in the subscriptions array).
      const [,,,,,, statuses] = await service.getSubscriptions();
      expect(statuses[0]).to.equal("Cancelled");
    });

    // Test updating the service information and reactivating the service.
    it("Should update service info", async () => {
      // Update the service name and description.
      await service.connect(owner).updateService("Updated", "New Desc");
      expect(await service.name()).to.equal("Updated");
      expect(await service.description()).to.equal("New Desc");
    });

    // Test that subscription statuses are updated based on expiration.
    it("Should check subscriptions", async () => {
      // Create a new subscription with a duration of 30 days
      const durationDays = 30;
      await service.connect(user1).buySubscription(user1.address, 100, durationDays, {
        value: 100,
      });
    
      // Advance time by 31 days AFTER the subscription duration (in seconds)
      await ethers.provider.send("evm_increaseTime", [(durationDays + 1) * 86400]);
      await ethers.provider.send("evm_mine");
    
      // Check and update the subscription statuses
      await service.checkSubscriptions();
    
      // Retrieve the subscription statuses (7th element of the array)
      const [,,,,,, statuses] = await service.getSubscriptions();
      
      // Verify if the subscription is marked as expired
      expect(statuses[2]).to.equal("Expired");
    });    
  });

  /*
   * Tests for Access Control to ensure only authorized accounts perform administrative actions.
   */
  describe("Access Control", () => {
    // Test that non-owners cannot perform admin actions like deactivating the service.
    it("Should prevent non-owners from admin actions", async () => {
      await expect(
        service.connect(user1).deactivateService()
      ).to.be.revertedWith("Only owner is allowed");
    });

    // Test that invalid payment amounts are rejected.
    it("Should prevent invalid payments", async () => {
      await expect(
        service.connect(user1).paySubscription(0, { value: 50 })
      ).to.be.revertedWith("Invalid payment amount");
    });

    // Test that duplicate subscriptions for the same user are not allowed.
    it("Should prevent duplicate subscriptions", async () => {
      // Create and pay for a subscription for user1 to activate it.
      await service.connect(owner).createSubscription(user1.address, 100, 30);
      await service.connect(user1).paySubscription(0, { value: 100 });
      
      // Attempt to create a duplicate subscription for the same user, expecting it to fail.
      await expect(
        service.connect(owner).createSubscription(user1.address, 100, 30)
      ).to.be.revertedWith("Subscriber already has an active subscription");
    });

    // Test that the service can be deactivated by the owner.
    it("Should deactivate service", async () => {
      await service.connect(owner).deactivateService();
      expect(await service.isActive()).to.be.false;
    });

  });
});