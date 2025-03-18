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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { dAppContract } from "@/lib/data"
import { ServiceType } from "@/types"
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function BuySubscriptionModal({ service }: { service: ServiceType }) {

    const [price, setPrice] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    async function confirmBuySubscription(e: Event) {
        e.preventDefault();
        if (!service) return null

        if (!price || price <= 0) {
            toast("Invalid price")
            return
        }

        if (!duration || duration <= 0 || parseInt(duration.toString()) != duration) {
            toast("Invalid duration")
            return
        }

        setLoading(true)
        try {
            if (!service) throw new Error("Service not found.")
            const user = await dAppContract.getWalletAddress()
            await dAppContract._buySubscription(service.address, user, price, duration)
        } catch (error: any) {
            toast("Problem on blockchain: " + error.message)
            setLoading(false)
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

                <RadioGroup>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" onClick={()=>{setPrice(0.25); setDuration(7);}}/>
                        <Label htmlFor="option-one">Weekly plan (7 days, 0.25 ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-twp" id="option-twp" onClick={()=>{setPrice(0.5); setDuration(14);}}/>
                        <Label htmlFor="option-twp">Bi-weekly plan (14 days, 0.5 ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-three" id="option-three" onClick={()=>{setPrice(1); setDuration(30);}}/>
                        <Label htmlFor="option-three">Monthly plan (30 days, 1 ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-fourth" id="option-fourth" onClick={()=>{setPrice(6); setDuration(180);}}/>
                        <Label htmlFor="option-fourth">Semester plan (180 days, 6 ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-fifth" id="option-fifth" onClick={()=>{setPrice(12); setDuration(365);}}/>
                        <Label htmlFor="option-fifth">Annual plan (365 days, 12 ETH)</Label>
                    </div>
                </RadioGroup>

                <DialogFooter>
                    <Button type="button" onClick={(e: any) => confirmBuySubscription(e)} disabled={loading}>
                        {
                            loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <p>Loading</p>
                                </>
                            ) : (
                                <p>Confirm payment</p>
                            )
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}