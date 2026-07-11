// State for handling Instagram connect flow.
export let instagramConnectTabId = null;
let instagramConnectInProgress = false;
let instagramConnectWaitingForLogin = false;

const isInstagramLoginUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("instagram.com")) return false;
    const path = u.pathname || "";
    return (
      path.startsWith("/accounts/login") || path.includes("/accounts/login/")
    );
  } catch {
    return false;
  }
};

const isInstagramFeedUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("instagram.com")) return false;
    const path = u.pathname || "/";
    // Feed is typically root or /explore etc.
    return (
      path === "/" || path.startsWith("/explore") || path.startsWith("/stories")
    );
  } catch {
    return false;
  }
};

const isInstagramProfileUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("instagram.com")) return false;
    const parts = u.pathname.split("/").filter(Boolean);
    if (!parts.length) return false;
    const first = parts[0];
    const exclude = [
      "explore",
      "reels",
      "direct",
      "p",
      "accounts",
      "stories",
      "tags",
    ];
    return !exclude.includes(first) && parts.length >= 1;
  } catch {
    return false;
  }
};

export const initializeInstagramConnectListener = async () => {
  if (instagramConnectInProgress) {
    console.warn(
      "[privAI][background] Instagram connect already in progress; ignoring duplicate request.",
    );
    return;
  }

  try {
    instagramConnectInProgress = true;
    const createdTab = await browser.tabs.create({
      url: "https://www.instagram.com/accounts/login/",
      active: true,
    });

    if (!createdTab.id) {
      console.warn("[privAI][background] Failed to create Instagram login tab");
      instagramConnectInProgress = false;
      return;
    }

    instagramConnectTabId = createdTab.id;
    instagramConnectWaitingForLogin = true;
  } catch (error) {
    console.warn(
      "[privAI][background] Failed to open Instagram login tab",
      error,
    );
    instagramConnectInProgress = false;
  }
};

export const updateInstagramConnectionListener = async (
  tabId,
  changeInfo,
  tab,
) => {
  const url = changeInfo.url || tab.url;
  if (!url || !url.includes("instagram.com")) return;

  if (isInstagramLoginUrl(url)) {
    instagramConnectWaitingForLogin = true;
    return;
  }

  if (
    instagramConnectWaitingForLogin &&
    isInstagramFeedUrl(url) &&
    changeInfo.status === "complete"
  ) {
    try {
      // On feed, ask content script to extract account info from DOM/fallback anchors.
      await browser.tabs.sendMessage(tabId, {
        type: "privai:requestInstagramAccount",
      });
    } catch (error) {
      console.warn(
        "[privAI][background] Failed to message Instagram feed tab",
        error,
      );
    } finally {
      resetInstagramConnectionListener();
    }
    return;
  }

  if (isInstagramProfileUrl(url) && changeInfo.status === "complete") {
    try {
      await browser.tabs.sendMessage(tabId, {
        type: "privai:requestInstagramAccount",
      });
    } catch (error) {
      console.warn(
        "[privAI][background] Failed to message Instagram profile tab",
        error,
      );
    } finally {
      resetInstagramConnectionListener();
    }
  }
};

export const resetInstagramConnectionListener = () => {
  instagramConnectInProgress = false;
  instagramConnectTabId = null;
  instagramConnectWaitingForLogin = false;
};
