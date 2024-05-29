<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const user = ref({} as User);
let userData = ref({} as User);

let isLoading = ref(false);
const storeUsers = useUsersStore();

onBeforeMount(async () => {
  isLoading.value = true;
  user.value = storeUsers.getUser();
  userData.value = user.value;
  isLoading.value = false;
});

onMounted(async () => {
  if (!token) {
    router.push("/auth/login");
  }
});

async function saveProfile() {
  isLoading.value = true;
  await storeUsers.updateUser(userData.value);
  Cookies.set("user", JSON.stringify(userData.value), { expires: 7 });
  isLoading.value = false;
}

definePageMeta({
  layout: "user",
});
</script>

<template>
  <Head>
    <Title>Профиль</Title>
  </Head>
  <div v-if="userData.profile && !isLoading"
    class="py-10 flex items-start text-left justify-between mx-auto max-2xl:flex-col container"
  >
    <div class="max-2xl:mb-5">
      <h1>Персональная информация</h1>
      <p>Измените и обновите информацию о себе</p>
    </div>
    <div class="bg-white shadow-sm border-2 max-w-[1000px] w-full p-10 rounded-md">
      <div class="flex items-center justify-between max-lg:gap-3 max-sm:flex-col w-full">
        <div class="w-[400px] max-sm:w-full">
          <label>Имя</label>
          <input
            v-model="userData.profile.name"
            type="text"
            class="block mt-2 w-full max-w-[400px] bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div class="w-[400px] max-sm:w-full">
          <label>Фамилия</label>
          <input
            v-model="userData.profile.surname"
            type="text"
            class="block mt-2 w-full max-w-[400px] bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div class="mt-5">
        <label>Пол</label>
        <select
          v-model="userData.profile.gender"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="MALE">Мужской</option>
          <option value="FEMALE">Женский</option>
        </select>
      </div>
      <div class="flex items-center justify-between max-sm:flex-col w-full mt-5 gap-5">
        <div class="w-[500px] max-sm:w-full">
          <label>Возраст</label>
          <input
            v-model="userData.profile.age"
            type="number"
            class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div class="w-[500px] max-sm:w-full">
          <label>Рост (СМ)</label>
          <input
            v-model="userData.profile.height"
            type="number"
            class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div class="w-[500px] max-sm:w-full">
          <label>Вес (КГ)</label>
          <input
            v-model="userData.profile.weight"
            type="number"
            class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <UIMainButton @click="saveProfile" class="mt-10">Сохранить</UIMainButton>
    </div>
  </div>

  <div v-else class="h-screen flex items-center justify-center">
    <UISpinnerMain />
  </div>
</template>
