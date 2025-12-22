import React from "react";
import {
  PLATFORM_ICONS,
  PLATFORM_COLORS,
  loadPlatformsState,
  savePlatformsState,
} from "../shared/constants.js";

export const Platforms = ({
  platforms,
  setPlatforms,
  isLight,
  activePlatforms,
  monitoringAllowed,
}) => {
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

  return (
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
            isLight ? "text-[11px] text-zinc-500" : "text-[11px] text-zinc-400"
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
  );
};
