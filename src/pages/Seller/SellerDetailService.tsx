import { columns } from "@/components/datatable/columns";
import { DataTable } from "@/components/datatable/datatable";
import DeactivateService from "@/components/deactivate-service";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Topper } from "@/components/topper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { UpdateService } from "@/components/update-service";
import { ServicesContext } from "@/routes";
import { ServiceType } from "@/types";
import { Loader2, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";


export default function SellerDetailService() {

    const navigate = useNavigate();

    const [service, setService] = useState<ServiceType>()
    const [error, setError] = useState<boolean>(false)

    const { services, loaded } = useContext(ServicesContext);

    async function fetchData() {
        const params = new URLSearchParams(window.location.search)
        let serviceName = params.get('name')
        let serviceFound = services.filter(service => service['name'] == serviceName)[0]
        if (!serviceFound && loaded) {
            setError(true)
        } else {
            setService(serviceFound)
            setError(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [loaded])

    return (
        <main className="flex flex-col lg:py-8 lg:px-0 p-16 mx-auto lg:max-w-[50%]">
            <Topper />

            {service && (
                <>
                    <Navbar />
                    <div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                        <div className="flex items-center gap-4">
                            <p className="text-6xl font-bold">{service['name']}</p>
                            {service['isActive'] ? <Badge>Active</Badge> : <Badge>Inactive</Badge>}
                        </div>
                        {service['isActive'] && (
                            <div className="flex lg:flex-row flex-col gap-4">
                                <Button variant="outline" onClick={() => navigate(`/seller/subscription/new/?name=${service['name']}`)} className="cursor-pointer">Add subscription</Button>
                                <UpdateService service={service} />
                                <DeactivateService />
                            </div>
                        )}
                    </div>
                    <p className="mt-3 text-md text-zinc-400 mb-8">
                        {service['description']}
                    </p>

                    <DataTable columns={columns} data={service['subscriptions']} />
                </>
            )}

            {!service && !error && (
                <div className="flex items-center justify-center gap-4">
                    <Loader2 className="animate-spin" />
                    <p>Loading Service</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center justify-center gap-4 text-[var(--destructive)]">
                        <X />
                        <p>Error in service's data fetching.</p>
                    </div>

                    <Button onClick={() => navigate('/')} variant="secondary" className="cursor-pointer">Go Home</Button>
                </div>
            )}
            
            <Toaster />
            <Footer />
        </main>
    );
}