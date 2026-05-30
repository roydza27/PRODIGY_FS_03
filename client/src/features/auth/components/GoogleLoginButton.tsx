import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import { loginWithGoogleAPI } from "../services/auth.service";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
  const [authenticating, setAuthenticating] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAuthenticating(true);
      try {
        // Exchange Google token for your native backend session JWT
        const data = await loginWithGoogleAPI(tokenResponse.access_token);

        setSession({
          user: data.user,
          token: data.token,
          remember: false, // Auto-remember social connections
        });

        // Match your existing routing permissions engine
        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "seller") navigate("/seller");
        else navigate("/account");

        toast.success(`Logged in as ${data.user.name}`);
      } catch (err) {
        toast.error("Google authentication sync failed");
      } finally {
        setAuthenticating(false);
      }
    },
    onError: () => toast.error("Google authentication popup window closed"),
  });

  return (
    <button
      type="button"
      disabled={authenticating}
      onClick={() => handleGoogleLogin()}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span>{authenticating ? "Authenticating..." : "Continue with Google"}</span>
    </button>
  );
}