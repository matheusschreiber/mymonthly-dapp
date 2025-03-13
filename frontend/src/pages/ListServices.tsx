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
import { useNavigate } from "react-router";

function ListServices() {

    const navigate = useNavigate();

    const services = [
        { "name": "Service 1", "description": "Description 1", "subscribers": {"paid": 10, "expired": 2, "canceled": 1}, "isActive": true},
        { "name": "Service 2", "description": "Description 2", "subscribers": {"paid": 4, "expired": 25, "canceled": 11}, "isActive": false},
    ]

    return (
        <main className="min-w-[400px]">
            
            <Navbar />

            <div className="flex items-center justify-between w-full mb-16">
                <p className="text-6xl font-semibold">Services</p>
                <Button variant="secondary" onClick={()=>navigate("/service/new/")} className="cursor-pointer">Add service</Button>
            </div>

            <div className="flex flex-wrap gap-8">
                {services.map((service, index) => (
                    <Card key={index} className="w-[300px]">
                        <CardHeader>
                            <CardTitle>{service['name']}</CardTitle>
                            <CardDescription>{service['description']}</CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                            <p className="mb-3">Subscriptions</p>
                            <ul>
                                <li><span className="font-mono text-lg font-bold">{service['subscribers']['paid'].toString().padStart(2, '0')}</span> paid subscriptions</li>
                                <li><span className="font-mono text-lg font-bold">{service['subscribers']['expired'].toString().padStart(2, '0')}</span> expired subscriptions</li>
                                <li><span className="font-mono text-lg font-bold">{service['subscribers']['canceled'].toString().padStart(2, '0')}</span> canceled subscriptions</li>
                            </ul>
                        </CardContent>

                        <CardFooter>
                            <div className="flex justify-between items-center w-full">
                                <p>Active? {service['isActive'] ? <span className="text-green-400 font-bold">YES</span> : <span className="text-[var(--destructive)] font-bold">NO</span>}</p>
                                <Button variant="link" onClick={()=>navigate('/service/details/')} className="cursor-pointer">
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

export default ListServices
