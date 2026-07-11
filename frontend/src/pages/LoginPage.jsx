import React, { useState,useEffect } from "react";
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

  // Sync theme on mount
  useEffect(() => {
    const activeTheme = localStorage.getItem("privai-theme") || "system";
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-purple", "theme-teal");
    
    if (activeTheme === "light") {
      root.classList.add("theme-light");
    } else if (activeTheme === "purple") {
      root.classList.add("theme-purple");
    } else if (activeTheme === "teal") {
      root.classList.add("theme-teal");
    } else if (activeTheme === "system") {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (!systemIsDark) {
        root.classList.add("theme-light");
      }
    }
  }, []);

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-text-primary transition-colors duration-200">
      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center">
        {/* Left Side Header */}
        <aside className="md:col-span-5 space-y-4 text-left">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
              <span className="text-xs font-bold text-text-primary">PM</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              Privacy Monitor
            </span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Welcome back
          </h1>
          <p className="text-sm text-text-secondary">
            Sign in to access your monitoring dashboard and view your risk timeline.
          </p>
        </aside>

        {/* Right Side Card Form */}
        <main className="md:col-span-7">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
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

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-[11px] text-text-secondary text-center">
                  Or continue with
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center gap-2 h-11 border-border text-text-secondary hover:text-text-primary"
                  onClick={handleOAuthClick}
                >
                  <span className="text-sm font-bold">G</span>
                  Continue with Google
                </Button>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-text-secondary text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-brand hover:text-brand-secondary font-semibold"
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
   