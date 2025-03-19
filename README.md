
<p align="center">
    <img src="public/logo.png" height="100" alt="MyMonthly Logo">
    <br/><br/>
    <p align="center">
        A decentralized application for managing subscription services like Netflix, Spotify, and Disney+, leveraging smart contracts to automate payments, renewals, and access control securely and transparently.
    </p>
</p>

[🇧🇷 Readme](README.br.md)

## Idea

A contract factory for managing payments and expiration dates of subscription services.

![diagram](public/diagram.png)

## Description

### Domain and Motivation

The application's domain is the subscription service management sector. The problem being addressed is the complex network of recurring payment management and access control, which currently relies on centralized intermediaries and manual processes. The DApp proposes a decentralized solution based on smart contracts, automating payments, renewals, and access revocations without the need for third-party trust. By utilizing Chainlink Automation and cryptocurrency payments, the platform ensures transparency, security, and efficiency for sellers and subscribers.

### Contract Factory

The concept of a Contract Factory will be used to allow each seller to create and manage multiple subscription contracts efficiently and in a decentralized manner. The Factory will act as a master contract responsible for deploying new child contracts whenever a seller registers a new service (e.g., Netflix, OpenAI, SmartFit, subscription-based newspapers, health plans, life insurance, car insurance, etc.).

Each child contract will belong to one of these sellers (e.g., Netflix), and within this contract, there will be control over subscribers, expiration dates, and the current states of each subscription.

### Events

The concept of Events will be used to log and monitor important actions within the smart contracts, enabling interfaces and external services to automatically react to changes in the subscription state.

For example, if a payment is made, the subscription's expiration date should be renewed and then updated on the application's front end. The same applies if the subscription is canceled or its expiration date is exceeded.

## Setup

Firstly, install dependencies
```
npm install
```

### Local deploy

For local deploy of the contract, follow:

**1. Alter the local provider on `.env`**
```
VITE_LOCAL_PROVIDER_ENABLED='true'
```

**2. Clean hardhat artifacts and start node worker (keep it running)**
```
npx hardhat clean && npx hardhat node
```

**3. Deploy the factory contract locally**
```
npx hardhat run --network localhost scripts/deploy.cjs
```
>Obs.: Save contract address

**4. Run vite server**
```
npm run dev
```

**5. Connect the deployed contract**

On the home page (`http://localhost:5173/`) theres a button for that

>Obs.: For ABIs you can input any value. Doesn't matter on local deployment.

### Metamask deploy

For real deploy of the contract, follow:

**1. Alter the local provider on `.env`**
```
VITE_LOCAL_PROVIDER_ENABLED='false'
```

**2. Deploy the factory contract on any platform**

Recomendation: [REMIX IDE](https://remix.ethereum.org/) 
>Obs.: Save contract address and contracts ABIs (Application Binary Interface) for ServiceFactory.sol and Service.sol


**3. Run vite server**
```
npm run dev
```

**4. Connect Metamask Wallet**

On the home page (`http://localhost:5173/`) theres a button for that

**5. Connect the deployed contract**

On the home page (`http://localhost:5173/`) theres a button for that