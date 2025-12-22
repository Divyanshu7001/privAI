// State for handling LinkedIn connect flow.
export let linkedinConnectTabId = null;
let linkedinConnectInProgress = false;
let linkedinConnectWaitingForLogin = false;
let linkedinConnectRetriedProfile = false;

const isLinkedInLoginUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("linkedin.com")) return false;
    const path = u.pathname || "";
    console.log("path value: ", path);

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

const isLinkedInFeedUrl = (url) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("linkedin.com")) return false;
    const path = u.pathname || "";
    return path.startsWith("/feed");
  } catch {
    return false;
  }
};

export const initializeLinkedInConnectListener = async () => {
  if (linkedinConnectInProgress) {
    console.warn(
      "[privAI][background] LinkedIn connect already in progress; ignoring duplicate request."
    );
    return;
  }

  try {
    linkedinConnectInProgress = true;
    const createdTab = await browser.tabs.create({
      // Start from /login:
      // - If already logged in, LinkedIn redirects to /feed
      // - If not logged in, user completes login, then redirects to /feed
      // In both cases we watch for /feed, then go to /in.
      url: "https://www.linkedin.com/login",
      active: true,
    });

    if (!createdTab.id) {
      console.warn("[privAI][background] Failed to create LinkedIn /in tab");
      linkedinConnectInProgress = false;
      return;
    }

    linkedinConnectTabId = createdTab.id;
    linkedinConnectWaitingForLogin = true;
    linkedinConnectRetriedProfile = false;
  } catch (error) {
    console.warn("[privAI][background] Failed to open LinkedIn /in tab", error);
    linkedinConnectInProgress = false;
  }
};

export const updateLinkedInConnectionListener = async (
  tabId,
  changeInfo,
  tab
) => {
  const url = changeInfo.url || tab.url;
  if (!url || !url.includes("linkedin.com")) return;

  // If we're on login, wait for the user to complete login.
  if (isLinkedInLoginUrl(url)) {
    linkedinConnectWaitingForLogin = true;
    return;
  }

  // Once we see /feed while waiting, the user is logged in (or was already
  // logged in). From here, go to /in to resolve to their profile.
  if (
    linkedinConnectWaitingForLogin &&
    !linkedinConnectRetriedProfile &&
    isLinkedInFeedUrl(url) &&
    changeInfo.status === "complete"
  ) {
    linkedinConnectRetriedProfile = true;
    linkedinConnectWaitingForLogin = false;
    try {
      await browser.tabs.update(tabId, {
        url: "https://www.linkedin.com/in/",
      });
    } catch (error) {
      console.warn(
        "[privAI][background] Failed to navigate to LinkedIn /in profile",
        error
      );
      resetLinkedInConnectionListener();
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
      resetLinkedInConnectionListener();
    }
  }
};

export const resetLinkedInConnectionListener = () => {
  linkedinConnectInProgress = false;
  linkedinConnectTabId = null;
  linkedinConnectWaitingForLogin = false;
  linkedinConnectRetriedProfile = false;
};
