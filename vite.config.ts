/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    test: {
        environment: 'jsdom',
        setupFiles: './setupTest.ts',
        globals: true,
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5501',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
