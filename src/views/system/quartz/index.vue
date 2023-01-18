<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!-- ================================
             上方搜索框
        ================================= -->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <a-col :span="6">
            <!--名称搜索框-->
            <a-input
              v-model="crud.options.query.name"
              placeholder="输入名称或者描述搜索"
            />
          </a-col>
          <a-col :span="6">
            <a-range-picker v-model="pickerValue" @change="rangePickerChange" />
          </a-col>
          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <!-- ================================
             CRUD操作
        ================================= -->
        <CrudOperation
          :add-permission="['system:quartz:list']"
          :edit-permission="['system:quartz:edit']"
          :del-permission="['system:quartz:del']"
          :download-permission="['system:quartz:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <!--任务名称、描述]-->
            <a-row>
              <a-col :span="12">
                <a-form-item
                  field="jobName"
                  label="任务名称"
                  :rules="[
                    { required: true, message: '任务名称不能为空' },
                    {
                      minLength: 2,
                      maxLength: 20,
                      message: '长度在2-20之间',
                    },
                  ]"
                >
                  <a-input v-model="crud.options.form.jobName" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  field="description"
                  label="任务描述"
                  :rules="[{ required: true, message: '任务描述不能为空' }]"
                >
                  <a-input v-model="crud.options.form.description" />
                </a-form-item>
              </a-col>
            </a-row>
            <!--Bean名称、执行方法-->
            <a-row>
              <a-col :span="12">
                <a-form-item
                  field="beanName"
                  label="Bean名称"
                  :rules="[{ required: true, message: 'beanName不能为空' }]"
                >
                  <a-input v-model="crud.options.form.beanName" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  field="methodName"
                  label="执行方法"
                  :rules="[{ required: true, message: '执行方法不能为空' }]"
                >
                  <a-input v-model="crud.options.form.methodName" />
                </a-form-item>
              </a-col>
            </a-row>
            <!--Cron表达式、子任务ID-->
            <a-row>
              <a-col :span="12">
                <a-form-item
                  field="cronExpression"
                  label="Cron表达式"
                  :rules="[{ required: true, message: 'Cron表达式不能为空' }]"
                >
                  <a-input v-model="crud.options.form.cronExpression" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="subTask" label="子任务ID">
                  <a-input v-model="crud.options.form.subTask" />
                </a-form-item>
              </a-col>
            </a-row>
            <!--任务负责人、告警邮箱-->
            <a-row>
              <a-col :span="12">
                <a-form-item
                  field="personInCharge"
                  label="任务负责人"
                  :rules="[{ required: true, message: '任务负责人不能为空' }]"
                >
                  <a-input v-model="crud.options.form.personInCharge" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="email" label="告警邮箱">
                  <a-input
                    v-model="crud.options.form.email"
                    placeholder="多个逗号隔开，按顺序执行"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <!--失败后暂停、任务状态-->
            <a-row>
              <a-col :span="12">
                <a-form-item field="pauseAfterFailure" label="失败后暂停">
                  <a-radio-group
                    v-model="crud.options.form.pauseAfterFailure"
                    default-value="true"
                  >
                    <a-radio value="true">是</a-radio>
                    <a-radio value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="isPause" label="任务状态">
                  <a-radio-group
                    v-model="crud.options.form.isPause"
                    default-value="false"
                  >
                    <a-radio value="false">启用</a-radio>
                    <a-radio value="true">禁用</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <!--是否立即执行一次任务-->
            <a-row>
              <a-col :span="12">
                <a-form-item field="runJobNow" label="立即执行一次">
                  <a-radio-group
                    v-model="crud.options.form.runJobNow"
                    default-value="false"
                  >
                    <a-radio value="true">是</a-radio>
                    <a-radio value="false">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <!--参数内容-->
            <a-row>
              <a-form-item label="方法参数" field="params">
                <a-textarea
                  v-model="crud.options.form.params"
                  allow-clear
                  auto-size /></a-form-item
            ></a-row>
          </template>
          <template #right>
            <a-button
              v-if="!crud.options.tableInfo.isEdit"
              :key="111"
              v-permission="['system:quartzLog:list']"
              type="outline"
              size="small"
              class="button"
              @click="logVisible = true"
            >
              <template #icon>
                <icon-drive-file />
              </template>
              日志
            </a-button>
          </template>
        </CrudOperation>
        <Log />

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
          style="height: calc(100% - 128px)"
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
          <template #beanName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.beanName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.beanName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].beanName
                    ? crud.options.form[record.id].beanName
                    : record.beanName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].beanName"
                :default-value="record.beanName"
              ></a-input>
            </div>
          </template>
          <!--cron表达式-->
          <template #cronExpression="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.cronExpression }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.cronExpression }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].cronExpression
                    ? crud.options.form[record.id].cronExpression
                    : record.cronExpression
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].cronExpression"
                :default-value="record.cronExpression"
              ></a-input>
            </div>
          </template>
          <!--任务名称-->
          <template #jobName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.jobName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.jobName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].jobName
                    ? crud.options.form[record.id].jobName
                    : record.jobName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].jobName"
                :default-value="record.jobName"
              ></a-input>
            </div>
          </template>
          <!--方法名称-->
          <template #methodName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.methodName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.methodName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].methodName
                    ? crud.options.form[record.id].methodName
                    : record.methodName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].methodName"
                :default-value="record.methodName"
              ></a-input>
            </div>
          </template>
          <!--方法参数-->
          <template #params="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.params }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.params }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].params
                    ? crud.options.form[record.id].params
                    : record.params
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].params"
                :default-value="record.params"
              ></a-input>
            </div>
          </template>
          <!--描述-->
          <template #description="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.description }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.description }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].description
                    ? crud.options.form[record.id].description
                    : record.description
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].description"
                :default-value="record.description"
              ></a-input>
            </div>
          </template>
          <!--负责人-->
          <template #personInCharge="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.personInCharge }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.personInCharge }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].personInCharge
                    ? crud.options.form[record.id].personInCharge
                    : record.personInCharge
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].personInCharge"
                :default-value="record.personInCharge"
              ></a-input>
            </div>
          </template>
          <!--告警邮箱-->
          <template #email="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.email }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.email }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].email
                    ? crud.options.form[record.id].email
                    : record.email
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].email"
                :default-value="record.email"
              ></a-input>
            </div>
          </template>
          <!--子任务-->
          <template #subTask="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.subTask }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.subTask }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].subTask
                    ? crud.options.form[record.id].subTask
                    : record.subTask
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].subTask"
                :default-value="record.subTask"
              ></a-input>
            </div>
          </template>
          <!--状态-->
          <template #isPause="{ record }">
            <a-trigger trigger="hover" position="right" show-arrow>
              <a-tag
                :color="record.isPause ? 'red' : 'green'"
                style="cursor: pointer"
                @click="statusClick(record)"
              >
                {{ record.isPause ? '已暂停' : '运行中' }}
              </a-tag>
              <template #content>
                <span v-show="record.isPause" style="color: #4cd263"
                  >点击运行</span
                >
                <span v-show="!record.isPause" style="color: #f98981"
                  >点击暂停</span
                >
              </template>
            </a-trigger>
          </template>
          <!--失败后暂停-->
          <template #pauseAfterFailure="{ record }">
            <a-switch
              v-model="record.pauseAfterFailure"
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
  // 国际化
  import { useI18n } from 'vue-i18n';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import { Quartz } from '@/api/system/quartz';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import Log from '@/views/system/quartz/log.vue';

  const { t } = useI18n();
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  const crud = useCrud<Quartz>({
    tag: '任务调度',
    url: '/system/quartz',
    title: 'system.quartz',
  });
  provide('crud', crud);
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
      title: t('system.quartz.table.id'),
      dataIndex: 'id',
      width: 80,
      display: true,
      slotName: 'id',
      fixed: 'left',
    },
    {
      title: t('system.quartz.table.jobName'),
      dataIndex: 'jobName',
      width: 160,
      display: true,
      slotName: 'jobName',
      fixed: 'left',
    },
    {
      title: t('system.quartz.table.description'),
      dataIndex: 'description',
      width: 200,
      display: true,
      slotName: 'description',
    },
    {
      title: t('system.quartz.table.cronExpression'),
      dataIndex: 'cronExpression',
      width: 160,
      display: true,
      slotName: 'cronExpression',
    },

    {
      title: t('system.quartz.table.isPause'),
      dataIndex: 'isPause',
      width: 160,
      display: true,
      slotName: 'isPause',
    },
    {
      title: t('system.quartz.table.beanName'),
      dataIndex: 'beanName',
      width: 160,
      display: true,
      slotName: 'beanName',
    },

    {
      title: t('system.quartz.table.methodName'),
      dataIndex: 'methodName',
      width: 160,
      display: true,
      slotName: 'methodName',
    },
    {
      title: t('system.quartz.table.params'),
      dataIndex: 'params',
      width: 160,
      display: true,
      slotName: 'params',
    },

    {
      title: t('system.quartz.table.personInCharge'),
      dataIndex: 'personInCharge',
      width: 160,
      display: true,
      slotName: 'personInCharge',
    },
    {
      title: t('system.quartz.table.email'),
      dataIndex: 'email',
      width: 160,
      display: true,
      slotName: 'email',
    },
    {
      title: t('system.quartz.table.subTask'),
      dataIndex: 'subTask',
      width: 160,
      display: true,
      slotName: 'subTask',
    },
    {
      title: t('system.quartz.table.pauseAfterFailure'),
      dataIndex: 'pauseAfterFailure',
      width: 160,
      display: true,
      slotName: 'pauseAfterFailure',
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
  const { loading, toggle } = useLoading();
  // 失败后暂停状态改变
  const enableChange = async (record: any) => {
    toggle();
    const data = (await axios.put(crud.options.url, [
      { id: record.id, pauseAfterFailure: record.pauseAfterFailure },
    ])) as any;
    if (data.code === 20000) {
      global.$notification.success('更改成功');
    } else {
      global.$notification.warning(`更改失败:${data.msg}`);
      record.pauseAfterFailure = !record.pauseAfterFailure;
    }
    toggle();
  };

  // 运行状态改变
  const statusClick = async (record: any) => {
    const data = await axios.put('/system/quartz/switch', { jobId: record.id });
    if ((data as any).code === 20000) {
      global.$message.success('修改成功');
      crud.update.setStatus(CrudStatus.NEED_REFRESH);
    }
  };

  // quartzLog
  const logVisible = ref(false);
  provide('logVisible', logVisible);
  // region    ↓-------------------------------- hook --------------------------------↓
  crud.hook.afterResetParams = () => {
    pickerValue.value = [];
  };
  onMounted(() => {
    crud.method.refresh();
  });
  // endregion ↑-------------------------------- hook --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Quartz',
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

  .button {
    color: #a871e3;
    border-color: #a871e3;
  }

  .button:hover {
    color: #c396ed;
    border-color: #c396ed;
  }
</style>
