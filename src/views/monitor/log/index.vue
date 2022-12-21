<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="crud.options.query"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-scrollbar style="height: 104px; overflow: auto">
                <a-row :gutter="16" style="width: 100%">
                  <!--描述搜索框-->
                  <a-col :span="8">
                    <a-form-item field="description" label="描述">
                      <a-input
                        v-model="crud.options.query.description"
                        placeholder="输入描述搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--日志类型搜索框-->
                  <a-col :span="8">
                    <a-form-item field="logType" label="日志类型">
                      <a-select
                        v-model="crud.options.query.logType"
                        placeholder="输入日志类型搜索"
                      >
                        <a-option
                          v-for="s in dict.tools_log_type"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--参数搜索框-->
                  <a-col :span="8">
                    <a-form-item field="params" label="参数">
                      <a-input
                        v-model="crud.options.query.params"
                        placeholder="输入参数搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--IP来源搜索框-->
                  <a-col :span="8">
                    <a-form-item field="requestIp" label="IP来源">
                      <a-input
                        v-model="crud.options.query.requestIp"
                        placeholder="输入IP来源搜索"
                      >
                        <template #prefix> = </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--耗时搜索框-->
                  <a-col :span="8">
                    <a-form-item field="time" label="耗时">
                      <a-input-group>
                        <a-input
                          v-model="crud.options.query.startTime"
                          placeholder="耗时"
                        >
                          <template #prefix>[</template>
                          <template #suffix>,</template>
                        </a-input>
                        <a-input
                          v-model="crud.options.query.endTime"
                          placeholder="耗时"
                        >
                          <template #suffix>]</template>
                        </a-input>
                      </a-input-group>
                    </a-form-item>
                  </a-col>
                  <!--用户名搜索框-->
                  <a-col :span="8">
                    <a-form-item field="username" label="用户名">
                      <a-input
                        v-model="crud.options.query.username"
                        placeholder="输入用户名搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--IP归属地搜索框-->
                  <a-col :span="8">
                    <a-form-item field="address" label="IP归属地">
                      <a-input
                        v-model="crud.options.query.address"
                        placeholder="输入IP归属地搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--浏览器搜索框-->
                  <a-col :span="8">
                    <a-form-item field="browser" label="浏览器">
                      <a-input
                        v-model="crud.options.query.browser"
                        placeholder="输入浏览器搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--创建时间搜索框-->
                  <a-col :span="8">
                    <a-form-item field="createTime" label="创建时间">
                      <a-range-picker
                        v-model="pickerValueCreateTime"
                        :placeholder="['[创建时间', '创建时间]']"
                        @change="rangePickerCreateTimeChange"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-scrollbar>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <RROperation direction="vertical" />
          </a-col>
        </a-row>
        <a-divider style="margin-top: 0" />
        <CrudOperation
          :del-permission="['sysLog:del']"
          :download-permission="['sysLog:list']"
          :show-add="false"
          :show-edit="false"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12"> </a-row>
          </template>
        </CrudOperation>

        <!--表格-->
        <a-table
          ref="table"
          v-model:selectedKeys="crud.options.tableInfo.selectKeys"
          row-key="id"
          :expandable="expandable"
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
          style="height: calc(100% - 209px); margin-bottom: 12px"
        >
          <template #description="{ record }">
            <a-space>
              <a-badge
                :color="record.logType === 'INFO' ? 'green' : 'red'"
                :text="record.logType"
              />
              <span>{{ record.description }}</span>
            </a-space>
          </template>

          <template #time="{ record }">
            <a-tag
              :color="
                record.time <= 50
                  ? 'green'
                  : record.time <= 100
                  ? 'lime'
                  : record.time <= 150
                  ? 'gold'
                  : record.time <= 200
                  ? 'orange'
                  : record.time <= 250
                  ? 'orangered'
                  : 'red'
              "
              >{{ record.time }}ms</a-tag
            >
          </template>
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
  import { SysLog } from '@/api/monitor/log';
  import {
    computed,
    getCurrentInstance,
    onMounted,
    provide,
    reactive,
    ref,
    h,
    resolveComponent,
  } from 'vue';

  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<SysLog>({
    tag: '操作日志',
    url: '/monitor/log',
    title: 'monitor.log',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);

  // 字典
  const dict = useDict('tools_log_type');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置操作日志 columns信息
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
      title: '描述',
      dataIndex: 'description',
      width: 200,
      display: true,
      slotName: 'description',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150,
      display: true,
      slotName: 'username',
      tooltip: true,
      ellipsis: true,
    },

    {
      title: 'IP',
      dataIndex: 'requestIp',
      width: 150,
      display: true,
      slotName: 'requestIp',
      tooltip: true,
      ellipsis: true,
    },

    {
      title: 'IP归属地',
      dataIndex: 'address',
      width: 120,
      display: true,
      slotName: 'address',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '耗时',
      dataIndex: 'time',
      width: 80,
      display: true,
      slotName: 'time',
      tooltip: true,
      ellipsis: true,
    },

    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 150,
      display: true,
      slotName: 'browser',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      width: 180,
      display: true,
      slotName: 'createTime',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  const ATag: any = resolveComponent('ATag');
  const ASpace: any = resolveComponent('ASpace');
  const expandable = reactive({
    title: '详情',
    width: 80,
    expandedRowRender: (record: any) => {
      return h(
        ASpace,
        { direction: 'vertical', size: 'mini' },
        {
          default: () => [
            h(
              ASpace,
              { size: 'mini' },
              {
                default: () => [
                  h(ATag, { color: 'blue' }, { default: () => '执行方法' }),
                  h(
                    'span',
                    { style: { color: 'rgb(var(--blue-6))' } },
                    record.method
                  ),
                ],
              }
            ),
            h(
              ASpace,
              { size: 'mini' },
              {
                default: () => [
                  h(ATag, { color: 'green' }, { default: () => '执行参数' }),
                  h(
                    'span',
                    { style: { color: 'rgb(var(--green-6))' } },
                    record.params
                  ),
                ],
              }
            ),
            h(
              'div',
              {},
              {
                default: () => [
                  h(ATag, { color: 'red' }, { default: () => '异常信息' }),
                  h(
                    'span',
                    {
                      style: {
                        color: 'rgb(var(--red-6))',
                        whiteSpace: 'pre-wrap',
                        marginLeft: '10px',
                      },
                    },
                    record.exceptionDetail
                  ),
                ],
              }
            ),
          ],
        }
      );
    },
  });

  // region    ↓-------------------------------- switch --------------------------------↓
  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓

  // rangePickerCreateTime的值改变
  function rangePickerCreateTimeChange(data: any) {
    crud.update.appendQueryParams({
      startCreateTime: `${data[0]} 00:00:00`,
      endCreateTime: `${data[1]} 00:00:00`,
    });
  }
  // 解决重置params rangerPickerCreateTime不清除数据的问题
  const pickerValueCreateTime = ref([]);

  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });

  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Log',
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
