import { BrowserRouter, Route, Routes } from "react-router";
import { createContext, useEffect, useState } from "react";
import { getServices } from "./lib/utils";
import { ServiceType } from "./types";

import Home from "./pages/Home";
import SellerHome from "./pages/Seller/SellerHome";
import SellerNewService from "./pages/Seller/SellerNewService";
import SellerListServices from "./pages/Seller/SellerListService";
import SellerDetailService from "./pages/Seller/SellerDetailService";
import SellerNewSubscription from "./pages/Seller/SellerNewSubscription";
import BuyerHome from "./pages/Buyer/BuyerHome";
import BuyerListServices from "./pages/Buyer/BuyerListServices";
import BuyerListSubscriptions from "./pages/Buyer/BuyerListSubscriptions";
import Hero from "./pages/Hero";

export const ServicesContext = createContext({
    services: [] as ServiceType[],
    loaded: false
});

export default function MyRoutes() {

    const [services, setServices] = useState<ServiceType[]>([]);
    const [loaded, setLoaded] = useState(false);
    
    async function fetchServices() {
        const _services = await getServices()
        setServices(_services)
        setLoaded(true)
    }

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <ServicesContext.Provider value={{services, loaded}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Hero />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/seller/home" element={<SellerHome />} />
                    <Route path="/seller/service/new/" element={<SellerNewService />} />
                    <Route path="/seller/services/list/" element={<SellerListServices />} />
                    <Route path="/seller/service/details/" element={<SellerDetailService />} />
                    <Route path="/seller/subscription/new/" element={<SellerNewSubscription />} />

                    <Route path="/buyer/home" element={<BuyerHome />} />
                    <Route path="/buyer/services/list/" element={<BuyerListServices />} />
                    <Route path="/buyer/subscriptions/list/" element={<BuyerListSubscriptions />} />
                </Routes>
            </BrowserRouter>
        </ServicesContext.Provider>
    )
}
