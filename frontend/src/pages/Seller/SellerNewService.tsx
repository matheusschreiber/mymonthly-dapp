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

const formSchema = z.object({
    name: z.string().min(5, {
        message: "The service name must be at least 5 characters.",
    }),
    description: z.string().min(5, {
        message: "The service description must be at least 5 characters.",
    }),
})

export default function SellerNewService() {
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <main className="lg:min-w-[400px] lg:p-0 p-16">
            <Navbar />

            <Form {...form}>

            <div className="mb-16">
                <p className="text-6xl font-semibold">New Service</p>
                <p className="mt-3 text-md text-zinc-400">
                    Complete the form to add a new service to the Blockchain. <br/>You can interact with subscriptions later on.
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

                <Button type="submit" variant="secondary">Submit</Button>
            </form>
        </Form>
        </main>
    )
}