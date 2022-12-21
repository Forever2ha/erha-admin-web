<template>
  <a-table
    v-model:selectedKeys="selectKeys"
    row-key="columnId"
    :loading="table.loading.value"
    :columns="tableColumns"
    :data="col"
    :pagination="false"
    :scroll="{ y: '100%' }"
    style="height: calc(100% - 10px)"
  >
    <!--字段描述-->
    <template #remark="{ record }">
      <a-input
        v-model="form[record.columnId].remark"
        :default-value="record.remark"
      />
    </template>
    <!--必填-->
    <template #notNull="{ record }">
      <a-checkbox
        v-model="form[record.columnId].notNull"
        :default-checked="record.notNull"
      />
    </template>
    <!--列表-->
    <template #listShow="{ record }">
      <a-checkbox
        v-model="form[record.columnId].listShow"
        :default-checked="record.listShow"
      />
    </template>
    <!--表单-->
    <template #formShow="{ record }">
      <a-checkbox
        v-model="form[record.columnId].formShow"
        :default-checked="record.formShow"
      />
    </template>
    <!--表单类型-->
    <template #formType="{ record }">
      <a-select
        v-model="form[record.columnId].formType"
        placeholder="请选择"
        :default-value="record.formType"
        v
      >
        <a-option value="">空</a-option>
        <a-option>文本框</a-option>
        <a-option>文本域</a-option>
        <a-option>开关[仅两个值]</a-option>
        <a-option>单选框[圆圈]</a-option>
        <a-option>单选框[按钮]</a-option>
        <a-option>下拉框[多选]</a-option>
        <a-option>下拉框[单选]</a-option>
        <a-option>日期框</a-option>
      </a-select>
    </template>
    <!--查询方式-->
    <template #queryType="{ record }">
      <a-select
        v-model="form[record.columnId].queryType"
        placeholder="请选择"
        :default-value="record.queryType"
      >
        <a-option value="">空</a-option>
        <a-option>=</a-option>
        <a-option>!=</a-option>
        <a-option>{{ '>=' }}</a-option>
        <a-option>{{ '<=' }} </a-option>
        <a-option>Like</a-option>
        <a-option>NotNull</a-option>
        <a-option>Between</a-option>
      </a-select>
    </template>
    <!--日期注解-->
    <template #dateAnnotation="{ record }">
      <a-select
        v-model="form[record.columnId].dateAnnotation"
        placeholder="请选择"
        :default-value="record.dateAnnotation"
        v
      >
        <a-option value="">空</a-option>
        <a-option>自动创建时间</a-option>
        <a-option>自动更新时间</a-option>
      </a-select>
    </template>
    <!--关联字典-->
    <template #dictName="{ record }">
      <a-select
        v-model="form[record.columnId].dictName"
        placeholder="请选择"
        :default-value="record.dictName"
        allow-search
      >
        <a-option value=""> 空 </a-option>
        <a-option v-for="dict in dictInfo" :key="dict.id">
          {{ dict.name }}
        </a-option>
      </a-select>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  // 字段设置
  import { getCurrentInstance, inject, onMounted, reactive, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  import { getTableCols } from '@/api/tools/generate';
  import { getDict } from '@/api/system/dict';

  const { t } = useI18n();
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  const info: any = inject('info');
  const col = ref([]);
  const selectKeys = ref([]);
  const tableColumns = ref([
    {
      title: t('tools.generate.tableCol.columnName'),
      dataIndex: 'columnName',
      width: 120,
      slotName: 'columnName',
      fixed: 'left',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('tools.generate.tableCol.columnType'),
      dataIndex: 'columnType',
      width: 100,
      slotName: 'columnType',
    },
    {
      title: t('tools.generate.tableCol.remark'),
      dataIndex: 'remark',
      width: 100,
      slotName: 'remark',
    },
    {
      title: t('tools.generate.tableCol.notNull'),
      dataIndex: 'notNull',
      width: 60,
      slotName: 'notNull',
    },
    {
      title: t('tools.generate.tableCol.listShow'),
      dataIndex: 'listShow',
      width: 60,
      slotName: 'listShow',
    },
    {
      title: t('tools.generate.tableCol.formShow'),
      dataIndex: 'formShow',
      width: 60,
      slotName: 'formShow',
    },
    {
      title: t('tools.generate.tableCol.formType'),
      dataIndex: 'formType',
      width: 160,
      slotName: 'formType',
    },
    {
      title: t('tools.generate.tableCol.queryType'),
      dataIndex: 'queryType',
      width: 125,
      slotName: 'queryType',
    },
    {
      title: t('tools.generate.tableCol.dateAnnotation'),
      dataIndex: 'dateAnnotation',
      width: 165,
      slotName: 'dateAnnotation',
    },
    {
      title: t('tools.generate.tableCol.dictName'),
      dataIndex: 'dictName',
      width: 150,
      slotName: 'dictName',
    },
  ]);
  const form = inject<{ [key: string]: any }>('form');
  const dictInfo = ref([]);
  const table = useLoading(true);

  // 获取表格字段数据
  const getData = async () => {
    const data = await getTableCols(info.table.tableName);
    col.value = data.data;
    col.value.forEach((val: any) => {
      (form as any)[val.columnId] = { id: val.columnId };
    });
    const dict = await getDict();
    dictInfo.value = dict.data.list;
    table.setLoading(false);
  };
  defineExpose({ getData });
  onMounted(async () => {
    await getData();
  });
</script>

<style scoped></style>
