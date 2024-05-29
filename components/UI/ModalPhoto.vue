<script setup lang="ts">
defineProps({
  url: { type: String, required: true },
});

const emits = defineEmits(["closeModal"]);

function closeModal() {
  emits("closeModal");
}
let showModal = ref(false);
</script>

<template>
  <div
    @click.stop="closeModal"
    class="fixed top-0 bottom-0 left-0 z-[400] right-0 bg-black bg-opacity-90 flex items-center justify-center"
  >
    <Icon
      name="material-symbols:close-small-outline-rounded"
      size="40"
      @click="closeModal"
      class="absolute top-7 right-7 hover:text-hover-color duration-200 cursor-pointer"
    />
    <img
      class="border-2 cursor-move border-white"
      :src="url"
      alt="Image"
      @click.stop
    />
  </div>
</template>
