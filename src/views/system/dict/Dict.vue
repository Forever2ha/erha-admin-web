<template>
  <div style="height: 100%">
    <a-row :gutter="24" style="margin-bottom: 12px">
      <a-col :span="8">
        <!--字典名称搜索框-->
        <a-input
          v-model="crud.options.query.name"
          placeholder="输入名称或者描述搜索"
        />
      </a-col>

      <a-col :span="6">
        <RROperation
          :enabled-reset="!dictDetailIsEdit"
          :enabled-search="!dictDetailIsEdit"
        />
      </a-col>
    </a-row>

    <!--crudOperation-->
    <CrudOperation
      :disable-all="dictDetailIsEdit"
      :add-permission="['dict:list']"
      :edit-permission="['dict:edit']"
      :del-permission="['dict:del']"
      :download-permission="['dict:list']"
      style="margin-bottom: 12px"
    >
      <template #addForm>
        <!--字典名称-->
        <a-row>
          <a-form-item
            field="name"
            :label="$t('system.dict.table.name')"
            :rules="[{ required: true, message: '字典名不能为空' }]"
          >
            <a-input v-model="crud.options.form.name" />
          </a-form-item>
        </a-row>
        <!--字典描述-->
        <a-row>
          <a-form-item
            field="description"
            :label="$t('system.dict.table.description')"
          >
            <a-input v-model="crud.options.form.description" />
          </a-form-item>
        </a-row>
      </template>
    </CrudOperation>
    <!--表格-->
    <a-card
      title="字典列表"
      :style="{ width: '100%' }"
      :bordered="false"
      style="position: relative; height: calc(100% - 84px)"
    >
      <a-table
        v-model:selectedKeys="crud.options.tableInfo.selectKeys"
        row-key="id"
        :columns="tableColumns"
        :data="crud.options.tableInfo.data"
        :pagination="false"
        :scroll="{ y: '100%' }"
        :loading="crud.status.value === CrudStatus.REFRESHING"
        :column-resizable="crud.options.tableInfo.componentConfig.colResizable"
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
                          $t(
                            `system.${crud.options.title}.table.${err.errorField}`
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
              :default-value="crud.options.tableInfo.data[rowIndex].name"
            ></a-input>
          </div>
        </template>

        <!--描述-->
        <template #description="{ record, rowIndex }">
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
              :default-value="crud.options.tableInfo.data[rowIndex].description"
            ></a-input>
          </div>
        </template>
      </a-table>
      <Pagination
        style="position: absolute; right: 0; bottom: 0; padding-right: 16px"
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  // crud组件
  import { useCrud, CrudStatus, CRUD } from '@/components/crud/CRUD';
  import {
    computed,
    CSSProperties,
    inject,
    onMounted,
    onUnmounted,
    provide,
    ref,
    unref,
    watchEffect,
  } from 'vue';
  import { useI18n } from 'vue-i18n';

  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { TableData } from '@arco-design/web-vue/es/table/interface';
  import { emitter } from '@/utils/myBus';
  import { Dict as DictModel, Dict } from '@/api/system/dict';

  const crud = useCrud<DictModel>({
    tag: '字典',
    url: '/dict',
    title: 'dict',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
    page: {
      currentPage: 1,
      pageSize: 10,
    },
  });
  provide('crud', crud);

  // 国际化
  const { t } = useI18n();

  // region    ↓-------------------------------- 左侧字典 --------------------------------↓
  const dictDetailIsEdit = ref(false);
  // 点击行的样式
  const bodyCellStyle = (record: TableData) => {
    const style: CSSProperties = {
      color: 'rgb(var(--arcoblue-5))',
      cursor: 'pointer',
    };
    if (record.click) {
      return style;
    }
    return { cursor: 'pointer' };
  };
  // 设置表格dict columns信息
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
      title: t('system.dict.table.name'),
      dataIndex: 'name',
      width: 130,
      display: true,
      slotName: 'name',
      bodyCellStyle,
    },

    {
      title: t('system.dict.table.description'),
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
  const clickDictName = ref('');
  let lastClickRecord: TableData = {};
  // 取消点击选择菜单
  function removeNowSelectMenu() {
    delete lastClickRecord.click;
    lastClickRecord = {};
    clickDictName.value = '';
  }
  const tableColClick = (record: TableData) => {
    if (!crud.options.tableInfo.isEdit && !dictDetailIsEdit.value) {
      emitter.emit('tableColClick', record);
    }

    // 编辑状态下不可选择角色所对应的菜单
    if (crud.options.tableInfo.isEdit) return;

    // 字典详情正在编辑的时候不能选择
    if (dictDetailIsEdit.value) return;

    if (lastClickRecord !== {}) {
      // 清除上一次点击的对象属性
      delete lastClickRecord.click;
    }
    clickDictName.value = record.name;
    lastClickRecord = record;
    record.click = true;
  };
  // endregion ↑-------------------------------- 左侧字典 --------------------------------↑

  // region    ↓-------------------------------- emitter --------------------------------↓

  const dictDetailName = 'dictDetailCrud';
  const dictDetailCrud = ref({
    options: {
      tableInfo: {
        isEdit: false,
      },
    },
  });

  emitter.on(dictDetailName, (data: any) => {
    dictDetailCrud.value = data;
  });

  // endregion ↑-------------------------------- emitter --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓

  crud.hook.beforeOpenEdit = async () => {
    (dictDetailCrud.value.options.tableInfo as any).data = [];
    (dictDetailCrud.value.options.tableInfo as any).selectKeys = [];
    return true;
  };

  crud.hook.afterRefresh = () => {
    const record = {
      id: -1,
      name: '',
    };
    emitter.emit('tableColClick', record);
  };

  watchEffect(() => {
    const val = dictDetailCrud.value.options.tableInfo.isEdit;
    dictDetailIsEdit.value = val;
  });

  onMounted(() => {
    crud.method.refresh();
    emitter.emit('dictCrud', crud);
  });

  onUnmounted(() => {
    emitter.off(dictDetailName);
  });

  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<style scoped>
  :deep(.arco-card-body) {
    height: 100%;
  }
</style>
