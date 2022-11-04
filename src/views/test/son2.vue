<template>
  <h1>son1</h1>
  <div>{{ crud }}</div> <div> </div>
  <a-button @click="click">阿松大</a-button>
</template>

<script lang="ts" setup>
  import { onMounted, provide, ref } from 'vue';
  import PublicCom from '@/views/test/PublicCom.vue';
  import { useCrud } from '@/components/crud/CRUD';
  import Pagination from '@/components/crud/Pagination.vue';

  const crud = useCrud<any>({
    tag: '字典详情',
    url: '/dictDetail',
    title: 'dictDetail',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
    page: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
    },
  });
  console.log(crud);
  const click = () => {
    console.log(crud);
  };
</script>

<style scoped></style>
