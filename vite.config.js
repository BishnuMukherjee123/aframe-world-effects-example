import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Serve 8th Wall scripts from public/
  publicDir: 'public',
})
