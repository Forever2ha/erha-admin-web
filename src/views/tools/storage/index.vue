<template>
  <div class="container">
    <div class="panel">
      <Transition name="fade" mode="out-in" style="height: 100%">
        <Component :is="storeType === '1' ? Local : Qiniu" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { provide, ref } from 'vue';

  import Local from '@/views/tools/storage/local.vue';
  import Qiniu from '@/views/tools/storage/qiniu.vue';

  const storeType = ref('1');
  provide('storeType', storeType);
</script>

<script lang="ts">
  export default {
    name: 'Storage',
  };
</script>

<style scoped>
  .container {
    height: 100%;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
  }

  .panel {
    height: 100%;
    padding: 16px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
