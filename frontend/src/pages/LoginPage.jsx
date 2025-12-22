import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";
import { loginUser } from "../api/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(loginIdentifier, loginPassword);
      toast.success("Welcome back!");
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "Invalid credentials.");
    }
  };

  const handleOAuthClick = () => {
    toast("OAuth (Google) integration coming soon. Please use the form.", {
      icon: "ℹ️",
    });
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-8 lg:flex-row lg:py-12">
        <aside className="lg:w-5/12 space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-950">PM</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Privacy Monitor
            </span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-slate-300">
            Sign in to access your monitoring dashboard and view your risk timeline.
          </p>
        </aside>
                 <main className="lg:w-7/12">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Work email or username"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
              />
              <PasswordInput
                label="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

                          <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="border-t border-slate-800 pt-4 space-y-2">
                <p className="text-xs text-slate-400 text-center">
                  Or continue with
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={handleOAuthClick}
                >
                  <span className="text-lg">G</span>
                  Continue with Google
                </Button>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                     to="/register"
                    className="text-cyan-300 hover:text-cyan-200 font-semibold"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;   