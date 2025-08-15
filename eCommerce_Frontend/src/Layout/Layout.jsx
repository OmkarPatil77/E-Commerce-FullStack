import Navbar from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "@/utils/ScrollToTop";

export default function Layout() {
  return (
    <>
    <ScrollToTop/>
      <Navbar />
        <Outlet />
      <Footer />
    </>
  )
}