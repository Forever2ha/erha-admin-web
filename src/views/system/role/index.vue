<template>
  <div class="container">
    <div class="panel">
      <div style="height: 100%">
        <a-row :gutter="24" style="margin-bottom: 12px">
          <a-col :span="6">
            <!--名称/角色描述搜索框-->
            <a-input
              v-model="crud.options.query.name"
              placeholder="输入名称或者描述搜索"
            />
          </a-col>
          <a-col :span="6">
            <a-range-picker v-model="pickerValue" @change="rangePickerChange" />
          </a-col>
          <a-col :span="12">
            <RROperation />
          </a-col>
        </a-row>

        <!--crudOperation-->
        <CrudOperation
          :add-permission="['system:role:list']"
          :edit-permission="['system:role:edit']"
          :del-permission="['system:role:del']"
          :download-permission="['system:role:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <!--角色名称-->
            <a-row>
              <a-col :span="22">
                <a-form-item
                  field="name"
                  :label="$t('system.role.table.name')"
                  :rules="[
                    { required: true, message: '角色名不能为空' },
                    {
                      minLength: 2,
                      maxLength: 20,
                      message: '长度在2-20之间',
                    },
                  ]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
            </a-row>
            <!--角色等级/数据范围-->
            <a-row :gutter="24">
              <a-col :span="11">
                <a-form-item
                  field="level"
                  :label="$t('system.role.table.level')"
                  :rules="[
                    {
                      required: true,
                      message: '角色级别不能为空',
                    },
                  ]"
                >
                  <a-input-number v-model="crud.options.form.level" :min="1" />
                </a-form-item>
              </a-col>
              <a-col :span="11">
                <a-form-item
                  field="dataScope"
                  :label="$t('system.role.table.dataScope')"
                  :rules="[
                    {
                      required: true,
                      message: '数据权限不能为空',
                    },
                  ]"
                >
                  <a-select v-model="crud.options.form.dataScope">
                    <a-option>全部</a-option>
                    <a-option>仅本级</a-option>
                    <a-option>仅本级以下</a-option>
                    <a-option>本级与本级以下</a-option>
                    <a-option>自定义</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <!--自定义数据权限-->
            <a-row v-show="crud.options.form.dataScope === '自定义'">
              <a-col :span="22">
                <a-form-item
                  field="deptIds"
                  :label="$t('system.role.table.deptIds')"
                  :rules="[
                    {
                      required: crud.options.form.dataScope === '自定义',
                      message: '数据权限不能为空',
                    },
                  ]"
                >
                  <a-tree-select
                    v-model="crud.options.form.deptIds"
                    :tree-checkable="true"
                    :data="originDeptTreeData"
                    tree-checked-strategy="parent"
                    placeholder="请选择部门"
                  ></a-tree-select>
                </a-form-item>
              </a-col>
            </a-row>
            <!--角色描述-->
            <a-row>
              <a-col :span="22">
                <a-form-item
                  field="description"
                  :label="$t('system.role.table.description')"
                  :rules="[{ required: true, message: '角色描述不能为空' }]"
                >
                  <a-textarea
                    v-model="crud.options.form.description"
                    :max-length="100"
                    show-word-limit
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </template>
        </CrudOperation>

        <!--表格-->
        <a-row :gutter="24" style="height: calc(100% - 84px)">
          <a-col :span="15" style="height: 100%">
            <a-card
              title="角色列表"
              :bordered="false"
              style="position: relative; height: 100%"
            >
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
                :show-header="
                  crud.options.tableInfo.componentConfig.tableHeader
                "
                :row-selection="
                  crud.options.tableInfo.componentConfig.checkbox
                    ? {
                        type: 'checkbox',
                        showCheckedAll: true,
                      }
                    : undefined
                "
                style="height: calc(100% - 80px); margin-bottom: 12px"
                @row-click="tableColClick"
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
                        !record.updateErr &&
                        typeof record.updateErr === 'boolean'
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
                                  $t(
                                    `${crud.options.title}.table.${err.errorField}`
                                  )
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
                <template #name="{ record, rowIndex }">
                  <!--正常情况下-->
                  <div
                    v-show="!record.editable && !crud.options.tableInfo.isEdit"
                  >
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
                      :default-value="
                        crud.options.tableInfo.data[rowIndex].name
                      "
                    ></a-input>
                  </div>
                </template>

                <!--数据范围-->
                <template #dataScope="{ record, rowIndex }">
                  <!--正常情况下-->
                  <div
                    v-show="!record.editable && !crud.options.tableInfo.isEdit"
                  >
                    {{ record.dataScope }}
                  </div>

                  <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
                  <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                    <!--未修改的行-->
                    <div v-show="!crud.options.form[record.id]">
                      {{ record.dataScope }}
                    </div>
                    <!--修改完毕提交后-->
                    <div v-if="crud.options.form[record.id]">
                      {{
                        crud.options.form[record.id].dataScope
                          ? crud.options.form[record.id].dataScope
                          : record.dataScope
                      }}
                    </div>
                  </div>

                  <!--修改情况下-->
                  <div v-if="record.editable">
                    <a-select
                      v-model="crud.options.form[record.id].dataScope"
                      :default-value="
                        crud.options.tableInfo.data[rowIndex].dataScope
                      "
                    >
                      <a-option>全部</a-option>
                      <a-option>仅本级</a-option>
                      <a-option>仅本级以下</a-option>
                      <a-option>本级与本级以下</a-option>
                      <a-option>自定义</a-option>
                    </a-select>
                  </div>
                </template>

                <!--数据权限-->
                <template #dataPerm="{ record, rowIndex }">
                  <!--正常情况下-->
                  <div
                    v-show="!record.editable && !crud.options.tableInfo.isEdit"
                  >
                    <a-space size="mini">
                      <a-tag
                        v-for="deptId in record.dataPerm"
                        :key="deptId"
                        :color="record.click ? 'rgb(var(--arcoblue-5))' : ''"
                      >
                        {{ deptInfo[deptId] ? deptInfo[deptId].name : '' }}
                      </a-tag>
                      <span v-show="!record.dataPerm"> - </span>
                    </a-space>
                  </div>

                  <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
                  <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                    <!--未修改的行-->
                    <a-space size="mini">
                      <a-tag
                        v-for="deptId in record.dataPerm"
                        :key="deptId"
                        :color="record.click ? 'rgb(var(--arcoblue-5))' : ''"
                      >
                        {{ deptInfo[deptId] ? deptInfo[deptId].name : '' }}
                      </a-tag>
                      <span v-show="!record.dataPerm"> - </span>
                    </a-space>
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
                    <div
                      v-show="
                        crud.options.form[record.id].dataScope === undefined
                          ? crud.options.tableInfo.data[rowIndex].dataScope ===
                            '自定义'
                          : crud.options.form[record.id].dataScope === '自定义'
                      "
                    >
                      <a-tree-select
                        v-model="crud.options.form[record.id].deptIds"
                        :tree-checkable="true"
                        :data="originDeptTreeData"
                        :default-value="
                          crud.options.tableInfo.data[rowIndex].dataPerm
                            ? crud.options.tableInfo.data[rowIndex].dataPerm
                            : []
                        "
                        tree-checked-strategy="parent"
                        placeholder="请选择部门"
                      ></a-tree-select>
                    </div>

                    <div
                      v-show="
                        crud.options.form[record.id].dataScope === undefined
                          ? crud.options.tableInfo.data[rowIndex].dataScope !==
                            '自定义'
                          : crud.options.form[record.id].dataScope !== '自定义'
                      "
                    >
                      -
                    </div>
                  </div>
                </template>

                <!--等级-->
                <template #level="{ record, rowIndex }">
                  <!--正常情况下-->
                  <div
                    v-show="!record.editable && !crud.options.tableInfo.isEdit"
                  >
                    {{ record.level }}
                  </div>

                  <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
                  <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                    <!--未修改的行-->
                    <div v-show="!crud.options.form[record.id]">
                      {{ record.level }}
                    </div>
                    <!--修改完毕提交后-->
                    <div v-if="crud.options.form[record.id]">
                      {{
                        crud.options.form[record.id].level
                          ? crud.options.form[record.id].level
                          : record.level
                      }}
                    </div>
                  </div>

                  <!--修改情况下-->
                  <div v-if="record.editable">
                    <a-input-number
                      v-model="crud.options.form[record.id].level"
                      :default-value="
                        crud.options.tableInfo.data[rowIndex].level
                      "
                      :min="1"
                    />
                  </div>
                </template>

                <!--描述-->
                <template #description="{ record, rowIndex }">
                  <!--正常情况下-->
                  <div
                    v-show="!record.editable && !crud.options.tableInfo.isEdit"
                  >
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
                      :default-value="
                        crud.options.tableInfo.data[rowIndex].description
                      "
                    ></a-input>
                  </div>
                </template>
              </a-table>

              <Pagination
                style="
                  position: absolute;
                  right: 0;
                  bottom: 0;
                  padding-right: 16px;
                "
              />
            </a-card>
          </a-col>
          <a-col :span="9" style="height: 100%">
            <a-card
              :style="{ width: '100%', height: '100%' }"
              :bordered="false"
              style="height: 100%"
            >
              <template #title>
                <span>菜单分配: </span>
                <span style="color: rgb(var(--arcoblue-5))">{{
                  clickRoleName
                }}</span>
                <span
                  v-show="
                    clickRoleName === '' && !crud.options.tableInfo.isEdit
                  "
                  style="color: var(--color-neutral-4)"
                  >请点击一个角色
                </span>
                <span
                  v-show="clickRoleName === '' && crud.options.tableInfo.isEdit"
                  style="color: var(--color-neutral-4)"
                  >正在编辑角色，无法选择菜单。
                </span>
              </template>
              <div
                style="
                  width: 100%;
                  height: calc(100vh - 350px);
                  overflow-y: auto;
                "
              >
                <a-tree
                  v-model:checked-keys="checkedIds"
                  :checkable="true"
                  :field-names="{
                    key: 'id',
                    icon: 'treeIcon',
                  }"
                  :check-strictly="true"
                  :data="menuTree"
                />
              </div>

              <template #extra>
                <a-button
                  type="dashed"
                  status="success"
                  size="mini"
                  :loading="saveRM.loading.value"
                  @click="saveRoleMenu"
                  ><template #icon><icon-check /></template>保存</a-button
                >
              </template>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // crud组件
  import { CrudStatus, useCrud } from '@/components/crud/CRUD';
  import { user } from '@/store/modules/user/types';
  import {
    computed,
    CSSProperties,
    onMounted,
    provide,
    reactive,
    ref,
  } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import {
    TableData,
    TableColumnData,
  } from '@arco-design/web-vue/es/table/interface';
  import { Dept, getAllDept, getDeptListTree } from '@/api/system/department';
  import { editRoleMenu, getMenuIdByRoleId, Role } from '@/api/system/role';
  import { getMenuTree } from '@/api/system/menu';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';

  // crud组件
  const crud = useCrud<Role>({
    tag: '角色',
    url: '/system/role',
    title: 'system.role',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);
  // 国际化
  const { t } = useI18n();

  // region    ↓-------------------------------- crud --------------------------------↓
  // 点击行的样式
  const bodyCellStyle = (record: TableData) => {
    const style: CSSProperties = {
      color: 'rgb(var(--arcoblue-5))',
    };
    if (record.click) {
      return style;
    }
    return {};
  };

  // 部门信息
  const originDeptInfo = ref([]);
  const deptInfo = computed(() => {
    const res: { [key: string]: any } = {};
    originDeptInfo.value.forEach((val: Dept) => {
      res[val.deptId] = val;
    });
    return res;
  });

  // 部门选择树的数据
  const originDeptTreeData = ref([]);
  async function getDept() {
    const { data } = await getDeptListTree();
    originDeptTreeData.value = data as any;
    const res = await getAllDept();
    (originDeptInfo as any).value = res.data;
  }

  // rangePicker的值改变
  function rangePickerChange(data: any) {
    crud.update.appendQueryParams({
      startCreateTime: `${data[0]} 00:00:00`,
      endCreateTime: `${data[1]} 00:00:00`,
    });
  }

  // 解决重置params rangerPicker不清除数据的问题
  const pickerValue = ref([]);
  crud.hook.afterResetParams = () => {
    pickerValue.value = [];
  };

  // endregion ↑-------------------------------- crud --------------------------------↑

  const menuTree = ref([]);
  const checkedIds = ref<number[]>([]);
  // region    ↓-------------------------------- 左侧角色列表 --------------------------------↓

  // 设置表格role columns信息
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
      title: t('system.role.table.name'),
      dataIndex: 'name',
      width: 130,
      display: true,
      slotName: 'name',
      bodyCellStyle,
    },
    {
      title: t('system.role.table.dataScope'),
      dataIndex: 'dataScope',
      width: 150,
      display: true,
      slotName: 'dataScope',
      bodyCellStyle,
    },
    {
      title: t('system.role.table.dataPerm'),
      dataIndex: 'dataPerm',
      width: 180,
      display: true,
      slotName: 'dataPerm',
      bodyCellStyle,
    },
    {
      title: t('system.role.table.level'),
      dataIndex: 'level',
      width: 100,
      display: true,
      slotName: 'level',
      bodyCellStyle,
    },
    {
      title: t('system.role.table.description'),
      dataIndex: 'description',
      width: 150,
      display: true,
      slotName: 'description',
      bodyCellStyle,
    },
    {
      title: t('system.user.table.createTime'),
      dataIndex: 'createTime',
      width: 180,
      display: true,

      bodyCellStyle,
    },
    {
      dataIndex: 'createBy',
      title: t('system.user.table.createBy'),
      width: 110,
      display: true,
      bodyCellStyle,
    },
    {
      dataIndex: 'updateTime',
      title: t('system.user.table.updateTime'),
      width: 180,
      display: true,
      bodyCellStyle,
    },
    {
      dataIndex: 'updateBy',
      title: t('system.user.table.updateBy'),
      width: 110,
      display: true,
      bodyCellStyle,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // 点击表格行，显示该角色对应的菜单
  const clickRoleName = ref('');
  let lastClickRecord: TableData = {};
  // 取消点击选择菜单
  function removeNowSelectMenu() {
    delete lastClickRecord.click;
    lastClickRecord = {};
    clickRoleName.value = '';
  }
  const tableColClick = async (record: TableData) => {
    // 编辑状态下不可选择角色所对应的菜单
    if (crud.options.tableInfo.isEdit) return;

    if (lastClickRecord !== {}) {
      // 清除上一次点击的对象属性
      delete lastClickRecord.click;
    }
    clickRoleName.value = record.name;
    lastClickRecord = record;
    record.click = true;

    const res = await getMenuIdByRoleId(record.id);
    checkedIds.value = res.data;
  };

  // endregion ↑-------------------------------- 左侧角色列表 --------------------------------↑

  // region    ↓-------------------------------- 右侧菜单分配 --------------------------------↓

  const saveRM = useLoading(false);
  const saveRoleMenu = async () => {
    saveRM.toggle();
    const res = (await editRoleMenu(
      lastClickRecord.id,
      checkedIds.value
    )) as any;

    if (res.code !== 20000) {
      Message.error(
        `添加失败：${res.data[0].errorField} -${res.data[0].errorMsg}`
      );
    } else {
      Message.success('添加成功');
    }

    crud.method.refresh();
    saveRM.toggle();
  };
  // endregion ↑-------------------------------- 右侧菜单分配 --------------------------------↑

  crud.hook.beforeRefresh = () => {
    checkedIds.value = [];
    lastClickRecord = {};
    clickRoleName.value = '';
    return true;
  };

  // 重置清除菜单分配的选择
  crud.hook.beforeResetParams = () => {
    removeNowSelectMenu();
    return true;
  };
  onMounted(async () => {
    crud.method.refresh();
    getDept();
    const res = await getMenuTree();
    menuTree.value = (res.data as any).list;
  });

  crud.hook.beforeOpenEdit = async () => {
    removeNowSelectMenu();
    return true;
  };

  crud.hook.beforeOpenAdd = () => {
    crud.options.form.level = 1;
    return true;
  };
</script>

<script lang="ts">
  export default {
    name: 'Role',
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

  :deep(.arco-card-body) {
    height: 100%;
  }
</style>
