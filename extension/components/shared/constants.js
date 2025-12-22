import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export const PLATFORMS = ["linkedin", "facebook", "instagram", "twitter", "x"];

export const INITIAL_PLATFORMS = {
  facebook: { name: "Facebook", connected: false, enabled: false },
  instagram: { name: "Instagram", connected: false, enabled: false },
  twitter: { name: "Twitter", connected: false, enabled: false },
  linkedin: { name: "LinkedIn", connected: false, enabled: false },
};

export const PLATFORM_ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
};

export const PLATFORM_COLORS = {
  facebook: "text-[#1877F2] bg-[#E8F1FF]",
  instagram: "text-[#E1306C] bg-[#FFE6F0]",
  twitter: "text-[#1DA1F2] bg-[#E5F4FF]",
  linkedin: "text-[#0A66C2] bg-[#E3F0FF]",
};

export const STORAGE_KEY = "privai-theme";

export const THEME_OPTIONS = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "purple", label: "Purple" },
  { id: "teal", label: "Teal" },
];

export const THEME_STYLES = {
  dark: {
    outer:
      "min-h-[360px] w-[400px] rounded-sm bg-gradient-to-br from-zinc-900 via-zinc-700 to-neutral-800 p-3 text-zinc-50",
    card: "relative flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-black/40 p-4 shadow-xl backdrop-blur-sm",
    tagline: "text-xs text-center text-zinc-300",
  },
  light: {
    outer:
      "min-h-[360px] w-[400px] rounded-sm bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-3 text-zinc-900",
    card: "relative flex h-full flex-col gap-4 rounded-xl border border-rose-200 bg-rose-50/95 p-4 shadow-xl backdrop-blur-sm",
    tagline: "text-xs text-center text-zinc-500",
  },
  purple: {
    outer:
      "min-h-[360px] w-[400px] rounded-sm bg-gradient-to-br from-violet-900 via-fuchsia-800 to-slate-900 p-3 text-violet-50",
    card: "relative flex h-full flex-col gap-4 rounded-xl border border-violet-400/40 bg-violet-950/60 p-4 shadow-xl backdrop-blur-sm",
    tagline: "text-xs text-center text-violet-200",
  },
  teal: {
    outer:
      "min-h-[360px] w-[400px] rounded-sm bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 p-3 text-emerald-50",
    card: "relative flex h-full flex-col gap-4 rounded-xl border border-emerald-400/40 bg-slate-950/70 p-4 shadow-xl backdrop-blur-sm",
    tagline: "text-xs text-center text-emerald-200",
  },
};

export const PLATFORM_STORAGE_KEY = "privai.platforms";

export const DEFAULT_PLATFORM_STATE = {
  facebook: {
    connected: false,
    monitor: false,
    accountId: null,
    accountName: null,
  },
  instagram: {
    connected: false,
    monitor: false,
    accountId: null,
    accountName: null,
  },
  twitter: {
    connected: false,
    monitor: false,
    accountId: null,
    accountName: null,
  },
  linkedin: {
    connected: false,
    monitor: false,
    accountId: null,
    accountName: null,
  },
};

export async function loadPlatformsState() {
  const api = globalThis.browser ?? globalThis.chrome ?? null;
  if (!api || !api.storage || !api.storage.local) {
    console.warn(
      "[privAI][storage] browser.storage.local is not available; using defaults only"
    );
    return { ...DEFAULT_PLATFORM_STATE };
  }

  const stored = await api.storage.local.get(PLATFORM_STORAGE_KEY);
  const raw = stored?.[PLATFORM_STORAGE_KEY] || {};
  return { ...DEFAULT_PLATFORM_STATE, ...raw };
}

export async function savePlatformsState(state) {
  const api = globalThis.browser ?? globalThis.chrome ?? null;
  if (!api || !api.storage || !api.storage.local) {
    console.warn(
      "[privAI][storage] browser.storage.local is not available; skipping save"
    );
    return;
  }

  await api.storage.local.set({ [PLATFORM_STORAGE_KEY]: state });
}
