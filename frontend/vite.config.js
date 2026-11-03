import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 라이브러리는 첫 화면용 vendor와 지도용 map 두 조각으로만 나눈다.
// 더 잘게 나누면 조각끼리 서로 import 하는 순환이 생겨 React가 준비되기 전에 실행될 수 있다.
const MAP_PACKAGES = ["leaflet", "react-leaflet", "@react-leaflet/core", "supercluster", "kdbush"];
const PACKAGE_IN_PATH = /node_modules[\\/](@[^\\/]+[\\/][^\\/]+|[^\\/]+)/;

const chunkFor = (id) => {
  const pkg = id.match(PACKAGE_IN_PATH)?.[1].replace(/\\/g, "/");
  if (pkg) return MAP_PACKAGES.includes(pkg) ? "map" : "vendor";
  // CommonJS 변환 도우미 같은 가상 모듈은 vendor에 두어 index ↔ vendor 순환을 막는다
  if (id.startsWith("\0") || id.includes("commonjsHelpers")) return "vendor";
  return undefined;
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: chunkFor,
      },
    },
  },
});
