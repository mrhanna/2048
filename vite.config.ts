/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(Date.now()),
  },
  base: './',
  plugins: [react()],
  test: {
    globals: true, // Enables Jest-like global APIs (describe, it, expect)
  },
})
