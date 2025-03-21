import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { factoryContractConfig, serviceContractConfig } from "./data";
import { config } from "./wagmi";
import { readContract, watchContractEvent, writeContract } from '@wagmi/core'
import { SubscriptionType } from "@/types";
import { formatUnits, parseEther } from 'viem'
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

async function addrsToServices(servicesAddresses: string[]) {
    return await Promise.all(
        servicesAddresses.map(async (address) => {

            const name = await readContract(config, { abi: serviceContractConfig.abi, address: address as `0x${string}`, functionName: 'getName', })
            const description = await readContract(config, { abi: serviceContractConfig.abi, address: address as `0x${string}`, functionName: 'getDescription', })
            const isActive = await readContract(config, { abi: serviceContractConfig.abi, address: address as `0x${string}`, functionName: 'getIsActive', })
            const owner = await readContract(config, { abi: serviceContractConfig.abi, address: address as `0x${string}`, functionName: 'getOwner', })

            const subscriptionsRaw = await readContract(config, { abi: serviceContractConfig.abi, address: address as `0x${string}`, functionName: 'getSubscriptions', })
            const subscriptions: SubscriptionType[] = [];
            const rawData = subscriptionsRaw as [string[], number[], string[], number[], string[], string[], string[]];

            for (let j = 0; j < rawData[0].length; j++) {
                subscriptions.push({
                    user: rawData[0][j],
                    tokenId: rawData[1][j],
                    price: parseFloat(formatUnits(BigInt(rawData[2][j]), 18)),
                    duration: rawData[3][j],
                    startDate: BigInt(rawData[4][j]),
                    endDate: BigInt(rawData[5][j]),
                    status: rawData[6][j],
                    serviceAddress: address,
                    serviceName: name as string,
                });
            }

            const metadata = {
                "subscribers": {
                    "ongoing": subscriptions.filter((sub: any) => sub.status == 'Ongoing').length,
                    "expired": subscriptions.filter((sub: any) => sub.status == 'Expired' || sub.status == 'New').length,
                    "cancelled": subscriptions.filter((sub: any) => sub.status == 'Cancelled').length,
                },
                "owner": owner as string
            }

            // watchContractEvent(config, {
            //     address: address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'SubscriptionCreated',
            //     onLogs(_) {
            //         toast("Subscription created. Redirecting...")
            //         const params = new URLSearchParams(window.location.search)
            //         setTimeout(() => {
            //             window.location.href = window.location.origin + "/seller/service/details/?name=" + params.get('name')
            //         }, 500)
            //     },
            // })

            // watchContractEvent(config, {
            //     address: address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'SubscriptionPaid',
            //     onLogs(_) {
            //         toast("Subscription paid. Refreshing page...")
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 500)
            //     },
            // })

            // watchContractEvent(config, {
            //     address: address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'SubscriptionBought',
            //     onLogs(_) {
            //         toast("Subscription bought. Refreshing page...")
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 500)
            //     },
            // })

            // watchContractEvent(config, {
            //     address: address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'SubscriptionCancelled',
            //     onLogs(_) {
            //         toast("Subscription cancelled. Refreshing page...")
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 500)
            //     },
            // })

            // watchContractEvent(config, {
            //     address: address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'ServiceDeactivated',
            //     onLogs(_) {
            //         toast("Service deactivated. Refreshing page...")
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 500)
            //     },
            // })

            // watchContractEvent(config, {
            //     address: address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'ServiceUpdated',
            //     onLogs(_) {
            //         toast("Service updated. Redirecting...")
            //         setTimeout(() => {
            //             window.location.href = window.location.origin + "/seller/services/list/"
            //         }, 500)
            //     },
            // })

            return {
                address,
                name: name as string,
                description: description as string,
                isActive: isActive as boolean,
                subscriptions: subscriptions,
                metadata: metadata,
            };
        })
    )
}

export async function getServices() {
    const servicesAddresses = await readContract(config, {
        address: factoryContractConfig.address,
        abi: factoryContractConfig.abi,
        functionName: "getServicesAddresses",
        args: []
    });

    return await addrsToServices(servicesAddresses as string[]);
}

export async function addService(name: string, description: string) {
    await writeContract(config, {
        abi: factoryContractConfig.abi,
        address: factoryContractConfig.address,
        functionName: 'createService',
        args: [name, description]
    })
}

export async function updateService(serviceAddress: string, name: string, description: string) {
    const isNameAvailable = await readContract(config, {
        address: factoryContractConfig.address,
        abi: factoryContractConfig.abi,
        functionName: "checkNameAvailability",
        args: [name]
    });
    if (!isNameAvailable) {
        throw Error("Name already in use")
    }

    await writeContract(config, {
        abi: serviceContractConfig.abi,
        address: serviceAddress as `0x${string}`,
        functionName: 'updateService',
        args: [name, description]
    })
}

export async function addSubscription(serviceAddress: string, user: string, price: number, duration: number) {
    const priceParsed = parseEther(price.toString());
    await writeContract(config, {
        abi: serviceContractConfig.abi,
        address: serviceAddress as `0x${string}`,
        functionName: 'createSubscription',
        args: [user, priceParsed, duration],
        value: priceParsed
    })
}

export async function buySubscription(serviceAddress: string, user: string, price: number, duration: number) {
    const priceParsed = parseEther(price.toString());
    await writeContract(config, {
        abi: serviceContractConfig.abi,
        address: serviceAddress as `0x${string}`,
        functionName: 'buySubscription',
        args: [user, priceParsed, duration],
        value: priceParsed
    })
}

export async function paySubscription(serviceAddress: string, tokenId: number, price: number) {
    const priceParsed = parseEther(price.toString());
    await writeContract(config, {
        abi: serviceContractConfig.abi,
        address: serviceAddress as `0x${string}`,
        functionName: 'paySubscription',
        args: [tokenId],
        value: priceParsed
    })
}

export async function cancelSubscription(serviceAddress: string, tokenId: number) {
    await writeContract(config, {
        abi: serviceContractConfig.abi,
        address: serviceAddress as `0x${string}`,
        functionName: 'cancelSubscription',
        args: [tokenId],
    })
}

export async function deactivateService(serviceAddress: string) {
    await writeContract(config, {
        abi: serviceContractConfig.abi,
        address: serviceAddress as `0x${string}`,
        functionName: 'deactivateService',
        args: [],
    })
}