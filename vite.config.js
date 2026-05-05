import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

const r = p => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/bloc1-presentation/' : '/',
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    },
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.exr'],
    build: {
        target: 'esnext',
        assetsInlineLimit: 0,
        rollupOptions: {
            input: {
                main: r('./index.html'),
                portfolio: r('./portfolio/index.html'),
            }
        }
    }
})
