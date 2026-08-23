import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const securityHeaders = {
  "Content-Security-Policy": "frame-ancestors 'none'",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // Keep the development server local by default. Use an explicit host at
    // the command line only when testing from another device.
    host: "127.0.0.1",
    port: 8080,
    headers: securityHeaders,
  },
  preview: { headers: securityHeaders },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
