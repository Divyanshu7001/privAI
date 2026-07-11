import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";
import { registerUser } from "../api/auth";

const STEPS = ["Account", "Monitoring", "Address"];

function ProgressBar({ current }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      {STEPS.map((label, idx) => {
        const stepNumber = idx + 1;
        const active = current === idx;
        const completed = idx < current;
        return (
          <div key={label} className="flex-1 flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                completed
                  ? "bg-emerald-500 text-slate-950"
                  : active
                  ? "bg-brand text-text-primary"
                  : "bg-border text-text-secondary"
              }`}
            >
              {stepNumber}
            </div>
            <span
              className={`text-xs sm:text-sm transition ${
                completed || active ? "text-text-primary" : "text-text-secondary/50"
              }`}
            >
              {label}
            </span>
            {idx !== STEPS.length - 1 && (
              <div className="hidden sm:block flex-1 h-px bg-border mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}


function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

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


  const [form, setForm] = useState({
    workEmail: "",
    username: "",
    password: "",
    confirmPassword: "",
    personalEmails: [""],
    monitoredPhones: [""],
    personalAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    hasWorkAddress: false,
    workAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  });

  const handleArrayChange = (field, index, value) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const nextStep = () => {
    if (step === 0) {
      if (!form.workEmail || !form.username || !form.password || !form.confirmPassword) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }
    if (step < 2) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const filteredEmails = form.personalEmails.filter((v) => v.trim() !== "");
    const filteredPhones = form.monitoredPhones.filter((v) => v.trim() !== "");

    if (filteredEmails.length === 0 && filteredPhones.length === 0) {
      toast.error("Add at least one personal email or phone to monitor.");
      return;
    }

    setLoading(true);

    const payload = {
      workIdentity: {
        workEmail: form.workEmail,
        username: form.username,
      },
      auth: {
        password: form.password,
      },
      monitoringContacts: {
        personalEmails: filteredEmails,
        phones: filteredPhones,
      },
      addresses: {
        personal: form.personalAddress,
        work: form.hasWorkAddress ? form.workAddress : null,
      },
    };

    try {
      await registerUser(payload);
      toast.success("Account created successfully!");
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleOAuthClick = () => {
    toast("OAuth (Google) integration coming soon. Please use the form.", {
      icon: "ℹ️",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-text-primary transition-colors duration-200">
      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side Info */}
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
            Create your account
          </h1>
          <p className="text-sm text-text-secondary">
            Set up your monitoring profile in three simple steps. Your work email stays separate from your monitored data.
          </p>
        </aside>

        {/* Right Side Card Form */}
        <main className="md:col-span-7 w-full">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <ProgressBar current={step} />

              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">
                    Account Information
                  </h2>

                  <Input
                    label="Work email"
                    type="email"
                    required
                    value={form.workEmail}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, workEmail: e.target.value }))
                    }
                    placeholder="you@company.com"
                    helper="This email is visible to others but not monitored for leaks."
                  />

                  <Input
                    label="Username"
                    required
                    value={form.username}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, username: e.target.value }))
                    }
                    placeholder="your-unique-handle"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <PasswordInput
                      label="Password"
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, password: e.target.value }))
                      }
                    />
                    <PasswordInput
                      label="Confirm password"
                      required
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">
                    Contacts to Monitor
                  </h2>
                  <p className="text-xs text-slate-400">
                    Add the personal emails and phone numbers you want us to track for data leaks.
                  </p>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-200">
                      Personal emails (monitored)
                    </p>
                    {form.personalEmails.map((val, idx) => (
                      <Input
                        key={idx}
                        type="email"
                        placeholder="personal.email@example.com"
                        value={val}
                        onChange={(e) =>
                          handleArrayChange(
                            "personalEmails",
                            idx,
                            e.target.value
                          )
                        }
                      />
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs px-2 py-1"
                      onClick={() => addArrayItem("personalEmails")}
                    >
                      + Add another email
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-200">
                      Phone numbers (monitored)
                    </p>
                    {form.monitoredPhones.map((val, idx) => (
                      <Input
                        key={idx}
                        placeholder="+1 555 000 0000"
                        value={val}
                        onChange={(e) =>
                          handleArrayChange(
                            "monitoredPhones",
                            idx,
                            e.target.value
                          )
                        }
                      />
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs px-2 py-1"
                      onClick={() => addArrayItem("monitoredPhones")}
                    >
                      + Add another phone
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">
                    Address Information
                  </h2>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-200">
                      Personal address (monitored)
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Street"
                        value={form.personalAddress.street}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            personalAddress: {
                              ...p.personalAddress,
                              street: e.target.value,
                            },
                          }))
                        }
                      />
                      <Input
                        label="City"
                        value={form.personalAddress.city}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            personalAddress: {
                              ...p.personalAddress,
                              city: e.target.value,
                            },
                          }))
                        }
                      />
                      <Input
                        label="State"
                        value={form.personalAddress.state}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            personalAddress: {
                              ...p.personalAddress,
                              state: e.target.value,
                            },
                          }))
                        }
                      />
                      <Input
                        label="Pincode"
                        value={form.personalAddress.pincode}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            personalAddress: {
                              ...p.personalAddress,
                              pincode: e.target.value,
                            },
                          }))
                        }
                      />
                      <Input
                        label="Country"
                        value={form.personalAddress.country}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            personalAddress: {
                              ...p.personalAddress,
                              country: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-slate-800 pt-4">
                    <label className="flex items-center gap-2 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                        checked={form.hasWorkAddress}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            hasWorkAddress: e.target.checked,
                          }))
                        }
                      />
                      <span>Add work address (optional)</span>
                    </label>

                    {form.hasWorkAddress && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="Work street"
                          value={form.workAddress.street}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              workAddress: {
                                ...p.workAddress,
                                street: e.target.value,
                              },
                            }))
                          }
                        />
                        <Input
                          label="City"
                          value={form.workAddress.city}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              workAddress: {
                                ...p.workAddress,
                                city: e.target.value,
                              },
                            }))
                          }
                        />
                        <Input
                          label="State"
                          value={form.workAddress.state}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              workAddress: {
                                ...p.workAddress,
                                state: e.target.value,
                              },
                            }))
                          }
                        />
                        <Input
                          label="Pincode"
                          value={form.workAddress.pincode}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              workAddress: {
                                ...p.workAddress,
                                pincode: e.target.value,
                              },
                            }))
                          }
                        />
                        <Input
                          label="Country"
                          value={form.workAddress.country}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              workAddress: {
                                ...p.workAddress,
                                country: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0}
                  onClick={prevStep}
                >
                  ← Back
                </Button>

                {step < 2 && (
                  <Button type="button" onClick={nextStep}>
                    Next →
                  </Button>
                )}

                {step === 2 && (
                  <Button type="submit" disabled={loading} className="min-w-[160px]">
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-text-secondary text-center">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-brand hover:text-brand-secondary font-semibold"
                  >
                    Sign in
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

export default SignupPage;

