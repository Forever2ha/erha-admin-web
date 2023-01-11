<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--没有查询字段，字段生成主键的查询方式-->
          <a-col :span="6">
            <!--id搜索框-->
            <a-input-number
              v-model="crud.options.query.historyId"
              placeholder="输入id搜索"
            />
          </a-col>
          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['operation:oraDeployHistory:add']"
          :edit-permission="['operation:oraDeployHistory:edit']"
          :del-permission="['operation:oraDeployHistory:del']"
          :download-permission="['operation:oraDeployHistory:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--应用名称-->
              <a-col :span="12">
                <a-form-item field="appName" label="应用名称">
                  <a-input v-model="crud.options.form.appName" />
                </a-form-item>
              </a-col>
              <!--部署日期-->
              <a-col :span="12">
                <a-form-item field="deployDate" label="部署日期">
                  <a-date-picker
                    v-model="crud.options.form.deployDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <!--部署用户-->
              <a-col :span="12">
                <a-form-item field="deployUser" label="部署用户">
                  <a-input v-model="crud.options.form.deployUser" />
                </a-form-item>
              </a-col>
              <!--服务器IP-->
              <a-col :span="12">
                <a-form-item field="ip" label="服务器IP">
                  <a-input v-model="crud.options.form.ip" />
                </a-form-item>
              </a-col>
              <!--部署编号-->
              <a-col :span="12">
                <a-form-item field="deployId" label="部署编号">
                  <a-input-number v-model="crud.options.form.deployId" />
                </a-form-item>
              </a-col>
              <!--项目ID-->
              <a-col :span="12">
                <a-form-item field="projectId" label="项目ID">
                  <a-input-number v-model="crud.options.form.projectId" />
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
          <template #appName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.appName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.appName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].appName
                    ? crud.options.form[record.id].appName
                    : record.appName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].appName"
                :default-value="record.appName"
              />
            </div>
          </template>

          <!--部署日期-->
          <template #deployDate="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.deployDate }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.deployDate }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].deployDate
                    ? crud.options.form[record.id].deployDate
                    : record.deployDate
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].deployDate"
                show-time
                :default-value="record.deployDate"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </div>
          </template>

          <!--部署用户-->
          <template #deployUser="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.deployUser }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.deployUser }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].deployUser
                    ? crud.options.form[record.id].deployUser
                    : record.deployUser
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].deployUser"
                :default-value="record.deployUser"
              />
            </div>
          </template>

          <!--服务器IP-->
          <template #ip="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.ip }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.ip }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].ip
                    ? crud.options.form[record.id].ip
                    : record.ip
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].ip"
                :default-value="record.ip"
              />
            </div>
          </template>

          <!--部署编号-->
          <template #deployId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.deployId }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.deployId }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].deployId
                    ? crud.options.form[record.id].deployId
                    : record.deployId
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].deployId"
                :default-value="record.deployId"
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
