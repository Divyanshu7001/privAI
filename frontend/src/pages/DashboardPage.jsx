import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ShieldAlert,
  User,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  Smartphone,
  MapPin,
  Mail,
  Info
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import {
  getUserProfile,
  updateUserProfile,
  logoutUser,
  updatePassword,
  deleteAccount,
  getExceptions,
  updateExceptions,
  getIncidents,
  updateIncidentAction
} from "../api/auth";

const THEME_OPTIONS = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "purple", label: "Purple" },
  { id: "teal", label: "Teal" }
];

function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, exceptions, profile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("system");
  
  // Profile state
  const [profile, setProfile] = useState({
    username: "",
    workEmail: "",
    personalEmails: [],
    phones: [],
    addresses: { personal: {}, work: {} }
  });
  
  // Edit profile state
  const [editProfile, setEditProfile] = useState({
    username: "",
    workEmail: ""
  });
  
  // Password change state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPass, setShowPass] = useState(false);

  // Exceptions state
  const [exceptions, setExceptions] = useState({
    name: true,
    personalEmail: true,
    workEmail: false,
    phone: false,
    workAddress: false,
    custom: []
  });
  const [newCustomException, setNewCustomException] = useState("");

  // Incidents state
  const [incidents, setIncidents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Initialize and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfile();
        const userExceptions = await getExceptions();
        const userIncidents = await getIncidents();
        
        setProfile({
          username: userProfile.workIdentity?.username || "",
          workEmail: userProfile.workIdentity?.workEmail || "",
          personalEmails: userProfile.monitoringContacts?.personalEmails || [],
          phones: userProfile.monitoringContacts?.phones || [],
          addresses: userProfile.addresses || { personal: {}, work: {} }
        });

        setEditProfile({
          username: userProfile.workIdentity?.username || "",
          workEmail: userProfile.workIdentity?.workEmail || ""
        });

        setExceptions(userExceptions);
        setIncidents(userIncidents);

        // Sync theme
        const activeTheme = localStorage.getItem("privai-theme") || "system";
        setTheme(activeTheme);
        applyTheme(activeTheme);
      } catch (error) {
        console.error("Failed to load user dashboard data:", error);
        toast.error("Failed to load dashboard settings.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const applyTheme = (themeId) => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-purple", "theme-teal");
    
    if (themeId === "system") {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (!systemIsDark) {
        root.classList.add("theme-light");
      }
    } else if (themeId === "light") {
      root.classList.add("theme-light");
    } else if (themeId === "purple") {
      root.classList.add("theme-purple");
    } else if (themeId === "teal") {
      root.classList.add("theme-teal");
    }
  };

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    localStorage.setItem("privai-theme", themeId);
    applyTheme(themeId);
    toast.success(`Theme updated to ${themeId}`);
  };

  // Metrics computing
  const platformMetrics = useMemo(() => {
    const counts = { linkedin: 0, facebook: 0, instagram: 0, twitter: 0 };
    incidents.forEach((inc) => {
      const plat = inc.platform.toLowerCase();
      if (counts[plat] !== undefined) {
        counts[plat] += 1;
      }
    });
    return counts;
  }, [incidents]);

  const totalStopped = incidents.length;
  
  // Mock compute a risk indicator based on overall incidents
  const riskStats = useMemo(() => {
    let percentage = 0;
    let label = "Safe";
    let color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    
    if (totalStopped > 0) {
      // Scale percentage up to 100% based on simulated active issues.
      // Since all seed incidents here are "stopped", we count ignored vs acknowledged.
      const ignoredCount = incidents.filter(i => i.action === "ignored").length;
      percentage = Math.round((ignoredCount / totalStopped) * 100);
      
      if (percentage <= 10) {
        label = "Safe";
        color = "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
      } else if (percentage <= 25) {
        label = "Warning";
        color = "text-amber-400 bg-amber-500/15 border-amber-500/30";
      } else {
        label = "Danger";
        color = "text-red-400 bg-red-500/15 border-red-500/30";
      }
    }
    return { percentage, label, color };
  }, [incidents, totalStopped]);

  // Profile CRUD handlers
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editProfile.username || !editProfile.workEmail) {
      toast.error("All details must be filled");
      return;
    }
    try {
      setLoading(true);
      const updated = await updateUserProfile({
        workIdentity: {
          username: editProfile.username,
          workEmail: editProfile.workEmail
        }
      });
      setProfile((p) => ({
        ...p,
        username: updated.workIdentity.username,
        workEmail: updated.workIdentity.workEmail
      }));
      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error("Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await updatePassword(passwords.current, passwords.new);
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      toast.success("Account permanently deleted.");
      setShowDeleteModal(false);
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  // Exceptions management
  const handleExceptionToggle = async (key) => {
    const updated = { ...exceptions, [key]: !exceptions[key] };
    setExceptions(updated);
    await updateExceptions(updated);
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} exception toggled.`);
  };

  const handleAddCustomException = async (e) => {
    e.preventDefault();
    const val = newCustomException.trim();
    if (!val) return;
    if (exceptions.custom.includes(val)) {
      toast.error("Exception keyword already exists");
      return;
    }
    const updated = { ...exceptions, custom: [...exceptions.custom, val] };
    setExceptions(updated);
    await updateExceptions(updated);
    setNewCustomException("");
    toast.success(`"${val}" added to ignore list.`);
  };

  const handleRemoveCustomException = async (val) => {
    const updated = {
      ...exceptions,
      custom: exceptions.custom.filter((e) => e !== val)
    };
    setExceptions(updated);
    await updateExceptions(updated);
    toast.success(`Removed "${val}" from exceptions.`);
  };

  // Incident feed actions
  const handleToggleIncidentAction = async (id, currentAction) => {
    const nextAction = currentAction === "acknowledged" ? "ignored" : "acknowledged";
    try {
      const updated = await updateIncidentAction(id, nextAction);
      setIncidents(updated);
      toast.success(`Incident action set to ${nextAction}`);
    } catch (error) {
      toast.error("Failed to update incident.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutUser();
      toast.success("Logged out successfully.");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-text-primary transition-colors duration-200">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`${isSidebarCollapsed ? "w-20" : "w-64"} border-r border-border bg-card flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out`}>
        <div>
          {/* Logo / Toggle */}
          <div className={`px-4 py-6 border-b border-border flex items-center justify-between gap-3 ${isSidebarCollapsed ? "flex-col" : "flex-row"}`}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20 shrink-0">
                <Shield className="h-4 w-4 text-text-primary" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold tracking-tight text-text-primary truncate">
                  privAI Monitor
                </span>
              )}
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="h-7 w-7 rounded-lg text-text-secondary hover:bg-border/40 hover:text-text-primary flex items-center justify-center transition shrink-0"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="text-xs font-semibold">
                {isSidebarCollapsed ? "→" : "←"}
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "dashboard"
                  ? "bg-brand text-text-primary"
                  : "text-text-secondary hover:bg-border/40 hover:text-text-primary"
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab("exceptions")}
              className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "exceptions"
                  ? "bg-brand text-text-primary"
                  : "text-text-secondary hover:bg-border/40 hover:text-text-primary"
              }`}
              title="Exceptions"
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>Exceptions</span>}
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "profile"
                  ? "bg-brand text-text-primary"
                  : "text-text-secondary hover:bg-border/40 hover:text-text-primary"
              }`}
              title="Profile Settings"
            >
              <User className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>Profile Settings</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-4 flex flex-col items-center">
          <div className={`flex items-center w-full ${isSidebarCollapsed ? "justify-center" : "gap-3 px-2"}`}>
            <div className="h-9 w-9 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center font-bold text-brand shrink-0">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {profile.username || "Guest User"}
                </p>
                <p className="text-[10px] text-text-secondary truncate">
                  {profile.workEmail || "Not logged in"}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center justify-center rounded-xl text-xs font-semibold border border-border text-text-secondary hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition shrink-0 ${
              isSidebarCollapsed ? "h-9 w-9 p-0" : "w-full gap-2 px-4 py-2.5"
            }`}
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>


      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-6xl mx-auto">
        {/* HEADER AREA */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary capitalize">
              {activeTab === "profile" ? "Profile Settings" : activeTab}
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              {activeTab === "dashboard" && "Real-time statistics of blocked PII exposures."}
              {activeTab === "exceptions" && "Manage bypass definitions and safety overrides."}
              {activeTab === "profile" && "Edit account identity, settings, and credentials."}
            </p>
          </div>

          {/* Theme Selector Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-card border border-border rounded-xl self-start">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleThemeChange(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wide uppercase transition ${
                  theme === opt.id
                    ? "bg-brand text-text-primary shadow"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </header>

        {/* TAB BODY PAGES */}
        <div className="space-y-8">
          {/* TAB 1: DASHBOARD ANALYTICS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Analytics Top Cards Grid */}
              <div className="grid gap-6 md:grid-cols-5">
                {/* Total Stats Banner Card (Spans 2 columns) */}
                <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Overall Monitoring Status
                    </p>
                    <h3 className="text-sm font-medium text-text-secondary">
                      Active Shields Blocking Leakages
                    </h3>
                  </div>

                  <div className="flex items-end justify-between mt-6">
                    <div>
                      <p className="text-4xl font-extrabold tracking-tight text-text-primary">
                        {totalStopped}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Total Risks Stopped
                      </p>
                    </div>

                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${riskStats.color}`}>
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {riskStats.label} ({riskStats.percentage}%)
                      </div>
                      <p className="text-[10px] text-text-secondary mt-1.5">
                        Leak Risk Ratio
                      </p>
                    </div>
                  </div>
                </div>

                {/* Platforms Grid (Remaining 3 columns) */}
                <div className="md:col-span-3 grid grid-cols-2 gap-4">
                  {/* LinkedIn */}
                  <div className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between hover:border-brand/40 transition">
                    <p className="text-xs font-semibold text-text-secondary">LinkedIn Risks</p>
                    <div className="flex items-end justify-between mt-4">
                      <p className="text-3xl font-extrabold text-text-primary">
                        {platformMetrics.linkedin}
                      </p>
                      <span className="text-xs font-semibold text-[#0A66C2] bg-[#E3F0FF] dark:bg-[#0A66C2]/10 dark:text-[#0A66C2] px-2 py-1 rounded-lg">
                        In Check
                      </span>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between hover:border-brand/40 transition">
                    <p className="text-xs font-semibold text-text-secondary">Facebook Risks</p>
                    <div className="flex items-end justify-between mt-4">
                      <p className="text-3xl font-extrabold text-text-primary">
                        {platformMetrics.facebook}
                      </p>
                      <span className="text-xs font-semibold text-[#1877F2] bg-[#E8F1FF] dark:bg-[#1877F2]/10 dark:text-[#1877F2] px-2 py-1 rounded-lg">
                        In Check
                      </span>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between hover:border-brand/40 transition">
                    <p className="text-xs font-semibold text-text-secondary">Instagram Risks</p>
                    <div className="flex items-end justify-between mt-4">
                      <p className="text-3xl font-extrabold text-text-primary">
                        {platformMetrics.instagram}
                      </p>
                      <span className="text-xs font-semibold text-[#E1306C] bg-[#FFE6F0] dark:bg-[#E1306C]/10 dark:text-[#E1306C] px-2 py-1 rounded-lg">
                        In Check
                      </span>
                    </div>
                  </div>

                  {/* Twitter/X */}
                  <div className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between hover:border-brand/40 transition">
                    <p className="text-xs font-semibold text-text-secondary">Twitter / X Risks</p>
                    <div className="flex items-end justify-between mt-4">
                      <p className="text-3xl font-extrabold text-text-primary">
                        {platformMetrics.twitter}
                      </p>
                      <span className="text-xs font-semibold text-text-primary bg-border dark:bg-border px-2 py-1 rounded-lg">
                        In Check
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Risks Feed Table */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">
                  Recent Risks Intercepted & Logged
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-text-secondary font-medium">
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Platform</th>
                        <th className="py-3 px-4">PII Snippet Flagged</th>
                        <th className="py-3 px-4 text-right">User Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {incidents.map((inc) => (
                        <tr key={inc.id} className="hover:bg-border/10 transition-colors">
                          <td className="py-4 px-4 font-semibold text-text-primary">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                              inc.type === "Posting"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}>
                              {inc.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 capitalize font-medium text-text-secondary">
                            {inc.platform}
                          </td>
                          <td className="py-4 px-4 font-mono text-xs text-text-primary">
                            {inc.title}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleToggleIncidentAction(inc.id, inc.action)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
                                inc.action === "acknowledged"
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                  : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                              }`}
                            >
                              {inc.action === "acknowledged" ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3" />
                                  Acknowledged
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-3 w-3" />
                                  Bypassed / Ignored
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {incidents.length === 0 && (
                  <div className="py-12 text-center text-text-secondary flex flex-col items-center gap-2">
                    <Info className="h-8 w-8 text-text-secondary/50" />
                    <p className="text-xs">No logged risks intercepted yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: EXCEPTIONS SETTINGS */}
          {activeTab === "exceptions" && (
            <div className="space-y-6 max-w-3xl animate-fadeIn">
              {/* Exceptions Info */}
              <div className="p-4 rounded-xl border border-brand/20 bg-brand/5 text-xs text-brand leading-relaxed flex gap-3">
                <Info className="h-5 w-5 shrink-0" />
                <p>
                  <strong>Active Exclusions:</strong> Monitored fields marked as exceptions will not trigger warnings even if the extension or local ML model flags them as highly risky. Define exceptions for terms you explicitly consent to publish.
                </p>
              </div>

              {/* Default exclusions switches */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                <h3 className="text-sm font-semibold text-text-primary">
                  Default Platform Exclusions
                </h3>

                <div className="space-y-4">
                  {/* Name Exception */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-text-primary flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-text-secondary" />
                        Exclude My Identity / Name
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        Do not flag username or profile initials ({profile.username || "Default User"}).
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={exceptions.name}
                      onChange={() => handleExceptionToggle("name")}
                      className="h-4 w-4 accent-brand cursor-pointer"
                    />
                  </div>

                  {/* Personal Emails */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-text-primary flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-text-secondary" />
                        Exclude Personal Email List
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        Allow checked personal monitoring addresses to bypass leaks checking.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={exceptions.personalEmail}
                      onChange={() => handleExceptionToggle("personalEmail")}
                      className="h-4 w-4 accent-brand cursor-pointer"
                    />
                  </div>

                  {/* Work Email */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-text-primary flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-text-secondary" />
                        Exclude Work Email Address
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        Do not intercept work identity emails ({profile.workEmail || "None"}).
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={exceptions.workEmail}
                      onChange={() => handleExceptionToggle("workEmail")}
                      className="h-4 w-4 accent-brand cursor-pointer"
                    />
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-text-primary flex items-center gap-2">
                        <Smartphone className="h-3.5 w-3.5 text-text-secondary" />
                        Exclude Phone Numbers
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        Allow my monitored contact phone list to bypass warnings.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={exceptions.phone}
                      onChange={() => handleExceptionToggle("phone")}
                      className="h-4 w-4 accent-brand cursor-pointer"
                    />
                  </div>

                  {/* Work Address */}
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-text-primary flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-text-secondary" />
                        Exclude Work Address
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        Allow work geographic details to bypass alerts.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={exceptions.workAddress}
                      onChange={() => handleExceptionToggle("workAddress")}
                      className="h-4 w-4 accent-brand cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Custom exclusion keywords */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                <h3 className="text-sm font-semibold text-text-primary">
                  Custom Keyword & Term Exceptions
                </h3>

                <form onSubmit={handleAddCustomException} className="flex gap-2">
                  <Input
                    placeholder="Enter keyword to ignore (e.g. project codename)"
                    value={newCustomException}
                    onChange={(e) => setNewCustomException(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="shrink-0 h-10 px-4">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </form>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-text-secondary">
                    Monitored Keywords Ignored ({exceptions.custom.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exceptions.custom.map((word) => (
                      <span
                        key={word}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-border/50 border border-border text-xs font-mono text-text-primary"
                      >
                        {word}
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomException(word)}
                          className="hover:text-red-400 transition"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    {exceptions.custom.length === 0 && (
                      <p className="text-xs text-text-secondary/70 italic py-2">
                        No custom keywords added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="space-y-6 max-w-3xl animate-fadeIn">
              {/* Profile Details Edit Form */}
              <form onSubmit={handleSaveProfile} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">
                  Identity Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Username"
                    value={editProfile.username}
                    onChange={(e) =>
                      setEditProfile((p) => ({ ...p, username: e.target.value }))
                    }
                  />

                  <Input
                    label="Work Email Address"
                    type="email"
                    value={editProfile.workEmail}
                    onChange={(e) =>
                      setEditProfile((p) => ({ ...p, workEmail: e.target.value }))
                    }
                  />
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button type="submit" disabled={loading} className="px-6">
                    Save Changes
                  </Button>
                </div>
              </form>

              {/* Password Change Form */}
              <form onSubmit={handlePasswordChange} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-text-secondary" />
                  Update Password
                </h3>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showPass ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, current: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="New Password"
                      type={showPass ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, new: e.target.value }))
                      }
                    />
                    <Input
                      label="Confirm New Password"
                      type={showPass ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, confirm: e.target.value }))
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[11px] font-semibold text-brand hover:text-brand-secondary transition"
                  >
                    {showPass ? "Hide Passwords" : "Show Passwords"}
                  </button>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button type="submit" disabled={loading} className="px-6">
                    Change Password
                  </Button>
                </div>
              </form>

              {/* Danger Zone: Account Deletion */}
              <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-red-400">
                  Danger Zone
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Permanently delete your profile and monitoring account. All exceptions list details and risk logs stored in this environment will be deleted forever. This action is irreversible.
                </p>
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition shadow shadow-red-600/20"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CONFIRM DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-scaleIn">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-text-primary">
                  Delete Account Permanently?
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Are you absolutely sure? This will wipe your account credentials, monitoring lists, exclusions, and logs. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-border text-text-secondary hover:bg-border/40 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
