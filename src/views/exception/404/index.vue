<template>
  <div class="container">
    <Breadcrumb :items="['menu.exception', 'menu.exception.404']" />
    <div class="content">
      <a-result
        class="result"
        status="404"
        :subtitle="$t('exception.result.404.description')"
      >
      </a-result>
      <div class="operation-row">
        <a-button
          key="again"
          style="margin-right: 16px"
          @click="$router.push({ path: lastRoute.fullPath })"
        >
          {{ $t('exception.result.404.retry') }}
        </a-button>
        <a-button key="back" type="primary" @click="$router.go(-1)">
          {{ $t('exception.result.404.back') }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { listenerRouteChange } from '@/utils/route-listener';
  import { ref } from 'vue';

  const lastRoute = ref({});

  listenerRouteChange((route) => {
    console.log(route);
    lastRoute.value = route;
  });
</script>

<script lang="ts">
  export default {
    name: '404',
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
