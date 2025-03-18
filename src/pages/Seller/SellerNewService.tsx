import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Navbar from "@/components/navbar"
import { dAppContract } from "@/lib/data"
import { Toaster } from "@/components/ui/sonner"
import { Topper } from "@/components/topper"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
    name: z.string().min(5, {
        message: "The service name must be at least 5 characters.",
    }),
    description: z.string().min(5, {
        message: "The service description must be at least 5 characters.",
    }),
})

export default function SellerNewService() {

    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            await dAppContract._addService(values.name, values.description)
        } catch (error: any) {
            toast("Problem on blockchain: " + error.message)
            setLoading(false)
        }
    }

    return (
        <main className="lg:min-w-[50%] p-16">
            <Topper />

            <Navbar />

            <Form {...form}>

                <div className="mb-16">
                    <p className="text-6xl font-semibold">New Service</p>
                    <p className="mt-3 text-md text-zinc-400">
                        Complete the form to add a new service to the Blockchain. <br />You can interact with subscriptions later on.
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="eg.: Netflix, Twitch, etc" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="eg.: An amazing movie streaming service" {...field} />
                                </FormControl>
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
            <Toaster />
        </main>
    )
}