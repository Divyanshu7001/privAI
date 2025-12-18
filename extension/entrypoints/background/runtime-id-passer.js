export const runTimeFetcher = () => {
  // This function is used to pass the runtime ID to the content script.
  // It is called in the background script.
  // The content script will use this ID to communicate with the background script.
  console.log("Runtime ID passer initialized", { id: browser.runtime.id });
  const getBrowserName = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox/")) return "firefox";
    if (ua.includes("Edg/")) return "edge";
    if (ua.includes("Chrome/")) return "chrome";
    if (ua.includes("OPR/") || ua.includes("Opera/")) return "opera";
    return "unknown";
  };

  const browserName = getBrowserName();
  console.log("Detected browser:", browserName);
  console.log("Runtime Data:", browser.runtime);
};
