// State for handling Facebook connect flow.
export let facebookConnectTabId = null;
let facebookConnectInProgress = false;
let facebookConnectWaitingForLogin = false;

const isFacebookLoginUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("facebook.com")) return false;
    const path = u.pathname || "";
    return (
      path.startsWith("/login") ||
      path.startsWith("/checkpoint/") ||
      path.includes("/login.php")
    );
  } catch {
    return false;
  }
};

const isFacebookFeedUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("facebook.com")) return false;
    const path = u.pathname || "/";
    // Home/feed pages typically are root or /home or /pages_feed
    return (
      path === "/" || path.startsWith("/home.php") || path.startsWith("/newsfeed.php")
    );
  } catch {
    return false;
  }
};

const isFacebookProfileUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("facebook.com")) return false;
    const path = u.pathname || "";
    // Simple heuristics: profile.php?id= or a single-segment username path
    if (path.startsWith("/profile.php")) return true;
    const parts = path.split("/").filter(Boolean);
    return parts.length === 1 && parts[0] !== "pages" && parts[0] !== "groups";
  } catch {
    return false;
  }
};

export const initializeFacebookConnectListener = async () => {
  if (facebookConnectInProgress) {
    console.warn(
      "[privAI][background] Facebook connect already in progress; ignoring duplicate request.",
    );
    return;
  }

  try {
    facebookConnectInProgress = true;
    const createdTab = await browser.tabs.create({
      url: "https://www.facebook.com/login",
      active: true,
    });

    if (!createdTab.id) {
      console.warn("[privAI][background] Failed to create Facebook login tab");
      facebookConnectInProgress = false;
      return;
    }

    facebookConnectTabId = createdTab.id;
    facebookConnectWaitingForLogin = true;
  } catch (error) {
    console.warn(
      "[privAI][background] Failed to open Facebook login tab",
      error,
    );
    facebookConnectInProgress = false;
  }
};

export const updateFacebookConnectionListener = async (
  tabId,
  changeInfo,
  tab,
) => {
  const url = changeInfo.url || tab.url;
  if (!url || !url.includes("facebook.com")) return;

  if (isFacebookLoginUrl(url)) {
    facebookConnectWaitingForLogin = true;
    return;
  }

  if (
    facebookConnectWaitingForLogin &&
    isFacebookFeedUrl(url) &&
    changeInfo.status === "complete"
  ) {
    // Once we see the feed/home, ask content script to extract the account info from the page DOM.
    try {
      await browser.tabs.sendMessage(tabId, {
        type: "privai:requestFacebookAccount",
      });
    } catch (error) {
      console.warn(
        "[privAI][background] Failed to message Facebook feed tab",
        error,
      );
    } finally {
      resetFacebookConnectionListener();
    }
    return;
  }

  if (isFacebookProfileUrl(url) && changeInfo.status === "complete") {
    try {
      await browser.tabs.sendMessage(tabId, {
        type: "privai:requestFacebookAccount",
      });
    } catch (error) {
      console.warn(
        "[privAI][background] Failed to message Facebook profile tab",
        error,
      );
    } finally {
      resetFacebookConnectionListener();
    }
  }
};

export const resetFacebookConnectionListener = () => {
  facebookConnectInProgress = false;
  facebookConnectTabId = null;
  facebookConnectWaitingForLogin = false;
};
