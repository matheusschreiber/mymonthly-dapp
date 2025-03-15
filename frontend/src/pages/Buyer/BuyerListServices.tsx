import BuySubscriptionModal from "@/components/buy-subscription";
import Navbar from "@/components/navbar";
import PaySubscriptionModal from "@/components/pay-subscription";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getServices, getStatus } from "@/lib/data";
import { ServiceType } from "@/types";
import { Check, Hourglass } from "lucide-react";
import { useEffect, useState } from "react";

export default function BuyerListServices() {

    const [services, setServices] = useState<ServiceType[]>([])
    const BuyerAddress = '12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv'

    async function fetchData() {
        let _services = await getServices()
        setServices(_services)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <main className="lg:min-w-[400px] lg:p-0 p-16">

            <Navbar />

            <div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                <p className="text-6xl font-semibold">Services</p>
            </div>
            <p className="mt-3 text-md text-zinc-400 mb-16">
                Complete list of services currently registered on the blockchain. <br />You can interact with each service individually.
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
                {services.map((service, index) => (
                    <Card key={index} className={`w-[300px] duration-300 ${service.isActive ? 'hover:border-2 hover:border-[var(--primary)]' : ''}`}>
                        <CardHeader>
                            <CardTitle>{service['name']}</CardTitle>
                            <CardDescription>{service['description']}</CardDescription>
                        </CardHeader>

                        <CardFooter>
                            <div className="flex justify-between items-center w-full">
                                <p>Active? {service['isActive'] ? <span className="text-green-400 font-bold">YES</span> : <span className="text-[var(--destructive)] font-bold">NO</span>}</p>
                            </div>
                            {service['isActive'] && (
                                service['subscriptions'].some(subscription =>
                                    subscription.user == BuyerAddress && getStatus(subscription) == 'Ongoing'
                                ) ? (
                                    <Badge>
                                        <Check />
                                        Subscribed
                                    </Badge>
                                ) : (
                                    service['subscriptions'].some(subscription =>
                                        subscription.user == BuyerAddress && getStatus(subscription) == 'Expired'
                                    ) ? (
                                        <>
                                            <Badge className="mr-4">
                                                <Hourglass />
                                                Expired
                                            </Badge>
                                            <PaySubscriptionModal 
                                                subscription={service['subscriptions'].find(subscription => subscription.user == BuyerAddress && getStatus(subscription) == 'Expired')} />
                                        </>
                                    )
                                        : (
                                            <BuySubscriptionModal service={service} />
                                        )
                                )
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    )
}