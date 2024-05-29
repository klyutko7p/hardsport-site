<script setup lang="ts">
import Cookies from "js-cookie";
import { useToast } from "vue-toastification";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
let isLoading = ref(false);
let schedules = ref<Array<Schedule>>([]);
let workouts = ref<Array<Workout>>([]);
let trainers = ref<Array<Trainer>>([]);

const toast = useToast();

const storeSchedules = useScheduleStore();
const storeWorkouts = useWorkoutStore();
const storeTrainers = useTrainersStore();
const storeUsers = useUsersStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  const [schedulesData, workoutsData, trainersData] = await Promise.all([
    storeSchedules.getSchedules(),
    storeWorkouts.getWorkouts(),
    storeTrainers.getTrainers(),
  ]);
  schedules.value = schedulesData;
  workouts.value = workoutsData;
  trainers.value = trainersData;
  isLoading.value = false;
});


definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(schedule: Schedule = {} as Schedule) {
  isOpenModal.value = true;
  if (schedule.id) {
    scheduleData.value = JSON.parse(JSON.stringify(schedule));
  } else {
    scheduleData.value = {} as Schedule;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  scheduleIdData.value = id;
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

let scheduleData = ref({} as Schedule);
let scheduleIdData = ref(0);

const validationStore = useValidationStore();
const requiredFields: Record<string, string> = {
  workoutId: "Тренировка",
  dateTime: "Дата тренировки",
  maxParticipants: "Макс. кол-во человек",
  reservedSlots: "Кол-во зарезервированных",
};

async function createSchedule() {
  if (
    scheduleData.value.bookings &&
    scheduleData.value.bookings.length + scheduleData.value.reservedSlots >
      scheduleData.value.maxParticipants
  ) {
    toast.error("Количество максимально возможных мест превышено!");
    return;
  }

  if (!validationStore.checkValidation(scheduleData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeSchedules.createSchedule(scheduleData.value);
  schedules.value = await storeSchedules.getSchedules();
  isLoading.value = false;
}

async function updateSchedule() {
  if (
    scheduleData.value.bookings &&
    scheduleData.value.bookings.length + scheduleData.value.reservedSlots >
      scheduleData.value.maxParticipants
  ) {
    toast.error("Количество максимально возможных мест превышено!");
    return;
  }

  if (!validationStore.checkValidation(scheduleData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeSchedules.updateSchedule(scheduleData.value);
  schedules.value = await storeSchedules.getSchedules();
  isLoading.value = false;
}

async function deleteSchedule() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeSchedules.deleteSchedule(scheduleIdData.value);
  schedules.value = await storeSchedules.getSchedules();
  isLoading.value = false;
}
</script>

<template>
  <Head>
    <Title>Расписание тренировок</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование расписаний</h1>
      <div class="mb-16 flex justify-end gap-5 max-lg:flex-col">
        <UIMainButton @click="router.push('/admin/workout/booking')"
          >Добавить бронь</UIMainButton
        >
        <UIMainButton @click="openModalComponent">Добавить расписание</UIMainButton>
        <UIMainButton @click="router.push('/admin/workout')"
          >Добавить тренировку</UIMainButton
        >
        <UIMainButton @click="router.push('/admin/workout/category')"
          >Добавить категорию</UIMainButton
        >
      </div>
      <div class="overflow-x-auto mb-10">
        <div class="grid grid-cols-6 overflow-x-auto min-w-[1400px] text-center mb-7">
          <h1>Тренировка</h1>
          <h1>Дата тренировки</h1>
          <h1>Макс. кол-во человек</h1>
          <h1>Кол-во зарезервированных</h1>
          <h1>Тренер</h1>
          <h1>Изменить</h1>
        </div>
        <div class="space-y-10">
          <ul
            v-for="(schedule, index) in schedules?.slice().reverse()"
            :key="index"
            class="border-2 overflow-x-auto mb-10 min-w-[1400px] rounded-lg py-5 shadow-sm grid grid-cols-6 text-center"
          >
            <li class="text-sm">{{ schedule.workout.title }}</li>
            <li class="text-sm">
              {{ storeUsers.getNormalizedDateWithoutTime(schedule.dateTime) }}
            </li>
            <li class="text-sm">{{ schedule.maxParticipants }}</li>
            <li class="text-sm">
              {{ schedule.bookings.length + schedule.reservedSlots }}
            </li>
            <li class="text-sm">{{ schedule.trainer?.name }}</li>
            <li class="text-sm space-x-3">
              <Icon
                name="material-symbols:edit-outline"
                @click="openModalComponent(schedule)"
                size="24"
                class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
              />
              <Icon
                name="material-symbols:delete-rounded"
                @click="openModalDeleteComponent(schedule.id)"
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
      <div class="text-left text-xl font-bold" v-if="!scheduleData.id">
        Добавить расписание
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить расписание</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Тренировка</label>
        <select
          v-model="scheduleData.workoutId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option :value="workout.id" v-for="workout in workouts">
            {{ workout.title + " " + `(${workout.type})` }}
          </option>
        </select>
      </div>

      <div>
        <label>Дата тренировки</label>
        <input
          v-model="scheduleData.dateTime"
          type="date"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Макс. кол-во человек</label>
        <input
          v-model="scheduleData.maxParticipants"
          type="number"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Кол-во зарезервированных</label>
        <input
          v-model="scheduleData.reservedSlots"
          type="number"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Тренер</label>
        <select
          v-model="scheduleData.trainerId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option :value="trainer.id" v-for="trainer in trainers">
            {{ trainer.name }}
          </option>
        </select>
      </div>

      <div class="flex gap-3" v-if="!scheduleData.id">
        <UIMainButton @click="createSchedule">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateSchedule">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить расписание</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данное расписание?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteSchedule">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
</template>
