import { useNavigate } from "react-router"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Topper } from "@/components/topper";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { ServiceType } from "@/types";
import { dAppContract } from "@/lib/data";
import { toast } from "sonner";
import Navbar from "@/components/navbar";

export default function BuyerHome() {

	const navigate = useNavigate();
	const [services, setServices] = useState<ServiceType[]>([]);

	useEffect(() => {
		async function fetchServices() {
			try {
				const _services = await dAppContract._getServices()
				setServices(_services)
			} catch (error:any) {
				toast("Problem on blockchain: " + error.message)
			}
		}
		setTimeout(()=>fetchServices(), 500)
	}, [])

	return (
		<main className="lg:min-w-[50%] lg:p-0 p-16">
			<Topper />

            <Navbar />

			<div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
                <p className="text-6xl font-semibold">Buyer</p>
            </div>
			<p className="mt-3 text-md text-zinc-400 mb-16">
                Choose one of the actions as a Buyer user
            </p>

			<div className="flex items-center lg:flex-row flex-col justify-center gap-5">
				<Card className="w-[370px] h-[230px] hover:border-2 hover:border-[var(--primary)] cursor-pointer hover:translate-y-[-5px] hover:translate-x-[-5px] duration-300"
					onClick={() => navigate('/buyer/subscriptions/list/')}>
					<CardHeader>
						<CardTitle>My subscriptions</CardTitle>
						<CardDescription>Check for yours subscriptions on services</CardDescription>
					</CardHeader>

					<CardContent className="h-[100px]">
					
					</CardContent>

					<CardFooter>
						<p>Each <b>Service</b> holds only one valid <b>Subscription</b> for each buyer</p>
					</CardFooter>
				</Card>

				<Card className="w-[370px] h-[230px] hover:border-2 hover:border-[var(--primary)] cursor-pointer hover:translate-y-[-5px] hover:translate-x-[5px] duration-300"
					onClick={() => navigate('/buyer/services/list/')}>
					<CardHeader>
						<CardTitle>Available services</CardTitle>
						<CardDescription>Check the list of currently registered services</CardDescription>
					</CardHeader>

					<CardContent className="h-[100px]">

					</CardContent>

					<CardFooter>
						<p>There are currently <span className="font-mono font-bold">{services.length}</span> registered services.</p>
					</CardFooter>
				</Card>
			</div>
			<Toaster />
		</main>
	)
}
