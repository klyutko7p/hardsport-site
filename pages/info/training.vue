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
    <Title>Расписание тренировок и групповых занятий в HardSport</Title>
  </Head>
  <div class="pt-64">
    <div>
      <h1 class="text-7xl max-lg:text-6xl max-md:text-5xl max-sm:text-4xl max-[400px]:text-2xl text-center uppercase">
        Расписание тренировок и групповых занятий в HardSport
      </h1>
      <p class="text-center text-xl max-sm:text-lg mt-5">
        Актуальные расписания тренировок и групповых занятий, чтобы планировать
        <br />
        свои занятия и достигать максимальных результатов вместе с HardSport.
      </p>
      <div class="flex items-center justify-center gap-10 mt-10 max-sm:mt-5">
        <UIRegistrationButton @click="router.push('/auth/registration')">Записаться</UIRegistrationButton>
      </div>
      <video autoplay muted loop id="background-video">
        <source
          src="@/assets/videos/video-section-training.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div class="mt-[450px] mb-5 max-2xl:mt-[350px] max-md:px-5">
        <h1 class="text-center text-4xl">Тренировки</h1>
        <div>
          <div>
            <p class="mt-10 text-2xl text-center mx-auto container max-sm:text-xl max-[500px]:text-lg max-lg:text-left">
              Наши групповые занятия представляют собой эффективные и веселые
              способы улучшить вашу физическую форму и здоровье. Выберите из
              разнообразных тренировок, таких как йога, пилатес, аэробика и
              многое другое, <br> каждая из которых специально разработана для
              достижения конкретных целей. <br />
              Время и дни проведения каждой тренировки удобно отображены в нашем
              расписании. <br />
              Чтобы забронировать место на выбранной тренировке, просто нажмите
              кнопку "Записаться" и следуйте инструкциям.
            </p>
            <div class="flex items-center justify-center gap-10 mb-10 mt-10">
              <UIRegistrationButton @click="router.push('/auth/registration')">Записаться</UIRegistrationButton>
            </div>
            <Swiper
              :modules="[SwiperAutoplay]"
              :loop="true"
              :grabCursor="true"
              :autoplay="{
                delay: 8000,
                disableOnInteraction: true,
              }"
            >
              <SwiperSlide>
                <div class="flex items-center max-lg:flex-col justify-between px-24 max-lg:px-3">
                  <div>
                    <h1 class="text-2xl mb-3">Йога</h1>
                    <p class="text-xl">
                      В потоке звуков мирской суеты, где каждый день словно
                      стремится обогнать предыдущий, йога представляет собой
                      остров спокойствия и внутренней гармонии. В ее объятиях мы
                      находим убежище от беспокойства и стресса, позволяя своему
                      разуму и душе раскрыться в полной мере.
                    </p>
                  </div>
                  <img
                    class="w-[1000px] h-[600px] max-lg:w-full max-lg:h-full"
                    src="@/assets/images/img-section-1-training-1.png"
                    alt=""
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="flex items-center max-lg:flex-col justify-between px-24 max-lg:px-3">
                  <div>
                    <h1 class="text-2xl mb-3">Пилатес</h1>
                    <p class="text-xl mb-10">
                      Это не просто система упражнений, это искусство
                      восстановления и укрепления тела, вдохновленное гармонией
                      и балансом. В каждом движении просыпается сила глубоких
                      мышц, приводя к ощущению единства между телом, разумом и
                      душой.
                    </p>
                  </div>
                  <img
                    class="w-[1000px] h-[600px] max-lg:w-full max-lg:h-full"
                    src="@/assets/images/img-section-1-training-2.jpg"
                    alt=""
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div class="flex items-center max-lg:flex-col justify-between px-24 max-lg:px-3">
                  <div>
                    <h1 class="text-2xl mb-3">Аэробика</h1>
                    <p class="text-xl mb-10">
                      Под музыку, которая придает нам силу и мотивацию, мы
                      буквально погружаемся в мир энергии и жизни. Аэробика
                      позволяет нам раскрыть свой потенциал, превращая стресс и
                      напряжение в бурю энтузиазма и позитива.
                    </p>
                  </div>
                  <img
                    class="w-[1000px] h-[600px] max-lg:w-full max-lg:h-full"
                    src="@/assets/images/img-section-1-training-4.jpg"
                    alt=""
                  />
                </div>
              </SwiperSlide>
            </Swiper>
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