import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@pages": resolve(__dirname, "src", "pages")
      }
    },
    plugins: [
      react(),
      compression({ threshold: 20480, skipIfLargerOrEqual: true })
      // visualizer({ open: false })
    ],
    assetsInclude: ['**/*.woff2'],
    esbuild: {
      pure: ["console.log"],
      drop: ["debugger"]
    },
    build: {
      outDir: `dist/${mode}`,
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
              // return id
              //   .toString()
              //   .split("node_modules/")[1]
              //   .split("/")[0]
              //   .toString();
            }
          }
        }
      }
    },

    server: {
      proxy: {
        "/web": {
          changeOrigin: true,
          // mock代理目标地址
          target: "http://shunxinda.test.muke.design",
          ws: true
        }
      }
    }
  };
});
