import { PLATFORMS, loadPlatformsState } from "../shared/constants.js";
import {
  getActiveComposerText,
  logPostOrComment,
  logVideoIfPresent,
} from "./data-scrapers.js";

let linkedInListenersAttached = false;
let facebookListenersAttached = false;
let instagramListenersAttached = false;

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

const platformSelectors = {
  linkedin: "div.feed-shared-update-v2, article",
  facebook: "div[role='article'], [data-ad-preview='message']",
  instagram: "article"
};

const injectCSS = () => {
  if (document.getElementById("privai-blur-styles")) return;
  const style = document.createElement("style");
  style.id = "privai-blur-styles";
  style.innerHTML = `
    .privai-post-wrapper {
      position: relative !important;
    }
    .privai-overlay {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 1000 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      font-family: system-ui, -apple-system, sans-serif !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      transition: all 0.5s ease-in-out !important;
      padding: 20px !important;
      box-sizing: border-box !important;
    }
    .privai-overlay-loading {
      background: rgba(15, 23, 42, 0.45) !important;
      backdrop-filter: blur(10px) !important;
      -webkit-backdrop-filter: blur(10px) !important;
    }
    .privai-overlay-warning {
      background: rgba(15, 23, 42, 0.94) !important;
      backdrop-filter: blur(28px) !important;
      -webkit-backdrop-filter: blur(28px) !important;
      border: 1px solid rgba(239, 68, 68, 0.25) !important;
    }
    
    /* Skeleton Layout */
    .privai-skeleton-card {
      width: 80% !important;
      max-width: 400px !important;
      background: rgba(255, 255, 255, 0.08) !important;
      border-radius: 12px !important;
      padding: 16px !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
    }
    .privai-skeleton-header {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
    }
    .privai-skeleton-avatar {
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      background: rgba(255, 255, 255, 0.15) !important;
      animation: privai-pulse 1.5s infinite ease-in-out !important;
    }
    .privai-skeleton-meta {
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
    }
    .privai-skeleton-line-sm {
      height: 10px !important;
      width: 40% !important;
      border-radius: 4px !important;
      background: rgba(255, 255, 255, 0.15) !important;
      animation: privai-pulse 1.5s infinite ease-in-out !important;
    }
    .privai-skeleton-line-md {
      height: 10px !important;
      width: 70% !important;
      border-radius: 4px !important;
      background: rgba(255, 255, 255, 0.15) !important;
      animation: privai-pulse 1.5s infinite ease-in-out !important;
    }
    .privai-skeleton-body {
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
    }
    .privai-skeleton-line-lg {
      height: 12px !important;
      width: 100% !important;
      border-radius: 4px !important;
      background: rgba(255, 255, 255, 0.15) !important;
      animation: privai-pulse 1.5s infinite ease-in-out !important;
    }
    
    .privai-loading-text {
      color: #f1f5f9 !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      text-align: center !important;
      margin-top: 8px !important;
      letter-spacing: 0.5px !important;
    }
    
    /* Warning Layout */
    .privai-warning-card {
      width: 90% !important;
      max-width: 420px !important;
      text-align: center !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 16px !important;
      color: #f8fafc !important;
      animation: privai-scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .privai-warning-icon {
      font-size: 40px !important;
      color: #ef4444 !important;
      animation: privai-bounce 2s infinite !important;
    }
    .privai-warning-title {
      font-size: 18px !important;
      font-weight: 700 !important;
      color: #f8fafc !important;
      margin: 0 !important;
    }
    .privai-warning-desc {
      font-size: 13px !important;
      color: #cbd5e1 !important;
      line-height: 1.5 !important;
      margin: 0 !important;
    }
    .privai-warning-btn {
      background: #ef4444 !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 9999px !important;
      padding: 10px 24px !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.4) !important;
    }
    .privai-warning-btn:hover {
      background: #dc2626 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.6) !important;
    }
    .privai-warning-btn:active {
      transform: translateY(0) !important;
    }
    
    @keyframes privai-pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    @keyframes privai-scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes privai-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
  `;
  document.head.appendChild(style);
};

const startBlurringSimulation = (siteName) => {
  injectCSS();
  
  const processedElements = new WeakSet();
  
  const findPosts = () => {
    const posts = [];
    if (siteName === "linkedin") {
      const headings = document.querySelectorAll("h2");
      headings.forEach((h2) => {
        // LinkedIn posts have an h2 containing a span with "Feed post"
        if (h2.textContent.includes("Feed post")) {
          const postCard = h2.closest("[role='listitem']") || h2.closest(".privai-post-wrapper") || h2.parentElement?.parentElement;
          if (postCard && !posts.includes(postCard)) {
            posts.push(postCard);
          }
        }
      });
      // Standard LinkedIn feed update container fallback
      const fallbacks = document.querySelectorAll("div.feed-shared-update-v2, article");
      fallbacks.forEach(f => {
        if (!posts.includes(f)) posts.push(f);
      });
    } else {
      const selector = platformSelectors[siteName] || "article";
      const found = document.querySelectorAll(selector);
      found.forEach(p => posts.push(p));
    }
    return posts;
  };
  
  const processNewPosts = () => {
    const posts = findPosts();
    posts.forEach((post) => {
      if (processedElements.has(post)) return;
      processedElements.add(post);
      
      // Mark wrapper
      post.classList.add("privai-post-wrapper");
      
      // Inject loading overlay
      const overlay = document.createElement("div");
      overlay.className = "privai-overlay privai-overlay-loading";
      
      overlay.innerHTML = `
        <div class="privai-skeleton-card">
          <div class="privai-skeleton-header">
            <div class="privai-skeleton-avatar"></div>
            <div class="privai-skeleton-meta">
              <div class="privai-skeleton-line-sm"></div>
              <div class="privai-skeleton-line-md"></div>
            </div>
          </div>
          <div class="privai-skeleton-body">
            <div class="privai-skeleton-line-lg"></div>
            <div class="privai-skeleton-line-lg" style="width: 85% !important;"></div>
          </div>
          <div class="privai-loading-text">privAI is checking post safety...</div>
        </div>
      `;
      
      // Apply initial light blur to content children
      const childrenToBlur = Array.from(post.children);
      childrenToBlur.forEach(child => {
        child.style.filter = "blur(8px)";
        child.style.transition = "filter 0.5s ease-in-out";
      });
      
      post.appendChild(overlay);
      
      // Simulate 10 seconds loading
      setTimeout(() => {
        // 35% chance of being sensitive / violence / AI sexual content
        const isSensitive = Math.random() < 0.35;
        
        if (isSensitive) {
          overlay.className = "privai-overlay privai-overlay-warning";
          
          const warningTypes = [
            "Warning: Sensitive content detected ahead.",
            "Warning: Violence / disturbing media detected ahead.",
            "Warning: AI-generated sexual content detected ahead."
          ];
          const randomWarning = warningTypes[Math.floor(Math.random() * warningTypes.length)];
          
          overlay.innerHTML = `
            <div class="privai-warning-card">
              <div class="privai-warning-icon">🛡️</div>
              <h4 class="privai-warning-title">Shielded by privAI</h4>
              <p class="privai-warning-desc">${randomWarning}</p>
              <button class="privai-warning-btn">Continue Anyway</button>
            </div>
          `;
          
          // Log initial block to backend
          if (typeof browser !== "undefined" && browser.runtime?.sendMessage) {
            browser.runtime.sendMessage({
              type: "privai:logIncident",
              platform: siteName,
              type: "text",
              title: "Blocked Feed Post",
              remarks: randomWarning,
              action: "acknowledged"
            }).catch(e => console.warn("[privAI] Failed to log incident:", e));
          }
          
          // Apply heavy blur to content children
          childrenToBlur.forEach(child => {
            child.style.filter = "blur(28px)";
          });
          
          const btn = overlay.querySelector(".privai-warning-btn");
          if (btn) {
            btn.addEventListener("click", () => {
              overlay.style.opacity = "0";
              childrenToBlur.forEach(child => {
                child.style.filter = "none";
              });
              
              // Log continued override to backend
              if (typeof browser !== "undefined" && browser.runtime?.sendMessage) {
                browser.runtime.sendMessage({
                  type: "privai:logIncident",
                  platform: siteName,
                  type: "text",
                  title: "Blocked Feed Post",
                  remarks: randomWarning,
                  action: "continued anyway"
                }).catch(e => console.warn("[privAI] Failed to update incident log:", e));
              }
              
              setTimeout(() => {
                overlay.remove();
              }, 500);
            });
          }
        } else {
          // Post is safe, fade out and remove overlay
          overlay.style.opacity = "0";
          childrenToBlur.forEach(child => {
            child.style.filter = "none";
          });
          setTimeout(() => {
            overlay.remove();
          }, 500);
        }
      }, 10000);
    });
  };
  
  // Process immediately
  processNewPosts();
  
  // Continuously watch for background scroll posts
  const observer = new MutationObserver(() => {
    processNewPosts();
  });
  observer.observe(document.body, { childList: true, subtree: true });
};


export const monitoringInitializer = async () => {
  const { hostname } = window.location;
  const parts = hostname.split(".");
  const siteName = parts[parts.length > 2 ? 1 : 0];

  console.log("[privAI] Current host:", hostname, "→ siteName:", siteName);

  if (PLATFORMS.includes(siteName)) {
    // Check global monitoring authorization first
    let allowed = false;
    if (typeof browser !== "undefined" && browser.storage?.local) {
      try {
        const res = await browser.storage.local.get("monitoringAllowed");
        allowed = !!res.monitoringAllowed;
      } catch (e) {
        console.warn("[privAI] Failed to read monitoringAllowed:", e);
      }
    }
    
    if (!allowed) {
      console.log(`[privAI][${siteName}] General monitoring not authorized; skipping.`);
      return siteName;
    }

    const platformStates = await loadPlatformsState();
    const state = platformStates[siteName];

    if (!state?.connected || !state.monitor || !state.accountId) {
      console.log(
        `[privAI][${siteName}] Not connected or monitoring disabled; skipping.`
      );
      return siteName;
    }
    setupMonitors(siteName);
    
    // Check if user is authenticated (real-time synced from cookies)
    let isAuthenticated = false;
    if (typeof browser !== "undefined" && browser.storage?.local) {
      try {
        const authStore = await browser.storage.local.get("isAuthenticated");
        isAuthenticated = !!authStore.isAuthenticated;
      } catch (e) {
        console.warn("[privAI] Failed to read isAuthenticated from storage:", e);
      }
    }

    if (isAuthenticated) {
      console.log(`[privAI][${siteName}] User authenticated; enabling feed filtering simulation.`);
      startBlurringSimulation(siteName);
    } else {
      console.log(`[privAI][${siteName}] User not authenticated; skipping feed filtering simulation.`);
    }
  }
  return siteName;
};

