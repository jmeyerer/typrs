// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'typr | work in progress',
      meta: [
        { name: 'description', content: 'The typing game for XTREME typers ༅(⌐■₀̶■)' }
      ]
    },
  },
  pages: true,
  pageTransition: {'page-fade': true },
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
  plugins: [
    '~/plugins/fontawesome.js'
  ],
  css: [
    '~/assets/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
});
  