import { useNavigate } from "react-router"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useState } from "react";
import { ServiceType } from "@/types";
import { getServices } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Topper } from "@/components/topper";

export default function Home() {

	const navigate = useNavigate();

	// const [services, setServices] = useState<ServiceType[]>([])
	
	// async function fetchData() {
	// 	const _services = await getServices()
	// 	setServices(_services)
	// }

	// useEffect(() => {
	// 	fetchData()
	// }, [])

	return (
		<div className="flex flex-col items-center justify-center lg:p-0 p-16">
			<Topper />

			<div className="flex items-center lg:flex-row flex-col justify-center gap-5 mt-16">
				<Card className="cursor-pointer w-[370px] h-[230px] hover:border-2 hover:border-[var(--primary)] hover:translate-y-[-5px] hover:translate-x-[-5px] duration-300"
					onClick={() => navigate('/seller/home/')}>
					<CardHeader>
						<CardTitle>Seller</CardTitle>
						<CardDescription>Register your Service to manage users subscriptions</CardDescription>
					</CardHeader>

					<CardContent className="h-[100px]">
					
					</CardContent>

					<CardFooter>
						<Button variant="outline">
							Get Started
						</Button>
					</CardFooter>
				</Card>

				<Card className="cursor-pointer w-[370px] h-[230px] hover:border-2 hover:border-[var(--primary)] hover:translate-y-[-5px] hover:translate-x-[5px] duration-300"
					onClick={() => navigate('/buyer/home/')}>
					<CardHeader>
						<CardTitle>Buyer</CardTitle>
						<CardDescription>Subscribe to existing Services to access their content</CardDescription>
					</CardHeader>

					<CardContent className="h-[100px]">

					</CardContent>

					<CardFooter>
						<Button variant="outline">
							Get Started
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}