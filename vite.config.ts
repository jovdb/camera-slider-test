import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  base: process.env.CI ? '/camera-slider-test/' : '/',
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
