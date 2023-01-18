<template>
  <div style="position: relative; height: 100%">
    <!--操作-->
    <a-row :gutter="24" style="margin-bottom: 12px">
      <a-col flex="250px">
        <!--名称搜索框-->
        <a-input
          v-model="crud.options.query.tableName"
          placeholder="输入表格名称或者备注搜索"
        />
      </a-col>
      <a-col flex="90px">
        <RROperation />
      </a-col>
      <a-col flex="auto"> </a-col>
      <a-col flex="100px">
        <a-space>
          <a-button type="outline" size="small">
            <template #icon>
              <icon-download />
            </template>
            批量预览</a-button
          >

          <a-button type="outline" size="small" status="warning">
            <template #icon>
              <icon-download />
            </template>
            批量下载</a-button
          >
        </a-space>
      </a-col>
    </a-row>

    <!--表格-->
    <a-table
      ref="table"
      v-model:selectedKeys="crud.options.tableInfo.selectKeys"
      row-key="tableName"
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
      style="height: calc(100% - 94px); margin-bottom: 12px"
    >
      <!--操作-->
      <template #operate="{ record }">
        {{ record.a }}
        <a-space size="mini">
          <a-link @click="config(record)">配置</a-link>
          <a-link @click="preview(record)">预览</a-link>
          <a-link @click="download(record)">下载</a-link>
          <a-link :loading="loading" @click="generate(record)">生成</a-link>
        </a-space>
      </template>
    </a-table>
    <Pagination
      style="position: absolute; right: 0; bottom: 0; padding-right: 0"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import { Table } from '@/api/tools/generate';
  import {
    computed,
    getCurrentInstance,
    inject,
    onMounted,
    provide,
  } from 'vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import axios from 'axios';
  import { parseTime } from '@/utils';
  import RROperation from '@/components/crud/RROperation.vue';
  import useLoading from '@/hooks/loading';

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;
  const { t } = useI18n();
  const crud = useCrud<Table>({
    url: '/tools/generate/table',
    tag: '表信息',
    title: 'generate/table',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);
  crud.update.setTableColumns([
    {
      title: t('tools.generate.table.tableName'),
      dataIndex: 'tableName',
      width: 150,
      display: true,
      slotName: 'tableName',
      fixed: 'left',
    },

    {
      title: t('tools.generate.table.engine'),
      dataIndex: 'engine',
      width: 100,
      display: true,
      slotName: 'engine',
    },
    {
      title: t('tools.generate.table.tableCollation'),
      dataIndex: 'tableCollation',
      width: 140,
      display: true,
      slotName: 'tableCollation',
    },
    {
      title: t('tools.generate.table.tableComment'),
      dataIndex: 'tableComment',
      width: 100,
      display: true,
      slotName: 'tableComment',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: t('tools.generate.table.createTime'),
      dataIndex: 'createTime',
      width: 180,
      display: true,
    },
    {
      title: t('tools.generate.table.operate'),
      dataIndex: 'operate',
      width: 150,
      display: true,
      slotName: 'operate',
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  const info: any = inject('info');

  const config = (r: any) => {
    info.show = 2;
    info.table = r;
  };

  const preview = (r: any) => {
    info.show = 3;
    info.table = r;
  };

  // 下载文件
  function downloadFile(obj: any, name: any, suffix: any) {
    const url = window.URL.createObjectURL(new Blob([obj]));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    const fileName = `${parseTime(new Date())}-${name}.${suffix}`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const download = (r: any) => {
    axios
      .get(`/generate/download?tableName=${r.tableName}`, {
        responseType: 'blob',
      })
      .then((data) => downloadFile(data, r.tableName, 'zip'))
      .catch(() => {});
  };

  const { loading, toggle } = useLoading(false);
  const generate = async (r: any) => {
    toggle();
    try {
      const res = await axios.get(`tools/generate?tableName=${r.tableName}`);
      if ((res as any).code === 20000) {
        global.$message.success('生成成功！');
      } else {
        global.$message.error(`生成失败:${(res as any).msg}`);
      }
      const res2 = await axios.post(`/system/menu/generate/${r.tableName}`);
      if ((res2 as any).code === 20000) {
        global.$message.success('菜单集成成功！');
      } else {
        global.$message.error(`菜单集成失败:${(res as any).msg}`);
      }
      // eslint-disable-next-line no-empty
    } catch (e) {
    } finally {
      toggle();
    }
  };
  info.gen = generate;

  onMounted(() => {
    crud.method.refresh();
  });
</script>

<style scoped></style>
