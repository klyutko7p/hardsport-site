<script setup lang="ts">
import Cookies from "js-cookie";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
let isLoading = ref(false);
let users = ref<Array<User>>([]);
let schedules = ref<Array<Schedule>>([]);
let bookings = ref<Array<Booking>>([]);
let workouts = ref<Array<Workout>>([]);
let originallyBookings = ref<Array<Booking>>([]);

const storeUsers = useUsersStore();
const storeSchedules = useScheduleStore();
const storeWorkouts = useWorkoutStore();
const storeBookings = useBookingsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  const [usersData, schedulesData, bookingsData, workoutsData] = await Promise.all([
    storeUsers.getUsers(),
    storeSchedules.getSchedules(),
    storeBookings.getBookings(),
    storeWorkouts.getWorkouts(),
  ]);
  users.value = usersData;
  schedules.value = schedulesData;
  bookings.value = bookingsData;
  originallyBookings.value = bookingsData;
  workouts.value = workoutsData;
  isLoading.value = false;
});


definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(booking: Booking = {} as Booking) {
  isOpenModal.value = true;
  if (booking.id) {
    bookingData.value = JSON.parse(JSON.stringify(booking));
    bookingData.value.bookingDateTime = storeUsers.getISODate(
      bookingData.value.bookingDateTime
    );
  } else {
    bookingData.value = {} as Booking;
    bookingData.value.bookingDateTime = storeUsers.getISODate(new Date());
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  BookingIdData.value = id;
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

let bookingData = ref({} as Booking);
let BookingIdData = ref(0);

const validationStore = useValidationStore();
const requiredFields: Record<string, string> = {
  scheduleId: "Расписание на",
  userId: "Владелец брони",
  status: "Статус",
  bookingDateTime: "Дата брони",
};

async function createBooking() {
  bookingData.value.scheduleId = bookingData.value.schedule.id;

  if (
    bookingData.value.schedule &&
    bookingData.value.schedule.bookings &&
    bookingData.value.schedule.maxParticipants <
      bookingData.value.schedule.reservedSlots +
        bookingData.value.schedule.bookings.length +
        1
  ) {
    toast.error("Количество зарезервированных уже максимальное количество!");
    return;
  }

  if (!validationStore.checkValidation(bookingData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeBookings.createBooking(bookingData.value);
  bookings.value = await storeBookings.getBookings();
  originallyBookings.value = bookings.value;
  isLoading.value = false;
}

async function updateBooking() {
  if (
    bookingData.value.schedule &&
    bookingData.value.schedule.bookings &&
    bookingData.value.schedule.maxParticipants <
      bookingData.value.schedule.reservedSlots +
        bookingData.value.schedule.bookings.length +
        1
  ) {
    toast.error("Количество зарезервированных уже максимальное количество!");
    return;
  }
  bookingData.value.bookingDateTime = new Date(bookingData.value.bookingDateTime);
  isLoading.value = true;

  if (!validationStore.checkValidation(bookingData.value, requiredFields)) {
    return;
  }

  closeModalComponent();
  await storeBookings.updateBooking(bookingData.value);
  bookings.value = await storeBookings.getBookings();
  originallyBookings.value = bookings.value;
  isLoading.value = false;
}

async function deleteBooking() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeBookings.deleteBooking(BookingIdData.value);
  bookings.value = await storeBookings.getBookings();
  originallyBookings.value = bookings.value;
  isLoading.value = false;
}

let selectedCustomer = ref("");
let selectedWorkout = ref("Все");
let selectedStatus = ref("Все");

function filterBookings(): void {
  bookings.value = originallyBookings.value.filter((booking: Booking) => {
    const serviceFilter: boolean =
      selectedWorkout.value === "Все" ||
      booking.schedule.workout.title === selectedWorkout.value;
    const statusFilter: boolean =
      selectedStatus.value === "Все" || booking.status === selectedStatus.value;
    const userFilter: boolean = `${booking.user.profile.name} ${booking.user.profile.surname}`
      .trim()
      .toLowerCase()
      .includes(selectedCustomer.value.trim().toLowerCase());

    return userFilter && serviceFilter && statusFilter;
  });
}
</script>

<template>
  <Head>
    <Title>Бронирование тренировок</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование броней</h1>
      <div class="mb-5 flex justify-end gap-5 max-lg:flex-col">
        <UIMainButton @click="openModalComponent">Добавить бронь</UIMainButton>
        <UIMainButton @click="router.push('/admin/workout/schedule')"
          >Добавить расписание</UIMainButton
        >
        <UIMainButton @click="router.push('/admin/workout')"
          >Добавить тренировку</UIMainButton
        >
        <UIMainButton @click="router.push('/admin/workout/category')"
          >Добавить категорию</UIMainButton
        >
      </div>
      <div class="flex items-end flex-col max-sm:items-start">
        <h1 class="text-2xl max-sm:text-center w-full my-5">
          Количество броней - {{ bookings.length }}
        </h1>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Пользователь:</h1>
          <input
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="selectedCustomer"
            @input="filterBookings"
          />
        </div>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Тренировка:</h1>
          <select
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="selectedWorkout"
            @change="filterBookings"
          >
            <option value="Все">Все</option>
            <option :value="workout.title" v-for="workout in workouts">
              {{ workout.title }}
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
      <div class="overflow-x-auto mt-16 mb-10">
        <div class="grid grid-cols-5 overflow-x-auto min-w-[1400px] text-center mb-7">
          <h1>Расписание</h1>
          <h1>Пользователь</h1>
          <h1>Статус</h1>
          <h1>Дата бронирования</h1>
          <h1>Изменить</h1>
        </div>
        <div class="space-y-10">
          <ul
            v-for="(booking, index) in bookings?.slice().reverse()"
            :key="index"
            class="border-2 overflow-x-auto mb-10 min-w-[1400px] rounded-lg py-5 shadow-sm grid grid-cols-5 text-center"
          >
            <li class="text-sm">
              {{
                `${booking.schedule.workout.title}, ${booking.schedule.workout.club.name}`
              }}
              <br />
              <span>{{
                storeUsers.getNormalizedDateWithoutTime(booking.schedule.dateTime)
              }}</span>
            </li>
            <li class="text-sm">
              {{
                booking.user.profile.name +
                " " +
                booking.user.profile.surname +
                " " +
                `(${booking.user.phoneNumber})`
              }}
            </li>
            <li class="text-green-500 font-bold" v-if="booking.status === 'CONFIRMED'">
              Подтверждён
            </li>
            <li class="text-green-500 font-bold" v-if="booking.status === 'PENDING'">
              В ожидании
            </li>
            <li class="text-green-500 font-bold" v-if="booking.status === 'CANCELED'">
              Отменен
            </li>
            <li class="text-sm">
              {{ storeUsers.getNormalizedDateWithoutTime(booking.bookingDateTime) }}
            </li>
            <li class="text-sm space-x-3">
              <Icon
                name="material-symbols:edit-outline"
                @click="openModalComponent(booking)"
                size="24"
                class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
              />
              <Icon
                name="material-symbols:delete-rounded"
                @click="openModalDeleteComponent(booking.id)"
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
      <div class="text-left text-xl font-bold" v-if="!bookingData.id">Добавить бронь</div>
      <div class="text-left text-xl font-bold" v-else>Изменить бронь</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Расписание на</label>
        <select
          v-model="bookingData.schedule"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="schedule in schedules" :value="schedule">
            {{
              `${schedule.workout.title}, ${
                schedule.workout.club.name
              } (${storeUsers.getNormalizedDateWithoutTime(schedule.dateTime)})`
            }}
          </option>
        </select>
      </div>

      <div>
        <label>Владелец брони</label>
        <select
          v-model="bookingData.userId"
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
        <label>Статус</label>
        <select
          v-model="bookingData.status"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option value="CONFIRMED">Подтверждён</option>
          <option value="PENDING">В ожидании</option>
          <option value="CANCELED">Отменен</option>
        </select>
      </div>

      <div>
        <label>Дата бронирования</label>
        <input
          v-model="bookingData.bookingDateTime"
          type="date"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div class="flex gap-3" v-if="!bookingData.id">
        <UIMainButton @click="createBooking">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateBooking">Изменить</UIMainButton>
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
        <UIMainButton @click="deleteBooking">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
</template>
