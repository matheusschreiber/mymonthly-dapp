import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ServiceType } from "@/types"

export function UpdateService({service}: {service: ServiceType}) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Update service</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Service data</DialogTitle>
                    <DialogDescription>
                        Insert the new values for the service data below
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col w-full *:w-full items-center space-x-2 gap-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="eg.: Netflix, Twitch, etc"
                            defaultValue={service.name}
                        />
                    </div>
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="description">
                            Description
                        </Label>
                        <Input
                            id="description"
                            placeholder="eg.: An amazing movie streaming service"
                            defaultValue={service.description}
                        />
                    </div>
                    
                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    
                    <Button type="submit" size="sm" className="px-3">
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
