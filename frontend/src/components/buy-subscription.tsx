
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
import { ServiceType } from "@/types";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

  
export default function BuySubscriptionModal({service}:{service:ServiceType}) {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" title="Buy subscription">
                    <Plus />
                    Subscribe
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Buy subscription</AlertDialogTitle>
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