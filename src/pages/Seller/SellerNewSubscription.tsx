import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
    FormDescription
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Navbar from "@/components/navbar"
import { useContext, useEffect, useState } from "react"
import { ServiceType } from "@/types"
import { Loader2, X } from "lucide-react"
import { useNavigate } from "react-router"
import { Toaster } from "@/components/ui/sonner"
import { Topper } from "@/components/topper"
import { toast } from "sonner"
import { ServicesContext } from "@/routes"
import { createSubscription } from "@/lib/utils"
import { Footer } from "@/components/footer"

const uint256Max = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

const formSchema = z.object({
    user: z.string().nonempty({
        message: "The subscription user address cannot be empty."
    }).regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid address."
    }),

    price: z.string().nonempty({
        message: "The subscription price must be a number greater than 0.",
    }).refine((val) => {
        try {
            const num = parseFloat(val);
            return num > 0 && num <= uint256Max;
        } catch {
            return false;
        }
    }, {
        message: "The subscription price must be a positive integer within the uint256 range."
    }),

    duration: z.string().nonempty({
        message: "The subscription duration (days) must be a number greater than 0.",
    }).refine((val) => {
        try {
            const num = BigInt(val);
            return num > 0 && num <= uint256Max;
        } catch {
            return false;
        }
    }, {
        message: "The subscription duration (days) must be a positive integer within the uint256 range."
    }),
})

export default function SellerNewSubscription() {

    const [service, setService] = useState<ServiceType>()
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const { services, loaded } = useContext(ServicesContext)

    const navigate = useNavigate();

    async function fetchData() {
        const params = new URLSearchParams(window.location.search)
        let serviceName = params.get('name')
        let serviceFound = services.filter(service => service['name'] === serviceName)[0]
        if (!serviceFound && loaded) {
            setError(true)
        } else {
            setError(false)
            setService(serviceFound)
        }
    }

    useEffect(() => {
        fetchData()
    }, [loaded])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user: "",
            price: "",
            duration: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            if (!service) throw new Error("Service not found.")
            if (!values.user) throw new Error("Account not found.")
            await createSubscription(service.address, values.user, parseFloat(values.price), parseInt(values.duration))
        } catch (error: any) {
            toast("Problem on blockchain: " + error.message)
            setLoading(false)
        }
    }

    return (
        <main className="flex flex-col lg:py-8 lg:px-0 p-16 mx-auto lg:max-w-[70%]">
            <Topper />

            {service && (
                <>
                    <Navbar />

                    <Form {...form}>
                        <p className="text-4xl font-semibold">New Subscription</p>
                        <p className="text-gray-500 mt-4">For the <b>{service['name']}</b> service.</p>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-16">
                            <FormField
                                control={form.control}
                                name="user"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="eg.: 0x123abcdef...." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input placeholder="eg.: 0.1, 0.15, 0.3, etc" {...field} type="number" />
                                        </FormControl>
                                        <FormDescription>
                                            The price is in ETH.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration</FormLabel>
                                        <FormControl>
                                            <Input placeholder="eg.: 30, 90, 365, etc" {...field} type="number" />
                                        </FormControl>
                                        <FormDescription>
                                            The duration is in full days.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" variant="secondary" disabled={loading}>
                                {
                                    loading ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            <p>Loading</p>
                                        </>
                                    ) : (
                                        <p>Submit</p>
                                    )
                                }
                            </Button>
                        </form>
                    </Form>
                </>
            )}

            {!service && !error && (
                <div className="flex items-center justify-center gap-4">
                    <Loader2 className="animate-spin" />
                    <p>Loading Service</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center justify-center gap-4 text-[var(--destructive)]">
                        <X />
                        <p>Error in service's data fetching.</p>
                    </div>

                    <Button onClick={() => navigate('/')} variant="secondary" className="cursor-pointer">
                        Go Home
                    </Button>
                </div>
            )}
            
            <Toaster />
            <Footer />
        </main>
    )
}