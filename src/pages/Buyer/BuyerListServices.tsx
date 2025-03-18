import BuySubscriptionModal from "@/components/buy-subscription";
import Navbar from "@/components/navbar";
import PaySubscriptionModal from "@/components/pay-subscription";
import { Topper } from "@/components/topper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner";
import { dAppContract, getStatus, getUserAddress } from "@/lib/data";
import { ServiceType } from "@/types";
import { Check, Hourglass } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function BuyerListServices() {

    const navigate = useNavigate()
    const [services, setServices] = useState<ServiceType[]>([])
    const [buyerAddress, setBuyerAddress] = useState<string>('')
    
    async function fetchData() {
        try {
            const _services = await dAppContract._getServices()
            setServices(_services)

            const _buyerAddress = await getUserAddress()
            setBuyerAddress(_buyerAddress)
        } catch(error:any) {
            toast("Problem on blockchain: " + error.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <main className="lg:min-w-[50%] lg:p-0 p-16">
            <Topper />

            <Navbar />

            <div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                <p className="text-6xl font-semibold">Services</p>
                <Button variant="outline" onClick={()=>navigate(`/buyer/subscriptions/list/`)}>My subscriptions</Button>
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
                                    subscription.user == buyerAddress && getStatus(subscription) == 'Ongoing'
                                ) ? (
                                    <Badge>
                                        <Check />
                                        Subscribed
                                    </Badge>
                                ) : (
                                    service['subscriptions'].some(subscription =>
                                        subscription.user == buyerAddress && getStatus(subscription) == 'Expired'
                                    ) ? (
                                        <>
                                            <Badge className="mr-4">
                                                <Hourglass />
                                                Expired
                                            </Badge>
                                            <PaySubscriptionModal 
                                                subscription={service['subscriptions'].find(subscription => subscription.user == buyerAddress && getStatus(subscription) == 'Expired')} />
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
            <Toaster />
        </main>
    )
}