import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// @ts-ignore - no types ship with this plugin
import prerender from "vite-plugin-prerender";

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
    // Pre-render public routes to fully populated static HTML so bots
    // (Google, ChatGPT, Perplexity, social link previews) see real content
    // instead of an empty <div id="root"></div>. Humans still get the full
    // hydrated React app with Framer Motion, custom cursor, etc.
    mode === "production" && prerender({
      staticDir: path.join(__dirname, "dist"),
      routes: ["/"],
      renderer: "@prerenderer/renderer-puppeteer",
      rendererOptions: {
        renderAfterTime: 3000,
        headless: "new",
        maxConcurrentRoutes: 1,
      },
      postProcess(renderedRoute: { html: string; route: string }) {
        // Strip the page loader & cursor from the static HTML so crawlers
        // (and link-preview screenshots) don't capture the orange splash.
        // The React app re-mounts everything on hydration for real users.
        renderedRoute.html = renderedRoute.html
          .replace(/<div[^>]*z-\[9999\][\s\S]*?<\/div>\s*<\/div>/g, "")
          .replace(/<div[^>]*data-custom-cursor[\s\S]*?<\/div>/g, "");
        return renderedRoute;
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
