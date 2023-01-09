<template>
  <div style="position: relative; height: 100%">
    <QiniuConfig />
    <!--查询表单-->
    <a-row :gutter="24" style="margin-bottom: 12px">
      <!--没有查询字段，字段生成主键的查询方式-->
      <a-col :span="6">
        <!--id搜索框-->
        <a-input-number
          v-model="crud.options.query.contentId"
          placeholder="输入id搜索"
        />
      </a-col>
      <a-col :span="6">
        <RROperation />
      </a-col>
    </a-row>
    <CrudOperation
      ref="crudOperation"
      :add-permission="['storage:qiniu:add']"
      :edit-permission="['storage:qiniu:edit']"
      :del-permission="['storage:qiniu:del']"
      :download-permission="['storage:qiniu:list']"
      style="margin-bottom: 12px"
    >
      <template #addForm>
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item field="fileName" label="文件">
              <a-upload
                ref="upload"
                v-model:file-list="fileItems"
                :custom-request="customRequest"
                :auto-upload="false"
                :limit="1"
              >
                <template #upload-button>
                  <div
                    style="
                      width: 540px;
                      height: 158px;
                      color: var(--color-text-1);
                      line-height: 158px;
                      text-align: center;
                      background-color: var(--color-fill-2);
                      border: 1px dashed var(--color-fill-4);
                      border-radius: 2px;
                    "
                  >
                    <div>
                      拖拽文件到此 或者
                      <span style="color: #3370ff">点击上传</span>
                    </div>
                  </div>
                </template>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      <template #right
        ><a-button
          v-show="storeType === '2'"
          :key="111"
          v-permission="['tools:storage:qiniu:add']"
          type="outline"
          size="small"
          class="config-btn"
          @click="visible = true"
        >
          <template #icon>
            <icon-settings />
          </template>
          配置
        </a-button>
        <a-divider direction="vertical" :margin="10" />
        <a-tag color="blue">bucket : {{ bucket }}</a-tag>
        <a-divider direction="vertical" :margin="10" />
        <a-radio-group v-model="storeType" type="button">
          <a-radio
            v-for="d in dict.tools_storage_type"
            :key="d.dictId"
            :value="d.value"
            >{{ d.label }}</a-radio
          >
        </a-radio-group>
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
            v-show="!record.updateErr && typeof record.updateErr === 'boolean'"
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

      <!--文件名-->
      <template #name="{ record }">
        <a-link target="_blank" :href="record.url">{{ record.name }}</a-link>
      </template>
    </a-table>
    <Pagination
      style="position: absolute; right: 0; bottom: 0; padding-right: 7px"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import {
    computed,
    getCurrentInstance,
    inject,
    onMounted,
    provide,
    ref,
  } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import {
    getActiveCfg,
    qiniuUpload,
    ToolQiniuContent,
  } from '@/api/tools/storage';
  import { useDict } from '@/components/dict';
  import QiniuConfig from '@/views/tools/storage/qiniu-config.vue';
  import { Modal } from '@arco-design/web-vue';
  import {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';

  const { t } = useI18n();
  const crud = useCrud<ToolQiniuContent>({
    tag: '七牛云',
    url: '/tools/storage/qiniu',
    title: 'tools.storage.qiniu',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);
  // 是否显示七牛云配置窗口
  const visible = ref(false);
  provide('visible', visible);
  const dict = useDict('tools_storage_type');
  const storeType = inject('storeType');

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置七牛云 columns信息
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
      title: 'Bucket 识别符',
      dataIndex: 'bucket',
      width: 150,
      display: true,
      slotName: 'bucket',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '文件名称',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      width: 150,
      display: true,
      slotName: 'size',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '文件类型',
      dataIndex: 'type',
      width: 150,
      display: true,
      slotName: 'type',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '文件后缀',
      dataIndex: 'suffix',
      width: 150,
      display: true,
      slotName: 'suffix',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '上传或同步的时间',
      dataIndex: 'updateTime',
      width: 180,
      display: true,
      slotName: 'updateTime',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // 当前配置信息
  const bucket = ref('');

  const upload = ref<null | HTMLElement>(null);
  const crudOperation = ref<null | HTMLElement>(null);
  const fileItems = ref<FileItem[]>([]);
  const customRequest = (options: RequestOption) => {
    // docs: https://axios-http.com/docs/cancellation
    const controller = new AbortController();

    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'file',
      } = options;
      onProgress(20);
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);
      const onUploadProgress = (event: ProgressEvent) => {
        let percent;
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(String(percent), 10), event);
      };
      try {
        const res = await qiniuUpload(
          {
            controller,
            onUploadProgress,
          },
          formData
        );
        global.$message.success('上传成功！');
        (crudOperation.value as any).addVisible = false;
        crud.status.value = CrudStatus.NEED_REFRESH;
        onSuccess(res);
      } catch (error) {
        onError(error);
      }
    })();
    return {
      abort() {
        controller.abort();
      },
    };
  };

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(async () => {
    crud.method.refresh();
  });

  crud.hook.afterRefresh = async () => {
    try {
      const { data } = await getActiveCfg();
      bucket.value = data.list[0].bucket;
    } catch (e) {
      console.log(e);
      bucket.value = '未配置';
    }
  };

  crud.hook.beforeAdd = () => {
    if (!fileItems.value[0]) {
      Modal.warning({
        title: '注意',
        content: '请选择一个文件',
      });
    } else if (
      // 文件大小大于100MB
      (fileItems.value[0].file?.size ? fileItems.value[0].file?.size : 0) /
        1024 /
        1024 >
      100
    ) {
      Modal.error({
        title: '错误',
        content: '文件大小不能超过100MB',
      });
    } else {
      (upload.value as any).submit();
    }

    return false;
  };
  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<style scoped>
  .config-btn {
    color: #a871e3;
    border-color: #a871e3;
  }

  .config-btn:hover {
    color: #c396ed;
    border-color: #c396ed;
  }
</style>
