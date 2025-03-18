import { Check, Loader2, Plus, Sparkle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useEffect, useState } from "react";
import { dAppContract } from "@/lib/data";
import { Button } from "./ui/button";
import { toast } from "sonner";
import AddContractModal from "./add-contract";

export function Topper() {

    const [loading, setLoading] = useState(true)
    const [walletConnected, setWalletConnected] = useState<boolean>(false)
    const [walletAddress, setWalletAddress] = useState<string>()

    const [contractConnected, setContractConnected] = useState<boolean>(false)
    const [contractAddress, setContractAddress] = useState<string>()

    async function connectWallet() {
        setLoading(true)
        try {
            await dAppContract.connectWallet()
            window.location.reload()
        } catch (error: any) {
            toast("Error connecting wallet: " + error.message)
        }
        setLoading(false)
    }

    async function checkWalletConnected() {
        const isConnected = await dAppContract.checkWalletConnected()
        setWalletConnected(isConnected)

        if (isConnected) {
            const address = await dAppContract.getWalletAddress()
            setWalletAddress(address)
        }

        setLoading(false)
    }

    async function connectContract() {
        setLoading(true)
        try {
            const contractaddress = await dAppContract.getContractAddress()
            if (!contractaddress){
                setContractConnected(false)
            } else {
                setContractAddress(contractaddress)
                setContractConnected(true)
            }
        } catch (error: any) {
            toast("Error connecting contract: " + error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        checkWalletConnected()
        connectContract()
    }, [])

    return (
        <header className="flex flex-col items-center justify-center mb-16">
            
            <img src="/logo.png" alt="Logo" className="w-[400px]" />

            <div className="flex items-center gap-5 mt-16">
                {
                    walletConnected ? (
                        <Alert className={loading ? "text-zinc-400" : "text-green-400"}>
                            {loading ? <Loader2 className="animate-spin" /> : <Check className="h-4 w-4" />}
                            <AlertTitle>
                                {loading ? "Loading..." : "Wallet connected"}
                            </AlertTitle>
                            <AlertDescription>
                                Wallet successfully connected. <br /> <p className="text-zinc-700">{walletAddress}</p>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className={loading ? "text-zinc-400" : "text-red-400"}>
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkle className="h-4 w-4" />}
                            <AlertTitle>
                                {loading ? "Loading..." : "Wallet not connected"}
                            </AlertTitle>
                            <AlertDescription>
                                To use the dApp, connect to you Metamask wallet.
                                <Button variant="secondary" onClick={() => connectWallet()} disabled={loading} className="mt-4 cursor-pointer">
                                    {loading ? <><Loader2 className="animate-spin" />Connecting...</> : <><Plus/> Connect Wallet</>}
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )
                }

                {
                    contractConnected ? (
                        <Alert className={loading ? "text-zinc-400" : "text-green-400"}>
                            {loading ? <Loader2 className="animate-spin" /> : <Check className="h-4 w-4" />}
                            <AlertTitle>
                                {loading ? "Loading..." : "Contract connected"}
                            </AlertTitle>
                            <AlertDescription>
                                Contract successfully connected. <br /> <p className="text-zinc-700">{contractAddress}</p>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className={loading ? "text-zinc-400" : "text-red-400"}>
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkle className="h-4 w-4" />}
                            <AlertTitle>
                                {loading ? "Loading..." : "Contract not connected"}
                            </AlertTitle>
                            <AlertDescription>
                                To use the dApp, connect the deployed contract.
                                <AddContractModal />
                            </AlertDescription>
                        </Alert>
                    )
                }
            </div>

            {
                window.location.pathname == "/" && (
                    <p className="text-zinc-300 lg:w-[500px] text-center mt-16">
                        Stop Wasting Time on Subscriptions Headaches! Take Charge with Flawless, Effortless Management.
                        <br /><br />
                        <b>Stay Organized. Stay in Control.</b>
                    </p>
                )
            }
        </header >
    )
}