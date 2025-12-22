import { monitoringInitializer } from "./content/monitoring-helpers";
import { getAccountInfo } from "./content/account-helpers";

// Attach listener as soon as the content script loads
browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "privai:requestLinkedInAccount") {
    const info = getAccountInfo("linkedin");
    if (info?.accountId) {
      browser.runtime.sendMessage({
        type: "privai:finishConnect",
        platform: "linkedin",
        accountId: info.accountId,
        accountName: info.accountName,
      });
    }
  } else if (message?.type === "privai:requestFacebookAccount") {
    const info = getAccountInfo("facebook");
    if (info?.accountId) {
      browser.runtime.sendMessage({
        type: "privai:finishConnect",
        platform: "facebook",
        accountId: info.accountId,
        accountName: info.accountName,
      });
    }
  } else if (message?.type === "privai:requestInstagramAccount") {
    const info = getAccountInfo("instagram");
    if (info?.accountId) {
      browser.runtime.sendMessage({
        type: "privai:finishConnect",
        platform: "instagram",
        accountId: info.accountId,
        accountName: info.accountName,
      });
    }
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
