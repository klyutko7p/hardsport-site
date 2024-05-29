<script setup>
import chevron from "../assets/chevron.svg";
defineProps(["faq"]); // recieving faq object as a prop.
const emit = defineEmits(["toggleAnswer"]); // defining events to emit
const handleClick = (id) => emit("toggleAnswer", id); // emitting toggleAnswer event with id attribute.
</script>
<template>
  <div class="faq">
    <div class="header" @click="() => handleClick(faq.id)">
      <div class="question">
        {{ faq.question }}
        <!--Extracting question from faq prop -->
      </div>
      <div :class="['icon', { open: faq.isOpen }]">
        <img :src="chevron" alt="chevron-icon" />
      </div>
    </div>
    <div :class="['answer', { open: faq.isOpen }]">
      <p>{{ faq.answer }}</p>
      <!--Extracting answer from faq prop -->
    </div>
  </div>
</template>
<style scoped lang="less">
.faq {
  flex-grow: 1;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px solid antiquewhite;
    padding: 10px;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    .question {
      font-weight: 700;
    }
    .icon {
      width: 30px;
      height: 30px;
      transition: transform 0.5s;
      img {
        width: 100%;
        height: auto;
      }
      &.open {
        transform: rotate(180deg);
      }
    }
  }
  .answer {
    height: 0;
    overflow-y: scroll;
    line-height: 1.5;
    background-color: antiquewhite;
    transition: height 0.5s;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      appearance: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      width: 5px;
      background-color: rgb(232, 210, 182);
      border-radius: 50px;
    }
    p {
      padding: 10px;
    }
    &.open {
      height: 200px;
    }
  }
}
</style>
