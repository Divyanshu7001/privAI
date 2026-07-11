import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

function LandingPage() {
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

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-200 flex flex-col justify-between">
      {/* Navigation */}
      <header className="border-b border-border bg-card/70 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
              <span className="text-xs font-extrabold tracking-tight text-text-primary animate-pulse">
                PM
              </span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Privacy Monitor
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition font-medium"
            >
              Sign In
            </Link>
            <Link to="/register">
              <Button className="px-5 py-2 text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24 xl:py-32 space-y-20 flex-1 w-full">
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Real-time breach monitoring for your personal data
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-text-primary">
            Know when your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-brand to-emerald-400 bg-clip-text text-transparent">
              personal data
            </span>{" "}
            is exposed online
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Monitor your emails, phone numbers, and addresses across data breaches,
            dark web dumps, and public records. Get clear insights into when and
            where your information appears.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button className="px-8 py-3 text-base shadow-lg shadow-brand/20">
                Start Monitoring Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-8 py-3 text-base border-border">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* Email Card */}
          <div className="rounded-2xl border border-border bg-card p-6 hover:border-brand/40 transition">
            <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4 text-xl">
              📧
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Email Monitoring
            </h3>
            <p className="text-sm text-text-secondary">
              Track your personal email addresses across data breaches and credential dumps.
              Get notified when your email appears in compromised databases.
            </p>
          </div>

          {/* Phone Card */}
          <div className="rounded-2xl border border-border bg-card p-6 hover:border-brand/40 transition">
            <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4 text-xl">
              📱
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Phone Number Tracking
            </h3>
            <p className="text-sm text-text-secondary">
              Monitor your phone numbers for exposure in marketing lists, public records,
              and data leaks. Know when your number is shared without your consent.
            </p>
          </div>

          {/* Address Card */}
          <div className="rounded-2xl border border-border bg-card p-6 hover:border-brand/40 transition">
            <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4 text-xl">
              🏠
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Address Protection
            </h3>
            <p className="text-sm text-text-secondary">
              Keep track of your home and work addresses in public records and property databases.
              Understand when your location data is exposed.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12">
          <h2 className="text-3xl font-bold text-center text-text-primary">
            How Privacy Monitor Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 border border-brand/20 text-brand text-lg font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Add Your Information</h3>
              <p className="text-sm text-text-secondary">
                Sign up and add the emails, phone numbers, and addresses you want us to monitor.
                Your work email stays separate and is never tracked.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 border border-brand/20 text-brand text-lg font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-text-primary">We Scan Continuously</h3>
              <p className="text-sm text-text-secondary">
                Our system monitors data breaches, dark web sources, and public records
                to detect when your information appears in risky places.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 border border-brand/20 text-brand text-lg font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Get Clear Insights</h3>
              <p className="text-sm text-text-secondary">
                View a monthly timeline of incidents, understand risk patterns,
                and take action based on what we find.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center rounded-2xl border border-border bg-card p-12">
          <h2 className="text-3xl font-bold mb-4 text-text-primary">
            Ready to protect your personal data?
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Join Privacy Monitor today and start tracking your digital footprint.
            No credit card required. Delete your data anytime.
          </p>
          <Link to="/register">
            <Button className="px-8 py-3 text-base shadow-lg shadow-brand/20">
              Get Started Free
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} Privacy Monitor. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-text-primary transition">Privacy Policy</button>
            <button className="hover:text-text-primary transition">Terms of Service</button>
            <button className="hover:text-text-primary transition">Contact Us</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default LandingPage;


