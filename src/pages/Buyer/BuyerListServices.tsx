import BuySubscriptionModal from "@/components/buy-subscription";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import PaySubscriptionModal from "@/components/pay-subscription";
import { Topper } from "@/components/topper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner";
import { ServicesContext } from "@/routes";
import { Check, Hourglass, Loader2, Sparkle } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";

export default function BuyerListServices() {

    const navigate = useNavigate()
    const account = useAccount()
    
    const { services, loaded } = useContext(ServicesContext);

    return (
        <main className="flex flex-col lg:py-8 lg:px-0 p-16 mx-auto lg:max-w-[70%]">
            <Topper />

            <Navbar />

            <div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                <p className="text-6xl font-semibold">Services</p>
                <Button variant="outline" onClick={() => navigate(`/buyer/subscriptions/list/`)}>My subscriptions</Button>
            </div>
            <p className="mt-3 text-md text-zinc-400 mb-16">
                Complete list of services currently registered on the blockchain. <br />You can interact with each service individually.
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
                {
                    !loaded ? (
                        <div className="flex items-center justify-center gap-4">
                            <Loader2 className="animate-spin" />
                            <p>Loading Services</p>
                        </div>
                    )
                    
                    :
                    
                    services.map((service, index) => (
                        <Card key={index} className={`w-[500px] duration-300 ${service.isActive ? 'hover:border-2 hover:border-[var(--primary)]' : ''}`}>
                            <CardHeader>
                                <CardTitle>{service['name']}</CardTitle>
                                <CardDescription>{service['description']}</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <p className="text-zinc-700 -mt-6 mb-6">{service.address}</p>
                            </CardContent>

                            <CardFooter>
                                <div className="flex justify-between items-center w-full">
                                    <p>Active? {service['isActive'] ? <span className="text-green-400 font-bold">YES</span> : <span className="text-[var(--destructive)] font-bold">NO</span>}</p>
                                </div>
                                {service['isActive'] && (

                                    service['subscriptions'].some(subscription =>
                                        subscription.user == account.address && subscription.status == 'Ongoing'
                                    ) ? (
                                        <Badge>
                                            <Check />
                                            Subscribed
                                        </Badge>
                                    ) : (

                                        service['subscriptions'].some(subscription =>
                                            subscription.user == account.address && (subscription.status == 'Expired' || subscription.status == 'New')
                                        ) ? (
                                            <>
                                                <Badge className="mr-4">
                                                    {service['subscriptions'].find(subscription => subscription.user == account.address && subscription.status == 'Expired') ? <><Hourglass />Expired</> : <><Sparkle />New</>}
                                                </Badge>
                                                <PaySubscriptionModal
                                                    subscription={service['subscriptions'].find(subscription => subscription.user == account.address && (subscription.status == 'Expired' || subscription.status == 'New'))} />
                                            </>
                                        )
                                            : (
                                                <BuySubscriptionModal service={service} />
                                            )
                                    )
                                )}
                            </CardFooter>
                        </Card>
                    ))
                }
            </div>

            <Toaster />
            <Footer />
        </main>
    )
}