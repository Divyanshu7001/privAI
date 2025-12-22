export const getAccountInfo = (siteName) => {
  if (siteName === "linkedin") {
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
  }

  if (siteName === "facebook") {
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
  }

  if (siteName === "instagram") {
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
  }

  return null;
};
