import { useState, useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import {
  ThemeSelector,
  useThemeStyles,
  useTheme,
} from "../../components/ui/Theme.jsx";
import {
  INITIAL_PLATFORMS,
  PLATFORM_ICONS,
  PLATFORM_COLORS,
  loadPlatformsState,
  savePlatformsState,
} from "../../components/shared/constants.js";

function App() {
  const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);
  const [themeOpen, setThemeOpen] = useState(false);
  const [monitoringAllowed, setMonitoringAllowed] = useState(false); // false by default until user authorizes
  const themeStyles = useThemeStyles();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  useEffect(() => {
    (async () => {
      try {
        const stored = await loadPlatformsState();
        // Load monitoring consent flag (if present) from browser storage.
        if (typeof browser !== "undefined" && browser.storage?.local) {
          try {
            const { monitoringAllowed: storedConsent } =
              await browser.storage.local.get("monitoringAllowed");
            if (typeof storedConsent === "boolean") {
              setMonitoringAllowed(storedConsent);
            } else {
              setMonitoringAllowed(false);
            }
          } catch (error) {
            console.warn(
              "[privAI][popup] Failed to load monitoring consent from storage",
              error
            );
            setMonitoringAllowed(false);
          }
        } else {
          setMonitoringAllowed(false);
        }
        setPlatforms((prev) => {
          const next = { ...prev };
          for (const key of Object.keys(prev)) {
            const storedPlatform = stored[key];
            if (!storedPlatform) continue;
            next[key] = {
              ...prev[key],
              connected:
                storedPlatform.connected ?? prev[key]?.connected ?? false,
              enabled: storedPlatform.monitor ?? prev[key]?.enabled ?? false,
            };
          }
          return next;
        });
      } catch (error) {
        console.warn(
          "[privAI][popup] Failed to load platform state from storage",
          error
        );
      }
    })();
  }, []);

  const persistMonitoringAllowed = async (value) => {
    setMonitoringAllowed(value);
    if (typeof browser !== "undefined" && browser.storage?.local) {
      try {
        await browser.storage.local.set({ monitoringAllowed: value });
      } catch (error) {
        console.warn(
          "[privAI][popup] Failed to persist monitoring consent to storage",
          error
        );
      }
    }
  };

  const handleToggle = async (key) => {
    if (!monitoringAllowed) return;
    let nextState;
    setPlatforms((prev) => {
      const current = prev[key];
      if (!current?.connected) {
        nextState = prev;
        return prev;
      }
      const updated = {
        ...prev,
        [key]: { ...current, enabled: !current.enabled },
      };
      nextState = updated;
      return updated;
    });

    try {
      const stored = await loadPlatformsState();
      const platformStored = stored[key] || {};
      const shouldMonitor = nextState?.[key]?.enabled ?? false;
      const updatedStored = {
        ...stored,
        [key]: {
          ...platformStored,
          monitor: shouldMonitor,
        },
      };
      await savePlatformsState(updatedStored);
    } catch (error) {
      console.warn(
        "[privAI][popup] Failed to persist toggle state to storage",
        error
      );
    }
  };

  const handleConnect = async (key) => {
    if (!monitoringAllowed) return;
    let nextState;
    setPlatforms((prev) => {
      const current = prev[key];
      const updated = {
        ...prev,
        [key]: { ...current, connected: true, enabled: true },
      };
      nextState = updated;
      return updated;
    });

    try {
      const stored = await loadPlatformsState();
      const platformStored = stored[key] || {};
      const updatedStored = {
        ...stored,
        [key]: {
          ...platformStored,
          connected: true,
          monitor: true,
        },
      };
      await savePlatformsState(updatedStored);
    } catch (error) {
      console.warn(
        "[privAI][popup] Failed to persist connect state to storage",
        error
      );
    }

    if (
      ["linkedin", "facebook", "instagram"].includes(key) &&
      typeof browser !== "undefined" &&
      browser.runtime?.sendMessage
    ) {
      browser.runtime
        .sendMessage({ type: "privai:startConnect", platform: key })
        .catch((error) => {
          console.warn("[privAI][popup] Failed to start connect flow", error);
        });
    }
  };

  const activePlatforms = Object.values(platforms)
    .filter((p) => p.connected && p.enabled)
    .map((p) => p.name);

  return (
    <div className={themeStyles.outer}>
      <div className={themeStyles.card}>
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-semibold tracking-wide">privAI</span>
            <p className={themeStyles.tagline}>
              protecting data , making you aware
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemeOpen((prev) => !prev)}
              className={
                isLight
                  ? "flex h-8 w-8 items-center justify-center rounded-full border border-black/50 bg-gray/20 text-xs text-zinc-700 shadow-sm hover:bg-rose-100"
                  : "flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-xs text-zinc-200 shadow-sm hover:bg-black/60"
              }
              aria-label="Change theme"
            >
              <FiSettings className="h-4 w-4" />
            </button>
            <div className="relative group">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-400 text-xs font-semibold text-zinc-900 shadow-md"
              >
                P
              </button>
              <div className="invisible absolute right-0 z-10 top-full w-40 rounded-xl border border-white/10 bg-zinc-900/95 p-1 text-xs text-zinc-100 opacity-0 shadow-lg ring-1 ring-black/40 transition duration-150 group-hover:visible group-hover:opacity-100">
                <a
                  href="https://example.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 hover:bg-zinc-800/80"
                >
                  Dashboard
                </a>
                <a
                  href="https://example.com/profile"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 flex w-full cursor-pointer items-center rounded-lg px-3 py-2 hover:bg-zinc-800/80"
                >
                  Profile settings
                </a>
              </div>
            </div>
          </div>
        </header>

        {!monitoringAllowed && (
          <div className="mt-2 rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            <p className="mb-1 font-medium">
              Monitoring is currently disabled.
            </p>
            <p className="mb-2">
              To let privAI watch your social posts and transcribe videos,
              please allow monitoring.
            </p>
            <button
              type="button"
              onClick={() => persistMonitoringAllowed(true)}
              className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-medium text-white hover:bg-amber-600"
            >
              Authorize monitoring
            </button>
          </div>
        )}

        <ThemeSelector open={themeOpen} onClose={() => setThemeOpen(false)} />

        <section className="mt-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2
              className={
                isLight
                  ? "text-sm font-semibold text-zinc-800"
                  : "text-sm font-semibold text-zinc-50"
              }
            >
              Platforms
            </h2>
            <span
              className={
                isLight
                  ? "text-[11px] text-zinc-500"
                  : "text-[11px] text-zinc-400"
              }
            >
              {activePlatforms.length} active
            </span>
          </div>

          <div className="space-y-2">
            {Object.entries(platforms).map(([key, platform]) => {
              const Icon = PLATFORM_ICONS[key];
              const colorClasses =
                PLATFORM_COLORS[key] ??
                "text-zinc-900 bg-gradient-to-br from-zinc-100 to-zinc-400";
              return (
                <div
                  key={key}
                  className={
                    isLight
                      ? "flex items-center justify-between rounded-xl border border-rose-200/80 bg-white px-3 py-2 shadow-sm"
                      : "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${colorClasses}`}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : platform.name[0]}
                    </div>
                    <div>
                      <p
                        className={
                          isLight
                            ? "text-sm font-medium text-zinc-800"
                            : "text-sm font-medium text-zinc-50"
                        }
                      >
                        {platform.name}
                      </p>
                      <p
                        className={
                          isLight
                            ? "text-[11px] text-zinc-500"
                            : "text-[11px] text-zinc-400"
                        }
                      >
                        {platform.connected
                          ? platform.enabled
                            ? "Monitoring enabled"
                            : "Monitoring paused"
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div>
                    {platform.connected ? (
                      <button
                        type="button"
                        onClick={() => handleToggle(key)}
                        disabled={!monitoringAllowed}
                        className={
                          platform.enabled
                            ? isLight
                              ? "rounded-full bg-gradient-to-r from-rose-500 to-rose-300 px-3 py-1 text-[11px] font-medium text-white shadow-sm"
                              : "rounded-full bg-gradient-to-r from-zinc-50 to-zinc-300 px-3 py-1 text-[11px] font-medium text-zinc-900 shadow-sm"
                            : isLight
                            ? "rounded-full border border-rose-300 px-3 py-1 text-[11px] font-medium text-rose-500 hover:border-rose-400 hover:bg-rose-50"
                            : "rounded-full border border-white/40 px-3 py-1 text-[11px] font-medium text-zinc-100 hover:border-white hover:bg-white/10"
                        }
                      >
                        {platform.enabled ? "On" : "Off"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleConnect(key)}
                        disabled={!monitoringAllowed}
                        className={
                          isLight
                            ? `rounded-full border px-3 py-1 text-[11px] font-medium text-black ${
                                !monitoringAllowed
                                  ? "border-zinc-300 text-zinc-400 cursor-not-allowed"
                                  : "border-zinc-500"
                              }`
                            : `rounded-full border px-3 py-1 text-[11px] font-medium text-zinc-100 ${
                                !monitoringAllowed
                                  ? "border-white/10 text-zinc-500 cursor-not-allowed"
                                  : "border-white/40 hover:border-white hover:bg-white/10"
                              }`
                        }
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="flex pt-1">
          <p className="text-[10px] text-zinc-500">
            You can adjust these preferences anytime in privAI.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
