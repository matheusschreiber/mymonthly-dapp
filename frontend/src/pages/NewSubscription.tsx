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
import { useEffect, useState } from "react"
import { ServiceType } from "@/types"
import { getServices } from "@/lib/data"
import { Loader2, X } from "lucide-react"
import { useNavigate } from "react-router"

const formSchema = z.object({
    user: z.string().min(5, { // TODO: make this validation for metamask tokens
        message: "The subscription user address must be at least 5 characters.",
    }),
    price: z.string().nonempty({ // TODO: this should be nonempty and nonzero
        message: "The subscription price must be a number greater than 0.",
    }),
    duration: z.string().nonempty({ // TODO: this should be nonempty and nonzero
        message: "The subscription duration must be a number greater than 0.",
    }),
})

function NewSubscription() {

    const [service, setService] = useState<ServiceType>()
    const [error, setError] = useState<boolean>(false)
    
    const navigate = useNavigate();

    async function fetchData() {
        const _services = await getServices()

        const params = new URLSearchParams(window.location.search)
        let serviceName = params.get('name')
        let serviceFound = _services.filter(service => service['name'] === serviceName)[0]
        if (!serviceName) {
            setError(true)
            return
        }
        setService(serviceFound)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user: "",
            price: "",
            duration: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <main className="lg:min-w-[400px] lg:p-0 p-16">
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
                                            <Input placeholder="eg.: 50, 100, 150, etc" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The price is in USD.
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
                                            <Input placeholder="eg.: 30, 90, 365, etc" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The duration is in full days.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" variant="secondary">Submit</Button>
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

                    <Button onClick={() => navigate('/')} variant="secondary" className="cursor-pointer">Go Home</Button>
                </div>
            )}
        </main>
    )
}

export default NewSubscription
