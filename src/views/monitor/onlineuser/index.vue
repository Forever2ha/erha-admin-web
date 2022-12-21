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
                  <!--用户名搜索框-->
                  <a-col :span="8">
                    <a-form-item field="userName" label="用户名">
                      <a-input
                        v-model="crud.options.query.userName"
                        placeholder="输入用户名搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--昵称搜索框-->
                  <a-col :span="8">
                    <a-form-item field="nickname" label="昵称">
                      <a-input
                        v-model="crud.options.query.nickname"
                        placeholder="输入昵称搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--岗位搜索框-->
                  <a-col :span="8">
                    <a-form-item field="dept" label="岗位">
                      <a-input
                        v-model="crud.options.query.dept"
                        placeholder="输入岗位搜索"
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
                  <!--ip搜索框-->
                  <a-col :span="8">
                    <a-form-item field="ip" label="ip">
                      <a-input
                        v-model="crud.options.query.ip"
                        placeholder="输入ip搜索"
                      >
                        <template #prefix> = </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--登录地点搜索框-->
                  <a-col :span="8">
                    <a-form-item field="address" label="登录地点">
                      <a-input
                        v-model="crud.options.query.address"
                        placeholder="输入登录地点搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--登录时间搜索框-->
                  <a-col :span="8">
                    <a-form-item field="loginTime" label="登录时间">
                      <a-range-picker
                        v-model="pickerValueLoginTime"
                        :placeholder="['[登录时间', '登录时间]']"
                        @change="rangePickerLoginTimeChange"
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
          :show-add="false"
          :show-del="false"
          :show-edit="false"
          :download-permission="['monitor:onlineUser:list']"
          style="margin-bottom: 12px"
        >
          <template #left>
            <a-button
              v-permission="['monitor:onlineUser:del']"
              :loading="loading"
              type="outline"
              size="small"
              status="danger"
              @click="kick(crud.options.tableInfo.selectKeys)"
            >
              <template #icon>
                <icon-forward />
              </template>
              强制退出
            </a-button>
          </template>
        </CrudOperation>

        <!--表格-->
        <a-table
          ref="table"
          v-model:selectedKeys="crud.options.tableInfo.selectKeys"
          row-key="userName"
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
          <template #operate="{ record }">
            <a-button
              v-permission="['monitor:onlineUser:del']"
              :loading="loading"
              type="outline"
              size="mini"
              status="danger"
              @click="kick([record.userName])"
            >
              <template #icon>
                <icon-forward />
              </template>
              Kick
            </a-button>
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
  import { OnlineUser } from '@/api/monitor/onlineuser';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';

  const { t } = useI18n();
  const crud = useCrud<OnlineUser>({
    tag: '在线用户',
    url: '/monitor/onlineuser',
    title: 'monitor.onlineuser',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  const { loading, toggle } = useLoading(false);
  const kick = async (userName: string[]) => {
    toggle();
    const res = await axios.delete('/monitor/onlineuser', { data: userName });
    try {
      if ((res as any).code === 20000) {
        global.$message.success('操作成功！');
        crud.method.refresh();
      } else {
        global.$message.error(`操作失败！${(res as any).msg}`);
      }
    } finally {
      toggle();
    }
  };

  // 设置在线用户 columns信息
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
      title: '用户名',
      dataIndex: 'userName',
      width: 150,
      display: true,
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      width: 150,
      display: true,
      slotName: 'nickName',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '岗位',
      dataIndex: 'dept',
      width: 150,
      display: true,
      slotName: 'dept',
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
      title: 'ip',
      dataIndex: 'ip',
      width: 150,
      display: true,
      slotName: 'ip',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '登录地点',
      dataIndex: 'address',
      width: 150,
      display: true,
      slotName: 'address',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      width: 180,
      display: true,
      slotName: 'loginTime',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '操作',
      width: 100,
      display: true,
      slotName: 'operate',
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });
  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // rangePickerLoginTime的值改变
  function rangePickerLoginTimeChange(data: any) {
    crud.update.appendQueryParams({
      startLoginTime: `${data[0]} 00:00:00`,
      endLoginTime: `${data[1]} 00:00:00`,
    });
  }
  // 解决重置params rangerPickerLoginTime不清除数据的问题
  const pickerValueLoginTime = ref([]);

  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });
  crud.hook.afterResetParams = () => {
    pickerValueLoginTime.value = [];
  };

  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Onlineuser',
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
