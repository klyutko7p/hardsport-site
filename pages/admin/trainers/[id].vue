<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const route = useRoute();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const validationStore = useValidationStore();
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
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
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
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(trainer: Trainer = {} as Trainer) {
  isOpenModal.value = true;
  if (trainer.id) {
    trainerData.value = JSON.parse(JSON.stringify(trainer));
  } else {
    trainerData.value = {} as Trainer;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  trainerIdData.value = id;
  document.body.style.overflow = "hidden";
}

function closeModalComponent() {
  isOpenModal.value = false;
  document.body.style.overflow = "auto";
  selectedCertifications.value = [];
}

function closeModalDeleteComponent() {
  isOpenModalDelete.value = false;
  document.body.style.overflow = "auto";
  selectedCertifications.value = [];
}

let selectedCertifications = ref([]);
let trainerData = ref({} as Trainer);
let trainerIdData = ref(0);

const requiredFields: Record<string, string> = {
  name: "Имя",
  clubId: "Клуб",
  gender: "Пол",
};

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

async function createTrainer() {
  if (!validationStore.checkValidation(trainerData.value, requiredFields)) {
    return;
  }

  trainerData.value.certifications = selectedCertifications.value;
  isLoading.value = true;
  closeModalComponent();
  await storeTrainers.createTrainer(trainerData.value);
  trainer.value = await storeTrainers.getTrainerById(id);
  await storeTrainers.getTrainers();
  isLoading.value = false;
}

async function updateTrainer() {
  if (!validationStore.checkValidation(trainerData.value, requiredFields)) {
    return;
  }

  trainerData.value.certifications = selectedCertifications.value;
  isLoading.value = true;
  closeModalComponent();
  await storeTrainers.updateTrainer(trainerData.value);
  trainer.value = await storeTrainers.getTrainerById(id);
  await storeTrainers.getTrainers();
  isLoading.value = false;
}

async function deleteTrainer() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeTrainers.deleteTrainer(trainerIdData.value);
  trainer.value = await storeTrainers.getTrainerById(id);
  await storeTrainers.getTrainers();
  isLoading.value = false;
}

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
          <div class="flex items-center justify-end gap-5 mb-5">
            <div>
              <Icon
                name="material-symbols:edit-outline"
                @click="openModalComponent(trainer)"
                size="32"
                class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
              />
              <Icon
                name="material-symbols:delete-rounded"
                @click="openModalDeleteComponent(trainer.id)"
                size="32"
                class="text-hover-color cursor-pointer hover:opacity-50 duration-200"
              />
            </div>
          </div>
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

  <UIModalComponent v-show="isOpenModal" @close-modal="closeModalComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold" v-if="!trainerData.id">
        Добавить нового тренера
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить данные тренера</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Имя</label>
        <input
          v-model="trainerData.name"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Возраст</label>
        <input
          v-model="trainerData.age"
          type="number"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Пол</label>
        <select
          v-model="trainerData.gender"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option value="MALE">Мужской</option>
          <option value="FEMALE">Женский</option>
        </select>
      </div>

      <div>
        <label>Ссылка на фото</label>
        <input
          v-model="trainerData.photo"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Опыт работы (лет)</label>
        <input
          v-model="trainerData.experience"
          type="number"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Клуб</label>
        <select
          v-model="trainerData.clubId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="club in clubs" :value="club.id">{{ club.name }}</option>
        </select>
      </div>

      <div
        class="flex items-center justify-centers gap-3 mb-5 flex-wrap"
      >
        <label v-for="(certification, index) in certifications" :key="index">
          <input
            type="checkbox"
            :value="certification"
            v-model="selectedCertifications"
          />
          {{ certification.name }}
        </label>
      </div>

      <div class="flex gap-3" v-if="!trainerData.id">
        <UIMainButton @click="createTrainer">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateTrainer">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить тренера</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данного тренера?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteTrainer">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
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
