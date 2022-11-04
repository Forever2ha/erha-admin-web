<template>
  <div class="container">
    <div class="panel">
      <a-row :gutter="24">
        <a-col :span="11">
          <Dict />
        </a-col>

        <a-col :span="13">
          <DictDetail />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Dict from '@/views/system/dict/Dict.vue';
  import DictDetail from '@/views/system/dict/DictDetail.vue';
</script>

<style scoped>
  .container {
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
  }

  .panel {
    height: 80vh;
    padding: 16px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }
</style>
