import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, User, Edit2, X, Save } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { getUserProfile, updateUserProfile, getRiskData, logoutUser } from "../api/auth";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [riskStats, setRiskStats] = useState([]);
  const [profile, setProfile] = useState({
    username: "",
    workEmail: "",
    personalEmails: [],
    phones: [],
  });
  const [editProfile, setEditProfile] = useState({
    username: "",
    personalEmails: [],
    phones: [],
  });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        const riskData = await getRiskData();

        setProfile({
          username: userData.workIdentity?.username || "",
          workEmail: userData.workIdentity?.workEmail || "",
          personalEmails: userData.monitoringContacts?.personalEmails || [],
          phones: userData.monitoringContacts?.phones || [],
        });

        setEditProfile({
          username: userData.workIdentity?.username || "",
          personalEmails: userData.monitoringContacts?.personalEmails || [],
          phones: userData.monitoringContacts?.phones || [],
        });

        setRiskStats(riskData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxValue = useMemo(
    () =>
      Math.max(
        1,
        ...riskStats.map((r) => r.email + r.phone + r.address)
      ),
    [riskStats]
  );

  const totalIncidents = useMemo(
    () =>
      riskStats.reduce(
        (sum, r) => sum + r.email + r.phone + r.address,
        0
      ),
    [riskStats]
  );

  const handleProfileChange = (field, index, value) => {
    setEditProfile((prev) => {
      if (Array.isArray(prev[field])) {
        const arr = [...prev[field]];
        arr[index] = value;
        return { ...prev, [field]: arr };
      }
      return { ...prev, [field]: value };
    });
  };

  const addProfileArrayItem = (field) => {
    setEditProfile((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeProfileArrayItem = (field, index) => {
    setEditProfile((prev) => {
      const arr = [...prev[field]].filter((_, i) => i !== index);
      return { ...prev, [field]: arr };
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updated = await updateUserProfile({
        workIdentity: {
          ...profile,
          username: editProfile.username,
        },
        monitoringContacts: {
          personalEmails: editProfile.personalEmails.filter((e) => e.trim() !== ""),
          phones: editProfile.phones.filter((p) => p.trim() !== ""),
        },
      });

      setProfile({
        ...profile,
        username: editProfile.username,
        personalEmails: editProfile.personalEmails.filter((e) => e.trim() !== ""),
        phones: editProfile.phones.filter((p) => p.trim() !== ""),
      });

      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditProfile({
      username: profile.username,
      personalEmails: [...profile.personalEmails],
      phones: [...profile.phones],
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutUser();
      toast.success("Logged out successfully.");
      navigate("/register");
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  if (loading && riskStats.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-300">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-950">PM</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Privacy Monitor
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 flex items-center justify-center text-xs font-bold text-slate-950">
                {getInitials(profile.username)}
              </div>
              <span className="text-xs text-slate-300 hidden sm:block">
                {profile.username}
              </span>
            </div>
            <Button
              variant="ghost"
              className="text-xs px-3 py-1.5"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8 space-y-6 lg:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-xs text-slate-400">
              Monitor your personal data exposure and manage your privacy settings.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left 2/3: Charts and Stats */}
          <section className="lg:col-span-2 space-y-4">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4">
                <p className="text-xs text-cyan-100/90">Total Incidents</p>
                <p className="mt-1 text-2xl font-bold text-cyan-100">
                  {totalIncidents}
                </p>
                <p className="text-[11px] text-cyan-100/70 mt-1">
                  Across all data types
                </p>
              </div>
              <div className="rounded-xl border border-violet-500/40 bg-violet-500/10 p-4">
                <p className="text-xs text-violet-100/90">Tracked Emails</p>
                <p className="mt-1 text-2xl font-bold text-violet-100">
                  {profile.personalEmails.length}
                </p>
                <p className="text-[11px] text-violet-100/70 mt-1">
                  Personal addresses monitored
                </p>
              </div>
              <div className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/10 p-4">
                <p className="text-xs text-fuchsia-100/90">Tracked Phones</p>
                <p className="mt-1 text-2xl font-bold text-fuchsia-100">
                  {profile.phones.length}
                </p>
                <p className="text-[11px] text-fuchsia-100/70 mt-1">
                  Phone numbers monitored
                </p>
              </div>
            </div>

            {/* Monthly Risk Chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold">
                    Monthly Risk Timeline
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Email, phone, and address risks detected per month
                  </p>
                </div>
                <div className="flex gap-3 text-[11px] text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Email
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Phone
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Address
                  </span>
                </div>
              </div>

              <div className="h-56 flex items-end gap-2 border-t border-b border-slate-800 py-4">
                {riskStats.map((r) => {
                  const total = r.email + r.phone + r.address;
                  const height = total ? (total / maxValue) * 100 : 0;
                  const emailH = total ? (r.email / total) * height : 0;
                  const phoneH = total ? (r.phone / total) * height : 0;
                  const addressH = total ? (r.address / total) * height : 0;

                  return (
                    <div
                      key={r.month}
                      className="flex flex-col items-center flex-1 gap-1"
                    >
                      <div className="relative flex w-4 sm:w-5 flex-col overflow-hidden rounded-full bg-slate-800/80 h-full">
                        {addressH > 0 && (
                          <div
                            className="bg-amber-400"
                            style={{ height: `${addressH}%` }}
                          />
                        )}
                        {phoneH > 0 && (
                          <div
                            className="bg-emerald-400"
                            style={{ height: `${phoneH}%` }}
                          />
                        )}
                        {emailH > 0 && (
                          <div
                            className="bg-cyan-400"
                            style={{ height: `${emailH}%` }}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {r.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {totalIncidents === 0 && (
                <p className="mt-3 text-[11px] text-slate-400 text-center">
                  No incidents detected yet. Your monitored data will appear here once risks are found.
                </p>
              )}
            </div>
          </section>

          {/* Right 1/3: Profile Settings */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Profile Settings</h2>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs px-2 py-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Username"
                    value={editProfile.username}
                    onChange={(e) =>
                      setEditProfile((p) => ({ ...p, username: e.target.value }))
                    }
                  />

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-300">
                      Personal emails
                    </p>
                    {editProfile.personalEmails.map((val, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={val}
                          onChange={(e) =>
                            handleProfileChange(
                              "personalEmails",
                              idx,
                              e.target.value
                            )
                          }
                          placeholder="personal@example.com"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2"
                          onClick={() => removeProfileArrayItem("personalEmails", idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[11px] px-2 py-1"
                      onClick={() => addProfileArrayItem("personalEmails")}
                    >
                      + Add email
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-300">
                      Phone numbers
                    </p>
                    {editProfile.phones.map((val, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={val}
                          onChange={(e) =>
                            handleProfileChange("phones", idx, e.target.value)
                          }
                          placeholder="+1 555 000 0000"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2"
                          onClick={() => removeProfileArrayItem("phones", idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[11px] px-2 py-1"
                      onClick={() => addProfileArrayItem("phones")}
                    >
                      + Add phone
                    </Button>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 text-xs justify-center"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 text-xs justify-center"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Username</p>
                    <p className="text-sm text-slate-100">{profile.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Work Email</p>
                    <p className="text-sm text-slate-100">{profile.workEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Personal Emails ({profile.personalEmails.length})
                    </p>
                    <div className="space-y-1">
                      {profile.personalEmails.length > 0 ? (
                        profile.personalEmails.map((email, idx) => (
                          <p key={idx} className="text-xs text-slate-300">
                            {email}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">None added</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Phone Numbers ({profile.phones.length})
                    </p>
                    <div className="space-y-1">
                      {profile.phones.length > 0 ? (
                        profile.phones.map((phone, idx) => (
                          <p key={idx} className="text-xs text-slate-300">
                            {phone}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">None added</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;

