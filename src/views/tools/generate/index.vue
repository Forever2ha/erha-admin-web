<template>
  <div class="container">
    <div class="panel">
      <Transition name="fade" mode="out-in" style="height: 100%">
        <Component
          :is="info.show === 1 ? Table : info.show === 2 ? Config : Preview"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Table from '@/views/tools/generate/table.vue';
  import { provide, reactive, ref } from 'vue';
  import Config from '@/views/tools/generate/config.vue';
  import Preview from '@/views/tools/generate/Preview.vue';

  const info = reactive({ show: 1, table: {} });
  provide('info', info);
</script>

<script lang="ts">
  export default {
    name: 'Generate',
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

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
</style>
