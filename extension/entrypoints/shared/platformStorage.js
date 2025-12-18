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
