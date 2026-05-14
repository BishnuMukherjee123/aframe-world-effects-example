import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function copy8thWallPlugin() {
  return {
    name: 'copy-8thwall',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'node_modules/@8thwall')
      const destDir = path.resolve(__dirname, 'dist/node_modules/@8thwall')
      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true })
        fs.cpSync(srcDir, destDir, { recursive: true })
        console.log('Successfully copied 8th Wall native modules to production build!')
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copy8thWallPlugin()],
  // Serve 8th Wall scripts from public/
  publicDir: 'public',
})
// hii