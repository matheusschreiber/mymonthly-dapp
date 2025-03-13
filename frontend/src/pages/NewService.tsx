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

function NewService() {
    
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
        <main className="min-w-[400px]">
            <Navbar />

            <Form {...form}>

            <p className="text-6xl mb-16 font-semibold">New Service</p>
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
                                <Input placeholder="eg.: This is a movie streaming service" {...field} />
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

export default NewService
