<script setup lang="ts">
let isOpen = ref(false);

let storeUsers = useUsersStore();
const router = useRouter();

async function signOut() {
  await storeUsers.signOut();
}

let isShowMenu = ref(false)
function showMenu() {
  isShowMenu.value = true
}
</script>

<template>
  <div>
    <div
      @mouseover="isOpen = true"
      @mouseleave="isOpen = false"
      :class="{ 'w-[200px]': isOpen, 'w-[80px]': !isOpen }"
      class="h-screen max-lg:hidden duration-300 fixed top-0 bg-[#0C1E35] border-r-2 text-white z-[100]"
    >
      <div class="flex items-center px-5 gap-3 duration-200 mt-10">
        <img src="@/assets/images/logo-hs-no-word.png" class="max-w-[40px]" alt="" />
        <h1 class="duration-200" :class="{ block: isOpen, hidden: !isOpen }">
          HARDSPORT
        </h1>
      </div>
      <div class="flex duration-200 px-6 flex-col mt-24 gap-10">
        <div
          class="flex items-center opacity-50 hover:opacity-100 duration-200 w-[200px] cursor-pointer gap-3"
          @click="router.push('/admin/workout')"
        >
          <Icon name="material-symbols:fitness-center" size="24" />
          <h1 class="duration-200" :class="{ block: isOpen, hidden: !isOpen }">
            Тренировки
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 duration-200 w-[200px] cursor-pointer gap-3"
          @click="router.push('/admin/online-booking')"
        >
          <Icon name="mingcute:fitness-fill" size="24" />
          <h1 class="duration-200" :class="{ block: isOpen, hidden: !isOpen }">Услуги</h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 duration-200 w-[200px] cursor-pointer gap-3"
          @click="router.push('/admin/subscription')"
        >
          <Icon name="majesticons:ticket-check" size="24" />
          <h1 class="duration-200" :class="{ block: isOpen, hidden: !isOpen }">
            Абонементы
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 duration-200 w-[200px] cursor-pointer gap-3"
          @click="router.push('/admin/video')"
        >
          <Icon name="material-symbols:slow-motion-video" size="24" />
          <h1 class="duration-200" :class="{ block: isOpen, hidden: !isOpen }">
            Видеоуроки
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 duration-200 w-[200px] cursor-pointer gap-3"
          @click="router.push('/admin/trainers')"
        >
          <Icon name="material-symbols:sports-handball" size="24" />
          <h1 class="duration-200" :class="{ block: isOpen, hidden: !isOpen }">
            Тренера
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 duration-200 w-[200px] cursor-pointer gap-3"
          @click="router.push('/admin/certification')"
        >
          <Icon name="carbon:user-certification" size="24" />
          <h1 class="duration-200" :class="{ block: isOpen, hidden: !isOpen }">
            Сертификация
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 duration-200 w-[200px] cursor-pointer gap-3"
          @click="router.push('/admin/clubs')"
        >
          <Icon name="ion:fitness" size="24" />
          <h1 class="duration-200" :class="{ block: isOpen, hidden: !isOpen }">Клубы</h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 duration-200 w-[200px] cursor-pointer gap-3"
          @click="signOut"
        >
          <Icon name="material-symbols:exit-to-app" size="24" />
          <h1 class="duration-200" :class="{ flex: isOpen, hidden: !isOpen }">Выйти</h1>
        </div>
      </div>
    </div>
    <div class="hidden max-lg:block" @click="showMenu">
      <Icon
        name="iconamoon:menu-burger-horizontal-bold"
        size="40"
        class="cursor-pointer hover:text-hover-color duration-200"
      />
    </div>
    <div v-if="isShowMenu" class="fixed top-0 bottom-0 left-0 right-0 bg-[#0C1E35] z-[100]">
      <div class="flex items-center py-10 flex-col h-screen gap-5 text-white relative">
        <div class="absolute top-2 right-2"> 
          <Icon class="hover:text-hover-color duration-200 cursor-pointer" @click="isShowMenu = !isShowMenu" name="material-symbols:close-small-outline" size="36" />
        </div>
        <div class="flex items-center px-5 gap-3 duration-200 mb-7">
          <img src="@/assets/images/logo-hs-no-word.png" class="max-w-[50px]" alt="" />
          <h1 class="text-xl">
            HARDSPORT
          </h1>
        </div>
        <div
          class="flex items-center opacity-50 hover:opacity-100 hover:bg-white hover:text-black rounded-xl p-5 duration-200 cursor-pointer gap-3 w-[200px]"
          @click="router.push('/admin/workout'), isShowMenu = !isShowMenu"
        >
          <Icon name="material-symbols:fitness-center" size="24" />
          <h1>
            Тренировки
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 hover:bg-white hover:text-black rounded-xl p-5 duration-200 cursor-pointer gap-3 w-[200px]"
          @click="router.push('/admin/online-booking'), isShowMenu = !isShowMenu"
        >
          <Icon name="mingcute:fitness-fill" size="24" />
          <h1 class="duration-200">Услуги</h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 hover:bg-white hover:text-black rounded-xl p-5 duration-200 cursor-pointer gap-3 w-[200px]"
          @click="router.push('/admin/subscription'), isShowMenu = !isShowMenu"
        >
          <Icon name="majesticons:ticket-check" size="24" />
          <h1 class="duration-200">
            Абонементы
          </h1>
        </div>
        <div
          class="flex items-center opacity-50 hover:opacity-100 hover:bg-white hover:text-black rounded-xl p-5 duration-200 cursor-pointer gap-3 w-[200px]"
          @click="router.push('/admin/video'), isShowMenu = !isShowMenu"
        >
          <Icon name="material-symbols:slow-motion-video" size="24" />
          <h1 class="duration-200">
            Видеоуроки
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 hover:bg-white hover:text-black rounded-xl p-5 duration-200 cursor-pointer gap-3 w-[200px]"
          @click="router.push('/admin/trainers'), isShowMenu = !isShowMenu"
        >
          <Icon name="material-symbols:sports-handball" size="24" />
          <h1 class="duration-200">
            Тренера
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 hover:bg-white hover:text-black rounded-xl p-5 duration-200 cursor-pointer gap-3 w-[200px]"
          @click="router.push('/admin/certification'), isShowMenu = !isShowMenu"
        >
          <Icon name="carbon:user-certification" size="24" />
          <h1 class="duration-200">
            Сертификация
          </h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 hover:bg-white hover:text-black rounded-xl p-5 duration-200 cursor-pointer gap-3 w-[200px]"
          @click="router.push('/admin/clubs'), isShowMenu = !isShowMenu"
        >
          <Icon name="ion:fitness" size="24" />
          <h1 class="duration-200">Клубы</h1>
        </div>

        <div
          class="flex items-center opacity-50 hover:opacity-100 hover:bg-white hover:text-black rounded-xl p-5 duration-200 cursor-pointer gap-3 w-[200px]"
          @click="signOut"
        >
          <Icon name="material-symbols:exit-to-app" size="24" />
          <h1 class="duration-200">Выйти</h1>
        </div>
      </div>
    </div>
  </div>
</template>
