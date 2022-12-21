<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--应用名称搜索框-->
          <a-col :span="6">
            <a-input
              v-model="crud.options.query.name"
              placeholder="输入应用名称搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>

          <!--项目ID搜索框-->
          <a-col :span="6">
            <a-input-number
              v-model="crud.options.query.projectId"
              placeholder="输入项目ID搜索"
            >
              <template #prefix> = </template>
            </a-input-number>
          </a-col>

          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['operation:oraApp:add']"
          :edit-permission="['operation:oraApp:edit']"
          :del-permission="['operation:oraApp:del']"
          :download-permission="['operation:oraApp:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--应用名称-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="应用名称"
                  :rules="[{ required: true, message: '应用名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <!--上传目录-->
              <a-col :span="12">
                <a-form-item
                  field="uploadPath"
                  label="上传目录"
                  :rules="[{ required: true, message: '上传目录不能为空' }]"
                >
                  <a-input v-model="crud.options.form.uploadPath" />
                </a-form-item>
              </a-col>
              <!--部署路径-->
              <a-col :span="12">
                <a-form-item
                  field="deployPath"
                  label="部署路径"
                  :rules="[{ required: true, message: '部署路径不能为空' }]"
                >
                  <a-input v-model="crud.options.form.deployPath" />
                </a-form-item>
              </a-col>
              <!--备份路径-->
              <a-col :span="12">
                <a-form-item
                  field="backupPath"
                  label="备份路径"
                  :rules="[{ required: true, message: '备份路径不能为空' }]"
                >
                  <a-input v-model="crud.options.form.backupPath" />
                </a-form-item>
              </a-col>
              <!--应用端口-->
              <a-col :span="12">
                <a-form-item
                  field="port"
                  label="应用端口"
                  :rules="[{ required: true, message: '应用端口不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.port" />
                </a-form-item>
              </a-col>
              <!--项目ID-->
              <a-col :span="12">
                <a-form-item
                  field="projectId"
                  label="项目ID"
                  :rules="[{ required: true, message: '项目ID不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.projectId" />
                </a-form-item>
              </a-col>
              <!--启动脚本-->
              <a-col :span="24">
                <a-form-item
                  field="startScript"
                  label="启动脚本"
                  :rules="[{ required: true, message: '启动脚本不能为空' }]"
                >
                  <a-textarea v-model="crud.options.form.startScript" />
                </a-form-item>
              </a-col>
              <!--部署脚本-->
              <a-col :span="24">
                <a-form-item
                  field="deployScript"
                  label="部署脚本"
                  :rules="[{ required: true, message: '部署脚本不能为空' }]"
                >
                  <a-textarea v-model="crud.options.form.deployScript" />
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

          <!--应用名称-->
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
              />
            </div>
          </template>

          <!--上传目录-->
          <template #uploadPath="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.uploadPath }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.uploadPath }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].uploadPath
                    ? crud.options.form[record.id].uploadPath
                    : record.uploadPath
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].uploadPath"
                :default-value="record.uploadPath"
              />
            </div>
          </template>

          <!--部署路径-->
          <template #deployPath="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.deployPath }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.deployPath }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].deployPath
                    ? crud.options.form[record.id].deployPath
                    : record.deployPath
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].deployPath"
                :default-value="record.deployPath"
              />
            </div>
          </template>

          <!--备份路径-->
          <template #backupPath="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.backupPath }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.backupPath }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].backupPath
                    ? crud.options.form[record.id].backupPath
                    : record.backupPath
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].backupPath"
                :default-value="record.backupPath"
              />
            </div>
          </template>

          <!--应用端口-->
          <template #port="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.port }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.port }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].port
                    ? crud.options.form[record.id].port
                    : record.port
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].port"
                :default-value="record.port"
              />
            </div>
          </template>

          <!--启动脚本-->
          <template #startScript="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.startScript }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.startScript }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].startScript
                    ? crud.options.form[record.id].startScript
                    : record.startScript
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].startScript"
                :default-value="record.startScript"
              />
            </div>
          </template>

          <!--部署脚本-->
          <template #deployScript="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.deployScript }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.deployScript }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].deployScript
                    ? crud.options.form[record.id].deployScript
                    : record.deployScript
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].deployScript"
                :default-value="record.deployScript"
              />
            </div>
          </template>

          <!--项目ID-->
          <template #projectId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.projectId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.projectId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].projectId
                    ? crud.options.form[record.id].projectId
                    : record.projectId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].projectId"
                :default-value="record.projectId"
              />
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
  import { OraApp } from '@/api/operation/app';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<OraApp>({
    tag: '应用管理',
    url: '/operation/app',
    title: 'operation.app',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置应用管理 columns信息
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
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '上传目录',
      dataIndex: 'uploadPath',
      width: 150,
      display: true,
      slotName: 'uploadPath',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '部署路径',
      dataIndex: 'deployPath',
      width: 150,
      display: true,
      slotName: 'deployPath',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '备份路径',
      dataIndex: 'backupPath',
      width: 150,
      display: true,
      slotName: 'backupPath',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '应用端口',
      dataIndex: 'port',
      width: 150,
      display: true,
      slotName: 'port',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '启动脚本',
      dataIndex: 'startScript',
      width: 150,
      display: true,
      slotName: 'startScript',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '部署脚本',
      dataIndex: 'deployScript',
      width: 150,
      display: true,
      slotName: 'deployScript',
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
      title: '创建日期',
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
      title: '项目ID',
      dataIndex: 'projectId',
      width: 150,
      display: true,
      slotName: 'projectId',
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

<script lang="ts">
  export default {
    name: 'App',
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
