
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SubscriptionType } from "@/types";
import { Button } from "./ui/button";
import { DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { paySubscription } from "@/lib/utils";


export default function PaySubscriptionModal({ subscription }: { subscription?: SubscriptionType }) {

    const [loading, setLoading] = useState<boolean>(false)

    async function confirmPayment(e: Event) {
        e.preventDefault()
        if (!subscription || !subscription.serviceAddress) return null

        setLoading(true)
        try {
            await paySubscription(subscription.serviceAddress, subscription.tokenId, subscription.price)
        } catch (error: any) {
            toast("Problem on blockchain: " + error.message)
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" title="Pay Subscription">
                    <DollarSign />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Pay subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will add a payment to the subscription and the user
                        will be able to use the service.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Nevermind</AlertDialogCancel>
                    <AlertDialogAction onClick={(e: any) => confirmPayment(e)} disabled={loading}>
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
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}