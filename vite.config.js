import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves the site from /myfirstproject/
  base: command === 'build' ? '/myfirstproject/' : '/',
  server: {
    port: 5177,
    strictPort: true,
    open: true,
  },
}))
