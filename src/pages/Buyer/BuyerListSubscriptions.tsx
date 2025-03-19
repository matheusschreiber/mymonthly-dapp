import { columns } from "@/components/datatable/columns";
import { DataTable } from "@/components/datatable/datatable";
import Navbar from "@/components/navbar";
import { Topper } from "@/components/topper";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { dAppContract } from "@/lib/data";
import { SubscriptionType } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function BuyerListSubscriptions() {

    const navigate = useNavigate()
    const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([])

    async function fetchData() {
        const BuyerAddress = await dAppContract.getWalletAddress()
        let _services = await dAppContract._getServices()
        let _subscriptions:SubscriptionType[] = []
        _services.map(service =>  {
            let userSubscriptions = service['subscriptions'].filter(subscription => subscription['user'] === BuyerAddress)
            _subscriptions = _subscriptions.concat(userSubscriptions);
        })
        setSubscriptions(_subscriptions)
    }

    useEffect(() => {
        setTimeout(()=>fetchData(), 500)
    }, [])

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