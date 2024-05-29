<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const validationStore = useValidationStore();
let isLoading = ref(false);
let trainers = ref<Array<Trainer>>();

let clubs = ref<Array<Club>>();
let certifications = ref<Array<Certification>>();
let storeTrainers = useTrainersStore();
let storeClubs = useClubsStore();
let storeCertifications = useCertificationsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  const [trainersData, clubsData, certificationsData] = await Promise.all([
    storeTrainers.getTrainers(),
    storeClubs.getClubs(),
    storeCertifications.getCertifications(),
  ]);
  trainers.value = trainersData;
  clubs.value = clubsData;
  certifications.value = certificationsData;
  isLoading.value = false;
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

async function createTrainer() {
  if (!validationStore.checkValidation(trainerData.value, requiredFields)) {
    return;
  }

  trainerData.value.certifications = selectedCertifications.value;
  isLoading.value = true;
  closeModalComponent();
  await storeTrainers.createTrainer(trainerData.value);
  trainers.value = await storeTrainers.getTrainers();
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
  trainers.value = await storeTrainers.getTrainers();
  isLoading.value = false;
}

async function deleteTrainer() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeTrainers.deleteTrainer(trainerIdData.value);
  trainers.value = await storeTrainers.getTrainers();
  isLoading.value = false;
}
</script>

<template>
  <Head>
    <Title>Тренера</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование тренеров</h1>
      <div class="mb-16 flex justify-end max-sm:flex-col max-lg:mb-40">
        <UIMainButton @click="openModalComponent">Добавить тренера</UIMainButton>
      </div>
      <div class="flex items-center justify-center gap-10 max-lg:gap-40 flex-wrap mt-24">
        <div
          v-for="(trainer, index) in trainers?.slice().reverse()"
          :key="index"
          class="border-2 border-hover-color w-[300px] relative bg-white shadow-2xl rounded-2xl h-[400px]"
        >
          <span
            class="circle-image absolute top-[-100px] left-[74px] border-8 border-hover-color"
          >
            <img v-if="trainer.photo" :src="trainer.photo" alt="" class="" />
            <img
              v-else
              src="https://st3.depositphotos.com/1717437/18622/v/450/depositphotos_186223678-stock-illustration-incognito-unknown-person-silhouette-man.jpg"
              alt=""
              class=""
            />
          </span>
          <div class="flex justify-center items-center h-full flex-col">
            <NuxtLink :to="`/admin/trainers/${trainer.id}`" class="text-2xl text-hover-color hover:opacity-50 duration-200 underline">
              <h1> {{ trainer.name }} </h1>
            </NuxtLink>
            <p class="mb-2 font-bold">
              {{ trainer.gender === "MALE" ? "Мужчина" : "Женщина" }},
              {{ trainer.age ? trainer.age : "?" }}
            </p>
            <p class="mb-1 font-bold">{{ trainer.club.name }}</p>
            <p>Опыт работы: {{ trainer.experience ? trainer.experience : "?" }} лет</p>
            <p class="mb-1">Проведенные онлайн уроки: {{ trainer.lessons.length }}</p>
            <p class="mb-3">Заготовленное расписание: {{ trainer.schedules.length }}</p>
            <div class="flex items-center flex-col max-h-[40px] overflow-auto">
              <p
                class="text-sm text-center"
                v-for="certification in trainer.TrainerCertification"
              >
                {{ certification.certification.name }}
              </p>
            </div>
            <div class="mt-7">
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
        </div>
      </div>
    </div>
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
        class="flex items-center justify-centers gap-3 mb-5 flex-wrap text-center max-sm:flex max-sm:text-left"
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
  border-radius: 50%;
  overflow: hidden;
  width: 150px;
  height: 150px;
}
.circle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
