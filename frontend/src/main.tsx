import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from "./pages/Home";
import NewService from "./pages/NewService";
import { ThemeProvider } from "./components/theme-provider";
import ListServices from "./pages/ListServices";
import DetailsService from "./pages/DetailsService";
import NewSubscription from "./pages/NewSubscription";

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service/new/" element={<NewService />} />
        <Route path="/services/list/" element={<ListServices />} />
        <Route path="/service/details/" element={<DetailsService />} />
        <Route path="/subscription/new/" element={<NewSubscription />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
)
