<template>
  <a-tabs type="text" style="height: 100%">
    <template #extra>
      <a-button @click="info.show = 1">退出</a-button>
    </template>
    <a-tab-pane
      v-for="(code, index) in code"
      :key="index"
      :title="code.name"
      style="height: 100%"
    >
      <Code
        :code="code.content"
        :lang="code.content.startsWith('package') ? 'java' : ''"
        style="height: 100%"
      />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
  import Code from '@/components/code/index.vue';
  import { inject, onMounted, ref } from 'vue';
  import axios from 'axios';

  const info = inject('info');
  const code = ref([]);

  const getCode = async () => {
    const data = await axios.get(
      `generate/preview?tableName=${(info as any).table.tableName}`
    );
    if ((data as any).code === 20000) {
      code.value = data.data;
    }
  };

  onMounted(() => {
    getCode();
  });
</script>

<style scoped>
  :deep(.arco-tabs-pane) {
    height: 100%;
  }

  :deep(.arco-tabs-content) {
    height: calc(100% - 32px);
    padding-top: 8px;
  }

  :deep(.arco-tabs-content-list) {
    height: 100%;
  }
</style>
