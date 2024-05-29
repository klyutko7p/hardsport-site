<script setup lang="ts">
import Cookies from "js-cookie";

const router = useRouter();
const token = Cookies.get("token");
const userCookie = Cookies.get("user");

onMounted(() => {
  if (!token) {
    router.push("/auth/login");
    return
  } else if (!userCookie?.includes('"role":"ADMIN"')) {
    router.push("/user/profile")
    return
  }
})
</script>


<template>
    <div>

    </div>
</template>

