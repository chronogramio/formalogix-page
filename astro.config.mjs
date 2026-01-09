// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://formalogix.com',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),

  vite: {
    plugins: [
      tailwindcss({
        config: './tailwind.config.mjs'
      })
    ]
  },

  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })
  ]
});