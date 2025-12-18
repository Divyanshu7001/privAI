//import { runTimeFetcher } from "./background/runtime-id-passer";
import {
  loadPlatformsState,
  savePlatformsState,
} from "./shared/platformStorage";

export default defineBackground(() => {
  //console.log("Hello background!", { id: browser.runtime.id });
  //runTimeFetcher();

  // State for handling LinkedIn connect flow.
  let linkedinConnectInProgress = false;
  let linkedinConnectTabId = null;
  let linkedinConnectWaitingForLogin = false;
  let linkedinConnectRetriedProfile = false;

  const isLinkedInLoginUrl = (url) => {
    if (!url) return false;
    try {
      const u = new URL(url);
      if (!u.hostname.includes("linkedin.com")) return false;
      const path = u.pathname || "";
      console.log("path value: ",path);
      
      return (
        path.startsWith("/login") ||
        path.startsWith("/checkpoint/") ||
        path.includes("/uas/login")
      );
    } catch {
      return false;
    }
  };

  const isLinkedInProfileUrl = (url) => {
    if (!url) return false;
    try {
      const u = new URL(url);
      if (!u.hostname.includes("linkedin.com")) return false;
      const parts = u.pathname.split("/").filter(Boolean);
      const inIndex = parts.indexOf("in");
      return inIndex !== -1 && inIndex + 1 < parts.length;
    } catch {
      return false;
    }
  };

  const isLinkedInLandingUrl = (url) => {
    if (!url) return false;
    try {
      const u = new URL(url);
      if (!u.hostname.includes("linkedin.com")) return false;
      const parts = u.pathname.split("/").filter(Boolean);
      // Treat only the locale landing variant like /in/?_l=en_US as "landing".
      // A real profile at /in/<accountId>/ should NOT match here.
      const isInRoot = parts.length === 1 && parts[0] === "in";
      const hasLocaleParam = u.searchParams.has("_l");
      return isInRoot && hasLocaleParam;
    } catch {
      return false;
    }
  };

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tabId !== linkedinConnectTabId) return;

    const url = changeInfo.url || tab.url;
    if (!url || !url.includes("linkedin.com")) return;

    // When /in resolves to a generic landing page (e.g. /in/?_l=en_US),
    // the user is not logged in. Redirect this tab to the login page and
    if (isLinkedInLandingUrl(url)) {
      try {
        await browser.tabs.create({
          url: "https://www.linkedin.com/login",
          active: true,
        });
        
        linkedinConnectWaitingForLogin = true;
        linkedinConnectRetriedProfile = false;
      } catch (error) {
        console.warn(
          "[privAI][background] Failed to redirect LinkedIn tab to login",
          error
        );
        linkedinConnectTabId = null;
        linkedinConnectWaitingForLogin = false;
        linkedinConnectRetriedProfile = false;
        linkedinConnectInProgress = false;
      }
      return;
    }
    console.log("Sending this url: ",url);
    
    // If we're on login, wait for the user to complete login.
    if (isLinkedInLoginUrl(url)) {
      linkedinConnectWaitingForLogin = true;
      return;
    }
    
    console.log("After login wait");
    console.log(changeInfo);
    console.log("Waiting status: ",linkedinConnectWaitingForLogin);
    console.log("Retried profile status: ",linkedinConnectRetriedProfile);
    
    // After login completes (URL changes away from login), retry opening /in once.
    if (
      linkedinConnectWaitingForLogin &&
      !linkedinConnectRetriedProfile &&
      changeInfo.status === "complete" &&
      !isLinkedInLoginUrl(url)
    ) {
      linkedinConnectRetriedProfile = true;
      try {
        await browser.tabs.update(tabId, {
          url: "https://www.linkedin.com/in/",
        });
      } catch (error) {
        console.warn(
          "[privAI][background] Failed to reopen LinkedIn /in profile",
          error
        );
        linkedinConnectTabId = null;
        linkedinConnectWaitingForLogin = false;
        linkedinConnectRetriedProfile = false;
        linkedinConnectInProgress = false;
      }
      return;
    }

    // Once we're on the user's profile page, request account info from content script.
    if (isLinkedInProfileUrl(url) && changeInfo.status === "complete") {
      try {
        await browser.tabs.sendMessage(tabId, {
          type: "privai:requestLinkedInAccount",
        });
      } catch (error) {
        console.warn(
          "[privAI][background] Failed to message LinkedIn profile tab",
          error
        );
      } finally {
        linkedinConnectTabId = null;
        linkedinConnectWaitingForLogin = false;
        linkedinConnectRetriedProfile = false;
        linkedinConnectInProgress = false;
      }
    }
  });

  browser.tabs.onRemoved.addListener((tabId) => {
    if (tabId === linkedinConnectTabId) {
      linkedinConnectTabId = null;
      linkedinConnectWaitingForLogin = false;
      linkedinConnectRetriedProfile = false;
      linkedinConnectInProgress = false;
    }
  });

  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message?.type === "privai:startConnect") {
      if (message.platform === "linkedin") {
        // Prevent multiple overlapping LinkedIn connect flows.
        if (linkedinConnectInProgress) {
          console.warn(
            "[privAI][background] LinkedIn connect already in progress; ignoring duplicate request."
          );
          return;
        }

        try {
          linkedinConnectInProgress = true;
          const createdTab = await browser.tabs.create({
            url: "https://linkedin.com/in/",
            active: true,
          });

          if (!createdTab.id) {
            console.warn(
              "[privAI][background] Failed to create LinkedIn /in tab"
            );
            linkedinConnectInProgress = false;
            return;
          }

          linkedinConnectTabId = createdTab.id;
          linkedinConnectWaitingForLogin = false;
          linkedinConnectRetriedProfile = false;
        } catch (error) {
          console.warn(
            "[privAI][background] Failed to open LinkedIn /in tab",
            error
          );
          linkedinConnectInProgress = false;
        }
      } else if (message.platform === "facebook") {
        const tabs = await browser.tabs.query({
          url: "*://www.facebook.com/*",
        });
        for (const tab of tabs) {
          if (!tab.id) continue;
          try {
            await browser.tabs.sendMessage(tab.id, {
              type: "privai:requestFacebookAccount",
            });
          } catch (error) {
            console.warn(
              "[privAI][background] Failed to message Facebook tab",
              error
            );
          }
        }
      } else if (message.platform === "instagram") {
        const tabs = await browser.tabs.query({
          url: "*://www.instagram.com/*",
        });
        for (const tab of tabs) {
          if (!tab.id) continue;
          try {
            await browser.tabs.sendMessage(tab.id, {
              type: "privai:requestInstagramAccount",
            });
          } catch (error) {
            console.warn(
              "[privAI][background] Failed to message Instagram tab",
              error
            );
          }
        }
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

      console.log("[privAI][background] Saving connected account", {
        platform,
        accountId,
        accountName,
      });

      await savePlatformsState(next);
      console.log("[privAI][background] Connected account set", {
        platform,
        accountId,
        accountName,
      });

      const stateAfterSave = await loadPlatformsState();
      console.log(
        "[privAI][background] State after save:",
        stateAfterSave[platform]
      );
    }
  });
});
