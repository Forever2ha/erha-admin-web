<template>
  <div style="position: relative; height: 100%">
    <a-modal
      :visible="showDeployHis"
      hide-cancel
      width="80vw"
      @cancel="showDeployHis = false"
    >
      <template #title>部署备份</template>
      <CrudOperation
        :show-add="false"
        :show-edit="false"
        :show-del="false"
        :show-download="false"
        :del-permission="['operation:history:del']"
        :download-permission="['operation:history:list']"
        style="margin-bottom: 12px"
      >
        <template #left>
          <a-button
            type="outline"
            size="small"
            status="success"
            :disabled="crud.options.tableInfo.selectKeys.length !== 1"
            :loading="reductionLoading.loading.value"
            @click="reduction"
          >
            <template #icon>
              <icon-reply />
            </template>
            还原</a-button
          >
        </template>
      </CrudOperation>

      <!--表格-->
      <a-table
        ref="table"
        v-model:selectedKeys="crud.options.tableInfo.selectKeys"
        row-key="id"
        :columns="tableColumns"
        :data="crud.options.tableInfo.data"
        :pagination="false"
        :scroll="{ y: '100%' }"
        :loading="crud.status.value === CrudStatus.REFRESHING"
        :column-resizable="crud.options.tableInfo.componentConfig.colResizable"
        :bordered="{
          cell: crud.options.tableInfo.componentConfig.border,
        }"
        :stripe="crud.options.tableInfo.componentConfig.stripe"
        :show-header="crud.options.tableInfo.componentConfig.tableHeader"
        :row-selection="
          crud.options.tableInfo.componentConfig.checkbox
            ? {
                type: 'checkbox',
                showCheckedAll: true,
              }
            : undefined
        "
        style="height: calc(100% - 128px); margin-bottom: 12px"
      >
      </a-table>
      <template #footer>
        <Pagination />
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import { OraDeployHistory } from '@/api/operation/history';
  import {
    computed,
    getCurrentInstance,
    inject,
    onMounted,
    provide,
    ref,
    watch,
  } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { reductionServer } from '@/api/operation/deploy';

  const websocket = inject<WebSocket>('websocket');
  const startWebsocket = inject('startWebsocket') as () => void;
  const showDeployHis = inject<boolean>('showDeployHis');
  const selectDeployId = inject<number>('selectDeployId');
  const reductionLoading = useLoading(false);
  const reduction = async () => {
    reductionLoading.toggle();
    if (crud.options.tableInfo.selectKeys.length !== 1) return;
    try {
      startWebsocket();
      await reductionServer(crud.options.tableInfo.selectKeys[0]);
    } catch (e) {
      // ignore
    }
    reductionLoading.toggle();
  };

  const { t } = useI18n();
  const crud = useCrud<OraDeployHistory>({
    tag: '部署备份',
    url: '/operation/history',
    title: 'operation.history',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置部署备份 columns信息
  crud.update.setTableColumns([
    {
      title: t('crud.table.update.result'),
      dataIndex: 'result',
      width: 90,
      display: false,
      fixed: 'left',
      slotName: 'result',
      ignoreSwitch: true,
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 150,
      display: true,
      slotName: 'appName',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '部署日期',
      dataIndex: 'deployDate',
      width: 180,
      display: true,
      slotName: 'deployDate',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '部署用户',
      dataIndex: 'deployUser',
      width: 150,
      display: true,
      slotName: 'deployUser',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '服务器IP',
      dataIndex: 'ip',
      width: 150,
      display: true,
      slotName: 'ip',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  watch(showDeployHis as any, (val) => {
    if (val) crud.method.refresh();
  });
  crud.hook.beforeRefresh = () => {
    crud.options.query.deployId = selectDeployId;
    return true;
  };
  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'History',
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
</style>
