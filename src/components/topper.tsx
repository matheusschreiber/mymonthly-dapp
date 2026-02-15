import { Check, CheckCircle2Icon, Loader2, Plus, Sparkle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import ContractEvents from "./events";

export function Topper() {

    const account = useAccount()
    const { connectors, connect, status } = useConnect()
    const { disconnect } = useDisconnect()

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [walletAddress, setWalletAddress] = useState<string>()

    async function connectWallet() {
        setLoading(true)
        try {
            connect({"connector": connectors.filter(connector => connector.name == 'MetaMask')[0]})
        } catch (error: any) {
            toast("Error connecting wallet: " + error.message)
        }
        setLoading(false)
    }

    function disconnectWallet(){
        setLoading(true)
        try {
            disconnect()
        } catch (error: any) {
            toast("Error disconnecting wallet: " + error.message)
        }
        setLoading(false)
    }

    async function checkWalletConnected() {
        if (account.isConnected) {
            setWalletAddress(account['address'])
        } else {
            navigate("/")
        }
        setLoading(false)
    }

    useEffect(() => {
        checkWalletConnected()
    }, [])

    useEffect(() => {
        toast(status)
    }, [status])

    return (
        <div className="flex justify-center w-full">
            <div className="absolute z-10 w-full">
                <Alert className="w-128 ml-4">
                    <CheckCircle2Icon />
                    <AlertTitle>Attention</AlertTitle>
                    <AlertDescription className="leading-none">
                        <p>
                            This project uses <b>Sepolia ETH</b>, which is for testing 
                            purposes only. <b className="text-red-400">DO NOT USE REAL ETH</b> or 
                            any valuable assets on this network, 
                            as they may be lost.
                        </p>
                    </AlertDescription>
                </Alert>
            </div>
            <header className="flex flex-col items-center justify-center mb-16">

                {window.location.pathname != '/' && (
                    <img src="/logo.png" alt="Logo" className="w-[200px] cursor-pointer mb-16" onClick={() => navigate("/")} />
                )}

                <div className="flex lg:flex-row flex-col items-center gap-5">
                    {
                        account.isConnected ? (
                            <Alert className={loading ? "text-zinc-400" : "text-green-400"}>
                                {loading ? <Loader2 className="animate-spin" /> : <Check className="h-4 w-4" />}
                                <AlertTitle>
                                    <div className="flex items-center justify-between">
                                        <p>{loading ? "Loading..." : "Wallet connected"}</p>
                                        <p className="text-red-400"><X onClick={()=>disconnectWallet()} className="cursor-pointer"/></p>
                                    </div>
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
                </div>

                <ContractEvents />
            </header >
        </div>
    )
}