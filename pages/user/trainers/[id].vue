<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const route = useRoute();
const token = Cookies.get("token");
let isLoading = ref(false);
let trainer = ref<Trainer>({} as Trainer);

let clubs = ref<Array<Club>>();
let certifications = ref<Array<Certification>>();
let storeTrainers = useTrainersStore();
let storeClubs = useClubsStore();
let storeCertifications = useCertificationsStore();
const id = +route.params.id;

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return;
  }

  isLoading.value = true;
  const [trainersData, trainerData, clubsData, certificationsData] = await Promise.all([
    await storeTrainers.getTrainers(),
    storeTrainers.getTrainerById(id),
    storeClubs.getClubs(),
    storeCertifications.getCertifications(),
  ]);
  trainer.value = trainerData;
  clubs.value = clubsData;
  certifications.value = certificationsData;

  isLoading.value = false;
});

onMounted(async () => {
  if (!token) {
    router.push("/auth/login");
  }
});

definePageMeta({
  layout: "user",
});

const formattedCertifications = computed(() => {
  return trainer.value.TrainerCertification.map(
    (certification) => certification.certification.name
  ).join(", ");
});

const currentSchedulesLength = computed(() => {
  const filteredSchedules = storeTrainers.filterSchedulesByDate(trainer.value.schedules);
  return filteredSchedules.length;
});

const pastSchedulesLength = computed(() => {
  const pastSchedules = storeTrainers.filterPastSchedules(trainer.value.schedules);
  return pastSchedules.length;
});

const averageWorkoutPeople = computed(() => {
  let totalReservedSlots = 0;
  let totalSchedules = trainer.value.schedules.length;

  trainer.value.schedules.forEach((schedule) => {
    totalReservedSlots += schedule.reservedSlots;
  });

  let average = totalSchedules > 0 ? totalReservedSlots / totalSchedules : 0;

  return average;
});

let showImageModal = ref(false);

function closeImageModal() {
  showImageModal.value = false;
}
</script>

<template>
  <Head>
    <Title>Тренера</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl mb-5">Данные тренера</h1>
      <div
        class="flex items-center gap-40 px-20 py-10 max-xl:flex-col max-xl:items-center max-xl:gap-10 max-xl:px-0"
      >
        <div>
          <h1 class="text-2xl text-center mb-5">{{ trainer.name }}</h1>
          <span class="circle-image border-4 border-hover-color">
            <img
              @click="showImageModal = true"
              v-if="trainer.photo"
              :src="trainer.photo"
              alt=""
              class=""
            />
            <img
              v-else
              src="https://st3.depositphotos.com/1717437/18622/v/450/depositphotos_186223678-stock-illustration-incognito-unknown-person-silhouette-man.jpg"
              alt=""
              class=""
            />
          </span>
        </div>
        <div class="w-full">
          <h1 class="mb-10 text-center text-2xl">
            Личные данные тренера и его статистика
          </h1>
          <div
            class="grid grid-cols-2 my-3 border-b-2 border-hover-color pb-5 font-bold text-sm"
          >
            <p>Пол</p>
            <p>{{ trainer.gender === "MALE" ? "Мужчина" : "Женщина" }}</p>
          </div>
          <div
            class="grid grid-cols-2 my-3 border-b-2 border-hover-color pb-5 font-bold text-sm"
          >
            <p>Возраст</p>
            <p v-if="trainer.age">{{ trainer.age }} лет</p>
            <p v-else>Неизвестно</p>
          </div>
          <div
            class="grid grid-cols-2 my-3 border-b-2 border-hover-color pb-5 font-bold text-sm"
          >
            <p>Опыт работы</p>
            <p v-if="trainer.experience">{{ trainer.experience }} лет</p>
            <p v-else>Неизвестно</p>
          </div>
          <div
            class="grid grid-cols-2 my-3 border-b-2 border-hover-color pb-5 font-bold text-sm"
          >
            <p>Клуб</p>
            <p>{{ trainer.club.name }}</p>
          </div>
          <div
            class="grid grid-cols-2 my-3 border-b-2 border-hover-color pb-5 font-bold text-sm"
          >
            <p>Сертификации</p>
            <p>{{ formattedCertifications }}</p>
          </div>
          <div
            class="grid grid-cols-2 my-3 border-b-2 border-hover-color pb-5 font-bold text-sm"
          >
            <p>Онлайн-уроки</p>
            <p>Проведённые уроки: {{ trainer.lessons.length }}</p>
          </div>
          <div
            class="grid grid-cols-2 my-3 border-b-2 border-hover-color pb-5 font-bold text-sm"
          >
            <p>Тренировки</p>
            <div>
              <p>Количество прошедших тренировок: {{ pastSchedulesLength }}</p>
              <p>Количество текущих тренировок: {{ currentSchedulesLength }}</p>
              <p>Среднее количество человек: {{ averageWorkoutPeople }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UIModalPhoto
      :url="trainer.photo"
      v-if="showImageModal"
      @close-modal="closeImageModal"
    />
  </div>

  <div v-else class="h-screen flex items-center justify-center">
    <UISpinnerMain />
  </div>
</template>

<style scoped>
.circle-image {
  display: inline-block;
  border-radius: 10%;
  overflow: hidden;
  width: 300px;
  height: 400px;
}
.circle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
