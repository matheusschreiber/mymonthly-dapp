import { useWatchContractEvent } from "wagmi"

import { useContext } from "react";
import { ServicesContext } from "@/routes";
import { serviceContractConfig } from "@/lib/data";
import { ServiceType } from "@/types";
import { toast } from "sonner";

export default function ContractEvents() {
    const { services, loaded } = useContext(ServicesContext)

    return (
        <>
            {loaded && services.map((service) => (
                <ContractEventWatcher key={service.address} service={service} />
            ))}
        </>
    )
}

function ContractEventWatcher({ service }: { service: ServiceType }) {
    useWatchContractEvent({
        address: service.address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'SubscriptionCreated',
        onLogs(_) {
            toast("Subscription created. Redirecting...")
            const params = new URLSearchParams(window.location.search)
            setTimeout(() => {
                window.location.href = window.location.origin + "/seller/service/details/?name=" + params.get('name')
            }, 500)
        },
    })

    useWatchContractEvent({
        address: service.address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'SubscriptionPaid',
        onLogs(_) {
            toast("Subscription paid. Refreshing page...")
            setTimeout(() => {
                window.location.reload()
            }, 500)
        },
    })

    useWatchContractEvent({
        address: service.address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'SubscriptionBought',
        onLogs(_) {
            toast("Subscription bought. Refreshing page...")
            setTimeout(() => {
                window.location.reload()
            }, 500)
        },
    })

    useWatchContractEvent({
        address: service.address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'SubscriptionCancelled',
        onLogs(_) {
            toast("Subscription cancelled. Refreshing page...")
            setTimeout(() => {
                window.location.reload()
            }, 500)
        },
    })

    useWatchContractEvent({
        address: service.address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'ServiceDeactivated',
        onLogs(_) {
            toast("Service deactivated. Refreshing page...")
            setTimeout(() => {
                window.location.reload()
            }, 500)
        },
    })

    useWatchContractEvent({
        address: service.address as `0x${string}`, abi: serviceContractConfig.abi, eventName: 'ServiceUpdated',
        onLogs(_) {
            toast("Service updated. Redirecting...")
            setTimeout(() => {
                window.location.href = window.location.origin + "/seller/services/list/"
            }, 500)
        },
    })

    return null
}