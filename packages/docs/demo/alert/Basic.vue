<template>
    <h2>通过 slot 传入内容</h2>
    <div style="max-width: 600px">
      <wan-alert type="success">Success alert</wan-alert>
      <wan-alert type="info">Info alert</wan-alert>
      <wan-alert type="warning">Warning alert</wan-alert>
      <wan-alert type="danger">Error alert</wan-alert>
    </div>
    <h2>通过 prop 传入内容</h2>
    <div style="max-width: 600px">
      <wan-alert type="success" title="Success alert" />
      <wan-alert type="info" title="Info alert" />
      <wan-alert type="warning" title="Warning alert" />
      <wan-alert type="danger" title="Error alert" />
    </div>
  </template>
  