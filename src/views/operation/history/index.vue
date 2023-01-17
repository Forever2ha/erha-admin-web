<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <a-col :span="6">
            <!--id搜索框-->
            <a-input
              v-model="crud.options.query.appName"
              placeholder="输入应用名称搜索"
              ><template #prefix>Like</template></a-input
            >
          </a-col>
          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :show-add="false"
          :show-edit="false"
          :del-permission="['operation:oraDeployHistory:del']"
          :download-permission="['operation:oraDeployHistory:list']"
          style="margin-bottom: 12px"
        >
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
          :column-resizable="
            crud.options.tableInfo.componentConfig.colResizable
          "
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
        <Pagination
          style="position: absolute; right: 0; bottom: 0; padding-right: 7px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import { OraDeployHistory } from '@/api/operation/history';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<OraDeployHistory>({
    tag: '部署管理',
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

  // 设置部署管理 columns信息
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
      title: '文件名',
      dataIndex: 'fileName',
      width: 200,
      display: true,
      slotName: 'fileName',
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
    {
      title: '部署编号',
      dataIndex: 'deployId',
      width: 150,
      display: true,
      slotName: 'deployId',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // region    ↓-------------------------------- switch --------------------------------↓
  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });

  // endregion ↑-------------------------------- 钩子 --------------------------------↑
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
