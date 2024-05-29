<script setup lang="ts">
import Cookies from "js-cookie";

const validationStore = useValidationStore();
const router = useRouter();
const token = Cookies.get("token");
const user = ref({} as User);
let isLoading = ref(false);
let users = ref<Array<User>>([]);
let clubs = ref<Array<Club>>([]);
let services = ref<Array<Service>>([]);
let onlineBookings = ref<Array<OnlineBooking>>([]);
let originallyOnlineBookings = ref<Array<OnlineBooking>>([]);

const storeUsers = useUsersStore();
const storeClubs = useClubsStore();
const storeOnlineBookings = useBookingsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return;
  }
  user.value = storeUsers.getUser();

  isLoading.value = true;
  const [
    userData,
    usersData,
    clubsData,
    servicesData,
    onlineBookingsData,
  ] = await Promise.all([
    storeUsers.getUserById(user.value.id),
    storeUsers.getUsers(),
    storeClubs.getClubs(),
    storeOnlineBookings.getServices(),
    storeOnlineBookings.getOnlineBookings(),
  ]);
  user.value = userData;
  users.value = usersData;
  clubs.value = clubsData;
  services.value = servicesData;
  onlineBookings.value = onlineBookingsData;
  originallyOnlineBookings.value = onlineBookingsData;
  isLoading.value = false;
});

definePageMeta({
  layout: "user",
});

let isOpenModal = ref(false);

function openModalComponent(onlineBooking: OnlineBooking = {} as OnlineBooking) {
  isOpenModal.value = true;
  if (onlineBooking.id) {
    onlineBookingData.value = JSON.parse(JSON.stringify(onlineBooking));
    onlineBookingData.value.bookedDateTime = storeUsers.getISODate(
      onlineBookingData.value.bookedDateTime
    );
  } else {
    onlineBookingData.value = {} as OnlineBooking;
  }
  document.body.style.overflow = "hidden";
}

function closeModalComponent() {
  isOpenModal.value = false;
  document.body.style.overflow = "auto";
}

let onlineBookingData = ref({} as OnlineBooking);

const requiredFields: Record<string, string> = {
  serviceId: "Сервис",
  clubId: "Клуб",
  bookedDateTime: "Дата брони",
};

async function createOnlineBooking() {
  if (!validationStore.checkValidation(onlineBookingData.value, requiredFields)) {
    return;
  }

  onlineBookingData.value.customerId = user.value.id;
  onlineBookingData.value.status = "PENDING";
  isLoading.value = true;
  closeModalComponent();
  await storeOnlineBookings.createOnlineBooking(onlineBookingData.value);
  onlineBookings.value = await storeOnlineBookings.getOnlineBookings();
  originallyOnlineBookings.value = onlineBookings.value;
  isLoading.value = false;
}

async function updateOnlineBooking() {
  onlineBookingData.value.bookedDateTime = new Date(
    onlineBookingData.value.bookedDateTime
  );
  if (!validationStore.checkValidation(onlineBookingData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeOnlineBookings.updateOnlineBooking(onlineBookingData.value);
  onlineBookings.value = await storeOnlineBookings.getOnlineBookings();
  originallyOnlineBookings.value = onlineBookings.value;
  isLoading.value = false;
}

let selectedCustomer = ref("Все");
let selectedService = ref("Все");
let selectedClub = ref("Все");
let selectedStatus = ref("Все");

function filterBookings(): void {
  onlineBookings.value = originallyOnlineBookings.value.filter(
    (onlineBooking: OnlineBooking) => {
      const customerFilter: boolean =
        selectedCustomer.value === "Все" ||
        onlineBooking.customer.phoneNumber === selectedCustomer.value;
      const serviceFilter: boolean =
        selectedService.value === "Все" ||
        onlineBooking.service.name === selectedService.value;
      const clubFilter: boolean =
        selectedClub.value === "Все" || onlineBooking.club.name === selectedClub.value;
      const statusFilter: boolean =
        selectedStatus.value === "Все" || onlineBooking.status === selectedStatus.value;

      return customerFilter && serviceFilter && clubFilter && statusFilter;
    }
  );
}

function getMinDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${year}-${month}-${day}`;
}
</script>

<template>
  <Head>
    <Title>Моя бронь</Title>
  </Head>
  <div v-if="!isLoading">
    <div v-if="user.subscription.length > 0 && user.subscription[0].status === 'ACTIVE'">
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Список моей брони</h1>
      <div class="flex items-end flex-col max-sm:items-start">
        <div class="mb-5 flex justify-end gap-5 max-sm:flex-col">
          <UIMainButton @click="openModalComponent">Добавить новую бронь</UIMainButton>
        </div>
        <h1 class="text-2xl max-sm:text-center w-full my-5">
          Количество броней - {{ onlineBookings.length }}
        </h1>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Сервис:</h1>
          <select
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="selectedService"
            @change="filterBookings"
          >
            <option value="Все">Все</option>
            <option :value="service.name" v-for="service in services">
              {{ service.name }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Статус:</h1>
          <select
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="selectedStatus"
            @change="filterBookings"
          >
            <option value="Все">Все</option>
            <option value="CONFIRMED">Подтверждён</option>
            <option value="PENDING">В ожидании</option>
            <option value="CANCELED">Отменен</option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-center gap-24 flex-wrap mt-24 mb-24">
        <div
          v-for="(onlineBooking, index) in onlineBookings
            .slice()
            .reverse()
            .filter(
              (onlineBooking) => onlineBooking.customer.phoneNumber === user.phoneNumber
            )"
          :key="index"
          class="max-w-[700px] w-full relative bg-white shadow-2xl rounded-xl max-h-[1000px]"
        >
          <div class="p-5 border-2 border-hover-color rounded-2xl">
            <div class="text-center mb-5 flex items-center justify-between max-sm:flex-col-reverse max-sm:gap-3">
              <h1
                class="text-green-500 text-4xl max-sm:text-3xl"
                v-if="onlineBooking.status === 'CONFIRMED'"
              >
                ПОДТВЕРЖДЁН
              </h1>
              <h1
                class="text-yellow-500 text-4xl max-sm:text-3xl"
                v-if="onlineBooking.status === 'PENDING'"
              >
                В ОЖИДАНИИ
              </h1>
              <h1
                class="text-red-500 text-4xl max-sm:text-3xl"
                v-if="onlineBooking.status === 'CANCELED'"
              >
                ОТМЕНЕН
              </h1>
              <span class="circle-image">
                <img :src="onlineBooking.club.linkToImage" alt="">
              </span>
            </div>
            <h1 class="text-2xl max-sm:text-xl mb-1">
              Бронь на телефон - {{ onlineBooking.customer.phoneNumber }}
            </h1>
            <h1 class="text-xl max-sm:text-lg mb-3">
              Дата брони -
              {{ storeUsers.getNormalizedDateWithoutTime(onlineBooking.bookedDateTime) }}
            </h1>
            <p class="text-lg max-sm:text-base">
              {{ onlineBooking.service.name }} в клубе {{ onlineBooking.club.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen flex items-center justify-center flex-col">
      <h1 class="text-4xl text-center">
        Чтобы получить доступ к данному разделу <br />
        нужно обязательно приобрести наш абонемент!
      </h1>
      <UIMainButton @click="router.push('/user/subscription')" class="mt-10"
        >Приобрести</UIMainButton
      >
    </div>
  </div>

  <div v-else class="h-screen flex items-center justify-center">
    <UISpinnerMain />
  </div>

  <UIModalComponent v-show="isOpenModal" @close-modal="closeModalComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold" v-if="!onlineBookingData.id">
        Добавить бронь
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить бронь</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Сервис</label>
        <select
          v-model="onlineBookingData.serviceId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="service in services" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Клуб</label>
        <select
          v-model="onlineBookingData.clubId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="club in clubs" :value="club.id">
            {{ club.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Дата брони</label>
        <input
          v-model="onlineBookingData.bookedDateTime"
          type="date"
          :min="getMinDate()"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div class="flex gap-3" v-if="!onlineBookingData.id">
        <UIMainButton @click="createOnlineBooking">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateOnlineBooking">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
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