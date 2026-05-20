import AppRouter from "@/app/router";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;