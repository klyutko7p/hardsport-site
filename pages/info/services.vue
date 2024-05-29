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
      Онлайн-бронирование услуг <br />
      НА HARDSPORT
    </h1>
    <p class="text-center text-xl max-sm:text-lg mt-5">
      Наслаждайтесь удобством и гибкостью нашей системы онлайн-бронирования,
      чтобы сделать ваше фитнес-путешествие еще более приятным и эффективным.
    </p>
    <div class="flex items-center justify-center gap-10 mt-10 max-sm:mt-5">
      <UIRegistrationButton>ЗАБРОНИРОВАТЬ</UIRegistrationButton>
    </div>
    <video autoplay muted loop id="background-video">
      <source
        src="@/assets/videos/video-section-services.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
    <div class="mt-[450px] mb-5 max-2xl:mt-[350px] max-md:px-5">
      <h1 class="text-center text-4xl">Как это работает</h1>
      <div class="flex items-start mt-16 max-lg:mt-5 justify-between gap-10 max-lg:flex-col">
        <div>
          <div class="my-10">
            <p class="mb-3 text-3xl">Выберите услугу:</p>
            <ul class="list-disc">
              <li class="text-lg">
                Изучите наш список доступных услуг, включая персональные
                тренировки, массаж, сауну и другие.
              </li>
              <li class="text-lg">Найдите то, что подходит именно вам.</li>
            </ul>
          </div>
          <div class="my-10">
            <p class="mb-3 text-3xl">Выберите время:</p>
            <ul class="list-disc">
              <li class="text-lg">
                Выберите удобное для вас время и дату из доступных слотов.
              </li>
              <li class="text-lg">
                Убедитесь, что выбранное время соответствует вашим планам.
              </li>
            </ul>
          </div>
          <div class="mt-10 mb-3">
            <p class="mb-3 text-3xl">Забронируйте:</p>
            <ul class="list-disc">
              <li class="text-lg">Введите свои данные для бронирования.</li>
              <li class="text-lg">
                Подтвердите бронь, и готово! Ваша услуга забронирована.
              </li>
            </ul>
          </div>
          <div class="flex items-center justify-center gap-10 mt-16">
            <UIRegistrationButton>Забронировать</UIRegistrationButton>
          </div>
        </div>
        <img
          class="max-w-[800px] max-lg:w-full"
          src="@/assets/images/img-section-1-services.jpg"
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
