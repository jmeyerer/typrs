// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
  