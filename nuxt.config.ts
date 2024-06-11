// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      tokenTelegramBot: '6511240958:AAFPHI8_G6m3f2jf7Vs8JV1pl6_8yBpN8Qk'
    },
  },
  ssr: false,
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@formkit/auto-animate/nuxt",
    "@nuxtjs/supabase",
    "nuxt-swiper",
    "nuxt-aos",
  ],
  css: ["~/assets/css/main.css"],
  build: {
    transpile: ["vue-toastification"],
  },
  supabase: {
    redirect: false,
  },
  aos: {
    disable: "mobile",
  },
});
