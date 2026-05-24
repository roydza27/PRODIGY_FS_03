import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";

import { userSidebarData } from "@/shared/constants/sidebar.constants";

const PublicLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    // Use React Router's navigation for a smooth, app-like transition
    // without forcing the browser to do a hard refresh.
    navigate("/login", { replace: true });
    
    // Trigger a custom event so other components (like Navbar) know to re-render
    window.dispatchEvent(new Event("storage")); 
  };
  
  return (
    <div className="relative flex min-h-screen flex-col bg-[#09090B] text-[#FAFAFA] antialiased selection:bg-[#DB4444]/30 selection:text-white">
      
      {/* Subtle background glow at the top of the screen */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-[#09090B] to-[#09090B]" />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar navData={userSidebarData} onLogout={handleLogout} />
        
        {/* flex-col on main ensures nested pages can stretch full height if needed */}
        <main className="flex w-full flex-1 flex-col pt-[68px]">
          {/* Handles loading states for lazy-loaded pages */}
          <Suspense 
            fallback={
              <div className="flex flex-1 items-center justify-center">
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