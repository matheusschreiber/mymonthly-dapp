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
import { useContext } from "react";
import Navbar from "@/components/navbar";
import { Loader2 } from "lucide-react";
import { ServicesContext } from "@/routes";


export default function SellerHome() {

	const navigate = useNavigate();
	
	const { services, loaded } = useContext(ServicesContext);

	return (
		<main className="lg:min-w-[50%] lg:p-0 p-16">
			<Topper />

			<Navbar />

			<div className="flex items-center lg:flex-row flex-col justify-between w-full lg:gap-0 gap-4">
				<p className="text-6xl font-semibold">Seller</p>
			</div>
			<p className="mt-3 text-md text-zinc-400 mb-16">
				Choose one of the actions as a Seller user
			</p>

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
						<div className="flex items-center gap-1">
							<p>There are currently</p>
							{!loaded ? <Loader2 className="animate-spin"/> : <span className="font-mono font-bold text-green-400"> {services.length} </span> }
							<p>registered services.</p>
						</div>
					</CardFooter>
				</Card>
			</div>
			<Toaster />
		</main>
	)
}