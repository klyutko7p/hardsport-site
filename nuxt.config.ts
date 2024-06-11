// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      tokenTelegramBot: '7007585786:AAEjBaueBcxv3N5M-PSHx3dzn001JLHVP8Q'
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
