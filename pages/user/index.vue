<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");

onMounted(() => {
  if (!token) {
    router.push('/auth/login')
  } else {
    router.push('/user/subscription')
  }
})
</script>


<template>
    <div>

    </div>
</template>

