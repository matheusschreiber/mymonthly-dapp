import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { createRoot } from 'react-dom/client'
import './index.css'

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

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
  </ThemeProvider>
)
