import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from '@samrum/vite-plugin-web-extension';
import { resolve } from 'path';
import * as packageJson from './package.json';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '../../.env.local') });

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_URL
    ),
    "process.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  },
  plugins: [
    webExtension({
      manifest: {
        name: "LinkLens Capture",
        description: "Save and summarize links with LinkLens.",
        version: packageJson.version,
        manifest_version: 3,
        permissions: ["storage", "tabs"],
        host_permissions: [
          "http://localhost:3000/*",
          "https://your-domain.com/*"
        ],
        externally_connectable: {
          "matches": [
            "http://localhost:3000/*",
            "https://your-domain.com/*"
          ]
        },
        action: {
          default_popup: 'src/popup/popup.html',
          default_icon: {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png',
            '128': 'icons/icon128.png'
          }
        },
        background: {
          service_worker: 'src/background.ts',
          type: 'module'
        },
        content_scripts: [
          {
            'matches': [
              '<all_urls>'
            ],
            'js': [
              'src/content.ts'
            ],
            'run_at': 'document_idle'
          }
        ],
        icons: {
          '16': 'icons/icon16.png',
          '48': 'icons/icon48.png',
          '128': 'icons/icon128.png'
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: 'inline',
  },
}); 