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
    <Title>Управление абонементами</Title>
  </Head>
  <div class="pt-64 mx-auto container">
    <h1 class="text-7xl max-lg:text-6xl max-md:text-5xl max-sm:text-4xl max-[400px]:text-4xl text-center uppercase">
      Управление абонементами <br />
      НА HARDSPORT
    </h1>
    <p class="text-center text-xl max-sm:text-lg max-[400px]:text-base mt-5">
      Наслаждайтесь удобством и гибкостью нашей системы
      управления абонементами и сосредоточьтесь на достижении своих
      фитнес-целей.
    </p>
    <div class="flex items-center justify-center gap-10 mt-10">
      <UIRegistrationButton>Приобрести/Продлить абонемент</UIRegistrationButton>
    </div>
    <video autoplay muted loop id="background-video">
      <source
        src="@/assets/videos/video-section-tickets.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
    <div class="mt-[450px] mb-5 max-2xl:mt-[350px] max-md:px-5">
      <h1 class="text-center text-4xl">Как это работает</h1>
      <div class="mt-16 justify-between gap-10">
        <div>
          <div class="my-10">
            <p class="mb-3 text-3xl">Выберите абонемент:</p>
            <ul class="list-disc">
              <li class="text-lg">
                Изучите доступные планы абонементов и выберите тот, который
                лучше всего соответствует вашим потребностям и целям
              </li>
              <li class="text-lg">
                Уточните информацию о сроках действия, условиях использования и
                преимуществах каждого плана.
              </li>
            </ul>
          </div>
          <div class="my-10">
            <p class="mb-3 text-3xl">Оформите покупку или продление:</p>
            <ul class="list-disc">
              <li class="text-lg">
                Войдите в свой аккаунт на нашей онлайн-платформе или
                зарегистрируйтесь, если вы    пользователь.
              </li>
              <li class="text-lg">
                Выберите желаемый абонемент и добавьте его в корзину.
              </li>
              <li class="text-lg">
                Укажите предпочтительный метод оплаты и завершите транзакцию
                через защищенную платежную систему.
              </li>
            </ul>
          </div>
          <div class="mt-10 mb-3">
            <p class="mb-3 text-3xl">Получите подтверждение:</p>
            <ul class="list-disc">
              <li class="text-lg">
                После успешной оплаты вы получите мгновенное подтверждение о
                покупке или продлении абонемента.
              </li>
              <li class="text-lg">
                Ваш абонемент автоматически активируется или продлевается, и вы
                можете сразу начать пользоваться его преимуществами.
              </li>
            </ul>
          </div>
          <div class="flex items-center justify-center gap-10 mt-16">
            <UIRegistrationButton @click="router.push('/auth/registration')">Приобрести/Продлить абонемент</UIRegistrationButton>
          </div>
        </div>
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
