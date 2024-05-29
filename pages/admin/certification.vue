<script setup lang="ts">
import Cookies from "js-cookie";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const validationStore = useValidationStore();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
let isLoading = ref(false);
let certifications = ref<Array<Certification>>();
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
  certifications.value = await storeCertifications.getCertifications();
  isLoading.value = false;
});


definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(certification: Certification = {} as Certification) {
  isOpenModal.value = true;
  if (certification.id) {
    certificationData.value = JSON.parse(JSON.stringify(certification));
  } else {
    certificationData.value = {} as Certification;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  certificationIdData.value = id;
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

let certificationData = ref({} as Certification);
let certificationIdData = ref(0);

const requiredFields: Record<string, string> = {
  name: "Название сертификата",
  description: "Описание сертификата",
};

async function createCertification() {
  if (!validationStore.checkValidation(certificationData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeCertifications.createCertification(certificationData.value);
  certifications.value = await storeCertifications.getCertifications();
  isLoading.value = false;
}

async function updateCertification() {
  if (!validationStore.checkValidation(certificationData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeCertifications.updateCertification(certificationData.value);
  certifications.value = await storeCertifications.getCertifications();
  isLoading.value = false;
}

async function deleteCertification() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeCertifications.deleteCertification(certificationIdData.value);
  certifications.value = await storeCertifications.getCertifications();
  isLoading.value = false;
}
</script>

<template>
  <Head>
    <Title>Сертификация</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">
        Редактирование сертификаций
      </h1>
      <div class="mb-16 flex justify-end max-sm:flex-col">
        <UIMainButton @click="openModalComponent">Добавить сертификацию</UIMainButton>
      </div>
      <div class="overflow-x-auto mb-10">
        <div class="grid grid-cols-4 overflow-x-auto min-w-[1400px] text-center mb-7">
          <h1>Номер</h1>
          <h1>Название</h1>
          <h1>Описание</h1>
          <h1>Изменить</h1>
        </div>
        <div class="space-y-10">
          <ul
            v-for="(club, index) in certifications?.slice().reverse()"
            :key="index"
            class="border-2 overflow-x-auto mb-10 min-w-[1400px] rounded-lg py-5 shadow-sm grid grid-cols-4 text-center"
          >
            <li class="text-sm">{{ index + 1 }}</li>
            <li class="text-sm">{{ club.name }}</li>
            <li class="text-sm">{{ club.description }}</li>
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
      <div class="text-left text-xl font-bold" v-if="!certificationData.id">
        Добавить сертификацию
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить сертификацию</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Название сертификата</label>
        <input
          v-model="certificationData.name"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Описание</label>
        <textarea
          v-model="certificationData.description"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div class="flex gap-3" v-if="!certificationData.id">
        <UIMainButton @click="createCertification">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateCertification">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить сертификацию</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данную сертификацию?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteCertification">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
</template>
