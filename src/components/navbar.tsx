import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useNavigate } from "react-router";

export default function Navbar() {

    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search)
    const serviceName = params.get('name')

    var breadcrumbs = <></>;
    var page = window.location.pathname;

    const SELLER_SERVICES_LIST = "/seller/services/list/"
    const SELLER_SERVICE_NEW = "/seller/service/new/"
    const SELLER_SERVICE_DETAILS = "/seller/service/details/"
    const SELLER_SUBSCRIPTION_NEW = "/seller/subscription/new/"
    const SELLER_SUBSCRIPTION_PAYMENT = "/seller/subscription/payment/"

    const BUYER_SERVICES_LIST = "/buyer/services/list/"
    const BUYER_SUBSCRIPTIONS_LIST = "/buyer/subscriptions/list/"

    switch (page) {
        case SELLER_SERVICES_LIST:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/home/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>Services</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;
        case SELLER_SERVICE_NEW:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/home/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/services/list/")} className="cursor-pointer">Services</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>New Service</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;

        case SELLER_SERVICE_DETAILS:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/home/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/services/list/")} className="cursor-pointer">Services</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>Service Details</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;
        case SELLER_SUBSCRIPTION_NEW:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/home/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/services/list/")} className="cursor-pointer">Services</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/service/details/?name=" + serviceName)} className="cursor-pointer">Service Details</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>New Subscription</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;

        case SELLER_SUBSCRIPTION_PAYMENT:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/home/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/services/list/")} className="cursor-pointer">Services</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/seller/service/details/?name=" + serviceName)} className="cursor-pointer">Service Details</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>Subscription Payment</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;
        
        case BUYER_SERVICES_LIST:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/buyer/home/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>Services</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;
        
        case BUYER_SUBSCRIPTIONS_LIST:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/buyer/home/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>Subscriptions</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;

    }

    return (
        <>
            <Breadcrumb className="mb-4">
                <BreadcrumbList>

                    {breadcrumbs}

                </BreadcrumbList>
            </Breadcrumb>
        </>
    )
}