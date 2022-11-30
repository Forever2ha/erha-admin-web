<template>
  <a-modal :visible="visible" width="80vw" @cancel="visible = false">
    <template #title>执行日志</template>
    <a-space direction="vertical">
      <!--检索条件栏-->
      <a-row :gutter="24">
        <a-col :span="6">
          <!--名称搜索框-->
          <a-input
            v-model="crud.options.query.name"
            placeholder="输入任务名称搜索"
          />
        </a-col>
        <a-col :span="6">
          <a-range-picker v-model="pickerValue" @change="rangePickerChange" />
        </a-col>

        <a-col :span="3">
          <a-select v-model="crud.options.query.isSuccess" placeholder="状态">
            <a-option value="true"> 成功 </a-option>
            <a-option value="false"> 失败 </a-option>
          </a-select>
        </a-col>

        <a-col :span="6">
          <RROperation />
        </a-col>
      </a-row>
      <!--表格栏-->
      <a-row>
        <a-table
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
          style="height: 65vh"
        >
          <!--状态-->
          <template #isSuccess="{ record }">
            <a-tag :color="record.isSuccess ? 'green' : 'red'">{{
              record.isSuccess ? '成功' : '失败'
            }}</a-tag>
          </template>

          <!--异常信息-->
          <template #exceptionDetail="{ record }">
            <a-link
              v-show="!record.isSuccess"
              @click="
                () => {
                  showException = true;
                  lastClickExc = record;
                }
              "
              >查看详情</a-link
            >
          </template>
        </a-table>
      </a-row>
    </a-space>
    <a-modal v-model:visible="showException" width="75vw">
      <template #title>异常详情</template>
      <div style="white-space: pre-wrap">
        {{ lastClickExc.exceptionDetail }}
      </div>

      <template #footer>
        <a-space>
          {{ lastClickExc.jobName }}
          <a-divider direction="vertical" />
          {{ lastClickExc.beanName }}
          <a-divider direction="vertical" />
          {{ lastClickExc.methodName }} (
          {{ lastClickExc.params ? lastClickExc.params : 'void' }} )
          <a-divider direction="vertical" />
          {{ lastClickExc.cronExpression }}
          <a-divider direction="vertical" />
          <a-tag :color="lastClickExc.isSuccess ? 'green' : 'red'">{{
            lastClickExc.isSuccess ? '成功' : '失败'
          }}</a-tag>
          <a-divider direction="vertical" />
          {{ lastClickExc.time }} ms
          <a-divider direction="vertical" />
          {{ lastClickExc.execTime }}
        </a-space>
      </template>
    </a-modal>
    <template #footer>
      <Pagination :show-page-size="true" />
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, ref, inject, onMounted, provide, reactive } from 'vue';
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import { QuartzLog } from '@/api/system/quartz';
  import { useI18n } from 'vue-i18n';
  import Pagination from '@/components/crud/Pagination.vue';
  import RROperation from '@/components/crud/RROperation.vue';

  const { t } = useI18n();
  const crud = useCrud<QuartzLog>({
    tag: '任务执行日志',
    url: '/quartzLog',
    title: 'system.quartzLog',
    tableInfo: {
      componentConfig: {
        checkbox: false,
        stripe: false,
      },
    },
  });

  provide('crud', crud);
  // 设置表格dept columns信息
  crud.update.setTableColumns([
    {
      title: t('system.quartzLog.table.id'),
      dataIndex: 'id',
      width: 80,
      display: true,
    },
    {
      title: t('system.quartzLog.table.jobName'),
      dataIndex: 'jobName',
      width: 160,
      display: true,
      slotName: 'jobName',
      ellipsis: true,
      tooltip: true,
      fixed: 'left',
    },
    {
      title: t('system.quartzLog.table.beanName'),
      dataIndex: 'beanName',
      width: 100,
      display: true,
      slotName: 'beanName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.quartzLog.table.methodName'),
      dataIndex: 'methodName',
      width: 100,
      display: true,
      slotName: 'methodName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.quartzLog.table.params'),
      dataIndex: 'params',
      width: 100,
      display: true,
      slotName: 'params',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.quartzLog.table.cronExpression'),
      dataIndex: 'cronExpression',
      width: 130,
      display: true,
      slotName: 'cronExpression',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.quartzLog.table.isSuccess'),
      dataIndex: 'isSuccess',
      width: 80,
      display: true,
      slotName: 'isSuccess',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.quartzLog.table.exceptionDetail'),
      dataIndex: 'exceptionDetail',
      width: 100,
      display: true,
      slotName: 'exceptionDetail',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.quartzLog.table.time'),
      dataIndex: 'time',
      width: 100,
      display: true,
      slotName: 'time',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.user.table.createTime'),
      dataIndex: 'createTime',
      width: 180,
      display: false,
    },
    {
      title: t('system.quartzLog.table.execTime'),
      dataIndex: 'execTime',
      width: 180,
      display: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  const visible = inject<boolean>('logVisible');
  const showException = ref<boolean>(false);
  const lastClickExc = reactive<QuartzLog | {}>({});

  // rangePicker的值改变
  function rangePickerChange(data: any) {
    crud.update.appendQueryParams({
      startExecTime: `${data[0]} 00:00:00`,
      endExecTime: `${data[1]} 00:00:00`,
    });
  }

  // 解决重置params rangerPicker不清除数据的问题
  const pickerValue = ref([]);

  onMounted(() => {
    crud.method.refresh();
  });

  crud.hook.afterResetParams = () => {
    pickerValue.value = [];
  };
</script>

<style scoped></style>
