const { jsxLocPlugin } = require("@builder.io/vite-plugin-jsx-loc");
const tailwindcss = require("@tailwindcss/vite");
const react = require("@vitejs/plugin-react");
const path = require("path");
const { defineConfig } = require("vite");

const plugins = [react.default(), tailwindcss.default(), jsxLocPlugin()];

module.exports = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(__dirname),
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client", "public"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
