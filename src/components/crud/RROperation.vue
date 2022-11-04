<template>
  <a-space size="medium">
    <a-button
      status="success"
      long
      :disabled="crud.options.tableInfo.isEdit || !props.enabledReset"
      @click="crud.method.refresh"
    >
      <template #icon> <icon-search /> </template
      >{{ $t('crud.search') }}</a-button
    ><a-button
      status="warning"
      :disabled="crud.options.tableInfo.isEdit || !props.enabledSearch"
      @click="crud.update.resetParams"
    >
      <template #icon> <icon-refresh /> </template>
      {{ $t('crud.reset') }}
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { CRUD } from '@/components/crud/CRUD';
  import { inject } from 'vue';

  const crud = inject('crud') as CRUD<any>;

  const props = withDefaults(
    defineProps<{
      enabledReset?: boolean;
      enabledSearch?: boolean;
    }>(),
    {
      enabledReset: true,
      enabledSearch: true,
    }
  );
</script>

<style scoped></style>
