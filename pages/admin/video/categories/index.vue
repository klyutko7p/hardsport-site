<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const validationStore = useValidationStore();
let isLoading = ref(false);
let categories = ref<Array<LessonCategory>>();
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
  categories.value = await storeLessons.getCategories();
  isLoading.value = false;
});

definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(category: LessonCategory = {} as LessonCategory) {
  isOpenModal.value = true;
  if (category.id) {
    categoryData.value = JSON.parse(JSON.stringify(category));
  } else {
    categoryData.value = {} as LessonCategory;
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

let categoryData = ref({} as LessonCategory);
let categoryIdData = ref(0);

const requiredFields: Record<string, string> = {
  categoryName: "Название",
  iconName: "Иконка",
};

async function createCategory() {
  if (!validationStore.checkValidation(categoryData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeLessons.createCategory(categoryData.value);
  categories.value = await storeLessons.getCategories();
  isLoading.value = false;
}

async function updateCategory() {
  if (!validationStore.checkValidation(categoryData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeLessons.updateCategory(categoryData.value);
  categories.value = await storeLessons.getCategories();
  isLoading.value = false;
}

async function deleteCategory() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeLessons.deleteCategory(categoryIdData.value);
  categories.value = await storeLessons.getCategories();
  isLoading.value = false;
}
</script>

<template>
  <Head>
    <Title>Категории уроков</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование категорий</h1>
      <div class="mb-16 flex justify-end gap-5 max-sm:flex-col">
        <UIMainButton @click="router.push('/admin/video')">Добавить урок</UIMainButton>
        <UIMainButton @click="openModalComponent">Добавить категорию</UIMainButton>
      </div>
      <div class="flex items-center justify-center gap-16 flex-wrap mt-24">
        <div
          v-for="(category, index) in categories?.slice().reverse()"
          :key="index"
          class="border-2 p-3 relative flex items-center justify-between border-hover-color w-[400px] text-white shadow-2xl rounded-xl h-[140px] bg-hover-color"
        >
          <div>
            <h1 class="text-2xl">{{ category.categoryName }}</h1>
            <div class="mt-3">
              <Icon
                name="material-symbols:edit-outline"
                @click="openModalComponent(category)"
                size="24"
                class="text-white opacity-50 cursor-pointer hover:opacity-100 duration-200"
              />
              <Icon
                name="material-symbols:delete-rounded"
                @click="openModalDeleteComponent(category.id)"
                size="24"
                class="text-white opacity-50 cursor-pointer hover:opacity-100 duration-200"
              />
            </div>
          </div>
          <Icon
            :name="category.iconName"
            size="110"
            class="text-white absolute bottom-5 right-0 opacity-50 rotate-[-10deg]"
          />
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
      <div class="text-left text-xl font-bold" v-else>Изменить данные категории</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Название категории</label>
        <input
          v-model="categoryData.categoryName"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Иконка</label>
        <input
          v-model="categoryData.iconName"
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
