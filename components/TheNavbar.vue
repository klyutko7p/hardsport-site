<script setup lang="ts">
const router = useRouter();
let isShowMenu = ref(false);

function actionMenu() {
  isShowMenu.value = !isShowMenu.value;
}
</script>

<template>
  <nav class="fixed w-full z-100 text-white">
    <div
      class="flex max-lg:hidden items-center justify-between py-5 px-10 bg-black bg-opacity-45 hover:bg-opacity-100 duration-150"
    >
      <img
        class="max-w-[50px]"
        src="../assets/images/logo-hs-no-word.png"
        @click="router.push('/')"
      />
      <ul class="flex items-center gap-3 ml-32">
        <NuxtLink class="hover:text-hover-color duration-200" to="/">
          <h1>ДОМОЙ</h1>
        </NuxtLink>
        <NuxtLink class="hover:text-hover-color duration-200 font-bold" to="/#about">
          <h1 class="uppercase">О нас</h1>
        </NuxtLink>
        <NuxtLink class="hover:text-hover-color duration-200 font-bold" to="/#services">
          <h1 class="uppercase">Возможности</h1>
        </NuxtLink>
        <NuxtLink class="hover:text-hover-color duration-200 font-bold" to="/#contacts">
          <h1 class="uppercase">Контакты</h1>
        </NuxtLink>
      </ul>
      <UILoginButton @click="router.push('/auth/login')">Войти</UILoginButton>
    </div>
    <div
      class="hidden max-lg:flex items-center justify-between py-5 px-10 bg-black bg-opacity-45 hover:bg-opacity-100 duration-150"
    >
      <Icon
        name="iconamoon:menu-burger-horizontal-duotone"
        size="40"
        class="cursor-pointer duration-200 hover:opacity-50"
        @click="actionMenu"
      />
      <img
        class="max-w-[50px]"
        src="../assets/images/logo-hs-no-word.png"
        @click="router.push('/')"
      />
    </div>
  </nav>
  <div v-if="isShowMenu" class="fixed top-0 bottom-0 left-0 right-0 bg-black z-[100]">
    <div class="flex items-center py-10 flex-col h-screen gap-5 text-white relative">
      <div class="absolute top-2 right-2">
        <Icon
          class="hover:text-hover-color duration-200 cursor-pointer"
          @click="actionMenu"
          name="material-symbols:close-small-outline"
          size="36"
        />
      </div>
      <div class="flex items-center px-5 gap-3 duration-200 mb-7">
        <img src="@/assets/images/logo-hs-no-word.png" class="max-w-[50px]" alt="" />
        <h1 class="text-xl">HARDSPORT</h1>
      </div>
      <ul class="flex items-center flex-col text-2xl mt-10 text-center gap-10">
        <NuxtLink @click="actionMenu" class="hover:text-white hover:bg-hover-color border-2 border-hover-color px-10 py-5 duration-200 w-full" to="/">
          <h1>ДОМОЙ</h1>
        </NuxtLink>
        <NuxtLink @click="actionMenu" class="hover:text-white hover:bg-hover-color border-2 border-hover-color px-10 py-5 duration-200 w-full" to="/#about">
          <h1 class="uppercase">О нас</h1>
        </NuxtLink>
        <NuxtLink @click="actionMenu" class="hover:text-white hover:bg-hover-color border-2 border-hover-color px-10 py-5 duration-200 w-full" to="/#services">
          <h1 class="uppercase">Возможности</h1>
        </NuxtLink>
        <NuxtLink @click="actionMenu" class="hover:text-white hover:bg-hover-color border-2 border-hover-color px-10 py-5 duration-200 w-full" to="/#contacts">
          <h1 class="uppercase">Контакты</h1>
        </NuxtLink>
      </ul>
      <UILoginButton class="w-full mt-10 max-w-[500px]" @click="router.push('/auth/login')">Войти</UILoginButton>
    </div>
  </div>
</template>
