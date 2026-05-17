import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/features/auth/services/auth.service";
import { useAuth } from "@/app/providers/AuthProvider";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      
      setSession({
        user: data.user,
        token: data.token,
        remember: rememberMe,
      })

      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid w-full items-center gap-8 md:gap-12 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-[#111113] p-6 shadow-2xl shadow-black/30 md:p-8 lg:ml-auto lg:mx-0">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-[-0.04em] text-white">
              Sign in
            </h1>
            <p className="text-sm leading-relaxed text-zinc-400">
              Sign in to your account to access your dashboard and manage your projects.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@readymadeui.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-400">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex cursor-pointer items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-black/30 text-[#DB4444] focus:ring-[#DB4444]/60"
                />
                <span className="ml-3 text-sm text-zinc-400">Remember me</span>
              </label>

              <a
                href="/forgotPassword"
                className="text-sm font-medium text-zinc-200 transition-colors hover:text-white hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#DB4444] px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#c53a3a] focus:outline-none focus:ring-2 focus:ring-[#DB4444]/60 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center text-sm text-zinc-400">
              Don't have an account?
              <a
                href="/register"
                className="ml-1 font-medium text-white transition-colors hover:text-zinc-300 hover:underline"
              >
                Sign up
              </a>
            </div>
          </form>
        </div>

        <div className="mx-auto hidden max-w-lg lg:block">
          <img
            src="https://readymadeui.com/images/integration-illus.webp"
            className="w-full object-contain"
            alt="login illustration"
          />
        </div>
      </div>
    </div>
  );
}