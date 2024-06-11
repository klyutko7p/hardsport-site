<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
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
  isLoading.value = true;
  const [usersData, plansData, subscriptionsData] = await Promise.all([
    storeUsers.getUsers(),
    storePlans.getPlans(),
    storeSubscriptions.getSubscriptions(),
  ]);
  users.value = usersData;
  plans.value = plansData;
  subscriptions.value = subscriptionsData;
  originallySubscriptions.value = subscriptionsData;
  isLoading.value = false;
});

onMounted(async () => {
  if (!token) {
    router.push("/auth/login");
  }
});

definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(subscription: Subscription = {} as Subscription) {
  isOpenModal.value = true;
  if (subscription.id) {
    subscriptionData.value = JSON.parse(JSON.stringify(subscription));
    subscriptionData.value.expirationDate = storeUsers.getISODate(
      subscriptionData.value.expirationDate
    );
    subscriptionData.value.purchaseDateTime = storeUsers.getISODate(
      subscriptionData.value.purchaseDateTime
    );
  } else {
    subscriptionData.value = {} as Subscription;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  subscriptionIdData.value = id;
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

let subscriptionData = ref({} as Subscription);
let subscriptionIdData = ref(0);

const requiredFields: Record<string, string> = {
  planId: "Тариф",
  status: "Статус",
  purchaseDateTime: "Дата покупки",
  expirationDate: "Дата истечения",
};

async function createSubscription() {
  if (!validationStore.checkValidation(subscriptionData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  closeModalComponent();
  await storeSubscriptions.createSubscription(subscriptionData.value);
  subscriptions.value = await storeSubscriptions.getSubscriptions();
  originallySubscriptions.value = subscriptions.value;
  isLoading.value = false;
}

async function updateSubscription() {
  if (!validationStore.checkValidation(subscriptionData.value, requiredFields)) {
    return;
  }

  subscriptionData.value.expirationDate = new Date(subscriptionData.value.expirationDate);
  subscriptionData.value.purchaseDateTime = new Date(
    subscriptionData.value.purchaseDateTime
  );
  isLoading.value = true;
  closeModalComponent();
  await storeSubscriptions.updateSubscription(subscriptionData.value);
  subscriptions.value = await storeSubscriptions.getSubscriptions();
  originallySubscriptions.value = subscriptions.value;
  isLoading.value = false;
}

async function deleteSubscription() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storeSubscriptions.deleteSubscription(subscriptionIdData.value);
  subscriptions.value = await storeSubscriptions.getSubscriptions();
  originallySubscriptions.value = subscriptions.value;
  isLoading.value = false;
}

let selectedPlan = ref("Все");
let selectedStatus = ref("Все");
let queryNumber = ref("");

function filterSubscriptions(): void {
  subscriptions.value = originallySubscriptions.value.filter(
    (subscription: Subscription) => {
      const planFilter: boolean =
        selectedPlan.value === "Все" || subscription.plan.name === selectedPlan.value;
      const statusFilter: boolean =
        selectedStatus.value === "Все" || subscription.status === selectedStatus.value;
      const queryFilter: boolean = subscription.customer.phoneNumber.includes(
        queryNumber.value
      );

      return planFilter && statusFilter && queryFilter;
    }
  );
}
</script>

<template>
  <Head>
    <Title>Абонементы</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование абонементов</h1>
      <div class="mb-10 flex justify-end gap-5 max-sm:flex-col">
        <UIMainButton @click="openModalComponent">Добавить абонемент</UIMainButton>
        <UIMainButton @click="router.push('/admin/subscription/plans')"
          >Добавить тариф</UIMainButton
        >
      </div>
      <div class="flex items-end flex-col max-sm:items-start">
        <h1 class="text-2xl max-sm:text-center w-full my-5">
          Количество абонементов - {{ subscriptions.length }}
        </h1>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Номер телефона:</h1>
          <input
            type="text"
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="queryNumber"
            @input="filterSubscriptions"
          />
        </div>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Тарифный план:</h1>
          <select
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="selectedPlan"
            @change="filterSubscriptions"
          >
            <option value="Все">Все</option>
            <option :value="plan.name" v-for="plan in plans">
              {{ plan.name }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-3 mt-2 max-sm:flex-col w-full max-sm:mb-3">
          <h1>Статус:</h1>
          <select
            class="block w-[200px] max-sm:w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
            v-model="selectedStatus"
            @change="filterSubscriptions"
          >
            <option value="Все">Все</option>
            <option value="ACTIVE">Активный</option>
            <option value="EXPIRED">Просрочен</option>
            <option value="CANCELED">Отменен</option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-center gap-24 flex-wrap mt-24 mb-24">
        <div
          v-for="(subscription, index) in subscriptions.slice().reverse()"
          :key="index"
          class="max-w-[700px] w-full relative bg-white shadow-2xl rounded-2xl max-h-[1000px]"
        >
          <div class="absolute top-[-50px] right-0">
            <Icon
              name="material-symbols:edit-outline"
              @click="openModalComponent(subscription)"
              size="32"
              class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
            />
            <Icon
              name="material-symbols:delete-rounded"
              @click="openModalDeleteComponent(subscription.id)"
              size="32"
              class="text-hover-color cursor-pointer hover:opacity-50 duration-200"
            />
          </div>
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
    </div>
  </div>

  <div v-else class="h-screen flex items-center justify-center">
    <UISpinnerMain />
  </div>

  <UIModalComponent v-show="isOpenModal" @close-modal="closeModalComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold" v-if="!subscriptionData.id">
        Добавить абонемент
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить данные абонемента</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Владелец абонемента</label>
        <select
          v-model="subscriptionData.customerId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="user in users" :value="user.id">
            {{
              user.profile.name +
              " " +
              user.profile.surname +
              " " +
              `(${user.phoneNumber})`
            }}
          </option>
        </select>
      </div>

      <div>
        <label>Тарифный план</label>
        <select
          v-model="subscriptionData.planId"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option v-for="plan in plans" :value="plan.id">
            {{ plan.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Статус</label>
        <select
          v-model="subscriptionData.status"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        >
          <option value="ACTIVE">Активный</option>
          <option value="EXPIRED">Просрочен</option>
          <option value="CANCELED">Отменен</option>
        </select>
      </div>

      <div>
        <label>Дата покупки</label>
        <input
          v-model="subscriptionData.purchaseDateTime"
          type="date"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Дата истечения срока действия</label>
        <input
          v-model="subscriptionData.expirationDate"
          type="date"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div class="flex gap-3" v-if="!subscriptionData.id">
        <UIMainButton @click="createSubscription">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updateSubscription">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить абонемент</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данный абонемент?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deleteSubscription">Удалить</UIMainButton>
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
