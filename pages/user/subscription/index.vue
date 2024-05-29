<script setup lang="ts">
import Cookies from "js-cookie";
import { useToast } from "vue-toastification";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const user = ref({} as User);
const toast = useToast();
const validationStore = useValidationStore();
let isLoading = ref(false);
let users = ref<Array<User>>([]);
let plans = ref<Array<Plan>>([]);
let subscriptions = ref<Array<Subscription>>([]);
let originallySubscriptions = ref<Array<Subscription>>([]);

const storeUsers = useUsersStore();
const storePlans = usePlansStore();
const storeSubscriptions = useSubscriptionsStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return;
  }

  isLoading.value = true;
  const [userData, usersData, plansData, subscriptionsData] = await Promise.all([
    storeUsers.getUser(),
    storeUsers.getUsers(),
    storePlans.getPlans(),
    storeSubscriptions.getSubscriptions(),
  ]);
  user.value = userData;
  users.value = usersData;
  plans.value = plansData;
  subscriptions.value = subscriptionsData;
  originallySubscriptions.value = subscriptionsData;
  isLoading.value = false;
});

async function buySubscription() {
  if (
    !cardName.value ||
    !cardNumber.value ||
    !cardMonth.value ||
    !cardYear.value ||
    !cardCVV.value
  ) {
    toast.error("Вы заполнили не все обязательные поля!");
    return;
  }

  let subscriptionData = {
    customerId: user.value.id,
    planId: planData.value.id,
    purchaseDateTime: new Date(),
    expirationDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
    status: "ACTIVE",
  } as Subscription;
  closeSecondModal();
  clearFields();

  isLoading.value = true;
  await storeSubscriptions.createSubscription(subscriptionData);
  subscriptions.value = await storeSubscriptions.getSubscriptions();
  isLoading.value = false;
}

let planData = ref({} as Plan);
let isShowFirstModal = ref(false);
let isShowSecondModal = ref(false);

function showFirstModal(plan: Plan) {
  isShowFirstModal.value = true;
  planData.value = JSON.parse(JSON.stringify(plan));
}

function closeFirstModal() {
  isShowFirstModal.value = false;
  planData.value = {} as Plan;
}

function showSecondModal() {
  isShowFirstModal.value = false;
  isShowSecondModal.value = true;
}

function closeSecondModal() {
  isShowFirstModal.value = false;
  isShowSecondModal.value = false;
  planData.value = {} as Plan;
}

definePageMeta({
  layout: "user",
});

let cardName = ref("");
let cardNumber = ref("");
let cardMonth = ref("");
let cardYear = ref("");
let cardCVV = ref("");

function clearFields() {
  cardName.value = "";
  cardNumber.value = "";
  cardMonth.value = "";
  cardYear.value = "";
  cardCVV.value = "";
}
</script>

<template>
  <Head>
    <Title>Абонементы</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Мой абонемент</h1>
      <div
        class="flex items-center justify-center gap-24 flex-wrap mt-24 mb-10"
        v-if="subscriptions.length > 0"
      >
        <div
          v-for="(subscription, index) in subscriptions
            .slice()
            .reverse()
            .filter((sub) => sub.customer.phoneNumber === user.phoneNumber)"
          :key="index"
          class="max-w-[700px] w-full relative bg-white shadow-2xl rounded-2xl max-h-[1000px]"
        >
          <div class="p-3 border-2 border-hover-color rounded-2xl">
            <div
              class="flex justify-between flex-col max-sm:justify-center max-sm:gap-3 p-5"
            >
              <div
                class="flex items-center justify-between gap-10 max-sm:flex-col max-sm:items-start max-sm:gap-3"
              >
                <h1 class="text-4xl">{{ subscription.customer.phoneNumber }}</h1>
                <div>
                  <h1
                    class="text-4xl text-green-500"
                    v-if="subscription.status === 'ACTIVE'"
                  >
                    АКТИВНЫЙ
                  </h1>
                  <h1
                    class="text-4xl text-yellow-500"
                    v-if="subscription.status === 'EXPIRED'"
                  >
                    ПРОСРОЧЕН
                  </h1>
                  <h1
                    class="text-4xl text-red-500"
                    v-if="subscription.status === 'CANCELED'"
                  >
                    ОТМЕНЕН
                  </h1>
                </div>
              </div>
              <h1 class="mt-10 mb-3 text-2xl">
                Тарифный план: {{ subscription.plan.name }}
              </h1>
              <h1 class="mb-1">
                Дата покупки:
                {{
                  storeUsers.getNormalizedDateWithoutTime(subscription.purchaseDateTime)
                }}
              </h1>
              <h1>
                Дата истечения срока:
                {{ storeUsers.getNormalizedDateWithoutTime(subscription.expirationDate) }}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="text-center mt-10 text-xl">У Вас ещё нет ни одного абонемента!</h1>
        <h1 class="text-center mt-3 text-xl">
          Приобретите его, чтоб получить весь функционал HARDSPORT!
        </h1>
        <div class="flex items-center justify-center gap-24 flex-wrap mt-10 mb-24">
          <div v-for="(plan, index) in plans" :key="index" class="relative">
            <div class="flex items-center justify-center mb-5">
              <UIMainButton @click="showFirstModal(plan)">ПРИОБРЕСТИ</UIMainButton>
            </div>
            <div
              :class="{
                'bg-gradient-to-r from-sky-400 via-violet-500 to-blue-400':
                  plan.name === 'Основной',
                'bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500':
                  plan.name === 'Продвинутый',
                'bg-gradient-to-r from-red-400 via-pink-500 to-rose-600':
                  plan.name === 'Премиум',
              }"
              class="max-w-[400px] w-full relative shadow-2xl rounded-2xl"
            >
              <h1
                class="bg-white rounded-xl shadow-2xl py-5 text-center text-4xl uppercase w-full"
              >
                {{ plan.name }}
              </h1>
              <div class="mt-5 text-white p-3">
                <h1 class="text-center text-3xl mb-5">{{ plan.price }} ₸</h1>
              </div>
            </div>
            <div
              class="max-w-[400px] h-[700px] w-full relative shadow-2xl rounded-2xl bg-slate-600 text-white"
            >
              <h1 class="text-center text-4xl mt-5 py-5">{{ plan.duration }} ДНЕЙ</h1>
              <ul class="list-disc px-10 py-5 font-bold min-h-[300px]">
                <li v-for="benefit in plan.benefits">{{ benefit }}</li>
              </ul>
              <h1
                :class="{
                  'bg-gradient-to-r from-sky-400 via-violet-500 to-blue-400':
                    plan.name === 'Основной',
                  'bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500':
                    plan.name === 'Продвинутый',
                  'bg-gradient-to-r from-red-400 via-pink-500 to-rose-600':
                    plan.name === 'Премиум',
                }"
                class="text-center py-10 px-3 text-xl h-[170px]"
              >
                {{ plan.description }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="h-screen flex items-center justify-center">
    <UISpinnerMain />
  </div>

  <UIModalComponent v-show="isShowFirstModal" @close-modal="closeFirstModal">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Купить абонемент</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите купить данный абонемент с тарифом '{{ planData.name }}'?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="showSecondModal">Перейти к оплате</UIMainButton>
        <UICancelButton @click="closeFirstModal">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isShowSecondModal" @close-modal="closeSecondModal">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Покупка абонемента</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div class="bg-white flex justify-center items-center">
        <div class="space-y-16">
          <div
            class="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform"
          >
            <img
              class="relative object-cover w-full h-full rounded-xl"
              src="https://i.imgur.com/Zi6v09P.png"
            />

            <div class="w-full px-8 absolute top-8">
              <div class="flex justify-between">
                <div class="">
                  <h1 class="font-light">Имя</h1>
                  <input
                    type="text"
                    class="bg-transparent border-none outline-none text-white font-bold uppercase"
                    v-model="cardName"
                    required
                  />
                  <hr />
                </div>
                <img
                  v-if="cardNumber[0] === '5'"
                  class="w-14 h-10"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png"
                />
                <img
                  v-if="cardNumber[0] === '4'"
                  class="w-14 h-7"
                  src="https://www.freepnglogos.com/uploads/visa-inc-png-18.png"
                />
              </div>
              <div class="pt-1">
                <h1 class="font-light">Номер карты</h1>
                <input
                  type="text"
                  class="bg-transparent border-none outline-none text-white font-bold uppercase"
                  v-model="cardNumber"
                  maxlength="16"
                  required
                />
                <hr />
              </div>
              <div class="pt-6 pr-6">
                <div class="flex justify-between">
                  <div class="">
                    <h1 class="font-light text-xs">Месяц/Год</h1>
                    <div class="flex items-center">
                      <div>
                        <input
                          type="text"
                          class="bg-transparent mr-1 outline-none text-white font-bold uppercase max-w-[20px]"
                          maxlength="2"
                          required
                          v-model="cardMonth"
                        />
                        <hr class="max-w-[20px]" />
                      </div>
                      <h1>/</h1>
                      <div>
                        <input
                          type="text"
                          class="bg-transparent ml-1 outline-none text-white font-bold uppercase max-w-[20px]"
                          maxlength="2"
                          required
                          v-model="cardYear"
                        />
                        <hr class="max-w-[20px]" />
                      </div>
                    </div>
                  </div>

                  <div class="">
                    <h1 class="font-light text-xs">CVV</h1>
                    <input
                      type="text"
                      class="bg-transparent border-none outline-none text-white font-bold uppercase max-w-[40px]"
                      maxlength="3"
                      required
                      v-model="cardCVV"
                    />
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 class="text-center text-2xl">К оплате: {{ planData.price }} ₸</h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="buySubscription">Оплатить</UIMainButton>
        <UICancelButton @click="closeSecondModal">Отменить</UICancelButton>
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
