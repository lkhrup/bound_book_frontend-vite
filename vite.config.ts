import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    nodePolyfills({
      exclude: ['http'],
      globals: {
        Buffer: true,
      },
    }),
    wasm(),
    topLevelAwait()
  ],
});
