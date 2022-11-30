<template>
  <div class="container">
    <div class="panel">
      <div style="position: relative; height: 100%">
        <a-row :gutter="24" style="margin-bottom: 12px">
          <a-col :span="6">
            <!--部门名称搜索框-->
            <a-input
              v-model="crud.options.query.title"
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
        <CrudOperation
          :add-permission="['menu:list']"
          :edit-permission="['menu:edit']"
          :del-permission="['menu:del']"
          :download-permission="['menu:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <!--菜单类型-->
            <a-row>
              <a-form-item field="type" :label="$t('system.menu.table.type')">
                <a-radio-group
                  v-model="crud.options.form.type"
                  type="button"
                  size="medium"
                >
                  <a-radio :value="0">目录</a-radio>
                  <a-radio :value="1">菜单</a-radio>
                  <a-radio :value="2">按钮</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-row>
            <!--菜单图标-->
            <a-row v-show="crud.options.form.type !== 2">
              <a-form-item
                field="icon"
                :label="$t('system.menu.table.icon')"
                :rules="[
                  {
                    required: crud.options.form.type !== 2,
                    message: '图标不能为空',
                  },
                ]"
              >
                <IconSelect v-model:icon="crud.options.form.icon" />
              </a-form-item>
            </a-row>
            <!--外链/隐藏/缓存-->
            <a-row v-show="crud.options.form.type !== 2" :gutter="12">
              <a-col :span="8">
                <a-form-item
                  field="type"
                  :label="$t('system.menu.table.iFrame')"
                >
                  <a-radio-group
                    v-model="crud.options.form.iFrame"
                    type="button"
                    size="medium"
                  >
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="type"
                  :label="$t('system.menu.table.hidden')"
                >
                  <a-radio-group
                    v-model="crud.options.form.hidden"
                    type="button"
                    size="medium"
                  >
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col v-show="crud.options.form.type !== 0" :span="8">
                <a-form-item
                  field="type"
                  :label="$t('system.menu.table.cache')"
                >
                  <a-radio-group
                    v-model="crud.options.form.cache"
                    type="button"
                    size="medium"
                  >
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <!--路径-->
            <a-row v-show="crud.options.form.iFrame === 1">
              <a-form-item field="path" :label="$t('system.menu.table.path')">
                <a-input v-model="crud.options.form.path" />
              </a-form-item>
            </a-row>
            <!--菜单标题-->
            <a-row>
              <a-form-item
                field="title"
                :label="$t('system.menu.table.title')"
                :rules="[
                  { required: true, message: '菜单标题不能为空' },
                  {
                    minLength: 2,
                    maxLength: 20,
                    message: '长度在2-20之间',
                  },
                ]"
              >
                <a-input v-model="crud.options.form.title" />
              </a-form-item>
            </a-row>
            <!--路由地址/路由名称-->
            <a-row v-show="crud.options.form.type !== 2" :gutter="12">
              <a-col :span="12">
                <a-form-item
                  field="name"
                  :label="$t('system.menu.table.name')"
                  :rules="[
                    {
                      required: crud.options.form.type !== 2,
                      message: '路由名称不能为空',
                    },
                  ]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  field="locale"
                  :label="$t('system.menu.table.locale')"
                  :rules="[
                    {
                      required: crud.options.form.type !== 2,
                      message: '语言包键值不能为空',
                    },
                  ]"
                >
                  <a-input v-model="crud.options.form.locale" />
                </a-form-item>
              </a-col>
            </a-row>
            <!--排序/权限-->
            <a-row :gutter="12">
              <a-col :span="12">
                <a-form-item
                  field="order"
                  :label="$t('system.menu.table.order')"
                >
                  <a-input-number v-model="crud.options.form.order" :min="0" />
                </a-form-item>
              </a-col>
              <a-col v-show="crud.options.form.type !== 0" :span="12">
                <a-form-item
                  field="title"
                  :label="$t('system.menu.table.permission')"
                >
                  <a-input v-model="crud.options.form.permission" />
                </a-form-item>
              </a-col>
            </a-row>
            <!--上级菜单-->
            <a-row :gutter="12">
              <a-form-item field="pid" :label="$t('system.menu.table.pid')">
                <a-tree-select
                  v-model="crud.options.form.pid"
                  :field-names="{
                    key: 'id',
                    title: 'title',
                    children: 'children',
                    icon: 'treeIcon',
                  }"
                  :data="menuTreeData"
                ></a-tree-select>
              </a-form-item>
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
          style="height: calc(100% - 84px); margin-bottom: 12px"
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

          <!--标题-->
          <template #title="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.title }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.title }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].title
                    ? crud.options.form[record.id].title
                    : record.title
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].title"
                :default-value="record.title"
              ></a-input>
            </div>
          </template>

          <!--图标-->
          <template #icon="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              <component :is="record.icon" />
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div
              v-if="
                !record.editable &&
                crud.options.tableInfo.isEdit &&
                record.type !== 2
              "
            >
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                <component :is="record.icon" />
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                <component
                  :is="
                    crud.options.form[record.id].icon
                      ? crud.options.form[record.id].icon
                      : record.icon
                  "
                />
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable && record.type !== 2">
              <IconSelect
                v-model:icon="crud.options.form[record.id].icon"
                :default-value="record.icon"
              />
            </div>
          </template>

          <!--类型-->
          <template #type="{ record }">
            <a-tag v-show="record.type === 0" color="red">
              <template #icon><icon-folder /></template>
              目录
            </a-tag>
            <a-tag v-show="record.type === 1" color="blue">
              <template #icon>
                <icon-menu />
              </template>
              菜单</a-tag
            >
            <a-tag v-show="record.type === 2" color="lime">
              <template #icon>
                <icon-star />
              </template>
              按钮</a-tag
            >
          </template>

          <!--排序-->
          <template #order="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.order }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.order }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].order
                    ? crud.options.form[record.id].order
                    : record.order
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].order"
                :default-value="record.order"
                :min="0"
              />
            </div>
          </template>

          <!--权限-->
          <template #permission="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.permission }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.permission }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].permission
                    ? crud.options.form[record.id].permission
                    : record.permission
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].permission"
                :default-value="record.permission"
              ></a-input>
            </div>
          </template>

          <!--路由名称-->
          <template #name="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.name }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div
              v-if="
                !record.editable &&
                crud.options.tableInfo.isEdit &&
                record.type !== 2
              "
            >
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
            <div v-if="record.editable && record.type !== 2">
              <a-input
                v-model="crud.options.form[record.id].name"
                :default-value="record.name"
              ></a-input>
            </div>
          </template>

          <!--路由-->
          <template #path="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.path }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div
              v-if="
                !record.editable &&
                crud.options.tableInfo.isEdit &&
                record.type !== 2
              "
            >
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.path }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].path
                    ? crud.options.form[record.id].path
                    : record.path
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable && record.type !== 2">
              <a-input
                v-model="crud.options.form[record.id].path"
                :default-value="record.path"
              ></a-input>
            </div>
          </template>

          <!--语言包键值-->
          <template #locale="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.locale }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div
              v-if="
                !record.editable &&
                crud.options.tableInfo.isEdit &&
                record.type !== 2
              "
            >
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.locale }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].locale
                    ? crud.options.form[record.id].locale
                    : record.locale
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable && record.type !== 2">
              <a-input
                v-model="crud.options.form[record.id].locale"
                :default-value="record.locale"
              ></a-input>
            </div>
          </template>

          <!--外链-->
          <template #iFrame="{ record }">
            <a-switch
              v-model="record.iFrame"
              :loading="iFrame.loading.value"
              @change="iFrameChange(record)"
            >
              <template #checked> 启用 </template>
              <template #unchecked> 禁用 </template>
            </a-switch></template
          >

          <!--隐藏-->
          <template #hidden="{ record }">
            <a-switch
              v-model="record.hidden"
              :loading="hidden.loading.value"
              @change="hiddenChange(record)"
            >
              <template #checked> 启用 </template>
              <template #unchecked> 禁用 </template>
            </a-switch></template
          >

          <!--缓存-->
          <template #cache="{ record }">
            <a-switch
              v-model="record.cache"
              :loading="cache.loading.value"
              @change="cacheChange(record)"
            >
              <template #checked> 启用 </template>
              <template #unchecked> 禁用 </template>
            </a-switch></template
          >
        </a-table>
      </div></div
    >
  </div>
</template>

<script lang="ts" setup>
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import {
    computed,
    getCurrentInstance,
    onMounted,
    provide,
    reactive,
    ref,
  } from 'vue';
  import IconSelect from '@/components/IconSelect/index.vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import axios from 'axios';
  import { Menu } from '@/api/system/menu';

  // 国际化
  const { t } = useI18n();
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;
  // region    ↓-------------------------------- crud --------------------------------↓
  const crud = useCrud<Menu>({
    tag: '菜单',
    url: '/menu',
    title: 'system.menu',
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
  // rangePicker的值改变
  function rangePickerChange(data: any) {
    crud.update.appendQueryParams({
      startCreateTime: `${data[0]} 00:00:00`,
      endCreateTime: `${data[1]} 00:00:00`,
    });
  }

  // 解决重置params rangerPicker不清除数据的问题
  const pickerValue = ref([]);

  const displayOnEdit = ref(false);

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
      title: t('system.menu.table.title'),
      dataIndex: 'title',
      width: 160,
      display: true,
      slotName: 'title',
      fixed: 'left',
    },

    {
      title: t('system.menu.table.icon'),
      dataIndex: 'icon',
      width: 160,
      display: true,
      slotName: 'icon',
    },
    {
      title: t('system.menu.table.type'),
      dataIndex: 'type',
      width: 110,
      display: true,
      slotName: 'type',
    },
    {
      title: t('system.menu.table.order'),
      dataIndex: 'order',
      width: 160,
      display: true,
      slotName: 'order',
    },
    {
      title: t('system.menu.table.permission'),
      dataIndex: 'permission',
      width: 160,
      display: true,
      slotName: 'permission',
    },
    {
      title: t('system.menu.table.name'),
      dataIndex: 'name',
      width: 160,
      display: true,
      slotName: 'name',
      ignoreSwitch: true,
    },
    {
      title: t('system.menu.table.path'),
      dataIndex: 'path',
      width: 160,
      display: true,
      slotName: 'path',
    },

    {
      title: t('system.menu.table.subCount'),
      dataIndex: 'subCount',
      width: 150,
      display: true,
    },

    {
      title: t('system.menu.table.locale'),
      dataIndex: 'locale',
      width: 180,
      display: true,
      slotName: 'locale',
    },
    {
      title: t('system.menu.table.iFrame'),
      dataIndex: 'iFrame',
      width: 160,
      display: true,
      slotName: 'iFrame',
    },
    {
      title: t('system.menu.table.hidden'),
      dataIndex: 'hidden',
      width: 160,
      display: true,
      slotName: 'hidden',
    },
    {
      title: t('system.menu.table.cache'),
      dataIndex: 'cache',
      width: 160,
      display: true,
      slotName: 'cache',
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

  const iFrame = useLoading(false);
  // IFrame状态改变
  const iFrameChange = async (record: any) => {
    iFrame.toggle();
    const data = (await axios.put(crud.options.url, [
      { id: record.id, iFrame: record.iFrame },
    ])) as any;
    if (data.code === 20000) {
      global.$notification.success('更改成功');
    } else {
      global.$notification.warning(`更改失败:${data.msg}`);
      record.enabled = !record.enabled;
    }
    iFrame.toggle();
  };

  const hidden = useLoading(false);
  // IFrame状态改变

  const hiddenChange = async (record: any) => {
    hidden.toggle();
    const data = (await axios.put(crud.options.url, [
      { id: record.id, hidden: record.hidden },
    ])) as any;
    if (data.code === 20000) {
      global.$notification.success('更改成功');
    } else {
      global.$notification.warning(`更改失败:${data.msg}`);
      record.enabled = !record.enabled;
    }
    hidden.toggle();
  };

  const cache = useLoading(false);
  // IFrame状态改变
  const cacheChange = async (record: any) => {
    cache.toggle();
    const data = (await axios.put(crud.options.url, [
      { id: record.id, cache: record.cache },
    ])) as any;
    if (data.code === 20000) {
      global.$notification.success('更改成功');
    } else {
      global.$notification.warning(`更改失败:${data.msg}`);
      record.enabled = !record.enabled;
    }
    cache.toggle();
  };

  const menuTreeData = reactive([{ id: -1, title: '顶级菜单', children: [] }]);
  // endregion ↑-------------------------------- crud --------------------------------↑
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

  crud.hook.beforeAdd = () => {
    if (crud.options.form.pid === -1) {
      delete crud.options.form.pid;
    }
    return true;
  };

  crud.hook.beforeOpenAdd = () => {
    crud.options.form.type = 0;
    crud.options.form.iFrame = 0;
    crud.options.form.hidden = 0;
    crud.options.form.cache = 0;
    crud.options.form.order = 0;
    crud.options.form.pid = -1;
    return true;
  };

  crud.hook.beforeOpenEdit = async () => {
    if (checkInSameLevel()) {
      displayOnEdit.value = true;
      return true;
    }
    global.$message.warning(`多选时：必须编辑同一级别的菜单`);
    return false;
  };

  crud.hook.afterRefresh = () => {
    (menuTreeData as any)[0].children = crud.options.tableInfo.list;
  };

  crud.hook.beforeRefresh = () => {
    displayOnEdit.value = false;
    return true;
  };

  crud.hook.afterResetParams = () => {
    pickerValue.value = [];
  };

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
