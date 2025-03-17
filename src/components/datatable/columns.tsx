import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { CancelSubscriptionModal } from "../cancel-subscription"
import { SubscriptionType } from "@/types"
import { getStatus } from "@/lib/data"
import { Badge } from "../ui/badge"
import PaySubscriptionModal from "../pay-subscription"

export const columns: ColumnDef<SubscriptionType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "user",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "service",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Service
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            
            return row.original.serviceName;
        },
    },
    {
        accessorKey: "tokenId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Token ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price (ETH)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "duration",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Duration (days)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Start Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ getValue }) => {
            if (getValue<number>() != 0) return new Date(Number(getValue<number>())).toLocaleDateString("pt-BR")
            else return <span className="text-gray-400">Not set</span>
        },
    },
    {
        accessorKey: "endDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    End Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ getValue }) => {
            if (getValue<number>() != 0) return new Date(Number(getValue<number>())).toLocaleDateString("pt-BR")
            else return <span className="text-gray-400">Not set</span>
        },
    },
    {
        id: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <Badge>{getStatus(row.original)}</Badge>
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const subscription = row.original
            const isBuyerRoute = window.location.href.includes("buyer")
            const isValidSubscription = getStatus(subscription) == "Expired" || getStatus(subscription) == "New"
            const isCanceled = getStatus(subscription) == "Canceled"

            return (
                <div className="flex items-center gap-2">
                    {
                        isBuyerRoute && isValidSubscription && (
                            <PaySubscriptionModal subscription={subscription} />
                        )
                    }
                    {
                        !isCanceled && (
                            <CancelSubscriptionModal subscription={subscription} />
                        )
                    }
                    {
                        isCanceled && (
                            <span className="text-[var(--destructive)] font-bold">Canceled</span>
                        )
                    }
                </div>
            )
        },
    },
]
