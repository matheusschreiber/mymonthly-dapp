
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
import { Button } from "./ui/button";
import { useContext, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ServicesContext } from "@/routes";
import { deactivateService } from "@/lib/utils";

export default function DeactivateService() {

    const [loading, setLoading] = useState<boolean>(false)
    const { services } = useContext(ServicesContext)

    async function confirmDeactivation(e:Event) {
        e.preventDefault();
        
        const params = new URLSearchParams(window.location.search)
        let serviceName = params.get('name')
        let serviceFound = services.filter(service => service['name'] === serviceName)[0]
        if (!serviceFound) {
            return
        }

        setLoading(true)
        try {
            await deactivateService(serviceFound.address)
        } catch (error: any) {
            toast("Problem on blockchain: " + error.message)
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-[var(--destructive)] text-white hover:text-white hover:bg-red-600">
                    Deactivate service
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently deactivate the service,
                        preventing it from receving/paying/cancel any subscription.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Nevermind</AlertDialogCancel>
                    <AlertDialogAction className="bg-[var(--destructive)] text-white hover:text-white hover:bg-red-600"
                        onClick={(e:any) => confirmDeactivation(e)} disabled={loading}>
                        {
                            loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <p>Loading</p>
                                </>
                            ) : (
                                <p>Deactivate service</p>
                            )
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}