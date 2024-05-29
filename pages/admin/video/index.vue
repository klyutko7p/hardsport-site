<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const validationStore = useValidationStore();
let isLoading = ref(false);
let trainers = ref<Array<Trainer>>([]);
let lessons = ref<Array<Lesson>>([]);
let originallyLessons = ref<Array<Lesson>>([]);
let categories = ref<Array<LessonCategory>>([]);
let storeTrainers = useTrainersStore();
let storeLessons = useLessonsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  const [categoriesData, trainersData, lessonsData] = await Promise.all([
    storeLessons.getCategories(),
    storeTrainers.getTrainers(),
    storeLessons.getLessons(),
  ]);
  categories.value = categoriesData;
  trainers.value = trainersData;
  lessons.value = lessonsData;
  originallyLessons.value = lessonsData;
  isLoading.value = false;
});


definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(lesson: Lesson = {} as Lesson) {
  isOpenModal.value = true;
  if (lesson.id) {
    lessonData.value = JSON.parse(JSON.stringify(lesson));
  } else {
    lessonData.value = {} as Lesson;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  lessonIdData.value = id;
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

let lessonData = ref({} as Lesson);
let lessonIdData = ref(0);

const requiredFields: Record<string, string> = {
  title: "Название",
  videoLink: "Ссылка на видео",
  trainerId: "Тренер",
  categoryId: "Категория",
};

async function createLesson() {
  if (!validationStore.checkValidation(lessonData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeLessons.createLesson(lessonData.value);
  lessons.value = await storeLessons.getLessons();
  originallyLessons.value = lessons.value;
  isLoading.value = false;
}

async function updateLesson() {
  if (!validationStore.checkValidation(lessonData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeLessons.updateLesson(lessonData.value);
  lessons.value = await storeLessons.getLessons();
  originallyLessons.value = lessons.value;
  isLoading.value = false;
}

async function deleteLesson() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeLessons.deleteLesson(lessonIdData.value);
  lessons.value = await storeLessons.getLessons();
  originallyLessons.value = lessons.value;
  isLoading.value = false;
}

let selectedType = ref("Все");
function filterLessons() {
  if (selectedType.value === "Все") {
    lessons.value = originallyLessons.value;
  } else {
    lessons.value = originallyLessons.value.filter(
      (lesson) => lesson.category.categoryName === selectedType.value
    );
  }
}
</script>

<template>
  <Head>
    <Title>Видеоуроки</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование видеоуроков</h1>
      <div class="mb-16 flex justify-end gap-5 max-sm:flex-col">
        <UIMainButton @click="openModalComponent">Добавить урок</UIMainButton>
        <UIMainButton @click="router.push('/admin/video/categories')"
          >Добавить категорию</UIMainButton
        >
      </div>
      <div class="flex items-end flex-col max-sm:items-start">
        <h1 class="text-2xl max-sm:text-center w-full my-5">
          Количество уроков - {{ lessons.length }}
        </h1>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Категория:</h1>
          <select
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="selectedType"
            @change="filterLessons"
          >
            <option value="Все">Все</option>
            <option :value="category.categoryName" v-for="category in categories">
              {{ category.categoryName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-center gap-24 flex-wrap mt-24 mb-24">
        <div
          data-aos="fade-up"
          v-for="(lesson, index) in lessons.slice().reverse()"
          :key="index"
          class="max-w-[500px] w-full relative bg-white shadow-2xl rounded-2xl max-h-[1000px]"
        >
          <div class="absolute top-[-50px] right-0">
            <Icon
              name="material-symbols:edit-outline"
              @click="openModalComponent(lesson)"
              size="40"
              class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
            />
            <Icon
              name="material-symbols:delete-rounded"
              @click="openModalDeleteComponent(lesson.id)"
              size="40"
              class="text-hover-color cursor-pointer hover:opacity-50 duration-200"
            />
          </div>
          <iframe
            height="315"
            :src="`https://www.youtube.com/embed/${
              lesson.videoLink.split('=')[1].split('&')[0]
            }`"
            frameborder="0"
            class="rounded-t-2xl w-full max-w-[500px]"
            allowfullscreen
          ></iframe>
          <div class="p-3">
            <div
              class="flex justify-between max-sm:flex-col-reverse max-sm:justify-center max-sm:gap-3"
            >
              <div>
                <h1 class="text-lg min-h-[60px]">{{ lesson.title }}</h1>
                <h1>{{ lesson.category.categoryName }}</h1>
                <h1>
                  Подготовил:
                  <NuxtLink :to="`/admin/trainers/${lesson.trainer.id}`"
                    class="underline text-hover-color cursor-pointer hover:opacity-50 duration-200"
                  >
                    {{ lesson.trainer.name }}
                  </NuxtLink>
                </h1>
                <p>Продолжительность: {{ lesson.duration }} мин.</p>
              </div>
              <span class="circle-image">
                <img v-if="lesson.trainer.photo" :src="lesson.trainer.photo" alt="" />
                <img
                  v-else
                  src="https://st3.depositphotos.com/1717437/18622/v/450/depositphotos_186223678-stock-illustration-incognito-unknown-person-silhouette-man.jpg"
                  alt=""
                  class=""
                />
              </span>
            </div>
            <p class="text-sm mt-5 overflow-auto max-h-[150px] min-h-[150px]">
              {{ lesson.description }}
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
      <div class="text-left text-xl font-bold" v-if="!lessonData.id">Добавить урок</div>
      <div class="text-left text-xl font-bold" v-else>Изменить данные урока</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Название урока</label>
        <input
          v-model="lessonData.title"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Описание урока</label>
        <textarea
          v-model="lessonData.description"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Длительность (мин.)</label>
        <input
          v-model="lessonData.duration"
          type="number"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Ссылка на видео</label>
        <input
          v-model="lessonData.videoLink"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Тренер</label>
        <select
          v-model="lessonData.trainerId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="trainer in trainers" :value="trainer.id">
            {{ trainer.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Категория</label>
        <select
          v-model="lessonData.categoryId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="category in categories" :value="category.id">
            {{ category.categoryName }}
          </option>
        </select>
      </div>

      <div class="flex gap-3" v-if="!lessonData.id">
        <UIMainButton @click="createLesson">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateLesson">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить урок</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данный урок?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteLesson">Удалить</UIMainButton>
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
  width: 100px;
  height: 100px;
}
.circle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
