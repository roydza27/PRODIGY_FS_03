import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPasswordAPI } from "../services/auth.service";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or expired reset token pointer.");
      return;
    }

    setLoading(true);

    try {
      await resetPasswordAPI(password, token);
      setSuccess(true);
    } catch (err) {
      setError("This link has expired or is invalid. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-[#111113] p-6 shadow-2xl shadow-black/30 md:p-8">
      <div className="mb-6 text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-[-0.04em] text-white">
          Create New Password
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          Please enter and confirm your secure new password credentials.
        </p>
      </div>

      {success ? (
        <div className="space-y-4 text-center">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            Password updated successfully. You can now log in securely.
          </div>
          <Link
            to="/login"
            className="block w-full rounded-2xl bg-[#DB4444] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#c53a3a]"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-left text-sm font-medium text-zinc-400"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-left text-sm font-medium text-zinc-400"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#DB4444]/60"
            />
          </div>

          {error ? (
            <p className="text-center text-sm text-red-400">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#DB4444] px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#c53a3a] disabled:opacity-60"
          >
            {loading ? "Updating password..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}