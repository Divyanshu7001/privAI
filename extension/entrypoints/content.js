import { monitoringInitializer } from "../components/content/monitoring-helpers";
import { getAccountInfo } from "../components/content/account-helpers";

// Attach listener as soon as the content script loads
browser.runtime.onMessage.addListener((message) => {
  let siteName = null,
    info = null;
  if (message?.type === "privai:requestLinkedInAccount") {
    info = getAccountInfo("linkedin");
    siteName = "linkedin";
  } else if (message?.type === "privai:requestFacebookAccount") {
    info = getAccountInfo("facebook");
    siteName = "facebook";
  } else if (message?.type === "privai:requestInstagramAccount") {
    info = getAccountInfo("instagram");
    siteName = "instagram";
  }
  if (info?.accountId) {
    browser.runtime.sendMessage({
      type: "privai:finishConnect",
      platform: siteName,
      accountId: info.accountId,
      accountName: info.accountName,
    });
  }
});

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main() {
    // Synchronize auth state if we are on localhost:5173
    if (window.location.host === "localhost:5173") {
      const syncAuth = () => {
        try {
          const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
          const pmUser = localStorage.getItem("pm_user");
          browser.storage.local.set({
            isAuthenticated,
            pm_user: pmUser ? JSON.parse(pmUser) : null,
          });
          console.log("[privAI] Synced auth state from page:", isAuthenticated);
        } catch (e) {
          console.warn("[privAI] Failed to sync auth state to browser storage:", e);
        }
      };

      // Run immediately
      syncAuth();

      // Listen for standard storage events
      window.addEventListener("storage", (e) => {
        if (e.key === "isAuthenticated" || e.key === "pm_user") {
          syncAuth();
        }
      });

      // Override setItem and removeItem to capture local changes immediately
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function (key, value) {
        originalSetItem.apply(this, arguments);
        if (key === "isAuthenticated" || key === "pm_user") {
          syncAuth();
        }
      };

      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = function (key) {
        originalRemoveItem.apply(this, arguments);
        if (key === "isAuthenticated" || key === "pm_user") {
          syncAuth();
        }
      };
    }

    try {
      await monitoringInitializer();
    } catch (error) {
      console.error("[privAI] hostExtractor failed", error);
    }
  },
});
