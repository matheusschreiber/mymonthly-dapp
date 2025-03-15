
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

  
export default function PaySubscriptionModal({subscription}:{subscription?:SubscriptionType}) {

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
                    <AlertDialogAction>Confirm payment</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}