<script setup lang="ts">
import Cookies from "js-cookie";
import { useToast } from "vue-toastification";

const router = useRouter();
const token = Cookies.get("token");
const toast = useToast()
let isLoading = ref(false);
let categories = ref<Array<LessonCategory>>();
let storeLessons = useLessonsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return;
  }

  isLoading.value = true;
  categories.value = await storeLessons.getCategories();
  isLoading.value = false;
});

definePageMeta({
  layout: "user",
});

function handleCategoryClick(category: LessonCategory) {
  if (category.lessons.length >= 1) {
    router.push(`video/${category.id}`);
  } else {
    toast.error("Извините, в данное время эта категория недоступна.")
  }
}
</script>

<template>
  <Head>
    <Title>Категории уроков</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">
        Выберите категорию видеоуроков
      </h1>
      <div class="flex items-center justify-center gap-16 flex-wrap mt-24">
        <div
          v-for="(category, index) in categories?.slice().reverse()"
          :key="index"
          class="border-2 p-3 relative hover:opacity-75 duration-200 flex items-center justify-between border-hover-color w-[400px] text-white shadow-2xl rounded-xl h-[140px] bg-hover-color"
          :class="{ 'cursor-not-allowed': category.lessons.length < 1, 'cursor-pointer': category.lessons.length >= 1 }"
          @click.stop="handleCategoryClick(category)"
        >
          <div>
            <h1 class="text-2xl">{{ category.categoryName }}</h1>
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
</template>
