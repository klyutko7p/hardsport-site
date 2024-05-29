<script setup lang="ts">
import Cookies from "js-cookie";

const validationStore = useValidationStore();
const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
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
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  const [usersData, clubsData, servicesData, onlineBookingsData] = await Promise.all([
    storeUsers.getUsers(),
    storeClubs.getClubs(),
    storeOnlineBookings.getServices(),
    storeOnlineBookings.getOnlineBookings(),
  ]);
  users.value = usersData;
  clubs.value = clubsData;
  services.value = servicesData;
  onlineBookings.value = onlineBookingsData;
  originallyOnlineBookings.value = onlineBookingsData;
  isLoading.value = false;
});

definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

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

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  onlineBookingIdData.value = id;
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

let onlineBookingData = ref({} as OnlineBooking);
let onlineBookingIdData = ref(0);

const requiredFields: Record<string, string> = {
  customerId: "Владелец",
  serviceId: "Сервис",
  clubId: "Клуб",
  bookedDateTime: "Дата брони",
  status: "Статус",
};

async function createOnlineBooking() {
  if (!validationStore.checkValidation(onlineBookingData.value, requiredFields)) {
    return;
  }

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

async function deleteOnlineBooking() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeOnlineBookings.deleteOnlineBooking(onlineBookingIdData.value);
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
</script>

<template>
  <Head>
    <Title>Бронь</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование броней</h1>
      <div class="mb-5 flex justify-end gap-5 max-sm:flex-col">
        <UIMainButton @click="openModalComponent">Добавить бронь</UIMainButton>
        <UIMainButton @click="router.push('/admin/online-booking/services')"
          >Добавить сервис</UIMainButton
        >
      </div>
      <div class="flex items-end flex-col max-sm:items-start">
        <h1 class="text-2xl max-sm:text-center w-full my-5">
          Количество броней - {{ onlineBookings.length }}
        </h1>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Пользователь:</h1>
          <select
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="selectedCustomer"
            @change="filterBookings"
          >
            <option value="Все">Все</option>
            <option :value="user.phoneNumber" v-for="user in users">
              {{ user.profile.name + " " + user.profile.surname }}
            </option>
          </select>
        </div>
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
          data-aos="fade-up"
          v-for="(onlineBooking, index) in onlineBookings.slice().reverse()"
          :key="index"
          class="max-w-[700px] w-full relative bg-white shadow-2xl rounded-xl max-h-[1000px]"
        >
          <div class="absolute top-[-50px] right-0">
            <Icon
              name="material-symbols:edit-outline"
              @click="openModalComponent(onlineBooking)"
              size="32"
              class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
            />
            <Icon
              name="material-symbols:delete-rounded"
              @click="openModalDeleteComponent(onlineBooking.id)"
              size="32"
              class="text-hover-color cursor-pointer hover:opacity-50 duration-200"
            />
          </div>
          <div class="p-5 border-2 border-hover-color rounded-2xl">
            <div class="text-center mb-5">
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
        <label>Владелец брони</label>
        <select
          v-model="onlineBookingData.customerId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="user in users" :value="user.id">
            {{
              user.profile.name + " " + user.profile.surname + ` (${user.phoneNumber})`
            }}
          </option>
        </select>
      </div>

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
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Статус</label>
        <select
          v-model="onlineBookingData.status"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option value="CONFIRMED">Подтверждён</option>
          <option value="PENDING">В ожидании</option>
          <option value="CANCELED">Отменен</option>
        </select>
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

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить бронь</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данную бронь?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteOnlineBooking">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
</template>
