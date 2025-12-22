import { useState, useEffect } from "react";
import {
  ThemeSelector,
  useThemeStyles,
  useTheme,
} from "../../components/ui/Theme.jsx";
import {
  INITIAL_PLATFORMS,
  loadPlatformsState,
} from "../../components/shared/constants.js";
import { Platforms } from "../../components/ui/Platforms.jsx";
import { Header } from "../../components/ui/Header.jsx";

export const App = () => {
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

  const activePlatforms = Object.values(platforms)
    .filter((p) => p.connected && p.enabled)
    .map((p) => p.name);

  return (
    <div className={themeStyles.outer}>
      <div className={themeStyles.card}>
        <Header
          themeStyles={themeStyles}
          isLight={isLight}
          setThemeOpen={setThemeOpen}
        />

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

        <Platforms
          setPlatforms={setPlatforms}
          platforms={platforms}
          isLight={isLight}
          activePlatforms={activePlatforms}
          monitoringAllowed={monitoringAllowed}
        />

        <footer className="flex pt-1">
          <p className="text-[10px] text-zinc-500">
            You can adjust these preferences anytime in privAI.
          </p>
        </footer>
      </div>
    </div>
  );
};
