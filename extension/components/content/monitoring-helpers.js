import { PLATFORMS, loadPlatformsState } from "../shared/constants.js";
import {
  getActiveComposerText,
  logPostOrComment,
  logVideoIfPresent,
} from "./data-scrapers.js";

let linkedInListenersAttached = false;
let facebookListenersAttached = false;
let instagramListenersAttached = false;
let twitterListenersAttached = false;

const normaliseLabel = (el) => {
  if (!el) return "";
  const label =
    el.getAttribute("aria-label") ||
    el.getAttribute("aria-describedby") ||
    el.innerText ||
    el.textContent ||
    "";
  return label.toLowerCase().trim();
};

const setupMonitors = (siteName) => {
  if (siteName === "linkedin") {
    if (linkedInListenersAttached) return;
    linkedInListenersAttached = true;
  } else if (siteName === "facebook") {
    if (facebookListenersAttached) return;
    facebookListenersAttached = true;
  } else if (siteName === "instagram") {
    if (instagramListenersAttached) return;
    instagramListenersAttached = true;
  } else if (siteName === "twitter") {
    if (twitterListenersAttached) return;
    twitterListenersAttached = true;
  }
  console.log(
    `[privAI][${siteName}] Initialising monitoring for posts and comments`
  );

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!target) return;

      const clickable = target.closest("button, [role='button']");
      if (!clickable) return;

      const label = normaliseLabel(clickable);
      const postLabels = [
        "post",
        "share",
        "start a post",
        "publish",
        "tweet",
        "reply",
        "send",
      ];

      const isPostAction = postLabels.some((text) => label.includes(text));
      const isCommentAction =
        label.includes("comment") || label.includes("reply");

      console.log("Post action: ", isPostAction);

      if (!isPostAction && !isCommentAction) return;

      const text = getActiveComposerText();
      //if (!text || !text.trim()) return;

      if (isPostAction) {
        console.log("In post action");
        logPostOrComment(siteName, "post", text);
        logVideoIfPresent(siteName);
      } else if (isCommentAction) {
        logPostOrComment(siteName, "comment", text);
      }
    },
    true
  );
};

export const monitoringInitializer = async () => {
  const { hostname } = window.location;
  const parts = hostname.split(".");
  const siteName = parts[parts.length > 2 ? 1 : 0];

  console.log("[privAI] Current host:", hostname, "→ siteName:", siteName);

  if (PLATFORMS.includes(siteName)) {
    const platformStates = await loadPlatformsState();
    const state = platformStates[siteName];
    //console.log(state);

    if (!state?.connected || !state.monitor || !state.accountId) {
      console.log(
        `[privAI][${siteName}] Not connected or monitoring disabled; skipping.`
      );
      return siteName;
    }
    // const info = getAccountInfo(siteName);
    // if (!info || info.accountId !== state.accountId) {
    //   console.log("Platform state: ",state);
    //   console.log(
    //     `[privAI][${siteName}] Logged-in account does not match connected account; skipping.`
    //   );rn siteName;
    // }
    setupMonitors(siteName);
    //setupLinkedInMonitors();
  }
  return siteName;
};
