import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Topper } from "@/components/topper";
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
import { Loader2 } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";

export default function SellerListServices() {

    const navigate = useNavigate();
    const account = useAccount()

    const { services, loaded } = useContext(ServicesContext);

    return (
        <main className="flex flex-col lg:py-8 lg:px-0 p-16 mx-auto lg:max-w-[70%]">
            <Topper />

            <Navbar />

            <div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                <p className="text-6xl font-semibold">Services</p>
                <Button variant="secondary" onClick={() => navigate("/seller/service/new/")} className="cursor-pointer">Add service</Button>
            </div>
            <p className="mt-3 text-md text-zinc-400 mb-16">
                Complete list of services registered on the Blockchain. <br />You can interact with each service individually.
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
                {!loaded ? (
                    <div className="flex items-center justify-center gap-4">
                        <Loader2 className="animate-spin" />
                        <p>Loading Services</p>
                    </div>
                )
                :
                services.map((service, index) => (
                    <Card key={index} className="w-[500px] hover:border-2 hover:border-[var(--primary)] duration-300">
                        <CardHeader>
                            <CardTitle>{service['name']}</CardTitle>
                            <CardDescription>{service['description']}</CardDescription>
                        </CardHeader>

                        {service.metadata?.owner == account.address && (
                            <CardContent>
                                <p className="text-zinc-700 -mt-6 mb-6">{service.address}</p>

                                {service['metadata'] && typeof(service['metadata']['subscribers']) != 'undefined' && (
                                    <>
                                        <p className="mb-3">Subscriptions</p>
                                        <ul>
                                            <li><span className="font-mono text-lg font-bold">{service['metadata']['subscribers']['ongoing']}</span> ongoing subscriptions</li>
                                            <li><span className="font-mono text-lg font-bold">{service['metadata']['subscribers']['expired']}</span> expired subscriptions</li>
                                            <li><span className="font-mono text-lg font-bold">{service['metadata']['subscribers']['cancelled']}</span> cancelled subscriptions</li>
                                        </ul>
                                    </>
                                )}
                            </CardContent>
                        )}

                        <CardFooter>
                            <div className="flex justify-between items-center w-full">
                                <p>Active? {service['isActive'] ? <span className="text-green-400 font-bold">YES</span> : <span className="text-[var(--destructive)] font-bold">NO</span>}</p>
                                <Button variant="link" onClick={() => navigate(`/seller/service/details/?name=${service['name']}`)} className="cursor-pointer">
                                    See Details
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Toaster />
            <Footer />
        </main>
    )
}