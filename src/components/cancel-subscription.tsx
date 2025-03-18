
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
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { dAppContract } from "@/lib/data";
import { useState } from "react";
import { toast } from "sonner";

export function CancelSubscriptionModal({ subscription }: { subscription: SubscriptionType }) {

    const [loading, setLoading] = useState<boolean>(false)

    async function confirmCancel(e: Event) {
        e.preventDefault();
        if (!subscription || !subscription.serviceAddress) return null

        setLoading(true)
        try {
            await dAppContract._cancelSubscription(subscription.serviceAddress, subscription.tokenId)
        } catch (error: any) {
            toast("Problem on blockchain: " + error.message)
            setLoading(false)
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
                    <AlertDialogAction className="bg-[var(--destructive)] text-white hover:text-white hover:bg-red-600"
                        onClick={(e: any) => confirmCancel(e)} disabled={loading}>
                        {
                            loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <p>Loading</p>
                                </>
                            ) : (
                                <p>Cancel subscription</p>
                            )
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}