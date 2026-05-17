import { Outlet } from "react-router-dom";

import Navbar from "@/shared/components/layout/Navbar"
import Footer from "@/shared/components/layout/Footer"

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-[#FAFAFA]">
      <Navbar />
        <main className="flex-1 w-full pt-[68px]">
          <Outlet />
        </main>
      <Footer/>
      
    </div>
  );
};

export default PublicLayout;