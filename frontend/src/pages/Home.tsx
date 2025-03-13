import { useNavigate } from "react-router"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

function Home() {

	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center gap-16 lg:p-0 p-16">
			<img src="/logo.png" alt="Logo" className="w-[400px]" />
			<p className="text-zinc-300 lg:w-[500px] text-center">
				Stop Wasting Time on Subscription Headaches—Take Charge with Flawless, Effortless Management. 
				<br/><br/>
				<b>Stay Organized, Stay in Control, and Never Miss a Beat!</b>
			</p>
			<div className="flex items-center lg:flex-row flex-col justify-center gap-5">
				<Card className="w-[370px] h-[230px] hover:border-2 hover:border-[var(--primary)] cursor-pointer hover:translate-y-[-5px] hover:translate-x-[-5px] duration-300"
					onClick={() => navigate('/service/new/')}>
					<CardHeader>
						<CardTitle>New service</CardTitle>
						<CardDescription>Adds a new service to the blockchain</CardDescription>
					</CardHeader>

					<CardContent className="h-[100px]">
					
					</CardContent>

					<CardFooter>
						<p>A single Manager can create as many <b>Services</b> as needed</p>
					</CardFooter>
				</Card>

				<Card className="w-[370px] h-[230px] hover:border-2 hover:border-[var(--primary)] cursor-pointer hover:translate-y-[-5px] hover:translate-x-[5px] duration-300"
					onClick={() => navigate('/services/list/')}>
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

export default Home
