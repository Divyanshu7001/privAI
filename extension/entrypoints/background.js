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

export default defineBackground(() => {
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
