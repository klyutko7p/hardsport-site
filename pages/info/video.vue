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
  <div class="pt-64 mx-auto container">
    <h1 class="text-7xl max-lg:text-6xl max-md:text-5xl max-sm:text-4xl max-[400px]:text-2xl text-center uppercase">
      Онлайн-тренировки <br />
      НА HARDSPORT
    </h1>
    <p class="text-center text-xl max-sm:text-lg mt-5">
      Следуйте за нашими профессиональными тренерами и экспертами, получайте
      мотивацию и вдохновение, и двигайтесь к своим целям вместе с нами.
    </p>
    <div class="flex items-center justify-center gap-10 mt-10">
      <UIRegistrationButton>Начать тренировку</UIRegistrationButton>
    </div>
    <video autoplay muted loop id="background-video">
      <source src="@/assets/videos/video-section-video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div class="mt-[450px] mb-5 max-2xl:mt-[350px] max-md:px-5">
      <h1 class="text-center text-4xl">Преимущества онлайн-тренировок</h1>
      <div class="flex max-lg:flex-col items-start mt-10 justify-between">
        <div>
          <p class="mt-10 text-2xl mb-3">
            <span class="text-3xl text-hover-color font-bold">Гибкость:</span>
            Тренируйтесь в любое удобное для вас время, не выходя из дома.
          </p>
          <p class="text-2xl mb-3">
            <span class="text-3xl text-hover-color font-bold">
              Разнообразие:</span
            >
            Изучайте различные виды активности и находите те, которые вам больше
            всего нравятся.
          </p>
          <p class="text-2xl mb-3">
            <span class="text-3xl text-hover-color font-bold">
              Эффективность:</span
            >
            Получайте качественные тренировки под руководством опытных тренеров,
            что поможет вам достичь своих целей быстрее и эффективнее.
          </p>
          <div class="flex items-center justify-center gap-10 mt-16">
            <UIRegistrationButton>Начать тренировку</UIRegistrationButton>
          </div>
        </div>
        <img
          class="max-w-[800px] max-lg:w-full"
          src="@/assets/images/img-section-1-video.jpg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

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
