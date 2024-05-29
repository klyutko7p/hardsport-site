<script setup lang="ts">
import Cookies from "js-cookie";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const user = ref({} as User);
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
    return;
  }

  user.value = storeUsers.getUser();

  isLoading.value = true;
  const [
    userData,
    usersData,
    schedulesData,
    bookingsData,
    workoutsData,
  ] = await Promise.all([
    storeUsers.getUserById(user.value.id),
    storeUsers.getUsers(),
    storeSchedules.getSchedules(),
    storeBookings.getBookings(),
    storeWorkouts.getWorkouts(),
  ]);
  user.value = userData;
  users.value = usersData;
  schedules.value = schedulesData;
  bookings.value = bookingsData;
  originallyBookings.value = bookingsData;
  workouts.value = workoutsData;
  isLoading.value = false;
});

definePageMeta({
  layout: "user",
});

async function createBooking(schedule: Schedule) {
  if (
    schedule.bookings &&
    schedule.bookings.length + schedule.reservedSlots > schedule.maxParticipants
  ) {
    toast.error("Количество максимально возможных мест превышено!");
    return;
  }

  isLoading.value = true;
  let booking = {
    scheduleId: schedule.id,
    status: "CONFIRMED",
    userId: user.value.id,
    bookingDateTime: new Date(),
  } as Booking;
  await storeBookings.createBooking(booking);
  schedules.value = await storeSchedules.getSchedules();
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

function bookedWorkout(schedule: Schedule) {
  let bookingsData = originallyBookings.value.filter(
    (booking) => booking.userId === user.value.id
  );
  if (bookingsData.some((booking) => booking.scheduleId === schedule.id)) {
    return false;
  } else {
    return true;
  }
}
</script>

<template>
  <Head>
    <Title>Бронирование тренировок</Title>
  </Head>
  <div v-if="!isLoading">
    <div v-if="user.subscription.length > 0 && user.subscription[0].status === 'ACTIVE'">
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Доступные тренировки</h1>
      <div class="overflow-x-auto mb-10 mt-16 max-h-[400px]">
        <div class="grid grid-cols-5 overflow-x-auto min-w-[1400px] text-center mb-7">
          <h1>Тренировка</h1>
          <h1>Дата тренировки</h1>
          <h1>Макс. кол-во человек</h1>
          <h1>Кол-во зарезервированных</h1>
          <h1>Забронировать место</h1>
        </div>
        <div class="space-y-10">
          <ul
            v-for="(schedule, index) in schedules?.slice().reverse()"
            :key="index"
            class="border-2 overflow-x-auto mb-10 min-w-[1400px] rounded-lg py-5 shadow-sm grid grid-cols-5 text-center"
          >
            <li class="text-sm">{{ schedule.workout.title }}</li>
            <li class="text-sm">
              {{ storeUsers.getNormalizedDateWithoutTime(schedule.dateTime) }}
            </li>
            <li class="text-sm">{{ schedule.maxParticipants }}</li>
            <li class="text-sm">
              {{ schedule.bookings.length + schedule.reservedSlots }}
            </li>
            <li class="text-sm space-x-3 mx-auto" v-if="bookedWorkout(schedule)">
              <UIMainButton @click="createBooking(schedule)">Забронировать</UIMainButton>
            </li>
            <li class="text-sm space-x-3 mx-auto text-green-500 font-bold" v-else>
              Вы успешно забронированы на эту тренировку!
            </li>
          </ul>
        </div>
      </div>

      <div class="flex items-end flex-col max-sm:items-start">
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <p>Тренировка:</p>
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
      </div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5 mt-5">Мои бронирования</h1>

      <div
        class="mt-16 mb-10 flex flex-col gap-10"
        v-if="bookings.filter((booking) => booking.userId === user.id).length > 0"
      >
        <div
          v-for="(booking, index) in bookings
            .filter((booking) => booking.userId === user.id)
            ?.slice()
            .reverse()"
          :key="index"
          class="border-2 border-hover-color p-5 rounded-2xl shadow-xl"
        >
          <div class="flex items-start justify-between max-sm:flex-col max-sm:gap-3">
            <div>
              <h1 class="text-2xl max-sm:text-xl max-[400px]:text-sm">
                {{ `${booking.schedule.workout.title},` }}
                <span>{{
                  storeUsers.getNormalizedDateWithoutTime(booking.schedule.dateTime)
                }}</span>
              </h1>
              <div class="flex items-center gap-1">
                <h1 class="text-xl max-[400px]:text-sm">{{ booking.schedule.workout.club.name }},</h1>
                <NuxtLink
                  :to="`/user/trainers/${booking.schedule.trainer?.id}`"
                  class="underline text-hover-color hover:opacity-50 duration-200 max-[400px]:text-sm"
                >
                  <h1>{{ booking.schedule.trainer?.name }}</h1>
                </NuxtLink>
              </div>
              <p class="text-green-500 font-bold text-lg max-[400px]:text-sm" v-if="booking.status === 'CONFIRMED'">
                Подтверждён
              </p>
              <p class="text-green-500 font-bold text-lg max-[400px]:text-sm" v-if="booking.status === 'PENDING'">
                В ожидании
              </p>
              <p class="text-green-500 font-bold text-lg max-[400px]:text-sm" v-if="booking.status === 'CANCELED'">
                Отменен
              </p>
              <p class="text-lg max-[400px]:text-sm">
                Дата бронирования - {{ storeUsers.getNormalizedDateWithoutTime(booking.bookingDateTime) }}
              </p>
            </div>
            <span class="circle-image">
              <img :src="booking.schedule.workout.club.linkToImage" />
            </span>
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="text-center text-hover-color text-2xl">
          Извините, бронирования не найдены!
        </h1>
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
