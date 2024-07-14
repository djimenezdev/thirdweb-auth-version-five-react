import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import jsconfigPaths from "vite-jsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), jsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/webhook": {
        target:
          "https://api.defender.openzeppelin.com/actions/96111d03-3823-45c7-b478-e8052ae7abac/runs/webhook/5028f470-6d91-44f2-a46a-bdd3c0eec651/6eJ2gLp3A91AupsiWsCqqe",
        changeOrigin: true,
      },
    },
  },
});
