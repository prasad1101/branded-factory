import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The site is served from https://prasad1101.github.io/branded-factory/
  // so every asset path must start with '/branded-factory/'.
  // ⚠️ If you later connect a custom domain (e.g. www.brandedfactory.in),
  // change this to '/' and redeploy.
  base: '/branded-factory/',
})
