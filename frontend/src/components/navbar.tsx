import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useNavigate } from "react-router";

function Navbar() {

    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search)
    const serviceName = params.get('name')

    var breadcrumbs = <></>;
    var page = window.location.pathname;

    const SERVICES_LIST = "/services/list/"
    const SERVICE_NEW = "/service/new/"
    const SERVICE_DETAILS = "/service/details/"
    const SUBSCRIPTION_NEW = "/subscription/new/"
    const SUBSCRIPTION_PAYMENT = "/subscription/payment/"

    switch (page) {
        case SERVICES_LIST:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>Services</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;
        case SERVICE_NEW:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/services/list/")} className="cursor-pointer">Services</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>New Service</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;

        case SERVICE_DETAILS:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/services/list/")} className="cursor-pointer">Services</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>Service Details</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;
        case SUBSCRIPTION_NEW:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/services/list/")} className="cursor-pointer">Services</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/service/details/?name=" + serviceName)} className="cursor-pointer">Service Details</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>New Subscription</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;

        case SUBSCRIPTION_PAYMENT:
            breadcrumbs = <>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/services/list/")} className="cursor-pointer">Services</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => navigate("/service/details/?name=" + serviceName)} className="cursor-pointer">Service Details</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    <BreadcrumbPage>Subscription Payment</BreadcrumbPage>
                </BreadcrumbItem>
            </>
            break;
    }

    return (
        <Breadcrumb className="mb-4">
            <BreadcrumbList>

                {breadcrumbs}

            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default Navbar;