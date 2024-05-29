<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
let isLoading = ref(false);
const validationStore = useValidationStore();
let workouts = ref<Array<Workout>>([]);
let workoutCategories = ref<Array<WorkoutCategory>>([]);
let clubs = ref<Array<Club>>([]);

const storeWorkouts = useWorkoutStore();
const storeClubs = useClubsStore();
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
  const [workoutsData, workoutCategoriesData, clubsData] = await Promise.all([
    storeWorkouts.getWorkouts(),
    storeWorkouts.getCategories(),
    storeClubs.getClubs(),
  ]);
  workouts.value = workoutsData;
  workoutCategories.value = workoutCategoriesData;
  clubs.value = clubsData;
  isLoading.value = false;
});


definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(workout: Workout = {} as Workout) {
  isOpenModal.value = true;
  if (workout.id) {
    workoutData.value = JSON.parse(JSON.stringify(workout));
  } else {
    workoutData.value = {} as Workout;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  workoutIdData.value = id;
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

let workoutData = ref({} as Workout);
let workoutIdData = ref(0);

const requiredFields: Record<string, string> = {
  title: "Название",
  categoryId: "Категория",
  clubId: "Клуб",
};


async function createWorkout() {
  if (!validationStore.checkValidation(workoutData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeWorkouts.createWorkout(workoutData.value);
  workouts.value = await storeWorkouts.getWorkouts();
  isLoading.value = false;
}

async function updateWorkout() {
  if (!validationStore.checkValidation(workoutData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeWorkouts.updateWorkout(workoutData.value);
  workouts.value = await storeWorkouts.getWorkouts();
  isLoading.value = false;
}

async function deleteWorkout() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeWorkouts.deleteWorkout(workoutIdData.value);
  workouts.value = await storeWorkouts.getWorkouts();
  isLoading.value = false;
}
</script>

<template>
  <Head>
    <Title>Тренировки</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование тренировок</h1>
      <div class="mb-16 flex justify-end gap-5 max-lg:flex-col">
        <UIMainButton @click="router.push('/admin/workout/booking')"
        >Добавить бронь</UIMainButton
      >
        <UIMainButton @click="router.push('/admin/workout/schedule')"
          >Добавить расписание</UIMainButton
        >
        <UIMainButton @click="openModalComponent">Добавить тренировку</UIMainButton>
        <UIMainButton @click="router.push('/admin/workout/category')"
          >Добавить категорию</UIMainButton
        >
      </div>
      <div class="overflow-x-auto mb-10">
        <div class="grid grid-cols-7 overflow-x-auto min-w-[1400px] text-center mb-7">
          <h1>Название</h1>
          <h1>Описание</h1>
          <h1>Тип</h1>
          <h1>Категория</h1>
          <h1>Расписание</h1>
          <h1>Клуб</h1>
          <h1>Изменить</h1>
        </div>
        <div class="space-y-10">
          <ul
            v-for="(workout, index) in workouts?.slice().reverse()"
            :key="index"
            class="border-2 overflow-x-auto mb-10 min-w-[1400px] rounded-lg py-5 shadow-sm grid grid-cols-7 text-center"
          >
            <li class="text-sm">{{ workout.title }}</li>
            <li class="text-sm">{{ workout.description }}</li>
            <li class="text-sm">{{ workout.type }}</li>
            <li class="text-sm">{{ workout.category.name }}</li>
            <li class="text-sm flex flex-col items-center">
              <span
                v-for="(schedule, index) in workout.schedules"
                :key="index"
              >
                <div>
                  <p class="flex gap-1">
                      {{ schedule.trainer?.name }}: 
                    <span class="font-bold">
                       {{
                        storeUsers.getNormalizedDateWithoutTime(schedule.dateTime)
                      }}</span
                    >
                  </p>
                </div>
              </span>
            </li>
            <li class="text-sm">{{ workout.club.name }}</li>
            <li class="text-sm space-x-3">
              <Icon
                name="material-symbols:edit-outline"
                @click="openModalComponent(workout)"
                size="24"
                class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
              />
              <Icon
                name="material-symbols:delete-rounded"
                @click="openModalDeleteComponent(workout.id)"
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
      <div class="text-left text-xl font-bold" v-if="!workoutData.id">
        Добавить тренировку
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить тренировку</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Название тренировки</label>
        <input
          v-model="workoutData.title"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Описание тренировки</label>
        <textarea
          v-model="workoutData.description"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Тип тренировки</label>
        <select
          v-model="workoutData.type"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option value="Групповая">Групповая</option>
          <option value="Индивидуальная">Индивидуальная</option>
        </select>
      </div>

      <div>
        <label>Категория</label>
        <select
          v-model="workoutData.categoryId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option :value="category.id" v-for="category in workoutCategories">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Клуб</label>
        <select
          v-model="workoutData.clubId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option :value="club.id" v-for="club in clubs">
            {{ club.name }}
          </option>
        </select>
      </div>

      <div class="flex gap-3" v-if="!workoutData.id">
        <UIMainButton @click="createWorkout">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateWorkout">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить тренировку</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данную тренировку?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteWorkout">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
</template>
