<script setup lang="ts">
import Cookies from "js-cookie";

const validationStore = useValidationStore();
const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
let isLoading = ref(false);
let services = ref<Array<Service>>([]);
const storeServices = useBookingsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  services.value = await storeServices.getServices();
  isLoading.value = false;
});

definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(service: Service = {} as Service) {
  isOpenModal.value = true;
  if (service.id) {
    serviceData.value = JSON.parse(JSON.stringify(service));
  } else {
    serviceData.value = {} as Service;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  serviceIdData.value = id;
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

let serviceData = ref({} as Service);
let serviceIdData = ref(0);

const requiredFields: Record<string, string> = {
  name: "Название",
  type: "Тип",
};


async function createService() {
  if (!validationStore.checkValidation(serviceData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeServices.createService(serviceData.value);
  services.value = await storeServices.getServices();
  isLoading.value = false;
}

async function updateService() {
  if (!validationStore.checkValidation(serviceData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeServices.updateService(serviceData.value);
  services.value = await storeServices.getServices();
  isLoading.value = false;
}

async function deleteService() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeServices.deleteService(serviceIdData.value);
  services.value = await storeServices.getServices();
  isLoading.value = false;
}

</script>

<template>
  <Head>
    <Title>Сервисы</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование сервисов</h1>
      <div class="mb-16 flex justify-end gap-5 max-sm:flex-col">
        <UIMainButton @click="router.push('/admin/online-booking')"
          >Добавить бронь</UIMainButton
        >
        <UIMainButton @click="openModalComponent">Добавить сервис</UIMainButton>
      </div>
      <div class="overflow-x-auto mb-10">
        <div class="grid grid-cols-6 overflow-x-auto min-w-[1400px] text-center mb-7">
          <h1>Номер</h1>
          <h1>Название</h1>
          <h1>Описание</h1>
          <h1>Тип</h1>
          <h1>Количество броней</h1>
          <h1>Изменить</h1>
        </div>
        <div class="space-y-10">
          <ul
            v-for="(service, index) in services?.slice().reverse()"
            :key="index"
            class="border-2 overflow-x-auto mb-10 min-w-[1400px] rounded-lg py-5 shadow-sm grid grid-cols-6 text-center"
          >
            <li class="text-sm">{{ index + 1 }}</li>
            <li class="text-sm">{{ service.name }}</li>
            <li class="text-sm">{{ service.description }}</li>
            <li class="text-sm" v-if="service.type === 'PERSONAL_TRAINING'">Персональная тренировка</li>
            <li class="text-sm" v-if="service.type === 'MASSAGE'">Массаж</li>
            <li class="text-sm" v-if="service.type === 'SAUNA'">Сауна и бассейн</li>
            <li class="text-sm">{{ service.onlineBooking.length }}</li>
            <li class="text-sm space-x-3">
              <Icon
                name="material-symbols:edit-outline"
                @click="openModalComponent(service)"
                size="24"
                class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
              />
              <Icon
                name="material-symbols:delete-rounded"
                @click="openModalDeleteComponent(service.id)"
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
      <div class="text-left text-xl font-bold" v-if="!serviceData.id">
        Добавить    абонемент
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить сервис</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Название сервиса</label>
        <input
          v-model="serviceData.name"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Описание сервиса</label>
        <textarea
          v-model="serviceData.description"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Тип сервиса</label>
        <select
          v-model="serviceData.type"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option value="PERSONAL_TRAINING">Персональная тренировка</option>
          <option value="MASSAGE">Массаж</option>
          <option value="SAUNA">Сауна + Бассейн</option>
        </select>
      </div>

      <div class="flex gap-3" v-if="!serviceData.id">
        <UIMainButton @click="createService">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateService">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить сервис</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данный сервис?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteService">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
</template>
