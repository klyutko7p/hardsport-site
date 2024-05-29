<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
let isLoading = ref(false);
let categories = ref<Array<WorkoutCategory>>([]);
const storeCategories = useWorkoutStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  categories.value = await storeCategories.getCategories();
  isLoading.value = false;
});


definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(category: WorkoutCategory = {} as WorkoutCategory) {
  isOpenModal.value = true;
  if (category.id) {
    categoryData.value = JSON.parse(JSON.stringify(category));
  } else {
    categoryData.value = {} as WorkoutCategory;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  categoryIdData.value = id;
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

let categoryData = ref({} as WorkoutCategory);
let categoryIdData = ref(0);

const validationStore = useValidationStore();
const requiredFields: Record<string, string> = {
  name: "Название",
};

async function createCategory() {
  if (!validationStore.checkValidation(categoryData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeCategories.createCategory(categoryData.value);
  categories.value = await storeCategories.getCategories();
  isLoading.value = false;
}

async function updateCategory() {
  if (!validationStore.checkValidation(categoryData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeCategories.updateCategory(categoryData.value);
  categories.value = await storeCategories.getCategories();
  isLoading.value = false;
}

async function deleteCategory() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeCategories.deleteCategory(categoryIdData.value);
  categories.value = await storeCategories.getCategories();
  isLoading.value = false;
}
</script>

<template>
  <Head>
    <Title>Категории тренировок</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование категорий</h1>
      <div class="mb-16 flex justify-end gap-5 max-lg:flex-col">
        <UIMainButton @click="router.push('/admin/workout/booking')"
          >Добавить бронь</UIMainButton
        >
        <UIMainButton @click="router.push('/admin/workout/schedule')"
          >Добавить расписание</UIMainButton
        >
        <UIMainButton @click="router.push('/admin/workout')"
          >Добавить тренировку</UIMainButton
        >
        <UIMainButton @click="openModalComponent">Добавить категорию</UIMainButton>
      </div>
      <div class="overflow-x-auto mb-10">
        <div class="grid grid-cols-4 overflow-x-auto min-w-[1400px] text-center mb-7">
          <h1>Номер</h1>
          <h1>Название</h1>
          <h1>Количество тренировок</h1>
          <h1>Изменить</h1>
        </div>
        <div class="space-y-10">
          <ul
            v-for="(category, index) in categories?.slice().reverse()"
            :key="index"
            class="border-2 overflow-x-auto mb-10 min-w-[1400px] rounded-lg py-5 shadow-sm grid grid-cols-4 text-center"
          >
            <li class="text-sm">{{ index + 1 }}</li>
            <li class="text-sm">{{ category.name }}</li>
            <li class="text-sm">{{ category.workouts.length }}</li>
            <li class="text-sm space-x-3">
              <Icon
                name="material-symbols:edit-outline"
                @click="openModalComponent(category)"
                size="24"
                class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
              />
              <Icon
                name="material-symbols:delete-rounded"
                @click="openModalDeleteComponent(category.id)"
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
      <div class="text-left text-xl font-bold" v-if="!categoryData.id">
        Добавить категорию
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить категорию</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Название категории</label>
        <input
          v-model="categoryData.name"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div class="flex gap-3" v-if="!categoryData.id">
        <UIMainButton @click="createCategory">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateCategory">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить категорию</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данную категорию?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteCategory">Удалить</UIMainButton>
        <UICancelButton @click="closeModalDeleteComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>
</template>
