<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <a-row :gutter="24" style="margin-bottom: 12px">
          <a-col :span="6">
            <!--部门名称搜索框-->
            <a-input
              v-model="crud.options.query.name"
              placeholder="输入名称或者描述搜索"
            />
          </a-col>
          <a-col :span="6">
            <a-range-picker v-model="pickerValue" @change="rangePickerChange" />
          </a-col>
          <a-col :span="3">
            <a-select
              v-model="crud.options.query.jobStatus"
              :placeholder="$t('system.user.status')"
            >
              <a-option
                v-for="s in dict.job_status"
                :key="s.detailId"
                :value="s.value"
              >
                {{ s.label }}
              </a-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>

        <!--crudOperation-->
        <CrudOperation
          :add-permission="['system:job:list']"
          :edit-permission="['system:job:edit']"
          :del-permission="['system:job:del']"
          :download-permission="['system:job:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <!--岗位名称-->
            <a-row>
              <a-form-item
                field="name"
                :label="$t('system.job.table.name')"
                :rules="[
                  { required: true, message: '岗位名不能为空' },
                  {
                    minLength: 2,
                    maxLength: 20,
                    message: '长度在2-20之间',
                  },
                ]"
              >
                <a-input v-model="crud.options.form.name" />
              </a-form-item>
            </a-row>
            <!--岗位排序-->
            <a-row>
              <a-form-item
                field="jobSort"
                :label="$t('system.job.table.sort')"
                :rules="[
                  {
                    required: true,
                    message: '岗位排序不能为空',
                  },
                ]"
              >
                <a-input-number v-model="crud.options.form.jobSort" :min="0" />
              </a-form-item>
            </a-row>
            <!--岗位状态-->
            <a-row>
              <a-col :span="12"
                ><a-form-item
                  field="enabled"
                  :label="$t('system.job.table.enabled')"
                  :rules="[{ required: true, message: '状态不能为空' }]"
                >
                  <a-radio-group v-model="crud.options.form.enabled">
                    <a-radio :value="true"> 启用 </a-radio>
                    <a-radio :value="false"> 禁用 </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
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
          <!--修改结果-->
          <template #result="{ record }">
            <!--修改完毕并且不完全修改成功的时候展示-->
            <div
              v-show="
                crud.options.tableInfo.selectKeys.includes(record.id) &&
                crud.options.tableInfo.isEdit
              "
            >
              <!--修改成功的行-->
              <div
                v-show="
                  !record.updateErr && typeof record.updateErr === 'boolean'
                "
              >
                <a-popover>
                  <a-tag color="green">
                    <icon-check />
                  </a-tag>

                  <template #title> 更改成功 </template>
                </a-popover>
              </div>
              <!--修改失败的行-->
              <div v-show="record.updateErr !== false">
                <div v-show="record.updateErr === undefined">
                  <a-tag color="blue"> <icon-edit />... </a-tag>
                </div>
                <div v-show="record.updateErr">
                  <a-popover>
                    <a-tag color="red">
                      <icon-close />
                    </a-tag>
                    <template #title> 更改失败 </template>
                    <template #content>
                      <a-list size="small">
                        <a-list-item
                          v-for="(err, index) in record.updateErr"
                          :key="index"
                        >
                          [{{
                            $t(`${crud.options.title}.table.${err.errorField}`)
                          }}]
                          {{ err.errorMsg }}
                          --->[{{ err.errorVal }}]
                        </a-list-item>
                      </a-list>
                    </template>
                  </a-popover>
                </div>
              </div>
            </div>
          </template>
          <!--名称-->
          <template #name="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.name }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.name }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].name
                    ? crud.options.form[record.id].name
                    : record.name
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].name"
                :default-value="record.name"
              ></a-input>
            </div>
          </template>

          <!--排序-->
          <template #jobSort="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.jobSort }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.jobSort }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].jobSort
                    ? crud.options.form[record.id].jobSort
                    : record.jobSort
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].jobSort"
                :default-value="record.jobSort"
                :min="0"
              />
            </div>
          </template>
          <!--状态-->
          <template #enabled="{ record }">
            <a-switch
              v-model="record.enabled"
              :loading="loading"
              @change="enableChange(record)"
            >
              <template #checked> 启用 </template>
              <template #unchecked> 禁用 </template>
            </a-switch></template
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
  import { Role } from '@/api/system/role';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import { Job } from '@/api/system/job';

  const crud = useCrud<Job>({
    tag: '岗位',
    url: '/system/job',
    title: 'system.job',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);
  // 字典
  const dict = useDict('job_status');
  // 国际化
  const { t } = useI18n();
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;
  // region    ↓-------------------------------- crud --------------------------------↓

  // rangePicker的值改变
  function rangePickerChange(data: any) {
    crud.update.appendQueryParams({
      startCreateTime: `${data[0]} 00:00:00`,
      endCreateTime: `${data[1]} 00:00:00`,
    });
  }

  // 解决重置params rangerPicker不清除数据的问题
  const pickerValue = ref([]);
  // 设置表格dept columns信息
  crud.update.setTableColumns([
    {
      title: t('crud.table.update.result'),
      dataIndex: 'result',
      width: 90,
      display: false,
      slotName: 'result',
      fixed: 'left',
      ignoreSwitch: true,
    },
    {
      title: t('system.job.table.name'),
      dataIndex: 'name',
      width: 160,
      display: true,
      slotName: 'name',
      ignoreSwitch: true,
    },
    {
      title: t('system.job.table.sort'),
      dataIndex: 'jobSort',
      width: 150,
      display: true,
      slotName: 'jobSort',
    },
    {
      title: t('system.job.table.enabled'),
      dataIndex: 'enabled',
      width: 100,
      display: true,
      slotName: 'enabled',
    },

    {
      title: t('system.user.table.createTime'),
      dataIndex: 'createTime',
      width: 180,
      display: true,
    },
    {
      dataIndex: 'createBy',
      title: t('system.user.table.createBy'),
      width: 110,
      display: true,
    },
    {
      dataIndex: 'updateTime',
      title: t('system.user.table.updateTime'),
      width: 180,
      display: true,
    },
    {
      dataIndex: 'updateBy',
      title: t('system.user.table.updateBy'),
      width: 110,
      display: true,
    },
  ]);

  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });
  // 状态loading
  const { loading, toggle } = useLoading();
  // 部门状态改变
  const enableChange = async (record: any) => {
    toggle();
    const data = (await axios.put(crud.options.url, [
      { id: record.id, enabled: record.enabled },
    ])) as any;
    if (data.code === 20000) {
      global.$notification.success('更改成功');
    } else {
      global.$notification.warning(`更改失败:${data.msg}`);
      record.enabled = !record.enabled;
    }
    toggle();
  };

  // endregion ↑-------------------------------- crud --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });
  crud.hook.afterResetParams = () => {
    pickerValue.value = [];
  };
  crud.hook.beforeOpenAdd = () => {
    crud.options.form.jobSort = 0;
    crud.options.form.enabled = true;
    return true;
  };
  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Job',
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
