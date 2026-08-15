import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA build. Output goes to /dist and can be drag&dropped to Netlify / Cloudflare Pages.
export default defineConfig({
  plugins: [react()],
  // Allow JSX inside .js files (project keeps hooks/services as .js per spec).
  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  build: { outDir: 'dist', sourcemap: false },
})
