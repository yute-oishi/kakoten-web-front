import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    env: {
      VITE_AMEDAS_OBSLIST_URL:
        "https://www.jma.go.jp/bosai/amedas/const/amedastable.json",
      VITE_BACKEND_BASE_URL: "https://kako-ten.com/prod",
    },
    baseUrl: "http://localhost:5173",
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
