
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
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { dAppContract } from "@/lib/data";

export function CancelSubscriptionModal({ subscription }: { subscription: SubscriptionType }) {

    async function confirmCancel() {
        if (!subscription || !subscription.serviceAddress) return null

        try {
            await dAppContract._cancelSubscription(subscription.serviceAddress, subscription.tokenId)
            window.location.reload()
        } catch (error: any) {
            alert("Problem on blockchain: " + error.message)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" title="Cancel Subscription">
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently cancel the subscription
                        by adding an end date as today's date.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Nevermind</AlertDialogCancel>
                    <AlertDialogAction className="bg-[var(--destructive)] text-white hover:text-white hover:bg-red-600" onClick={() => confirmCancel()}>
                        Cancel subscription
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}