
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
import { DollarSign } from "lucide-react";
import { dAppContract } from "@/lib/data";

  
export default function PaySubscriptionModal({subscription}:{subscription?:SubscriptionType}) {

    async function confirmPayment(){
        if (!subscription || !subscription.serviceAddress) return null

        try {
            await dAppContract._paySubscription(subscription.serviceAddress, subscription.tokenId, subscription.price)
        } catch(error:any){
            alert("Problem on blockchain: " + error.message)
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
                    <AlertDialogAction onClick={()=>confirmPayment()}>Confirm payment</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}