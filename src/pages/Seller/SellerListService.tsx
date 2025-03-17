import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { dAppContract } from "@/lib/data";
import { ServiceType } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function SellerListServices() {

    const navigate = useNavigate();

    const [services, setServices] = useState<ServiceType[]>([])

    async function fetchData() {
        try {
            const _services = await dAppContract._getServices()
            setServices(_services)
        } catch(error:any) {
            alert("Problem on blockchain: " + error.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <main className="lg:min-w-[400px] lg:p-0 p-16">

            <Navbar />

            <div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                <p className="text-6xl font-semibold">Services</p>
                <Button variant="secondary" onClick={() => navigate("/seller/service/new/")} className="cursor-pointer">Add service</Button>
            </div>
            <p className="mt-3 text-md text-zinc-400 mb-16">
                Complete list of services registered on the Blockchain. <br />You can interact with each service individually.
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
                {services.map((service, index) => (
                    <Card key={index} className="w-[300px] hover:border-2 hover:border-[var(--primary)] duration-300">
                        <CardHeader>
                            <CardTitle>{service['name']}</CardTitle>
                            <CardDescription>{service['description']}</CardDescription>
                        </CardHeader>

                        <CardContent>
                            {service['metadata'] && service['metadata']['subscribers'] && (
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
        </main>
    )
}