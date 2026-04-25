import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // ── Pre-rendering (production only) ──────────────────────────────
    // Outputs fully populated static HTML for each public route so that
    // bots (Google, ChatGPT, Perplexity, Twitter/X, Facebook, LinkedIn)
    // see the real DOM instead of an empty <div id="root"></div>.
    // Humans still receive the full hydrated React app — Framer Motion,
    // CustomCursor, Lenis smooth scroll, and PuzzleGame all run on the
    // client exactly as before.
    mode === "production" &&
      prerender({
        routes: ["/"],
        renderer: new PuppeteerRenderer({
          renderAfterTime: 3000,
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          maxConcurrentRoutes: 1,
        }),
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
