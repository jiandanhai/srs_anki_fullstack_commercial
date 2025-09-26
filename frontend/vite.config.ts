import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // 强制 IPv4 localhost
    port: 5173,
    strictPort: true,
    open: true,
    hmr: {
      host: '127.0.0.1', // HMR 绑定 localhost
    }
  },
  resolve: {
    alias: {
      // 强制所有模块都使用同一份 react / react-dom
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    }
  }
})
