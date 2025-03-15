import { useNavigate } from "react-router"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Topper } from "@/components/topper";

export default function SellerHome() {

	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center lg:p-0 p-16">
			<Topper />

            <div className="w-full mb-16 mt-8">
                <Button variant="link" onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
                    <ChevronLeft />
                    <span>Back</span>
                </Button>
            </div>
			
			<div className="flex items-center lg:flex-row flex-col justify-center gap-5">
				<Card className="w-[370px] h-[230px] hover:border-2 hover:border-[var(--primary)] cursor-pointer hover:translate-y-[-5px] hover:translate-x-[-5px] duration-300"
					onClick={() => navigate('/seller/service/new/')}>
					<CardHeader>
						<CardTitle>New service</CardTitle>
						<CardDescription>Adds a new service to the blockchain</CardDescription>
					</CardHeader>

					<CardContent className="h-[100px]">
					
					</CardContent>

					<CardFooter>
						<p>A single Seller can create as many <b>Services</b> as needed</p>
					</CardFooter>
				</Card>

				<Card className="w-[370px] h-[230px] hover:border-2 hover:border-[var(--primary)] cursor-pointer hover:translate-y-[-5px] hover:translate-x-[5px] duration-300"
					onClick={() => navigate('/seller/services/list/')}>
					<CardHeader>
						<CardTitle>List services</CardTitle>
						<CardDescription>Check the list of currently registered services</CardDescription>
					</CardHeader>

					<CardContent className="h-[100px]">

					</CardContent>

					<CardFooter>
						<p>There are currently <span className="font-mono font-bold">02</span> registered services.</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}