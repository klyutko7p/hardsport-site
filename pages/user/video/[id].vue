<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const route = useRoute();
const token = Cookies.get("token");
const user = ref({} as User);
const id = +route.params.id;
const storeUsers = useUsersStore();
let isLoading = ref(false);
let trainers = ref<Array<Trainer>>([]);
let lessons = ref<Array<Lesson>>([]);
let originallyLessons = ref<Array<Lesson>>([]);
let storeTrainers = useTrainersStore();
let storeLessons = useLessonsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return;
  }
  user.value = storeUsers.getUser();

  isLoading.value = true;
  const [userData, trainersData, lessonsData] = await Promise.all([
    await storeUsers.getUserById(user.value.id),
    storeTrainers.getTrainers(),
    storeLessons.getLessonsByCategory(id),
  ]);

  user.value = userData;
  trainers.value = trainersData;
  lessons.value = lessonsData;
  originallyLessons.value = lessonsData;

  if (lessons.value.length < 1) {
    router.push(`/user/video`);
  }

  isLoading.value = false;
});

definePageMeta({
  layout: "user",
});
</script>

<template>
  <Head>
    <Title>Видеоуроки</Title>
  </Head>
  <div v-if="!isLoading">
    <div v-if="user.subscription.length > 0 && user.subscription[0].status === 'ACTIVE'">
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">
        Модули по категории {{ lessons[0].category.categoryName }}
      </h1>
      <div class="flex items-end flex-col max-sm:items-start">
        <h1 class="text-2xl max-lg:text-center w-full my-5">
          Количество модулей - {{ lessons.length }}
        </h1>
      </div>
      <div class="flex items-center justify-center flex-wrap mt-3 mb-24">
        <UIAccordionPanel
          v-for="(lesson, index) in lessons"
          :key="index"
          aria-title="incidents"
          :title="`Модуль ${index + 1}`"
        >
          <div class="flex justify-between max-xl:flex-col">
            <div class="w-[800px] max-lg:w-full">
              <h1 class="text-2xl mb-1">{{ lesson.title }}, {{ lesson.duration }} мин</h1>
              <p class="text-xl max-lg:text-base">{{ lesson.description }}</p>
              <div class="flex items-start flex-col-reverse gap-5 mt-20 max-xl:hidden">
                <p>
                  Подготовил тренер -
                  <NuxtLink
                    class="text-hover-color underline font-bold"
                    :to="`/user/trainers/${lesson.trainer.id}`"
                    >{{ lesson.trainer.name }}</NuxtLink
                  >
                </p>
                <span class="circle-image">
                  <img v-if="lesson.trainer.photo" :src="lesson.trainer.photo" alt="" />
                  <img
                    v-else
                    src="https://st3.depositphotos.com/1717437/18622/v/450/depositphotos_186223678-stock-illustration-incognito-unknown-person-silhouette-man.jpg"
                    alt=""
                    class=""
                  />
                </span>
              </div>
            </div>
            <div>
              <iframe
                :src="`https://www.youtube.com/embed/${
                  lesson.videoLink.split('=')[1].split('&')[0]
                }`"
                frameborder="0"
                class="w-[600px] h-[315px] mt-5 max-xl:w-full max-xl:h-[500px]"
                allowfullscreen
              ></iframe>
            </div>
            <div
              class="hidden items-start gap-5 mt-5 max-xl:flex max-xl:flex-col-reverse"
            >
              <p>
                Подготовил тренер -
                <NuxtLink
                  class="text-hover-color underline font-bold"
                  :to="`/user/trainers/${lesson.trainer.id}`"
                  >{{ lesson.trainer.name }}</NuxtLink
                >
              </p>
              <span class="circle-image">
                <img v-if="lesson.trainer.photo" :src="lesson.trainer.photo" alt="" />
                <img
                  v-else
                  src="https://st3.depositphotos.com/1717437/18622/v/450/depositphotos_186223678-stock-illustration-incognito-unknown-person-silhouette-man.jpg"
                  alt=""
                  class=""
                />
              </span>
            </div>
          </div>
        </UIAccordionPanel>
      </div>
    </div>
    <div v-else class="h-screen flex items-center justify-center flex-col">
      <h1 class="text-4xl text-center">
        Чтобы получить доступ к данному разделу <br> нужно обязательно приобрести наш
        абонемент!
      </h1>
      <UIMainButton @click="router.push('/user/subscription')" class="mt-10">Приобрести</UIMainButton>
    </div>
  </div>
  <div v-else class="h-screen flex items-center justify-center">
    <UISpinnerMain />
  </div>
</template>

<style scoped>
.circle-image {
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  width: 100px;
  height: 100px;
}
.circle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
