<template>
  <h1>son111</h1>
  <div>{{ crud }}</div>
  <a-button @click="click">阿松大</a-button>
</template>

<script lang="ts" setup>
  import { onMounted, provide, ref } from 'vue';
  import PublicCom from '@/views/test/PublicCom.vue';
  import { useCrud } from '@/components/crud/CRUD';
  import { Dict } from '@/api/system/dict';
  import Pagination from '@/components/crud/Pagination.vue';

  const crud = useCrud<Dict>({
    tag: '字典',
    url: '/dict',
    title: 'dict',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
    page: {
      currentPage: 1,
      pageSize: 10,
    },
  });
  console.log(crud);

  const click = () => {
    console.log(crud);
  };

  onMounted(() => {
    crud.method.refresh();
  });
</script>

<style scoped></style>
