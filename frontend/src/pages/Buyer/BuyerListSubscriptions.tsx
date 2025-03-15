import { columns } from "@/components/datatable/columns";
import { DataTable } from "@/components/datatable/datatable";
import Navbar from "@/components/navbar";
import { getServices } from "@/lib/data";
import { SubscriptionType } from "@/types";
import { useEffect, useState } from "react";

export default function BuyerListSubscriptions() {

    const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([])

    async function fetchData() {
        const BuyerAddress = '12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv'
        let _services = await getServices()
        let _subscriptions:SubscriptionType[] = []
        _services.map(service =>  {
            let userSubscriptions = service['subscriptions'].filter(subscription => subscription['user'] === BuyerAddress)
            _subscriptions = _subscriptions.concat(userSubscriptions);
        })
        setSubscriptions(_subscriptions)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <main className="lg:min-w-[400px] lg:p-0 p-16">

            <Navbar />

            <div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                <p className="text-6xl font-semibold">Subscriptions</p>
            </div>
            <p className="mt-3 text-md text-zinc-400 mb-16">
                Complete list of yours subscriptions. <br />You can interact with each subscription individually.
            </p>

            <div className="flex flex-wrap gap-8 justify-center">
                {subscriptions && (
                    <DataTable columns={columns} data={subscriptions} />
                )}
            </div>
        </main>
    )
}