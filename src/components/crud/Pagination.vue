<template>
  <a-pagination
    :total="crud.options.page.totalCount"
    :show-total="showTotal"
    :show-jumper="showJumper"
    :show-page-size="showPageSize"
    :page-size-options="crud.options.page?.componentConfig?.pageSizeOptions"
    @change="
      (currentPage) => {
        crud.update.appendPage({ currentPage });
        crud.update.setStatus(CrudStatus.NEED_REFRESH);
        crud.update.setTableSelectKeys([]);
      }
    "
    @page-size-change="
      (pageSize) => {
        crud.update.appendPage({ pageSize });
        crud.update.setStatus(CrudStatus.NEED_REFRESH);
        crud.update.setTableSelectKeys([]);
      }
    "
  />
</template>

<script lang="ts" setup>
  import { CrudStatus, CRUD } from '@/components/crud/CRUD';
  import { inject } from 'vue';

  const crud = inject('crud') as CRUD<any>;

  const props = withDefaults(
    defineProps<{
      showTotal?: boolean;
      showJumper?: boolean;
      showPageSize?: boolean;
    }>(),
    {
      showTotal: true,
      showJumper: true,
      showPageSize: true,
    }
  );
</script>

<style scoped></style>
