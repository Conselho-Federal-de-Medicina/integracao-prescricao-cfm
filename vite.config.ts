/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'prescricaoCfm',
            fileName: 'bundle',
            formats: ['es', 'iife']
        },
        sourcemap: true
    },
    plugins: [dts()],
    test: {
        browser: {
            enabled: true,
            name: 'chrome'
        }
    }
});