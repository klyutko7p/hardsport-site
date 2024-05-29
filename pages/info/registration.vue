<script setup lang="ts">
const router = useRouter();

useHead({
  bodyAttrs: {
    class: 'bg-black text-white'
  }
})

</script>

<template>
  <Head>
    <Title>Регистрация в HardSport</Title>
  </Head>
  <video autoplay muted loop id="background-video">
    <source
      src="@/assets/videos/1DX Mark III - Cinematic Gym Fitness Video.mp4"
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
  <div class="pt-64">
    <h1
      class="text-7xl max-lg:text-6xl max-md:text-5xl max-sm:text-4xl max-[400px]:text-2xl text-center"
    >
      ЗАРЕГИСТРИРУЙТЕСЬ <br />
      НА HARDSPORT
    </h1>
    <p class="text-center text-xl max-sm:text-lg mt-5">
      Вам больше не придётся искать фитнес лучше!
    </p>
    <div class="flex items-center justify-center gap-10 mt-10 max-sm:mt-5">
      <UIRegistrationButton @click="router.push('/auth/registration')"
        >Зарегистрироваться</UIRegistrationButton
      >
    </div>

    <div class="bg-black">
      <div class="mt-[450px] mx-auto container pb-5 max-2xl:mt-[350px] max-md:px-5">
        <h1 class="text-center text-4xl max-sm:text-2xl">
          Краткое описание преимуществ регистрации
        </h1>
        <div
          class="flex items-start mt-16 max-md:mt-10 max-xl:flex-col max-xl:justify-center justify-between"
        >
          <div>
            <p class="text-3xl max-sm:text-2xl max-[400px]:text-base">
              Регистрация в
              <span class="text-hover-color font-bold">HardSport</span> открывает двери к
              миру фитнеса и здорового образа жизни. Получите доступ к персонализированным
              программам тренировок, отслеживайте свой прогресс, бронируйте услуги клуба и
              общайтесь с нашим сообществом единомышленников -
              <span class="text-hover-color font-bold">все это в одном месте,</span>
              для вашего удобства.
            </p>
            <div class="max-xl:hidden flex items-center justify-center gap-10 mt-24">
              <UIRegistrationButton @click="router.push('/auth/registration')"
                >Зарегистрироваться</UIRegistrationButton
              >
            </div>
          </div>
          <div class="max-xl:mx-auto">
            <img
              class="max-w-[600px] max-xl:max-w-[400px] max-[400px]:w-full"
              src="@/assets/images/img-section-1-registration.jpg"
              alt=""
            />
          </div>
          <div
            class="max-xl:flex hidden max-xl:mx-auto items-center justify-center gap-10 mt-10"
          >
            <UIRegistrationButton @click="router.push('/auth/registration')"
              >Зарегистрироваться</UIRegistrationButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#background-video {
  position: absolute;
  right: 0;
  bottom: 0;
  top: -50px;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  object-fit: cover;
  background-size: cover;
}
</style>
