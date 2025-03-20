import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button";
import { Topper } from "@/components/topper";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { dAppContract } from "@/lib/data";

export default function Hero() {

	const navigate = useNavigate();
	const[enabled, setEnabled] = useState(false);

	async function checkContractEnabled(){
		const contractaddress = await dAppContract.getContractAddress()
		if (!contractaddress){
			setEnabled(false)
		} else {
			setEnabled(true)
		}
	}

	useEffect(()=>{
		checkContractEnabled();
	}, [])

	return (
		<main className="flex flex-col items-center justify-center lg:py-8 lg:px-0 p-16">
			<Topper />

            <img src="/hero.png" alt="Logo" className="w-[100vw] cursor-pointer mb-16" />

			<div className="w-full px-[10%] my-32 flex justify-between -mt-[600px]">
				<div>
					<h1 className="text-6xl font-bold text-left">
						Simplify Subscriptions.<br/>Reduce Trouble.<br/>Grow Smarter.
					</h1>
					<p className="text-zinc-300 lg:w-[700px] mt-8 text-2xl">
						Stop wasting time on subscriptions headaches! Take charge with flawless, efficient and effortless Management.
					</p>
				</div>

				<div>
					<img src="/logo.png" alt="Logo" className="w-[600px]"/>
				</div>
			</div>

            <Button onClick={()=>navigate("/home/")} className="cursor-pointer mt-[200px] mb-4" disabled={!enabled}>
                Get Started
            </Button>
            <p className="text-zinc-300 text-center w-80">
                Start your journey to a smarter subscription management today!
            </p>
			
			<Toaster />
		</main>
	)
}