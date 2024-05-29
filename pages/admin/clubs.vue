<script setup lang="ts">
import Cookies from "js-cookie";
import toast from "~/plugins/toast";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const validationStore = useValidationStore();
let isLoading = ref(false);
let clubs = ref<Array<Club>>();
let storeClubs = useClubsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  clubs.value = await storeClubs.getClubs();
  isLoading.value = false;
});

definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(club: Club = {} as Club) {
  isOpenModal.value = true;
  if (club.id) {
    clubData.value = JSON.parse(JSON.stringify(club));
  } else {
    clubData.value = {} as Club;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  clubIdData.value = id;
  document.body.style.overflow = "hidden";
}

function closeModalComponent() {
  isOpenModal.value = false;
  document.body.style.overflow = "auto";
}

function closeModalDeleteComponent() {
  isOpenModalDelete.value = false;
  document.body.style.overflow = "auto";
}

let clubData = ref({} as Club);
let clubIdData = ref(0);

const requiredFields: Record<string, string> = {
  name: "Название",
  address: "Адрес",
  city: "Город",
  country: "Страна",
  phoneNumber: "Номер телефона",
  linkToImage: "Ссылка на изображение",
};

async function createClub() {
  if (!validationStore.checkValidation(clubData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeClubs.createClub(clubData.value);
  clubs.value = await storeClubs.getClubs();
  isLoading.value = false;
}

async function updateClub() {
  if (!validationStore.checkValidation(clubData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeClubs.updateClub(clubData.value);
  clubs.value = await storeClubs.getClubs();
  isLoading.value = false;
}

async function deleteClub() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeClubs.deleteClub(clubIdData.value);
  clubs.value = await storeClubs.getClubs();
  isLoading.value = false;
}
</script>

<template>
  <Head>
    <Title>Клубы</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">
        Редактирование клубов "HARDSPORT"
      </h1>
      <div class="mb-16 flex justify-end max-sm:flex-col">
        <UIMainButton @click="openModalComponent">Добавить клуб</UIMainButton>
      </div>
      <div class="overflow-x-auto mb-10">
        <div class="grid grid-cols-8 overflow-x-auto min-w-[1400px] text-center mb-7">
          <h1>Номер</h1>
          <h1>Название</h1>
          <h1>Адрес</h1>
          <h1>Город</h1>
          <h1>Страна</h1>
          <h1>Номер телефона</h1>
          <h1>Ссылка на фото</h1>
          <h1>Изменить</h1>
        </div>
        <div class="space-y-10">
          <ul
            data-aos="fade-up"
            v-for="(club, index) in clubs?.slice().reverse()"
            :key="index"
            class="border-2 overflow-x-auto mb-10 min-w-[1400px] rounded-lg py-5 shadow-sm grid grid-cols-8 text-center"
          >
            <li class="text-sm">{{ index + 1 }}</li>
            <li class="text-sm">{{ club.name }}</li>
            <li class="text-sm">{{ club.address }}</li>
            <li class="text-sm">{{ club.city }}</li>
            <li class="text-sm">{{ club.country }}</li>
            <li class="text-sm">{{ club.phoneNumber }}</li>
            <a
              class="text-sm font-bold underline text-hover-color hover:opacity-50 duration-200"
              :href="club.linkToImage"
              >ССЫЛКА</a
            >
            <li class="text-sm space-x-3">
              <Icon
                name="material-symbols:edit-outline"
                @click="openModalComponent(club)"
                size="24"
                class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
              />
              <Icon
                name="material-symbols:delete-rounded"
                @click="openModalDeleteComponent(club.id)"
                size="24"
                class="text-hover-color cursor-pointer hover:opacity-50 duration-200"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="h-screen flex items-center justify-center">
    <UISpinnerMain />
  </div>

  <UIModalComponent v-show="isOpenModal" @close-modal="closeModalComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold" v-if="!clubData.id">Добавить клуб</div>
      <div class="text-left text-xl font-bold" v-else>Изменить клуб</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Название клуба</label>
        <input
          v-model="clubData.name"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <label>Адрес</label>
        <input
          v-model="clubData.address"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <label>Город</label>
        <input
          v-model="clubData.city"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <label>Страна</label>
        <input
          v-model="clubData.country"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <label>Номер телефона</label>
        <input
          v-model="clubData.phoneNumber"
          type="number"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <label>Ссылка на фото</label>
        <input
          v-model="clubData.linkToImage"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div class="flex gap-3" v-if="!clubData.id">
        <UIMainButton @click="createClub">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateClub">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить клуб</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данный клуб?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteClub">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
</template>
