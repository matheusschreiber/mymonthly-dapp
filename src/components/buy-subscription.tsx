import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { dAppContract, getUserAddress } from "@/lib/data"
import { ServiceType } from "@/types"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function BuySubscriptionModal({ service }: { service: ServiceType }) {

    const [price, setPrice] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)

    async function confirmBuySubscription() {
        try {
            if (!service) throw new Error("Service not found.")
            const user = await getUserAddress()
            await dAppContract._buySubscription(service.address, user, price, duration)
            window.location.reload()
        } catch (error: any) {
            alert("Problem on blockchain: " + error.message)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" title="Buy subscription">
                    <Plus />
                    Subscribe
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buy subscription</DialogTitle>
                    <DialogDescription>
                    This will add a payment to the subscription and the user
                    will be able to use the service.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price (ETH)
                        </Label>
                        <Input id="price" placeholder="eg.: 0.1, 0.15, 0.3, etc" className="col-span-2" type="number" onChange={(e)=> setPrice(parseFloat(e.target.value))}/>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                            Duration (days)
                        </Label>
                        <Input id="duration" placeholder="eg.: 30, 90, 365, etc" className="col-span-2" type="number" onChange={(e)=> setDuration(parseInt(e.target.value))}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={()=>confirmBuySubscription()}>Confirm payment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}