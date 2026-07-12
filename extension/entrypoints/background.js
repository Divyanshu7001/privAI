import {
  initializeLinkedInConnectListener,
  updateLinkedInConnectionListener,
  resetLinkedInConnectionListener,
  linkedinConnectTabId,
} from "../components/background/linkedin-events";

import {
  initializeFacebookConnectListener,
  updateFacebookConnectionListener,
  resetFacebookConnectionListener,
  facebookConnectTabId,
} from "../components/background/facebook-events";

import {
  initializeInstagramConnectListener,
  updateInstagramConnectionListener,
  resetInstagramConnectionListener,
  instagramConnectTabId,
} from "../components/background/instagram-events";

import {
  loadPlatformsState,
  savePlatformsState,
} from "../components/shared/constants";

// Helper function to check auth status using JWT token in pm_cookie
const checkAuthInBackground = async () => {
  try {
    if (typeof browser === "undefined" || !browser.storage?.local || !browser.cookies) {
      return;
    }

    const cookie = await browser.cookies.get({
      url: "http://localhost:5173",
      name: "pm_cookie",
    });
    const cookieValue = cookie?.value;

    if (!cookieValue) {
      console.log("[privAI][background] No pm_cookie found. Logging out.");
      await browser.storage.local.set({ isAuthenticated: false, pm_user: null });
      return;
    }

    const res = await fetch(`http://localhost:5000/api/auth?cookie=${encodeURIComponent(cookieValue)}`);
    if (!res.ok) {
      throw new Error("Failed to verify credentials");
    }
    
    const data = await res.json();
    if (data.isAuthenticated) {
      console.log("[privAI][background] User is authenticated.", data.user);
      await browser.storage.local.set({ isAuthenticated: true, pm_user: data.user });
    } else {
      console.log("[privAI][background] Session invalid or expired.");
      await browser.storage.local.set({ isAuthenticated: false, pm_user: null });
    }
  } catch (e) {
    console.warn("[privAI][background] Background Auth verification failed:", e);
    // On network failure, we keep the existing local state to prevent false logouts
  }
};

export default defineBackground(() => {
  // Sync auth state on startup
  checkAuthInBackground();

  // Listen to cookie changes (login/logout from dashboard)
  if (typeof browser !== "undefined" && browser.cookies) {
    browser.cookies.onChanged.addListener((changeInfo) => {
      if (changeInfo.cookie.name === "pm_cookie") {
        console.log("[privAI][background] pm_cookie changed. Syncing auth state...");
        checkAuthInBackground();
      }
    });
  }

  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message?.type === "privai:startConnect") {
      if (message.platform === "linkedin") {
        initializeLinkedInConnectListener();
      }
      if (message.platform === "facebook") {
        initializeFacebookConnectListener();
      }
      if (message.platform === "instagram") {
        initializeInstagramConnectListener();
      }
    }

    if (message?.type === "privai:finishConnect") {
      console.log(message);

      const { platform, accountId, accountName } = message;
      if (!accountId || !platform) return;

      const current = await loadPlatformsState();
      const next = {
        ...current,
        [platform]: {
          ...(current[platform] || {}),
          connected: true,
          monitor: true,
          accountId,
          accountName: accountName || null,
        },
      };

      await savePlatformsState(next);
      console.log("[privAI][background] Connected account set", {
        platform,
        accountId,
        accountName,
      });
    }

    // Handle incident logging from content script
    if (message?.type === "privai:logIncident") {
      const { platform, type, title, remarks, action } = message;
      
      try {
        const stored = await browser.storage.local.get("isAuthenticated");
        if (!stored.isAuthenticated) {
          console.log("[privAI][background] User not authenticated; skipping incident log.");
          return;
        }

        const cookie = await browser.cookies.get({
          url: "http://localhost:5173",
          name: "pm_cookie",
        });
        const token = cookie?.value;

        if (token) {
          const res = await fetch("http://localhost:5000/api/risks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              platform,
              type,
              title,
              remarks,
              action
            })
          });
          if (res.ok) {
            console.log("[privAI][background] Flagged post logged to backend successfully.");
          } else {
            console.warn("[privAI][background] Backend failed to log incident:", res.statusText);
          }
        }
      } catch (err) {
        console.warn("[privAI][background] Failed to log incident to backend:", err);
      }
    }
  });

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tabId === linkedinConnectTabId) {
      await updateLinkedInConnectionListener(tabId, changeInfo, tab);
      return;
    }
    if (tabId === facebookConnectTabId) {
      await updateFacebookConnectionListener(tabId, changeInfo, tab);
      return;
    }
    if (tabId === instagramConnectTabId) {
      await updateInstagramConnectionListener(tabId, changeInfo, tab);
      return;
    }
  });

  browser.tabs.onRemoved.addListener((tabId) => {
    if (tabId === linkedinConnectTabId) {
      resetLinkedInConnectionListener();
      return;
    }
    if (tabId === facebookConnectTabId) {
      resetFacebookConnectionListener();
      return;
    }
    if (tabId === instagramConnectTabId) {
      resetInstagramConnectionListener();
      return;
    }
  });
});
