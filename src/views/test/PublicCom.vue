<template>
  <div>public Com</div>
  <div>inject：{{ data }}</div>
  <hr />
</template>

<script lang="ts" setup>
  import { inject } from 'vue';

  const data = inject('data');
</script>

<style scoped></style>
