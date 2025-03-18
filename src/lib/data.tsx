import { ethers, JsonRpcProvider } from 'ethers'

import { ServiceType, SubscriptionType } from "@/types"

import ServiceFactoryArtifact from "@/artifacts/contracts/ServiceFactory.sol/ServiceFactory.json"
import ServiceArtifact from "@/artifacts/contracts/Service.sol/Service.json"
import { toast } from 'sonner';

class ServiceFactoryContract {

    // address of deployed contract on hardhat
    contractAddressFactory: string = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    provider: JsonRpcProvider;
    loaded: Promise<boolean>;
    contract: ethers.Contract;
    signer: ethers.Signer;

    constructor() {
        this.provider = new JsonRpcProvider('http://localhost:8545') // hardhat local address
        // this.provider = new ethers.providers.Web3Provider(window.ethereum);

        this.contract = {} as ethers.Contract
        this.signer = {} as ethers.Signer

        this.loaded = this.initializeContract().then(() => {
            return true
        }).catch(() => {
            return false
        })
    }
    
    async initializeContract() {
        this.signer = await this.provider.getSigner();
        this.contract = new ethers.Contract(
            this.contractAddressFactory,
            ServiceFactoryArtifact.abi,
            this.signer
        );

        this.provider.once("block", () => {
            this.contract.removeAllListeners("ServiceCreated");
            this.contract.on("ServiceCreated", (serviceAddress: string) => {
                toast("Service created: " + serviceAddress)
            })
            this.contract.removeAllListeners("ServiceNotFound");
            this.contract.on("ServiceNotFound", (serviceAddress: string) => {
                toast("Service not found: " + serviceAddress)
            })
        });

    }

    async _getServices() {
        let serviceContractsAddresses = await this.contract.getServicesAddresses()

        let services:ServiceType[] = [];

        for(let i=0; i<serviceContractsAddresses.length; i++){
            const serviceContract = new ethers.Contract(
                serviceContractsAddresses[i],
                ServiceArtifact.abi,
                this.signer
            );
            
            services.push({
                "address": serviceContractsAddresses[i],
                "name": await serviceContract.getName(), 
                "description": await serviceContract.getDescription(), 
                "isActive": await serviceContract.isActive(), 
                "subscriptions": []
            })

            let subscriptions = await serviceContract.getSubscriptions()      
            for(let j=0; j<subscriptions[0].length; j++){
                services[i]['subscriptions'].push({
                    "user": subscriptions[0][j],
                    "tokenId": subscriptions[1][j],
                    "price": subscriptions[2][j],
                    "duration": subscriptions[3][j],
                    "startDate": BigInt(subscriptions[4][j]),
                    "endDate": BigInt(subscriptions[5][j])
                })
            }

            this.provider.once("block", () => {
                serviceContract.removeAllListeners("SubscriptionCreated");
                serviceContract.on("SubscriptionCreated", (tokenId:string) => {
                    toast("Subscription created. ID: " + tokenId)
                })
                serviceContract.removeAllListeners("SubscriptionPaid");
                serviceContract.on("SubscriptionPaid", (tokenId:string) => {
                    toast("Subscription paid. ID: " + tokenId + ". Refreshing page...")
                    setTimeout(()=>window.location.reload(), 500)
                })
                serviceContract.removeAllListeners("SubscriptionCancelled");
                serviceContract.on("SubscriptionCancelled", (tokenId:string) => {
                    toast("Subscription cancelled. ID: " + tokenId + ". Refreshing page...")
                    setTimeout(()=>window.location.reload(), 500)
                })
                serviceContract.removeAllListeners("ServiceDeactivated");
                serviceContract.on("ServiceDeactivated", (serviceAddress: string) => {
                    toast("Service deactivated: " + serviceAddress + ". Refreshing page...")
                    window.location.reload()
                })
                serviceContract.removeAllListeners("ServiceUpdated");
                serviceContract.on("ServiceUpdated", (serviceAddress: string, serviceName:string) => {
                    toast("Service updated: " + serviceAddress + ". Refreshing page...")
                    window.location.href = window.location.origin + "/seller/service/details/?name=" + serviceName
                })
            })

        }
        


        for (let i = 0; i < services.length; i++) {
            if (!services[i]['subscriptions'] || services[i]['subscriptions'].length == 0) continue

            services[i]['metadata'] = {
                "subscribers": {
                    "ongoing": services[i]['subscriptions'].filter((sub: any) => getStatus(sub) == 'Ongoing').length,
                    "expired": services[i]['subscriptions'].filter((sub: any) => getStatus(sub) == 'Expired' || getStatus(sub) == 'New').length,
                    "cancelled": services[i]['subscriptions'].filter((sub: any) => getStatus(sub) == 'Cancelled').length,
                }
            }
            services[i]['subscriptions'] = services[i]['subscriptions'].map((sub: any) => {
                sub['serviceAddress'] = services[i]['address']
                sub['serviceName'] = services[i]['name']
                return sub
            })
        }

        return services
    }

    async _addService(name: string, description: string) {
        return await this.contract.createService(name, description)
    }

    async _updateService(serviceAddress: string, name: string, description: string) {

        const isNameAvailable = await this.contract.checkNameAvailability(name)
        if (!isNameAvailable) {
            throw Error("Name already in use")
        }

        const serviceContract = new ethers.Contract(
            serviceAddress,
            ServiceArtifact.abi,
            this.signer
        );

        return await serviceContract.updateService(name, description)
    }

    async _deactivateService(serviceAddress: string) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            ServiceArtifact.abi,
            this.signer
        );

        return await serviceContract.deactivateService()
    }

    async _addSubscription(serviceAddress: string, user: string, price: number, duration: number) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            ServiceArtifact.abi,
            this.signer
        );

        const priceParsed = price.toString()
        return await serviceContract.createSubscription(user, priceParsed, duration)
    }

    async _paySubscription(serviceAddress: string, tokenId: number, price:number) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            ServiceArtifact.abi,
            this.signer
        );

        const priceParsed = price.toString()
        return await serviceContract.paySubscription(tokenId, {value: priceParsed})
    }

    async _buySubscription(serviceAddress: string, user: string, price: number, duration: number) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            ServiceArtifact.abi,
            this.signer
        );

        const priceParsed = price.toString()
        return await serviceContract.buySubscription(user, price, duration, {value: priceParsed})
    }

    async _cancelSubscription(serviceAddress: string, tokenId: number) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            ServiceArtifact.abi,
            this.signer
        );

        return await serviceContract.cancelSubscription(tokenId)
    }
}

export function getStatus(subscription: SubscriptionType) {
    const MILISECONDS_IN_DAY = 60 * 60 * 24 * 1000;

    if (Number(subscription['endDate']) == 0) return "New"
    else if (new Date(Number(subscription['endDate'])) < new Date()) return "Cancelled"
    else if (new Date(Number(subscription['endDate'])) > new Date()) return "Ongoing"
    else if ((Number(subscription['startDate']) + Number(subscription['duration']) * MILISECONDS_IN_DAY) <= subscription['endDate']) return "Expired"
    else return "Error"

}

export async function getUserAddress() {
    // return "0x78eaaE5dE26E7D4855Da96Bb1463eAf8f1137496" // matheus
    return "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // hardhat
}

const dAppContract = new ServiceFactoryContract();
await dAppContract.loaded
export { dAppContract }