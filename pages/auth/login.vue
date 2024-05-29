<script setup lang="ts">
import Cookies from "js-cookie";

const storeUsers = useUsersStore();
const router = useRouter();

const phoneNumber = ref("");
const password = ref("");
const message = ref("");

let isLoading = ref(false);

async function signIn() {
  isLoading.value = true;
  message.value = await storeUsers.signIn(phoneNumber.value, password.value);
  isLoading.value = false;
}

let user = ref({} as User);
const token = Cookies.get("token");
const userCookie = Cookies.get("user");

onBeforeMount(async () => {
  if (token && user.value.role === "ADMIN") {
    router.push("/admin/workout");
  } else if (token && user.value.role === "USER") {
    router.push("/user/subscription");
  }
});

definePageMeta({
  layout: false,
  name: "Авторизация",
});
</script>

<template>
  <Head>
    <Title>Авторизация</Title>
  </Head>
  <div
    v-if="!isLoading"
    class="flex min-h-full flex-col justify-center px-6 lg:px-8 h-screen"
  >
    <div class="flex min-h-full flex-col justify-center px-6 lg:px-8 pb-24">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          class="mx-auto h-24 w-auto"
          src="@/assets/images/logo-hs-no-word.png"
          alt="hardsport"
        />
        <h2
          class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Авторизация
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div>
          <label
            for="phone"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Номер телефона</label
          >
          <div class="mt-2">
            <input
              id="phone"
              name="phone"
              type="phone"
              autocomplete="phone"
              v-model="phoneNumber"
              required
              class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Пароль</label
            >
          </div>
          <div class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
            />
          </div>
        </div>
        <div>
          <button
            @click="signIn"
            type="submit"
            class="flex font-bold w-full justify-center rounded-md bg-hover-color px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-hover-color focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hover-color"
          >
            ВОЙТИ
          </button>
          <h1 class="text-center mt-3 text-hover-color">{{ message }}</h1>

          <h1 class="mt-5">
            Нет аккаунта? Зарегистрируйтесь
            <NuxtLink
              class="underline text-hover-color hover:opacity-60 duration-200"
              to="/auth/registration"
            >
              здесь
            </NuxtLink>
          </h1>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center flex items-center justify-center h-screen main-page">
    <UISpinnerMain />
  </div>
</template>
