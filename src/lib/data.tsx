import { BrowserProvider, ethers, JsonRpcProvider } from 'ethers'

import { ServiceType } from "@/types"

import ServiceFactoryArtifact from "@/artifacts/contracts/ServiceFactory.sol/ServiceFactory.json"
import ServiceArtifact from "@/artifacts/contracts/Service.sol/Service.json"

import { toast } from 'sonner';

class ServiceFactoryContract {

    localProviderEnabled: boolean = true;
    contractAddressFactory: string = localStorage.getItem("contractAddress") || "";
    serviceFactoryABI: any = ServiceFactoryArtifact.abi
    serviceABI: any = ServiceArtifact.abi

    contractLoaded: Promise<boolean>;
    provider: JsonRpcProvider | BrowserProvider = {} as BrowserProvider;
    contract: ethers.Contract = {} as ethers.Contract;
    signer: ethers.Signer = {} as ethers.Signer;

    constructor() {
        
        if (this.localProviderEnabled) {
            this.setProvider()
        }  else {
            try {
                this.serviceFactoryABI = JSON.parse(localStorage.getItem('serviceFactoryABI') || "{}")
                this.serviceABI = JSON.parse(localStorage.getItem('serviceABI') || "{}")
            } catch (error: any) {}
        }

        this.contractLoaded = this.initializeContract().then(() => {
            return true
        }).catch((error:any) => {
            console.log(error)
            return false
        })
    }

    // ########################## WALLET + DEPLOY RELATED FUNCTIONS ##########################

    async setProvider(){
        if (this.localProviderEnabled){
            this.provider = new JsonRpcProvider('http://localhost:8545')
        } else {
            this.provider = new BrowserProvider((window as any).ethereum)
        }
    }

    async connectWallet() {
        await this.setProvider()

        this.contractLoaded = this.initializeContract().then(() => {
            return true
        }).catch((error:any) => {
            console.log(error)
            return false
        })
    }

    async getWalletAddress(){
        const signer = await this.provider.getSigner();
        const address = await signer.getAddress();
        return address;
    }

    async checkWalletConnected() {

        if (this.localProviderEnabled) return true
        
        const metamaskExtensionActivated = typeof window !== 'undefined' && (window as any).ethereum;
        if (!metamaskExtensionActivated) {
            return false
        }

        try {
            const accounts = await (window as any).ethereum.request({
                method: "eth_accounts",
            });
            
            if (accounts.length == 0) {
                throw Error("No accounts found")
            }
        } catch (error: any) {
            return false
        }

        return true
    }

    async getContractAddress(){
        const contractLoaded = await this.contractLoaded
        if (contractLoaded || this.localProviderEnabled){
            return this.contractAddressFactory;
        }

        return null;
    }

    async initializeContract() {
        if (!this.checkWalletConnected()) {
            return
        }

        await this.setProvider()

        this.signer = await this.provider.getSigner();
        this.contract = new ethers.Contract(
            this.contractAddressFactory,
            this.serviceFactoryABI,
            this.signer
        );

        this.provider.once("block", () => {
            this.contract.removeAllListeners("ServiceCreated");
            this.contract.on("ServiceCreated", (serviceAddress: string) => {
                toast("Service created: " + serviceAddress)
                window.location.href = window.location.origin + "/seller/services/list/"
            })
            this.contract.removeAllListeners("ServiceNotFound");
            this.contract.on("ServiceNotFound", (serviceAddress: string) => {
                toast("Service not found: " + serviceAddress)
            })
        });
    }

    // ########################## CONTRACT RELATED FUNCTIONS ##########################

    async _checkSubscriptionsExpiration(){
        await this.contract.checkServices()
    }

    async _addExpiredSubscription(serviceAddress: string){
        const serviceContract = new ethers.Contract(
            serviceAddress,
            this.serviceABI,
            this.signer
        );
        
        await serviceContract.addExpiredSubscription()
    }

    setAutoUpdate(enabled: boolean){
        localStorage.setItem('autoupdate', enabled ? 'true' : 'false')
    }

    getAutoUpdate(){
        return localStorage.getItem('autoupdate') == 'true' ? true : false
    }

    async _getServices() {
        const autoUpdateEnabled = localStorage.getItem('autoupdate') == 'true' ? true : false;
        if (autoUpdateEnabled){
            await this._checkSubscriptionsExpiration()
        }

        let serviceContractsAddresses = await this.contract.getServicesAddresses()

        let services: ServiceType[] = [];

        for (let i = 0; i < serviceContractsAddresses.length; i++) {
            const serviceContract = new ethers.Contract(
                serviceContractsAddresses[i],
                this.serviceABI,
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
            for (let j = 0; j < subscriptions[0].length; j++) {
                services[i]['subscriptions'].push({
                    "user": subscriptions[0][j],
                    "tokenId": subscriptions[1][j],
                    "price": parseFloat(ethers.formatEther(subscriptions[2][j])),
                    "duration": subscriptions[3][j],
                    "startDate": BigInt(subscriptions[4][j]),
                    "endDate": BigInt(subscriptions[5][j]),
                    "status": subscriptions[6][j]
                })
            }

            this.provider.once("block", () => {
                serviceContract.removeAllListeners("SubscriptionCreated");
                serviceContract.on("SubscriptionCreated", (_: string) => {
                    toast("Subscription created. Redirecting...")
                    const params = new URLSearchParams(window.location.search)
                    setTimeout(() => {
                        window.location.href = window.location.origin + "/seller/service/details/?name=" + params.get('name')
                    }, 500)
                })
                serviceContract.removeAllListeners("SubscriptionPaid");
                serviceContract.on("SubscriptionPaid", (_: string) => {
                    toast("Subscription paid. Refreshing page...")
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                })
                serviceContract.removeAllListeners("SubscriptionBought");
                serviceContract.on("SubscriptionBought", (_: string) => {
                    toast("Subscription bought. Refreshing page...")
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                })
                serviceContract.removeAllListeners("SubscriptionCancelled");
                serviceContract.on("SubscriptionCancelled", (_: string) => {
                    toast("Subscription cancelled. Refreshing page...")
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                })
                serviceContract.removeAllListeners("ServiceDeactivated");
                serviceContract.on("ServiceDeactivated", (serviceAddress: string) => {
                    toast("Service deactivated: " + serviceAddress + ". Refreshing page...")
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                })
                serviceContract.removeAllListeners("ServiceUpdated");
                serviceContract.on("ServiceUpdated", (serviceAddress: string, serviceName: string) => {
                    toast("Service updated: " + serviceAddress + ". Redirecting...")
                    setTimeout(() => {
                        window.location.href = window.location.origin + "/seller/service/details/?name=" + serviceName
                    }, 500)
                })
            })

        }

        for (let i = 0; i < services.length; i++) {
            if (!services[i]['subscriptions'] || services[i]['subscriptions'].length == 0) continue

            services[i]['metadata'] = {
                "subscribers": {
                    "ongoing": services[i]['subscriptions'].filter((sub: any) => sub.status == 'Ongoing').length,
                    "expired": services[i]['subscriptions'].filter((sub: any) => sub.status == 'Expired' || sub.status == 'New').length,
                    "cancelled": services[i]['subscriptions'].filter((sub: any) => sub.status == 'Cancelled').length,
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
            this.serviceABI,
            this.signer
        );

        return await serviceContract.updateService(name, description)
    }

    async _deactivateService(serviceAddress: string) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            this.serviceABI,
            this.signer
        );

        return await serviceContract.deactivateService()
    }

    async _addSubscription(serviceAddress: string, user: string, price: number, duration: number) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            this.serviceABI,
            this.signer
        );

        const priceParsed = ethers.parseEther(price.toString());
        return await serviceContract.createSubscription(user, priceParsed, duration)
    }

    async _paySubscription(serviceAddress: string, tokenId: number, price: number) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            this.serviceABI,
            this.signer
        );

        const priceParsed = ethers.parseEther(price.toString());
        return await serviceContract.paySubscription(tokenId, { value: priceParsed })
    }

    async _buySubscription(serviceAddress: string, user: string, price: number, duration: number) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            this.serviceABI,
            this.signer
        );

        const priceParsed = ethers.parseEther(price.toString());
        return await serviceContract.buySubscription(user, priceParsed, duration, { value: priceParsed })
    }

    async _cancelSubscription(serviceAddress: string, tokenId: number) {
        const serviceContract = new ethers.Contract(
            serviceAddress,
            this.serviceABI,
            this.signer
        );

        return await serviceContract.cancelSubscription(tokenId)
    }
}

const dAppContract = new ServiceFactoryContract();
await dAppContract.contractLoaded
export { dAppContract }