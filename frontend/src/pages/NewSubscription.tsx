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

    const service = { "name": "Service 1", "description": "Description 1", "subscribers": { "paid": 10, "expired": 2, "canceled": 1 }, "isActive": true }
    
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
        <main className="min-w-[400px]">
            <Navbar />
            
            <Form {...form}>
            <p className="text-4xl font-semibold">New Subscription</p>
            <p className="text-gray-500 mt-4">{service['name']}</p>
            
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
        </main>
    )
}

export default NewSubscription
