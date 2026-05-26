import AppRouter from "@/app/router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";

function App() {
  const hydrateSession = useAuthStore((state) => state.hydrateSession);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);
  
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;