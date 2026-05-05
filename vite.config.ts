import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE permite servir o build sob path diferente (ex: /app/ no FastAPI)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
