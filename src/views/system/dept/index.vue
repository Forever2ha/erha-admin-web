<template>
  <div class="container">
    <div class="panel">
      <a-space
        direction="vertical"
        fill
        size="medium"
        style="padding-bottom: 30px"
      >
        <a-row :gutter="24">
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
              v-model="crud.options.query.deptStatus"
              :placeholder="$t('system.user.status')"
            >
              <a-option
                v-for="s in dict.dept_status"
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
          :add-permission="['dept:list']"
          :edit-permission="['dept:edit']"
          :del-permission="['dept:del']"
          :download-permission="['dept:list']"
        >
          <!--添加部门表单-->
          <template #addForm>
            <!--部门名称-->
            <a-row>
              <a-form-item
                field="name"
                :label="$t('system.dept.table.name')"
                :rules="[
                  { required: true, message: '用户名不能为空' },
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
            <!--部门排序-->
            <a-row>
              <a-form-item
                field="deptSort"
                :label="$t('system.dept.table.sort')"
                :rules="[
                  {
                    required: true,
                    message: '部门排序不能为空',
                  },
                ]"
              >
                <a-input-number v-model="crud.options.form.deptSort" :min="0" />
              </a-form-item>
            </a-row>
            <!--顶级部门/状态-->
            <a-row>
              <a-col :span="12"
                ><a-form-item
                  field="isTop"
                  :label="$t('system.dept.table.isTop')"
                  :rules="[{ required: true, message: '是否为顶级部门?' }]"
                >
                  <a-radio-group v-model="crud.options.form.isTop">
                    <a-radio :value="true"> 是 </a-radio>
                    <a-radio :value="false"> 否 </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12"
                ><a-form-item
                  field="enabled"
                  :label="$t('system.dept.table.enabled')"
                  :rules="[{ required: true, message: '状态不能为空' }]"
                >
                  <a-radio-group v-model="crud.options.form.enabled">
                    <a-radio :value="true"> 启用 </a-radio>
                    <a-radio :value="false"> 禁用 </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <!--上级部门-->
            <a-row v-show="!crud.options.form.isTop">
              <a-form-item
                field="pid"
                label="部门父id"
                :rules="[
                  {
                    required: !crud.options.form.isTop,
                    message: '部门不能为空',
                  },
                ]"
              >
                <a-tree-select
                  v-model="crud.options.form.pid"
                  :data="crud.options.props.deptTreeData"
                  placeholder="请选择部门"
                />
              </a-form-item>
            </a-row>
          </template>
          <!--编辑提示消息-->
          <template #right> </template>
        </CrudOperation>

        <div style="height: 65vh; padding-bottom: 20px">
          <a-table
            ref="table"
            v-model:selectedKeys="crud.options.tableInfo.selectKeys"
            row-key="id"
            :load-more="loadMore"
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
                            [{{ $t(`system.dept.table.${err.errorField}`) }}]
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
            <template #deptSort="{ record }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ record.deptSort }}
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <div v-show="!crud.options.form[record.id]">
                  {{ record.deptSort }}
                </div>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  {{
                    crud.options.form[record.id].deptSort
                      ? crud.options.form[record.id].deptSort
                      : record.deptSort
                  }}
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <a-input-number
                  v-model="crud.options.form[record.id].deptSort"
                  :default-value="record.deptSort"
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

            <!--是否是顶级部门-->
            <template #isTop="{ record }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ !record.pid }}
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <div v-show="!crud.options.form[record.id]">
                  <a-radio-group disabled :default-value="!record.pid">
                    <a-radio :value="true"> 是 </a-radio>
                    <a-radio :value="false"> 否 </a-radio>
                  </a-radio-group>
                </div>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  <a-radio-group
                    disabled
                    :default-value="
                      crud.options.form[record.id].isTop
                        ? crud.options.form[record.id].isTop
                        : !record.pid
                    "
                  >
                    <a-radio :value="true"> 是 </a-radio>
                    <a-radio :value="false"> 否 </a-radio>
                  </a-radio-group>
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <a-radio-group
                  v-model="crud.options.form[record.id].isTop"
                  :default-value="!record.pid"
                >
                  <a-radio :value="true"> 是 </a-radio>
                  <a-radio :value="false"> 否 </a-radio>
                </a-radio-group>
              </div>
            </template>

            <!--上级部门-->
            <template #pid="{ record }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ record.pid ? shortDeptInfo[record.pid] : '-' }}
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <div v-show="!crud.options.form[record.id]">
                  {{ record.pid ? shortDeptInfo[record.pid] : '-' }}
                </div>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  {{
                    crud.options.form[record.id].pid
                      ? shortDeptInfo[crud.options.form[record.id].pid]
                      : record.pid
                      ? shortDeptInfo[record.pid]
                      : '-'
                  }}
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <div
                  v-if="
                    crud.options.form[record.id].isTop === undefined
                      ? !record.pid
                      : crud.options.form[record.id].isTop
                  "
                >
                  -
                </div>

                <a-tree-select
                  v-else
                  v-model="crud.options.form[record.id].pid"
                  :default-value="
                    record.pid ? shortDeptInfo[record.pid] : '请选择部门'
                  "
                  :data="crud.options.props.deptTreeData"
                />
              </div>
            </template>
          </a-table>
        </div>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // crud组件
  import {
    useCrud,
    CrudStatus,
    TableColumDataPlus,
  } from '@/components/crud/CRUD';
  import { Role } from '@/api/system/role';
  import {
    computed,
    getCurrentInstance,
    onMounted,
    provide,
    reactive,
    ref,
  } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import { useI18n } from 'vue-i18n';
  import { TableData } from '@arco-design/web-vue/es/table/interface';
  import {
    getChildrenDeptsById,
    getDeptListTree,
    SummaryDept,
  } from '@/api/system/department';
  import { useDict } from '@/components/dict';
  import { Table } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import axios from 'axios';

  const crud = useCrud<Role>({
    tag: '部门',
    url: '/dept',
    title: 'dept',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
    page: {
      currentPage: 1,
      pageSize: 999,
    },
  });
  provide('crud', crud);
  // 国际化
  const { t } = useI18n();
  // 字典
  const dict = useDict('dept_status');
  // 状态loading
  const { loading, toggle } = useLoading();
  // a-table
  const table = ref<InstanceType<typeof Table> | null>(null);
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // region    ↓-------------------------------- crud --------------------------------↓

  const shortDeptInfo: { [key: number]: string } = reactive({});

  // rangePicker的值改变
  function rangePickerChange(data: any) {
    crud.update.appendQueryParams({
      startCreateTime: `${data[0]} 00:00:00`,
      endCreateTime: `${data[1]} 00:00:00`,
    });
  }

  // 解决重置params rangerPicker不清除数据的问题
  const pickerValue = ref([]);

  const displayOnEdit = computed(() => {
    return !!crud.options.tableInfo.isEdit;
  });

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
      title: t('system.dept.table.name'),
      dataIndex: 'name',
      width: 160,
      display: true,
      slotName: 'name',
      ignoreSwitch: true,
    },
    {
      title: t('system.dept.table.sort'),
      dataIndex: 'deptSort',
      width: 150,
      display: true,
      slotName: 'deptSort',
    },
    {
      title: t('system.dept.table.enabled'),
      dataIndex: 'enabled',
      width: 100,
      display: true,
      slotName: 'enabled',
    },
    {
      title: t('system.dept.table.isTop'),
      dataIndex: 'isTop',
      width: 160,
      display: displayOnEdit as any,
      slotName: 'isTop',
      ignoreSwitch: true,
    },
    // index 5
    {
      title: t('system.dept.table.pid'),
      dataIndex: 'pid',
      width: 150,
      display: displayOnEdit as any,
      slotName: 'pid',
      ignoreSwitch: true,
    },
    {
      title: t('system.dept.table.subCount'),
      dataIndex: 'subCount',
      width: 130,
      display: true,
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
  const loadMore = async (
    record: SummaryDept,
    done: (children?: TableData[]) => void
  ) => {
    const { data } = await getChildrenDeptsById(record.id);
    data.list.forEach((rec: any) => {
      if (rec.subCount === 0) {
        rec.isLeaf = true;
      }
    });
    (record as any).children = data.list;
    done();
  };

  // endregion ↑-------------------------------- crud --------------------------------↑
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

  crud.hook.beforeOpenAdd = () => {
    // 初始化表单默认值
    crud.options.form.deptSort = 999;
    crud.options.form.isTop = false;
    crud.options.form.enabled = true;
    // 查部门列表树
    getDeptListTree().then(({ data }) => {
      crud.options.props.deptTreeData = data;
    });
    return true;
  };
  // region    ↓-------------------------------- 钩子 --------------------------------↓
  function checkInSameLevel() {
    // 找出selectKeys对应的pid,如果这个数组长度不等于1则说明选了两个级别以上的部门
    let flag: number | undefined;
    let res = true;

    function checkSelectKeysRecordPids(data: any[]) {
      data.forEach((data_) => {
        if (crud.options.tableInfo.selectKeys.includes(data_.id)) {
          if (flag === undefined) {
            flag = data_.pid ? data_.pid : -1;
          }

          if (data_.pid === undefined && flag !== -1) {
            res = false;
            return;
          }
          if (data_.pid !== undefined && flag !== data_.pid) {
            res = false;
            return;
          }
        }

        if (data_.children) {
          checkSelectKeysRecordPids(data_.children);
        }
      });
    }

    checkSelectKeysRecordPids(crud.options.tableInfo.data as any[]);
    return res;
  }
  crud.hook.beforeOpenEdit = async () => {
    const getDeptData = async () => {
      const { data } = await getDeptListTree();
      crud.options.props.deptTreeData = data;
      function getShortDeptInfo(
        data_: { key: number; title: string; children: any[] }[]
      ) {
        data_.forEach((t_: { key: number; title: string; children: any[] }) => {
          shortDeptInfo[t_.key] = t_.title;
          if (t_.children) {
            getShortDeptInfo(t_.children);
          }
        });
      }
      getShortDeptInfo(data);
    };

    // 编辑的部门必须是同一级别的，否则就禁止编辑
    if (checkInSameLevel()) {
      await getDeptData();
      return true;
    }
    global.$message.warning(`多选时：必须编辑同一级别的部门`);
    return false;
  };
  crud.hook.beforeDelete = () => {
    if (checkInSameLevel()) {
      return true;
    }
    global.$message.warning(`多选时：必须删除同一级别的部门`);
    return false;
  };
  crud.hook.afterRefresh = () => {
    table.value?.expandAll(false);
    crud.options.tableInfo.data?.forEach((rec: any) => {
      if (rec.subCount === 0) {
        rec.isLeaf = true;
      }
    });
  };

  onMounted(() => {
    crud.method.refresh();
  });
  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<style scoped>
  .container {
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
  }

  .panel {
    height: 80vh;
    padding: 16px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }
</style>
