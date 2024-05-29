<script setup lang="ts">
const storeClubs = useClubsStore();
const router = useRouter();

let clubs = ref<Array<Club>>([]);
let isLoading = ref(false);

onBeforeMount(async () => {
  setTimeout(async () => {
    isLoading.value = true;
    clubs.value = await storeClubs.getClubs();
    isLoading.value = false;
  }, 10);
});

let showImageModal = ref(false);
function openModal(url: string) {
  imageModalURL.value = url;
  showImageModal.value = true;
}

function closeModal() {
  imageModalURL.value = "";
  showImageModal.value = false;
}
let imageModalURL = ref("");

useHead({
  bodyAttrs: {
    class: "bg-black text-white",
  },
});
</script>

<template>
  <Head>
    <Title>Hard Sport - Онлайн-платформа фитнес-клуба</Title>
  </Head>
  <div class="pt-5" v-if="!isLoading">
    <section
      data-aos="fade-up"
      class="section-1 h-screen max-lg:h-[600px] mx-auto container"
    >
      <article class="pt-56 max-lg:text-center">
        <h1
          class="uppercase text-4xl max-sm:text-3xl max-[400px]:text-2xl text-hover-color"
        >
          персонализированная
        </h1>
        <h1
          class="uppercase text-6xl max-sm:text-5xl max-[400px]:text-4xl text-white leading-[70px]"
        >
          работа над <br />
          собой
        </h1>
        <article
          class="gap-3 flex items-center max-lg:justify-center mt-7 max-[400px]:flex-col"
        >
          <UISectionButton
            class="max-[400px]:w-full min-w-[220px]"
            @click="router.push('/info/registration')"
            >Начать</UISectionButton
          >
          <UISectionButton
            class="max-[400px]:w-full min-w-[220px]"
            @click="router.push('/#services')"
            >Узнать больше</UISectionButton
          >
        </article>
      </article>
    </section>
    <section class="section-2 h-screen" id="about">
      <article>
        <h1 class="text-center text-4xl max-sm:text-3xl py-20">
          Онлайн-платформа Hard Sport
        </h1>
        <article
          class="flex items-center max-lg:flex-col mb-10 justify-between gap-5 mx-auto container"
        >
          <div>
            <Icon name="ic:round-format-quote" class="text-hover-color" size="40" />
            <p
              data-aos="fade-right"
              class="text-4xl max-xl:px-5 max-xl:text-2xl max-sm:text-xl max-w-[660px] pl-10"
            >
              Наша <span class="text-hover-color font-bold">цель</span> - вдохновлять и
              поддерживать наших клиентов на пути к здоровому образу жизни и достижению
              своих фитнес-целей. Мы стремимся предоставить инновационные решения и
              персонализированный подход, чтобы каждый член нашего сообщества мог стать
              лучше с каждым днем.
            </p>
          </div>
          <img
            data-aos="fade-up"
            class="max-xl:px-5"
            src="../assets/images/img-section-2-1.png"
            alt=""
          />
        </article>
        <article class="mt-5">
          <marquee direction="right" loop="-1" scrollamount="20">
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
          </marquee>
        </article>
        <article class="flex items-center max-xl:flex-col gap-3 justify-center px-5 py-3">
          <img
            class="max-[500px]:w-full hover:opacity-100 duration-200"
            src="../assets/images/img-section-2-2.png"
            alt=""
          />
          <div class="flex flex-col gap-3">
            <div class="flex gap-3">
              <img
                class="max-[500px]:w-full hover:opacity-50 duration-200"
                src="../assets/images/img-section-2-3.png"
                alt=""
              />
              <img
                class="max-[500px]:w-full hover:opacity-50 duration-200"
                src="../assets/images/img-section-2-4.png"
                alt=""
              />
            </div>
            <img
              class="max-[500px]:w-full hover:opacity-50 duration-200"
              src="../assets/images/img-section-2-5.png"
              alt=""
            />
          </div>
          <img
            class="max-[500px]:w-full hover:opacity-50 duration-200"
            src="../assets/images/img-section-2-6.png"
            alt=""
          />
        </article>
        <article class="mt-5">
          <marquee direction="left" loop="-1" scrollamount="20">
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
            <span class="text-4xl font-bold">SPORT </span>
            <span class="text-4xl font-bold text-stroke-3 text-black">SPORT </span>
          </marquee>
        </article>
      </article>
    </section>
    <section
      class="mt-56 mb-20 max-xl:mt-[800px] max-lg:mt-[900px] max-xl:mb-[400px] max-md:mb-[1200px] section-4 h-screen"
      id="services"
    >
      <article>
        <h1 class="text-center text-4xl py-20">Возможности</h1>
        <article
          class="flex items-center flex-wrap justify-center max-xl:grid-cols-2 max-md:flex max-md:justify-center max-md:flex-col max-md:items-center gap-x-56 gap-y-10 container mx-auto"
        >
          <div
            data-aos="zoom-in"
            class="flex flex-col min-w-[350px] min-h-[300px] max-sm:min-w-[200px] items-center border-2 border-white p-5 border-dashed max-w-[350px]"
          >
            <Icon name="material-symbols:person-add" size="48" class="mb-3" />
            <h1
              @click="router.push('/info/registration')"
              class="text-2xl text-center mb-3 min-h-[65px] hover:text-hover-color cursor-pointer duration-200"
            >
              Регистрация и авторизация
            </h1>
            <p class="text-center text-xl">
              Возможность создания учетной записи и входа с помощью логина и пароля.
            </p>
          </div>
          <div
            data-aos="zoom-in"
            class="flex flex-col min-w-[350px] min-h-[300px] max-sm:min-w-[200px] items-center border-2 border-white p-5 border-dashed max-w-[350px]"
          >
            <Icon name="material-symbols:fitness-center" size="48" class="mb-3" />
            <h1
              @click="router.push('/info/training')"
              class="text-2xl text-center mb-3 min-h-[65px] hover:text-hover-color cursor-pointer duration-200"
            >
              Расписание <br />
              тренировок
            </h1>
            <p class="text-center text-xl">
              Актуальное расписание тренировок и групповых занятий с возможностью записи
              на них.
            </p>
          </div>
          <div
            data-aos="zoom-in"
            class="flex flex-col min-w-[350px] min-h-[300px] max-sm:min-w-[200px] items-center border-2 border-white p-5 border-dashed max-w-[350px]"
          >
            <Icon name="oui:online" size="48" class="mb-3" />
            <h1
              @click="router.push('/info/services')"
              class="text-2xl text-center mb-3 min-h-[65px] hover:text-hover-color cursor-pointer duration-200"
            >
              Онлайн-бронирование услуг
            </h1>
            <p class="text-center text-xl">
              Онлайн-бронирование персональных тренировок, массажа, сауны и других услуг
              клуба.
            </p>
          </div>
          <div
            data-aos="zoom-in"
            class="flex flex-col min-w-[350px] min-h-[300px] max-sm:min-w-[200px] items-center border-2 border-white p-5 border-dashed max-w-[350px]"
          >
            <Icon name="majesticons:ticket-check" size="48" class="mb-3" />
            <h1
              @click="router.push('/info/tickets')"
              class="text-2xl text-center mb-3 min-h-[65px] hover:text-hover-color cursor-pointer duration-200"
            >
              Управление абонементами
            </h1>
            <p class="text-center text-xl">
              Покупка и продление абонементов онлайн с выбором подходящего плана и оплатой
              через интернет.
            </p>
          </div>
          <div
            data-aos="zoom-in"
            class="flex flex-col min-w-[350px] min-h-[300px] max-sm:min-w-[200px] items-center border-2 border-white p-5 border-dashed max-w-[350px]"
          >
            <Icon name="material-symbols:slow-motion-video" size="48" class="mb-3" />
            <h1
              @click="router.push('/info/video')"
              class="text-2xl text-center mb-3 min-h-[65px] hover:text-hover-color cursor-pointer duration-200"
            >
              Онлайн-тренировки и видеоуроки
            </h1>
            <p class="text-center text-xl">
              Доступ к онлайн-тренировкам и видеоурокам по различным видам активности.
            </p>
          </div>
        </article>
      </article>
    </section>
    <section id="contacts">
      <h1 class="text-center text-4xl py-20">Контакты</h1>
      <article
        v-for="(club, index) in clubs"
        :key="index"
        data-aos="fade-up"
        class="mx-auto container space-y-36 px-3 flex items-center max-xl:flex-col max-xl:items-start max-xl:gap-10 justify-between mb-10"
      >
        <div>
          <h1 class="text-4xl">{{ club.name }}</h1>
          <p class="text-xl mb-1">{{ club.address }}</p>
          <p class="text-xl text-muted-color mb-1">
            г. {{ club.city }}, {{ club.country }}
          </p>
          <p class="text-xl mt-6">{{ club.phoneNumber }}</p>
        </div>
        <img
          class="max-w-[750px] max-xl:w-full hover:opacity-50 duration-200 cursor-pointer"
          :src="club.linkToImage"
          @click="openModal(club.linkToImage)"
          alt=""
        />
      </article>
    </section>
    <UIModalPhoto
      v-auto-animate
      :url="imageModalURL"
      v-if="showImageModal"
      @close-modal="closeModal"
    />
  </div>
  <div v-else class="text-center flex items-center justify-center h-screen">
    <UISpinner />
  </div>
</template>

<style scoped>
.section-1 {
  background-image: url("../assets/images/bg-section-1.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.section-2 {
  background-image: url("../assets/images/bg-section-2.png");
  background-position: center;
  background-size: contain;
  background-repeat: repeat;
}

.section-4 {
  background-image: url("../assets/images/bg-section-4.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.text-stroke-3 {
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
}
</style>
