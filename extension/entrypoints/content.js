import { hostExtractor } from "./content/host-extractor";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main() {
    try {
      await hostExtractor();
    } catch (error) {
      console.error("[privAI] hostExtractor failed", error);
    }
  },
});
