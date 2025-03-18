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
import { dAppContract } from "@/lib/data"
import { ServiceType } from "@/types"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function UpdateService({ service }: { service: ServiceType }) {

    const [loading, setLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>(service.name)
    const [description, setDescription] = useState<string>(service.description)

    async function updateService() {
        setLoading(true)
        const _services = await dAppContract._getServices()

        const params = new URLSearchParams(window.location.search)
        let serviceName = params.get('name')
        let serviceFound = _services.filter(service => service['name'] === serviceName)[0]
        if (!serviceFound) {
            return
        }

        try {
            await dAppContract._updateService(serviceFound.address, name, description)
        } catch (error: any) {
            toast("Problem on blockchain: " + error.message)
            setLoading(false)
        }
    }

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
                            onChange={(e) => setName(e.target.value)}
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
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>

                    <Button type="button" size="sm" className="px-3" onClick={() => updateService()} disabled={loading}>
                        {
                            loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <p>Loading</p>
                                </>
                            ) : (
                                <p>Update</p>
                            )
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
