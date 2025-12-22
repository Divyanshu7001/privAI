import {
  initializeLinkedInConnectListener,
  updateLinkedInConnectionListener,
  resetLinkedInConnectionListener,
  linkedinConnectTabId,
} from "../components/background/linkedin-events";

import {
  loadPlatformsState,
  savePlatformsState,
} from "../components/shared/constants";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message?.type === "privai:startConnect") {
      if (message.platform === "linkedin") {
        // Prevent multiple overlapping LinkedIn connect flows.
        initializeLinkedInConnectListener();
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
  });

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tabId === linkedinConnectTabId) {
      await updateLinkedInConnectionListener(tabId, changeInfo, tab);
    }
  });

  browser.tabs.onRemoved.addListener((tabId) => {
    if (tabId === linkedinConnectTabId) {
      resetLinkedInConnectionListener();
    }
  });
});
