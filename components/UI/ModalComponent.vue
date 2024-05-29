<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 flex justify-center bg-[#000000da] z-[100]"
  >
    <div class="flex items-center justify-center px-3">
      <div
        class="text-black max-w-[500px] max-h-[1000px] w-full text-center bg-white overflow-auto max-lg:px-1 rounded-lg"
        @click.stop
      >
        <div class="px-5 py-7">
          <div class="flex justify-between items-center">
            <slot name="header"></slot>
            <Icon
              @click="$emit('close-modal')"
              name="material-symbols:close-rounded"
              size="32"
              class="cursor-pointer hover:opacity-50 duration-200 text-hover-color"
            />
          </div>
        </div>
        <hr />
        <div class="mt-3">
            <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
