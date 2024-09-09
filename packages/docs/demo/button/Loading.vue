<template>
    <div>
      <wan-button type="primary" loading>Loading</wan-button>
      <wan-button type="primary" loading-icon="circle-notch" loading
        >Loading</wan-button
      >
      <wan-button type="primary" loading>
        <template #loading>
          <wan-icon style="margin-right: 6px" icon="star" spin />
        </template>
        Loading
      </wan-button>
    </div>
  </template>
  