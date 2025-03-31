<script setup lang="ts">
import { ref } from "vue";

const options = ref([
  { value: "beijing", label: "Beijing" },
  { value: "shanghai", label: "Shanghai" },
]);
const value = ref("");
</script>

<template>
  <wan-select v-model="value" :options="options"></wan-select>
</template>

