import { columns } from "@/components/datatable/columns";
import { DataTable } from "@/components/datatable/datatable";
import Navbar from "@/components/navbar";
import { Topper } from "@/components/topper";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { ServicesContext } from "@/routes";
import { SubscriptionType } from "@/types";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";

export default function BuyerListSubscriptions() {

    const navigate = useNavigate()
    const account = useAccount()
    
    const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([])
    const { services, loaded } = useContext(ServicesContext)

    async function fetchData() {
        
        const _subscriptions:SubscriptionType[] = []
        services.map((service) =>{
            service.subscriptions.filter((subscription) => subscription.user == account.address).map((subscription) => {
                _subscriptions.push(subscription)
            })
        })
        setSubscriptions(_subscriptions)
    }

    useEffect(() => {
        fetchData()
    }, [loaded])

    return (
        <main className="lg:min-w-[50%] p-16">
            <Topper />

            <Navbar />

            <div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                <p className="text-6xl font-semibold">My Subscriptions</p>
                <Button variant="outline" onClick={()=>navigate(`/buyer/services/list/`)}>Available services</Button>
            </div>
            <p className="mt-3 text-md text-zinc-400 mb-16">
                Complete list of yours subscriptions. <br />You can interact with each subscription individually.
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
                {
                    subscriptions.length == 0 ? (
                        <div className="flex items-center justify-center gap-4">
                            <Loader2 className="animate-spin" />
                            <p>Loading Subscriptions</p>
                        </div>
                    )
                :
                    subscriptions && (
                        <DataTable columns={columns} data={subscriptions} />
                    )
                }
            </div>

            <Toaster />
        </main>
    )
}