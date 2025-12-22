import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-900 to-fuchsia-900 text-slate-50">
      {/* Navigation */}
      <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/40">
              <span className="text-xs font-extrabold tracking-tight text-slate-950">
                PM
              </span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Privacy Monitor
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-slate-200 hover:text-white transition"
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
      <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <section className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-4 py-1.5 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/40">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow shadow-emerald-400/70" />
            Real-time breach monitoring for your personal data
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Know when your{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
              personal data
            </span>{" "}
            is exposed online
          </h1>

          <p className="text-xl sm:text-2xl text-slate-100/90 max-w-3xl mx-auto">
            Monitor your emails, phone numbers, and addresses across data breaches,
            dark web dumps, and public records. Get clear insights into when and
            where your information appears.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button className="px-8 py-3 text-base shadow-lg shadow-fuchsia-500/40">
                Start Monitoring Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-8 py-3 text-base border-slate-200/40">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="rounded-2xl border border-cyan-400/40 bg-slate-950/40 p-6">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="text-lg font-semibold text-cyan-200 mb-2">
              Email Monitoring
            </h3>
            <p className="text-sm text-slate-200/80">
              Track your personal email addresses across data breaches and credential dumps.
              Get notified when your email appears in compromised databases.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-400/40 bg-slate-950/40 p-6">
            <div className="h-12 w-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-violet-200 mb-2">
              Phone Number Tracking
            </h3>
            <p className="text-sm text-slate-200/80">
              Monitor your phone numbers for exposure in marketing lists, public records,
              and data leaks. Know when your number is shared without your consent.
            </p>
          </div>

          <div className="rounded-2xl border border-fuchsia-400/40 bg-slate-950/40 p-6">
            <div className="h-12 w-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-fuchsia-200 mb-2">
              Address Protection
            </h3>
            <p className="text-sm text-slate-200/80">
              Keep track of your home and work addresses in public records and property databases.
              Understand when your location data is exposed.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Privacy Monitor Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-2xl font-bold text-slate-950">
                1
              </div>
              <h3 className="text-lg font-semibold">Add Your Information</h3>
              <p className="text-sm text-slate-300">
                Sign up and add the emails, phone numbers, and addresses you want us to monitor.
                Your work email stays separate and is never tracked.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-2xl font-bold text-slate-950">
                2
              </div>
              <h3 className="text-lg font-semibold">We Scan Continuously</h3>
              <p className="text-sm text-slate-300">
                Our system monitors data breaches, dark web sources, and public records
                to detect when your information appears in risky places.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-lime-500 text-2xl font-bold text-slate-950">
                3
              </div>
              <h3 className="text-lg font-semibold">Get Clear Insights</h3>
              <p className="text-sm text-slate-300">
                View a monthly timeline of incidents, understand risk patterns,
                and take action based on what we find.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-fuchsia-500/10 p-12 mb-20">
          <h2 className="text-3xl font-bold mb-4">
            Ready to protect your personal data?
          </h2>
          <p className="text-slate-200/80 mb-6 max-w-2xl mx-auto">
            Join Privacy Monitor today and start tracking your digital footprint.
            No credit card required. Delete your data anytime.
          </p>
          <Link to="/register">
            <Button className="px-8 py-3 text-base shadow-lg shadow-fuchsia-500/40">
              Get Started Free
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-200/80">
          <p>© {new Date().getFullYear()} Privacy Monitor. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-white transition">Privacy Policy</button>
            <button className="hover:text-white transition">Terms of Service</button>
            <button className="hover:text-white transition">Contact Us</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default LandingPage;

