import { columns } from "@/components/datatable/columns";
import { DataTable } from "@/components/datatable/datatable";
import DeactivateService from "@/components/deactivate-service";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";


function DetailsService() {

    const service = { "name": "Service 1", "description": "Description 1", "subscribers": { "paid": 10, "expired": 2, "canceled": 1 }, "isActive": true }
    const subscriptions = [
        { "user": "12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "Token ID 1", "price": 10, "duration": 30, "startDate": 1633084800, "endDate": 1633084800 },
        { "user": "12bauieojgahi1bi12ugb3hu13yg12uig2j21vb12gcv", "tokenId": "Token ID 2", "price": 20, "duration": 30, "startDate": 1633084800, "endDate": 0 },
    ]

    const navigate = useNavigate();

    return (
        <div>
            <Navbar />

            <div className="flex items-center justify-between w-full">
                <p className="text-6xl font-bold">{service['name']}</p>
                <div className="flex gap-4">
                    <Button variant="secondary" onClick={()=>navigate("/subscription/new/")} className="cursor-pointer">Add subscription</Button>
                    <DeactivateService />
                </div>
            </div>
            
            <p className="text-lg mt-3 mb-8">{service['description']}</p>

            <DataTable columns={columns} data={subscriptions} />
        </div>
    );
}

export default DetailsService;