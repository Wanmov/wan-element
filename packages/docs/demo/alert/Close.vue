<script setup></script>
<template>
  <div class="basic block">
    <wan-alert title="Unclosable alert" type="success" :closable="false" />
    <wan-alert title="Alert with callback" type="warning" @close="handleClose" />
  </div>
</template>
