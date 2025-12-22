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
    try {
      await monitoringInitializer();
    } catch (error) {
      console.error("[privAI] hostExtractor failed", error);
    }
  },
});
