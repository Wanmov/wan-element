<script setup></script>

<template>
  <p>
    <wan-button @click="handleBtnClick"> with throttle</wan-button>
    <wan-button :use-throttle="false" @click="handleBtnClick"
      >without throttle</wan-button
    >
  </p>
</template>
