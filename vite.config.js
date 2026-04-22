import { defineConfig } from 'vite'

export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/bloc1-presentation/' : '/',
    server: {
        port: 3000,
        open: true
    },
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.exr'],
    build: {
        target: 'esnext',
        assetsInlineLimit: 0
    }
})
