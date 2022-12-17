<template>
  <div class="container">
    <Breadcrumb :items="['menu.exception', 'menu.exception.500']" />
    <div class="content">
      <a-modal v-model:visible="showException" width="75vw">
        <template #title>异常详情</template>
        <div style="white-space: pre-wrap">
          {{ error }}
        </div>
      </a-modal>
      <a-result
        class="result"
        status="500"
        :subtitle="$t('exception.result.500.description')"
      />
      <a-space>
        <a-button status="warning" type="primary" @click="showException = true">
          原因
        </a-button>
        <a-button key="back" type="primary" @click="$router.go(-2)">
          {{ $t('exception.result.500.back') }}
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const error = localStorage.getItem('exception');
  const showException = ref(false);
</script>

<script lang="ts">
  export default {
    name: '500',
  };
</script>

<style scoped lang="less">
  .container {
    height: calc(100% - 40px);
    padding: 0 20px 20px 20px;

    :deep(.content) {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      background-color: var(--color-bg-1);
      border-radius: 4px;
    }
  }
</style>
