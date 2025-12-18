import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],

  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
  manifest: {
    name: "privAI",
    description: "Saving you from sharing private info online.",
    version: "0.0.0",
    permissions: ["storage", "tabs", "scripting"],
  },
});
