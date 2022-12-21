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
                  <!--项目名称搜索框-->
                  <a-col :span="8">
                    <a-form-item field="pname" label="项目名称">
                      <a-input
                        v-model="crud.options.query.pname"
                        placeholder="输入项目名称搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--创建者搜索框-->
                  <a-col :span="8">
                    <a-form-item field="createBy" label="创建者">
                      <a-input
                        v-model="crud.options.query.createBy"
                        placeholder="输入创建者搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--状态搜索框-->
                  <a-col :span="8">
                    <a-form-item field="enabled" label="状态">
                      <a-select
                        v-model="crud.options.query.enabled"
                        placeholder="输入状态搜索"

                      >
                        <a-option
                          v-for="s in dict.user_status"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-scrollbar>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <RROperation direction="vertical"/>
          </a-col>
        </a-row>
        <a-divider style="margin-top: 0" />
        <CrudOperation
          :add-permission="['oraProject:add']"
          :edit-permission="['oraProject:edit']"
          :del-permission="['oraProject:del']"
          :download-permission="['oraProject:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--项目名称-->
              <a-col :span="12">
                <a-form-item
                  field="pname"
                  label="项目名称"
                >
                  <a-input v-model="crud.options.form.pname" />
                </a-form-item>
              </a-col>
              <!--项目计划开始日期-->
              <a-col :span="12">
                <a-form-item
                  field="planStartDate"
                  label="项目计划开始日期"
                >
                  <a-date-picker
                    v-model="crud.options.form.planStartDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <!--项目计划结束日期-->
              <a-col :span="12">
                <a-form-item
                  field="planFinishDate"
                  label="项目计划结束日期"
                >
                  <a-date-picker
                    v-model="crud.options.form.planFinishDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <!--实际开始日期-->
              <a-col :span="12">
                <a-form-item
                  field="actuStartDate"
                  label="实际开始日期"
                >
                  <a-date-picker
                    v-model="crud.options.form.actuStartDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <!--实际结束日期-->
              <a-col :span="12">
                <a-form-item
                  field="actuFinishDate"
                  label="实际结束日期"
                >
                  <a-date-picker
                    v-model="crud.options.form.actuFinishDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <!--状态-->
              <a-col :span="12">
                <a-form-item
                  field="enabled"
                  label="状态"
                >
                  <a-radio-group v-model="crud.options.form.enabled">
                    <a-radio
                      v-for="s in dict.user_status"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-radio
                    >
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
          style="height: calc(100% - 209px); margin-bottom: 12px"
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
                          [{{ err.errorField }}]
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

          <!--项目名称-->
          <template #pname="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.pname }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.pname }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].pname
                    ? crud.options.form[record.id].pname
                    : record.pname
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].pname"
                :default-value="record.pname"
              />
            </div>
          </template>

          <!--项目计划开始日期-->
          <template #planStartDate="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.planStartDate }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.planStartDate }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].planStartDate
                    ? crud.options.form[record.id].planStartDate
                    : record.planStartDate
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].planStartDate"
                show-time
                :default-value="record.planStartDate"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </div>
          </template>

          <!--项目计划结束日期-->
          <template #planFinishDate="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.planFinishDate }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.planFinishDate }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].planFinishDate
                    ? crud.options.form[record.id].planFinishDate
                    : record.planFinishDate
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].planFinishDate"
                show-time
                :default-value="record.planFinishDate"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </div>
          </template>

          <!--实际开始日期-->
          <template #actuStartDate="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.actuStartDate }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.actuStartDate }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].actuStartDate
                    ? crud.options.form[record.id].actuStartDate
                    : record.actuStartDate
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].actuStartDate"
                show-time
                :default-value="record.actuStartDate"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </div>
          </template>

          <!--实际结束日期-->
          <template #actuFinishDate="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.actuFinishDate }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.actuFinishDate }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].actuFinishDate
                    ? crud.options.form[record.id].actuFinishDate
                    : record.actuFinishDate
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].actuFinishDate"
                show-time
                :default-value="record.actuFinishDate"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </div>
          </template>

          <!--状态-->
          <template #enabled="{ record }">
            <div>
              <a-switch
                v-model="record.enabled"
                :loading="enabled.loading.value"
                @change="enableEnabledChange(record)"
              >
                <template #checked>{{
                  dict.user_status
                    ? dict.user_status.filter(
                        (di) => di.value === '1' || di.value === 'true'
                    )[0].label
                    : ''
                }}</template>
                <template #unchecked>{{
                  dict.user_status
                    ? dict.user_status.filter(
                        (di) => di.value === '0' || di.value === 'false'
                      )[0].label
                    : ''
                }}</template>
              </a-switch>
            </div>
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
  import { OraProject } from '@/api/operation/project';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue'
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<OraProject>({
    tag: '项目管理',
    url: '/operation/project',
    title: 'operation.project',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);



  // 字典
  const dict = useDict('user_status');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置项目管理 columns信息
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
      title: '项目名称',
      dataIndex: 'pname',
      width: 150,
      display: true,
      slotName: 'pname',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '项目计划开始日期',
      dataIndex: 'planStartDate',
      width: 180,
      display: true,
      slotName: 'planStartDate',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '项目计划结束日期',
      dataIndex: 'planFinishDate',
      width: 180,
      display: true,
      slotName: 'planFinishDate',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      width: 150,
      display: true,
      slotName: 'createBy',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '更新者',
      dataIndex: 'updateBy',
      width: 150,
      display: true,
      slotName: 'updateBy',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      display: true,
      slotName: 'createTime',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      display: true,
      slotName: 'updateTime',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '实际开始日期',
      dataIndex: 'actuStartDate',
      width: 180,
      display: true,
      slotName: 'actuStartDate',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '实际结束日期',
      dataIndex: 'actuFinishDate',
      width: 180,
      display: true,
      slotName: 'actuFinishDate',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      display: true,
      slotName: 'enabled',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // region    ↓-------------------------------- switch --------------------------------↓
  // 状态loading
  const enabled = useLoading();
  // 状态状态改变
  const enableEnabledChange = async (record: any) => {
    enabled.toggle();
    const data = (await axios.put(crud.options.url, [
      { id: record.id, enabled: record.enabled },
    ])) as any;
    if (data.code === 20000) {
      global.$notification.success('更改成功');
    } else {
      global.$notification.warning(`更改失败:${data.msg}`);
      record.enabled = !record.enabled;
    }
    enabled.toggle();
  };

  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓
  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });


  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Project',
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