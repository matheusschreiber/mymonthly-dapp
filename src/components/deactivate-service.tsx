
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
import { dAppContract } from "@/lib/data";

export default function DeactivateService() {

    async function confirmDeactivation() {
        const _services = await dAppContract._getServices()

        const params = new URLSearchParams(window.location.search)
        let serviceName = params.get('name')
        let serviceFound = _services.filter(service => service['name'] === serviceName)[0]
        if (!serviceFound) {
            return
        }

        try {
            await dAppContract._deactivateService(serviceFound.address)
        } catch (error: any) {
            alert("Problem on blockchain: " + error.message)
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
                    <AlertDialogAction className="bg-[var(--destructive)] text-white hover:text-white hover:bg-red-600" onClick={() => confirmDeactivation()}>
                        Deactivate service
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}