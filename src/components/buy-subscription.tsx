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
import { ServiceType } from "@/types"
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import { buySubscription } from "@/lib/utils"


export default function BuySubscriptionModal({ service }: { service: ServiceType }) {

    const account = useAccount()
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
            if (!account.address) throw new Error("Account not found.")
            await buySubscription(service.address, account.address, price, duration)
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
                        <RadioGroupItem value="option-one" id="option-one" onClick={()=>{setPrice(0.00125); setDuration(7);}}/>
                        <Label htmlFor="option-one">Weekly plan (7 days, 0.00125 ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" onClick={()=>{setPrice(0.0025); setDuration(14);}}/>
                        <Label htmlFor="option-two">Bi-weekly plan (14 days, 0.0025 ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-three" id="option-three" onClick={()=>{setPrice(0.005); setDuration(30);}}/>
                        <Label htmlFor="option-three">Monthly plan (30 days, 0.005 ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-fourth" id="option-fourth" onClick={()=>{setPrice(0.03); setDuration(180);}}/>
                        <Label htmlFor="option-fourth">Semester plan (180 days, 0.03 ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-fifth" id="option-fifth" onClick={()=>{setPrice(0.06); setDuration(365);}}/>
                        <Label htmlFor="option-fifth">Annual plan (365 days, 0.06 ETH)</Label>
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