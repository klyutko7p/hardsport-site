<script setup lang="ts">
import { useToast } from "vue-toastification";

const config = useRuntimeConfig();

const storeUsers = useUsersStore();

definePageMeta({
  layout: false,
  name: "Регистрация",
});

const toast = useToast();

let originallyConfirmationCode = ref("");

async function uploadData(chat_id: string) {
  const confirmationCode = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  const messageText = `Ваш код подтверждения: ${confirmationCode}`;
  originallyConfirmationCode.value = confirmationCode;

  const formData = new FormData();
  formData.append("chat_id", chat_id);
  formData.append("text", messageText);
  const botToken = config.public.tokenTelegramBot;

  let response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    body: formData,
  });

  let data = await response.json();
}

async function getChatData() {
  const botToken = config.public.tokenTelegramBot;
  const apiUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;
  let requestSent = false;
  let requestPhone = false;

  while (!requestSent) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok && data.ok) {
        if (data.result.length > 0) {
          data.result.forEach(async (update) => {
            const chatData = update.message;
            const username = chatData.chat.username;
            const contact = chatData.contact;

            if (username === registrationUser.value.usernameTG && !requestPhone) {
              if (!contact) {
                await requestContact(chatData.chat.id);
                requestPhone = true;
              }
            }

            if (contact) {
              const phoneNumber = contact.phone_number;
              if (phoneNumber === registrationUser.value.phoneNumber) {
                await uploadData(chatData.chat.id);
              }
              requestSent = true;
              return;
            }
          });
        } else {
          console.log("No updates received.");
        }
      } else {
        console.log("Failed to get updates.");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

async function requestContact(chatId: string) {
  const botToken = config.public.tokenTelegramBot;
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const keyboard = {
    keyboard: [[{ text: "Предоставить номер телефона", request_contact: true }]],
    one_time_keyboard: true,
  };

  const formData = new URLSearchParams();
  formData.append("chat_id", chatId);
  formData.append("text", "Предоставьте свой номер телефона:");
  formData.append("reply_markup", JSON.stringify(keyboard));

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
  } catch (error) {
    console.error("Error requesting contact:", error);
  }
}

let errorTextValidation = ref("");
let isShowFirstModal = ref(false);
let isShowSecondModal = ref(false);

function showFirstModal() {
  if (registrationUser.value.phoneNumber.length < 11) {
    errorTextValidation.value = "Неправильный ввод номера телефона";
    return;
  }

  if (registrationUser.value.phoneNumber.length > 12) {
    errorTextValidation.value = "Неправильный ввод номера телефона";
    return;
  }

  if (!registrationUser.value.phoneNumber.startsWith("+7")) {
    errorTextValidation.value = 'Номер телефона должен начинаться с "+7"';
    return;
  }

  if (registrationUser.value.usernameTG.trim() === "") {
    errorTextValidation.value = "Пожалуйста, введите имя пользователя";
    return;
  }

  if (
    !/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?/~`|-]+$/.test(
      registrationUser.value.usernameTG
    )
  ) {
    errorTextValidation.value =
      "Имя пользователя должно содержать только английские буквы, цифры и специальные символы";
    return;
  }

  if (registrationUser.value.password.trim() === "") {
    errorTextValidation.value = "Пожалуйста, введите пароль";
    return;
  }

  if (registrationUser.value.repeatPassword?.trim() === "") {
    errorTextValidation.value = "Пожалуйста, повторите пароль";
    return;
  }

  if (registrationUser.value.password !== registrationUser.value.repeatPassword) {
    errorTextValidation.value = "Пароль и повтор пароля не совпадают";
    return;
  }

  errorTextValidation.value = "";
  isShowFirstModal.value = true;
}

function showSecondModal() {
  isShowFirstModal.value = false;
  isShowSecondModal.value = true;
}

async function isValidateConfirmationCode() {
  if (confirmationCode.value.length === 5) {
    if (confirmationCode.value === originallyConfirmationCode.value) {
      isLoading.value = true;
      let data = await storeUsers.createUser(registrationUser.value);
      console.log(data);
      if (data !== undefined) {
        toast.success("Вы успешно зарегистрированы!");
      } else {
        toast.error("Произошла ошибка: Пользователь уже существует");
      }
      isLoading.value = false;
    } else {
      toast.error("Вы ввели неправильный код, попробуйте ещё раз!");
    }
  }
}

let confirmationCode = ref("");
let registrationUser = ref({
  usernameTG: "",
  phoneNumber: "",
  role: "USER",
  password: "",
  repeatPassword: "",
  profile: {
    age: 0,
    gender: "",
    height: 0,
    name: "",
    surname: "",
    weight: 0,
  },
} as User);
let isLoading = ref(false);
let isShowInputConfirmationCode = ref(false);
</script>

<template>
  <Head>
    <Title>Регистрация в HardSport</Title>
  </Head>
  <div class="h-screen" v-if="!isLoading">
    <div class="py-28 mx-auto container h-screen">
      <div
        class="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl"
      >
        <div
          class="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style="
            background-image: url('https://sportishka.com/uploads/posts/2021-11/1636992822_1-sportishka-com-p-elitnii-fitnes-fitnes-krasivie-foto-1.jpg');
          "
        ></div>
        <div class="w-full p-8 lg:w-1/2">
          <div class="flex justify-center mb-3">
            <img src="@/assets/images/logo-hs-no-word.png" class="max-w-[70px]" alt="" />
          </div>
          <h2 class="text-2xl font-semibold text-gray-700 text-center">HARDSPORT</h2>
          <p class="text-xl text-gray-600 text-center">Добро пожаловать!</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="border-b w-1/5 lg:w-1/4"></span>
            <p href="#" class="text-xs text-center text-gray-500 uppercase">
              ЗАРЕГИСТРИРУЙТЕСЬ ИСПОЛЬЗУЯ ТЕЛЕГРАМ
            </p>
            <span class="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 text-sm font-bold mb-2"
              >Номер телефона</label
            >
            <input
              class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              v-model="registrationUser.phoneNumber"
              type="text"
              placeholder="+7xxxxxxxxxx"
            />
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 text-sm font-bold mb-2"
              >Логин TELEGRAM</label
            >
            <input
              class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              v-model="registrationUser.usernameTG"
              type="text"
              placeholder="Ваш логин в телеграм"
            />
          </div>
          <div class="mt-4">
            <div class="flex justify-between">
              <label class="block text-gray-700 text-sm font-bold mb-2"
                >Придумайте пароль</label
              >
            </div>
            <input
              class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              v-model="registrationUser.password"
              type="password"
              placeholder="Ваш пароль"
            />
          </div>
          <div class="mt-4">
            <div class="flex justify-between">
              <label class="block text-gray-700 text-sm font-bold mb-2"
                >Повторите пароль</label
              >
            </div>
            <input
              class="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              v-model="registrationUser.repeatPassword"
              type="password"
              placeholder="Повторите Ваш пароль"
            />
          </div>
          <div class="mt-8">
            <button
              @click="showFirstModal"
              class="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
            >
              ЗАРЕГИСТРИРОВАТЬСЯ
            </button>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <span class="border-b w-1/5 md:w-1/4"></span>
            <NuxtLink to="/auth/login" class="text-xs text-gray-500 uppercase"
              >ИЛИ АВТОРИЗУЙТЕСЬ</NuxtLink
            >
            <span class="border-b w-1/5 md:w-1/4"></span>
          </div>
          <p class="text-hover-color text-center mt-2">
            {{ errorTextValidation }}
          </p>
        </div>
      </div>
    </div>
    <div
      data-aos="zoom-out"
      v-if="isShowFirstModal"
      class="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-65"
    >
      <div class="flex items-center justify-center h-screen">
        <div class="bg-white rounded-b-2xl max-w-[550px]">
          <div class="border-b-2 p-5 flex items-center gap-24 justify-between">
            <p class="font-medium text-3xl">Регистрация аккаунта</p>
            <Icon
              @click="isShowFirstModal = !isShowFirstModal"
              class="hover:text-hover-color duration-200 cursor-pointer"
              name="material-symbols:close-rounded"
              size="24"
            />
          </div>
          <div class="px-10 py-5">
            <p class="text-2xl">
              Для окончательной регистрации Вашего аккаунта нам нужно подтвердить Ваш
              номер телефона. Как это сделать?
            </p>
            <ul class="list-decimal mt-3">
              <li>Перейдите в телеграм</li>
              <li>
                Вбейте в поиск "Поддержка HardSport" или кликните
                <NuxtLink
                  class="underline text-hover-color"
                  to="https://t.me/HardSportSupportBot"
                  target="_blank"
                  >здесь</NuxtLink
                >
              </li>
              <li>Напишите нашему боту любое сообщение</li>
              <li>Кликните "Получить подтверждение" ниже</li>
              <li>Поделитесь Вашим номером телефона с ботом</li>
              <li>Вбейте код подтверждения, который пришлёт наш бот!</li>
            </ul>
            <div class="flex justify-center mt-5" v-if="!isShowInputConfirmationCode">
              <UISectionButton
                @click="
                  getChatData(),
                    (isShowInputConfirmationCode = !isShowInputConfirmationCode)
                "
                >Получить подтверждение</UISectionButton
              >
            </div>
            <div v-if="isShowInputConfirmationCode" class="flex justify-center mt-5">
              <input
                class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
                type="text"
                @input="isValidateConfirmationCode"
                v-model="confirmationCode"
              />
            </div>
            <div class="flex justify-center mt-5" v-if="isShowInputConfirmationCode">
              <UISectionButton @click="getChatData()"
                >Получить подтверждение ещё раз</UISectionButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      data-aos="zoom-out"
      v-if="isShowSecondModal"
      class="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-65"
    >
      <div class="flex items-center justify-center h-screen">
        <div class="bg-white rounded-b-2xl max-w-[650px]">
          <div class="border-b-2 p-5 flex items-center gap-24 justify-between">
            <p class="font-medium text-3xl">Подтверждение номера телефона</p>
            <Icon
              @click="isShowSecondModal = !isShowSecondModal"
              class="hover:text-hover-color duration-200 cursor-pointer"
              name="material-symbols:close-rounded"
              size="24"
            />
          </div>
          <div class="px-10 py-5">
            <p class="text-2xl">
              Подтвердите свой номер телефона введя цифры, который отправил Вам наш бот!
              Как это сделать?
            </p>
            <ul class="list-decimal mt-3">
              <li>Перейдите в телеграм</li>
              <li>
                Вбейте в поиск "Поддержка HardSport" или кликните
                <NuxtLink
                  class="underline text-hover-color"
                  to="https://t.me/HardSportSupportBot"
                  target="_blank"
                  >здесь</NuxtLink
                >
              </li>
              <li>
                Вы должны увидеть сообщение:
                <span class="italic text-muted-color">Ваш код подтверждения: *****</span>
              </li>
              <li>Впишите код подтверждения ниже</li>
            </ul>
            <div class="flex justify-center mt-5">
              <input
                class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
                type="text"
                @input="isValidateConfirmationCode"
                v-model="confirmationCode"
              />
            </div>
            <div class="flex justify-center mt-5">
              <UISectionButton @click="getChatData(), showSecondModal()"
                >Получить подтверждение ещё раз</UISectionButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center flex items-center justify-center h-screen">
    <UISpinnerMain />
  </div>
</template>
