import { Check, Loader2, Plus, Sparkle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useEffect, useState } from "react";
import { dAppContract } from "@/lib/data";
import { Button } from "./ui/button";
import { toast } from "sonner";
import AddContractModal from "./add-contract";
import { useNavigate } from "react-router";

export function Topper() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [walletConnected, setWalletConnected] = useState<boolean>(false)
    const [walletAddress, setWalletAddress] = useState<string>()

    const [contractConnected, setContractConnected] = useState<boolean>(false)
    const [contractAddress, setContractAddress] = useState<string>()

    const [autoUpdate, setAutoUpdate] = useState<boolean>(false)

    async function connectWallet() {
        setLoading(true)
        try {
            await dAppContract.connectWallet()
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
            if (!contractaddress) {
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

    async function _temporaryCheckExp() {
        await dAppContract._checkSubscriptionsExpiration()
        window.location.reload()
    }

    async function _temporaryAddExp() {
        let _services = await dAppContract._getServices()
        await dAppContract._addExpiredSubscription(_services[0].address)
        window.location.reload()
    }

    async function _temporaryCheckAutoUpdate() {
        const enabled = dAppContract.getAutoUpdate()
        setAutoUpdate(enabled)
    }

    async function _temporaryChangeAutoUpdate() {
        console.log(!autoUpdate)
        dAppContract.setAutoUpdate(!autoUpdate)
        window.location.reload()
    }

    useEffect(() => {
        checkWalletConnected()
        connectContract()
        _temporaryCheckAutoUpdate()
    }, [])

    return (
        <header className="flex flex-col items-center justify-center mb-16">

            {window.location.pathname != '/' && (
                <img src="/logo.png" alt="Logo" className="w-[400px] cursor-pointer mb-16" onClick={() => navigate("/")} />
            )}

            <div className="flex lg:flex-row flex-col items-center gap-5">
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
                                    {loading ? <><Loader2 className="animate-spin" />Connecting...</> : <><Plus /> Connect Wallet</>}
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
                                <div className="flex items-center gap-2 justify-between">
                                    {
                                        loading ? 
                                        "Loading..."
                                        :
                                        <>
                                            Contract connected
                                            <X onClick={() => { localStorage.clear(); window.location.reload() }} className="cursor-pointer text-red-400" size={18} />
                                        </>
                                    }

                                </div>
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

                <Alert className={import.meta.env.VITE_TEST_BUTTONS == 'true' ? "" : "hidden"}>
                    <AlertTitle>
                        Testing actions (temporary)
                    </AlertTitle>
                    <AlertDescription>
                        These buttons are for testing purposes only.
                        <div className="flex gap-2 mt-2">
                            <Button variant="outline" onClick={() => _temporaryAddExp()}>Add expired service</Button>
                            <Button variant="outline" onClick={() => _temporaryCheckExp()}>Update expirations</Button>
                        </div>
                        <Button variant="outline" onClick={() => _temporaryChangeAutoUpdate()}>
                            Auto update
                            {
                                autoUpdate ? <p className="text-green-400">ENABLED</p> : <p className="text-red-400">DISABLED</p>
                            }
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        </header >
    )
}