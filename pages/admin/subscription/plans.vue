<script setup lang="ts">
import Cookies from "js-cookie";

const validationStore = useValidationStore();
const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");
let isLoading = ref(false);
let plans = ref<Array<Plan>>([]);
let storePlans = usePlansStore();

onBeforeMount(async () => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }

  isLoading.value = true;
  const [plansData] = await Promise.all([storePlans.getPlans()]);
  plans.value = plansData;
  isLoading.value = false;
});

definePageMeta({
  layout: "admin",
});

let isOpenModal = ref(false);
let isOpenModalDelete = ref(false);

function openModalComponent(plan: Plan = {} as Plan) {
  isOpenModal.value = true;
  if (plan.id) {
    planData.value = JSON.parse(JSON.stringify(plan));
  } else {
    planData.value = {} as Plan;
  }
  document.body.style.overflow = "hidden";
}

function openModalDeleteComponent(id: number = 0) {
  isOpenModalDelete.value = true;
  planIdData.value = id;
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

let planData = ref({} as Plan);
let planIdData = ref(0);

const requiredFields: Record<string, string> = {
  name: "Название",
  description: "Описание",
  duration: "Срок",
  price: "Стоимость",
};

async function createPlan() {
  if (!validationStore.checkValidation(planData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  planData.value.benefits = selectedBenefits.value;
  closeModalComponent();
  await storePlans.createPlan(planData.value);
  planData.value = await storePlans.getPlans();
  isLoading.value = false;
}

async function updatePlan() {
  if (!validationStore.checkValidation(planData.value, requiredFields)) {
    return;
  }

  isLoading.value = true;
  planData.value.benefits = selectedBenefits.value;
  closeModalComponent();
  await storePlans.updatePlan(planData.value);
  planData.value = await storePlans.getPlans();
  isLoading.value = false;
}

async function deletePlan() {
  isLoading.value = true;
  closeModalDeleteComponent();
  await storePlans.deletePlan(planIdData.value);
  planData.value = await storePlans.getPlans();
  isLoading.value = false;
}

let benefits = ref([
  "Доступ к базовым тренировкам и упражнениям",
  "Доступ к просмотру онлайн-тренировок",
  "Доступ к эксклюзивным тренировкам от профессиональных тренеров",
  "Персональное онлайн-обучение от опытных тренеров",
  "Доступ к бассейну",
  "Доступ к персональному тренеру",
  "Доступ к личной беседе HardSport",
]);
let selectedBenefits = ref([]);
</script>

<template>
  <Head>
    <Title>Тарифные планы</Title>
  </Head>
  <div v-if="!isLoading">
    <div>
      <h1 class="text-center text-3xl max-sm:text-xl mb-5">Редактирование тарифов</h1>
      <div class="mb-16 flex justify-end gap-5">
        <UIMainButton @click="router.push('/admin/subscription')"
          >Добавить абонемент</UIMainButton
        >
        <UIMainButton @click="openModalComponent">Добавить тариф</UIMainButton>
      </div>
      <div class="flex items-center justify-center gap-24 flex-wrap mt-24 mb-24">
        <div v-for="(plan, index) in plans" :key="index" class="relative">
          <div class="absolute top-[-50px] right-0">
            <Icon
              name="material-symbols:edit-outline"
              @click="openModalComponent(plan)"
              size="32"
              class="text-green-500 cursor-pointer hover:opacity-50 duration-200"
            />
            <Icon
              name="material-symbols:delete-rounded"
              @click="openModalDeleteComponent(plan.id)"
              size="32"
              class="text-hover-color cursor-pointer hover:opacity-50 duration-200"
            />
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
            <h1 class="text-sm mt-3 px-3">
              Количество человек с этим тарифом: {{ plan.subscriptions.length }}
            </h1>
            <h1 class="text-sm mt-3 px-3">
              Статус Активный:
              {{ plan.subscriptions.filter((sub) => sub.status === "ACTIVE").length }}
            </h1>
            <h1 class="text-sm mt-3 px-3">
              Статус Просрочен:
              {{ plan.subscriptions.filter((sub) => sub.status === "EXPIRED").length }}
            </h1>
            <h1 class="text-sm mt-3 px-3">
              Статус Отменен:
              {{ plan.subscriptions.filter((sub) => sub.status === "CANCELED").length }}
            </h1>
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
      <div class="text-left text-xl font-bold" v-if="!planData.id">
        Добавить тарифный план
      </div>
      <div class="text-left text-xl font-bold" v-else>Изменить тарифный план</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <div>
        <label>Название тарифного плана</label>
        <input
          v-model="planData.name"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Описание тарифного плана</label>
        <textarea
          v-model="planData.description"
          type="text"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Срок (дней)</label>
        <input
          v-model="planData.duration"
          type="number"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label>Стоимость тарифного плана</label>
        <input
          v-model="planData.price"
          type="number"
          class="block mt-2 w-full bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div class="flex items-center justify-centers gap-3 mb-5 flex-wrap text-left">
        <label v-for="(benefit, index) in benefits" :key="index">
          <input type="checkbox" :value="benefit" v-model="selectedBenefits" />
          {{ benefit }}
        </label>
      </div>

      <div class="flex gap-3" v-if="!planData.id">
        <UIMainButton @click="createPlan">Добавить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
      <div class="flex gap-3" v-else>
        <UIMainButton @click="updatePlan">Изменить</UIMainButton>
        <UICancelButton @click="closeModalComponent">Отменить</UICancelButton>
      </div>
    </div>
  </UIModalComponent>

  <UIModalComponent v-show="isOpenModalDelete" @close-modal="closeModalDeleteComponent">
    <template v-slot:header>
      <div class="text-left text-xl font-bold max-sm:text-lg">Удалить тарифный план</div>
    </template>
    <div class="text-left px-5 space-y-5 mb-5">
      <h1 class="text-2xl text-center max-sm:text-xl">
        Вы уверены, что хотите удалить данный тарифный план?
      </h1>
      <div class="flex gap-3 mb-5 justify-center">
        <UIMainButton @click="deletePlan">Удалить</UIMainButton>
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
