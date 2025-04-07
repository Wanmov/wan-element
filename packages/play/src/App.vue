<script setup lang="ts">
import { ref } from "vue";

const options = ref([
  { value: "beijing", label: "Beijing" },
  { value: "shanghai", label: "Shanghai" },
  { value: "shenzhen", label: "Shenzhen", disabled: true },
  { value: "hangzhou", label: "Hangzhou" },
]);
const value = ref("");
</script>

<template>
  <wan-select
    v-model="value"
    :options="options"
    filterable
    clearable
  ></wan-select>
</template>
