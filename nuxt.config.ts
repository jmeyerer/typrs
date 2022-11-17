// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'typr | work in progress',
      meta: [
        { name: 'description', content: 'The typing game for XTREME typers ༅(⌐■₀̶■)' }
      ]
    },
  },
  pages: true,
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  vue: {
    config: {
      productionTip: true,
      devtools: false
    }
  },
  modules: ["@nuxtjs/tailwindcss"],
  buildModules: [
  ],
  css: [
    '~/assets/style/main.css'
  ],
});
  