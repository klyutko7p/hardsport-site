<script setup>
import { ref } from "vue";
const props = defineProps({
  title: { type: String, required: true },
  ariaTitle: { type: String, required: true },
});
const showPanel = ref(false);
const togglePanel = (event) => {
  showPanel.value = !showPanel.value;
};
</script>

<template>
  <div class="panel container mb-4 border-2 rounded-lg shadow-sm">
    <button
      :arial-controls="'accordion-content-' + ariaTitle"
      :id="'accordion-control-' + ariaTitle"
      @click.prevent="togglePanel"
      class="p-4 w-full border-b-2 font-semibold flex flex-row items-center justify-between"
    >
      {{ title }}
      <Icon size="32" name="material-symbols:expand-circle-up-outline-rounded" v-if="showPanel" /> 
      <Icon size="32" name="material-symbols:expand-circle-down-outline-rounded" v-else /> 
    </button>
    <div
      :aria-hidden="!showPanel"
      :id="'content-' + ariaTitle"
      class="p-4"
      v-if="showPanel"
    >
      <slot></slot>
    </div>
  </div>
</template>
