import { loadPlatformsState } from "../shared/platformStorage";

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

const logPostOrComment = (platform, kind, text) => {
  console.log(`[privAI][${platform}] New ${kind} text:`, text.trim());
  // TODO: Later send `text` to backend API (and optionally audio) for analysis.
};

const setupLinkedInMonitors = () => {
  if (linkedInListenersAttached) return;
  linkedInListenersAttached = true;

  console.log(
    "[privAI][linkedin] Initialising monitoring for posts and comments"
  );

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!target) return;

      const clickable = target.closest("button, [role='button']");
      if (!clickable) return;

      const label = normaliseLabel(clickable);

      const isPostAction =
        label.includes("post") ||
        label.includes("share") ||
        label.includes("start a post");
      const isCommentAction = label.includes("comment");
      
      console.log("Post action: ",isPostAction);
      

      if (!isPostAction && !isCommentAction) return;

      const text = getActiveComposerText();
      if (!text || !text.trim()) return;

      if (isPostAction) {
        console.log("In post action");
        logPostOrComment("linkedin", "post", text);
        logVideoIfPresent("linkedin");
      } else if (isCommentAction) {
        logPostOrComment("linkedin", "comment", text);
      }
    },
    true
  );
};

const setupFacebookMonitors = () => {
  if (facebookListenersAttached) return;
  facebookListenersAttached = true;

  console.log("[privAI][facebook] Initialising monitoring for posts/comments");

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!target) return;

      const clickable = target.closest("button, [role='button']");
      if (!clickable) return;

      const label = normaliseLabel(clickable);

      const isPostAction =
        label.includes("post") ||
        label.includes("share") ||
        label.includes("publish");
      const isCommentAction = label.includes("comment");

      if (!isPostAction && !isCommentAction) return;

      const text = getActiveComposerText();
      if (!text || !text.trim()) return;

      if (isPostAction) {
        logPostOrComment("facebook", "post", text);
        logVideoIfPresent("facebook");
      } else if (isCommentAction) {
        logPostOrComment("facebook", "comment", text);
      }
    },
    true
  );
};

const setupInstagramMonitors = () => {
  if (instagramListenersAttached) return;
  instagramListenersAttached = true;

  console.log("[privAI][instagram] Initialising monitoring for posts/comments");

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!target) return;

      const clickable = target.closest("button, [role='button']");
      if (!clickable) return;

      const label = normaliseLabel(clickable);

      const isPostAction =
        label.includes("share") ||
        label.includes("post") ||
        label.includes("next");
      const isCommentAction =
        label.includes("post") && label.includes("comment");

      if (!isPostAction && !isCommentAction) return;

      const text = getActiveComposerText();
      if (!text || !text.trim()) return;

      if (isPostAction) {
        logPostOrComment("instagram", "post", text);
        logVideoIfPresent("instagram");
      } else if (isCommentAction) {
        logPostOrComment("instagram", "comment", text);
      }
    },
    true
  );
};

const setupTwitterMonitors = () => {
  if (twitterListenersAttached) return;
  twitterListenersAttached = true;

  console.log("[privAI][twitter] Initialising monitoring for posts/comments");

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!target) return;

      const clickable = target.closest("button, [role='button']");
      if (!clickable) return;

      const label = normaliseLabel(clickable);

      const isPostAction =
        label.includes("post") ||
        label.includes("tweet") ||
        label.includes("reply") ||
        label.includes("send");
      const isCommentAction = label.includes("reply");

      if (!isPostAction && !isCommentAction) return;

      const text = getActiveComposerText();
      if (!text || !text.trim()) return;

      if (isPostAction && !isCommentAction) {
        logPostOrComment("twitter", "post", text);
      } else {
        logPostOrComment("twitter", "comment", text);
      }
    },
    true
  );
};

const getActiveComposerText = () => {
  const active = document.activeElement;
  if (
    active &&
    active.getAttribute &&
    active.getAttribute("role") === "textbox"
  ) {
    return active.innerText || active.textContent || "";
  }

  const boxes = Array.from(document.querySelectorAll("div[role='textbox']"));
  // Prefer the last visible textbox (often the one the user just interacted with)
  for (let i = boxes.length - 1; i >= 0; i -= 1) {
    const el = boxes[i];
    if (el && el.offsetParent !== null) {
      return el.innerText || el.textContent || "";
    }
  }

  return "";
};

const logVideoIfPresent = async (platform) => {
  const videos = Array.from(document.querySelectorAll("video"));
  if (!videos.length) return;

  const video = videos[0];
  const src = video.currentSrc || video.src || null;
  const duration = Number.isFinite(video.duration) ? video.duration : null;

  console.log(`[privAI][${platform}] Detected video for transcription`, {
    src,
    duration,
    muted: video.muted,
    hasAudioTrack: !video.muted, // heuristic only
  });

  if (!src) {
    console.warn("[privAI] No video src available to transcribe");
    return;
  }

  try {
    const videoResponse = await fetch(src);
    if (!videoResponse.ok) {
      console.warn(
        "[privAI] Failed to fetch video for transcription",
        videoResponse.status,
        videoResponse.statusText
      );
      return;
    }

    const blob = await videoResponse.blob();
    const formData = new FormData();
    // Best-effort filename and type; FastAPI only cares it's a file.
    const fileName = `post-video-${Date.now()}.mp4`;
    const file = new File([blob], fileName, { type: blob.type || "video/mp4" });
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/transcribe-video", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn(
        "[privAI] /transcribe-video request failed",
        response.status,
        response.statusText
      );
      return;
    }

    const data = await response.json().catch(() => null);
    console.log("[privAI] Transcription result:", data);
  } catch (error) {
    console.warn(
      "[privAI] Error while sending video to /transcribe-video",
      error
    );
  }
};

const getFacebookAccountInfo = () => {
  try {
    const url = new URL(window.location.href);
    let accountId = null;

    if (url.pathname.startsWith("/profile.php")) {
      accountId = url.searchParams.get("id");
    } else {
      const parts = url.pathname.split("/").filter(Boolean);
      accountId = parts[0] || null;
    }

    if (!accountId) return null;

    return {
      accountId,
      accountName: null,
    };
  } catch {
    return null;
  }
};

const getInstagramAccountInfo = () => {
  try {
    const url = new URL(window.location.href);
    const parts = url.pathname.split("/").filter(Boolean);
    const username = parts[0] || null;

    if (
      !username ||
      ["explore", "reels", "direct", "p", "accounts"].includes(username)
    ) {
      return null;
    }

    return {
      accountId: username,
      accountName: username,
    };
  } catch {
    return null;
  }
};
const getLinkedInAccountInfo = () => {
  // Prefer extracting the account from the current URL when on /in/<accountId>/.
  try {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.hostname.includes("linkedin.com")) {
      const parts = currentUrl.pathname.split("/").filter(Boolean);
      const inIndex = parts.indexOf("in");

      if (inIndex !== -1 && inIndex + 1 < parts.length) {
        const accountId = parts[inIndex + 1];

        const nameSelectors = [
          ".pv-text-details__left-panel h1",
          ".text-heading-xlarge",
          "header h1",
          "h1",
        ];

        let accountName = null;
        for (const selector of nameSelectors) {
          const el = document.querySelector(selector);
          if (el && el.textContent && el.textContent.trim()) {
            accountName = el.textContent.trim();
            break;
          }
        }

        return { accountId, accountName };
      }
    }
  } catch {
    // fall through to link-based heuristic below
  }

  // Fallback: look for profile links on the page (used on feed pages).
  const link =
    document.querySelector('a[href*="linkedin.com/in/"]') ||
    document.querySelector('a[href^="/in/"]');

  if (!link || !link.href) return null;

  try {
    const url = new URL(link.href, window.location.origin);
    const parts = url.pathname.split("/").filter(Boolean);
    const inIndex = parts.indexOf("in");
    if (inIndex === -1 || inIndex + 1 >= parts.length) return null;

    const accountId = parts[inIndex + 1];
    const accountName =
      link.getAttribute("aria-label") || link.innerText || null;

    return { accountId, accountName };
  } catch {
    return null;
  }
};

browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "privai:requestLinkedInAccount") {
    const info = getLinkedInAccountInfo();
    if (info?.accountId) {
      browser.runtime.sendMessage({
        type: "privai:finishConnect",
        platform: "linkedin",
        accountId: info.accountId,
        accountName: info.accountName,
      });
    }
  } else if (message?.type === "privai:requestFacebookAccount") {
    const info = getFacebookAccountInfo();
    if (info?.accountId) {
      browser.runtime.sendMessage({
        type: "privai:finishConnect",
        platform: "facebook",
        accountId: info.accountId,
        accountName: info.accountName,
      });
    }
  } else if (message?.type === "privai:requestInstagramAccount") {
    const info = getInstagramAccountInfo();
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

export const hostExtractor = async () => {
  const { hostname } = window.location;
  const parts = hostname.split(".");
  const siteName = parts[parts.length > 2 ? 1 : 0];

  console.log("[privAI] Current host:", hostname, "→ siteName:", siteName);

  if (siteName === "linkedin") {
    const platforms = await loadPlatformsState();
    const state = platforms.linkedin;

    if (!state?.connected || !state.monitor || !state.accountId) {
      console.log(
        "[privAI][linkedin] Not connected or monitoring disabled; skipping."
      );
      return siteName;
    }
    
    // const info = getLinkedInAccountInfo();
    // if (!info || info.accountId !== state.accountId) {
    //   console.log("Platform state: ",state);
    //   console.log(
    //     "[privAI][linkedin] Logged-in account does not match connected account; skipping."
    //   );
    //   return siteName;
    // }

    setupLinkedInMonitors();
  } else if (siteName === "facebook") {
    const platforms = await loadPlatformsState();
    const state = platforms.facebook;

    if (!state?.connected || !state.monitor || !state.accountId) {
      console.log(
        "[privAI][facebook] Not connected or monitoring disabled; skipping."
      );
      return siteName;
    }

    const info = getFacebookAccountInfo();
    if (!info || info.accountId !== state.accountId) {
      console.log(
        "[privAI][facebook] Logged-in account does not match connected account; skipping."
      );
      return siteName;
    }

    setupFacebookMonitors();
  } else if (siteName === "instagram") {
    const platforms = await loadPlatformsState();
    const state = platforms.instagram;

    if (!state?.connected || !state.monitor || !state.accountId) {
      console.log(
        "[privAI][instagram] Not connected or monitoring disabled; skipping."
      );
      return siteName;
    }

    const info = getInstagramAccountInfo();
    if (!info || info.accountId !== state.accountId) {
      console.log(
        "[privAI][instagram] Logged-in account does not match connected account; skipping."
      );
      return siteName;
    }

    setupInstagramMonitors();
  } else if (siteName === "twitter" || siteName === "x") {
    setupTwitterMonitors();
  }

  return siteName;
};
