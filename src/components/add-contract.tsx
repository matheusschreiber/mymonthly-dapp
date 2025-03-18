import { Button } from "@/components/ui/button"
import {
    Dialog,
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
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function AddContractModal() {

    const [address, setAddress] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    async function confirmAddContract(e: Event) {
        e.preventDefault();

        if (!address) {
            toast("Invalid address")
            return
        }

        setLoading(true)
        try {
            dAppContract.addContractAddress(address)
            window.location.reload()
        } catch (error: any) {
            toast("Problem on blockchain: " + error.message)
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" title="Address contract" className="mt-4">
                    <Plus />
                    Add contract
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add contract</DialogTitle>
                    <DialogDescription>
                        This is the factory contract address already deployed on 
                        any given network.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            Address
                        </Label>
                        <Input id="address" placeholder="eg.: 0x123abcdef..." className="col-span-2" onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={(e: any) => confirmAddContract(e)} disabled={loading}>
                        {
                            loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <p>Loading</p>
                                </>
                            ) : (
                                <p>Save</p>
                            )
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}