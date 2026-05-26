import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";

import { userSidebarData } from "@/shared/constants/sidebar.constants";

const PublicLayout = () => {

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.replace("/login");
  };
  
  return (
    <div className="relative flex min-h-screen flex-col bg-[#09090B] text-[#FAFAFA] antialiased selection:bg-[#DB4444]/30 selection:text-white">
      
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-[#09090B] to-[#09090B]" />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex min-h-screen flex-col">
        
        {/* Ensure your Navbar component uses 'sticky top-0 z-50' 
          instead of 'fixed top-0' inside its own file! 
        */}
        <Navbar navData={userSidebarData} onLogout={handleLogout} />
        
        {/* REMOVED pt-[68px]. Flexbox will now naturally stack this below the Navbar */}
        <main className="flex w-full flex-1 flex-col">
          <Suspense 
            fallback={
              <div className="flex flex-1 items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-zinc-600" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;