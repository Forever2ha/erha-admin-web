<template>
  <div style="position: relative; height: 100%">
    <!--查询表单-->
    <a-row>
      <a-col :flex="1">
        <a-form
          :model="crud.options.query"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-scrollbar style="height: 104px; overflow: auto">
            <a-row :gutter="16" style="width: 100%">
              <!--文件真实的名称搜索框-->
              <a-col :span="8">
                <a-form-item field="realName" label="真实名称">
                  <a-input
                    v-model="crud.options.query.realName"
                    placeholder="输入文件真实的名称搜索"
                  >
                    <template #prefix> Like </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <!--文件名搜索框-->
              <a-col :span="8">
                <a-form-item field="name" label="文件名">
                  <a-input
                    v-model="crud.options.query.name"
                    placeholder="输入文件名搜索"
                  >
                    <template #prefix> Like </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <!--后缀搜索框-->
              <a-col :span="8">
                <a-form-item field="suffix" label="后缀">
                  <a-input
                    v-model="crud.options.query.suffix"
                    placeholder="输入后缀搜索"
                  >
                    <template #prefix> = </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <!--大小搜索框-->
              <a-col :span="8">
                <a-form-item field="size" label="大小(MB)">
                  <a-input-group>
                    <a-input-number
                      v-model="startBitSize"
                      :precision="2"
                      :min="0"
                      placeholder="0"
                    >
                      <template #prefix>[</template>
                      <template #suffix>,</template>
                    </a-input-number>
                    <a-input-number
                      v-model="endBitSize"
                      :precision="2"
                      :min="0"
                      placeholder="100"
                    >
                      <template #suffix>]</template>
                    </a-input-number>
                  </a-input-group>
                </a-form-item>
              </a-col>
              <!--创建日期搜索框-->
              <a-col :span="8">
                <a-form-item field="createTime" label="创建日期">
                  <a-range-picker
                    v-model="pickerValueCreateTime"
                    :placeholder="['[创建日期', '创建日期]']"
                    @change="rangePickerCreateTimeChange"
                  />
                </a-form-item>
              </a-col>
              <!--更新时间搜索框-->
              <a-col :span="8">
                <a-form-item field="updateTime" label="更新时间">
                  <a-range-picker
                    v-model="pickerValueUpdateTime"
                    :placeholder="['[更新时间', '更新时间]']"
                    @change="rangePickerUpdateTimeChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-scrollbar>
        </a-form>
      </a-col>
      <a-divider style="height: 84px" direction="vertical" />
      <a-col :flex="'86px'" style="text-align: right">
        <RROperation direction="vertical" />
      </a-col>
    </a-row>
    <a-divider style="margin-top: 0" />
    <CrudOperation
      ref="crudOperation"
      :add-permission="['tools:storage:add']"
      :edit-permission="['tools:storage:edit']"
      :del-permission="['tools:storage:del']"
      :download-permission="['tools:storage:list']"
      style="margin-bottom: 12px"
    >
      <template #addForm>
        <a-row :gutter="12">
          <!--文件名-->
          <a-col :span="24">
            <a-form-item
              field="name"
              label="文件名"
              :rules="[{ required: true, message: '文件名不能为空' }]"
            >
              <a-input v-model="crud.options.form.name" />
            </a-form-item>
          </a-col>
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
      <template #right>
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
      style="height: calc(100% - 209px); margin-bottom: 12px"
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
        <!--正常情况下-->
        <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
          <a-link
            target="_blank"
            :href="
              baseApi +
              '/file/' +
              record.type +
              '/' +
              record.realName +
              '?token=' +
              token
            "
            >{{ record.name }}</a-link
          >
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
    </a-table>
    <Pagination
      style="position: absolute; right: 0; bottom: 0; padding-right: 7px"
    />
  </div>
</template>

<script lang="ts" setup>
  import useApiStore from '@/store/modules/api';
  import {
    computed,
    getCurrentInstance,
    inject,
    onMounted,
    provide,
    ref,
    watch,
  } from 'vue';
  import {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { localUpload, ToolLocalStorage } from '@/api/tools/storage';
  import RROperation from '@/components/crud/RROperation.vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { CrudStatus, useCrud } from '@/components/crud/CRUD';
  import { useDict } from '@/components/dict';
  import { useI18n } from 'vue-i18n';
  import { Modal } from '@arco-design/web-vue';

  const storeType = inject('storeType');

  const { baseApi } = useApiStore();
  const token = localStorage.getItem('EH-ADMIN-TOKEN');

  const upload = ref<null | HTMLElement>(null);
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
        const res = await localUpload(
          {
            controller,
            onUploadProgress,
          },
          formData,
          crud.options.form.name
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

  watch(fileItems, (newVal) => {
    if (fileItems.value.length > 0 && !crud.options.form.name)
      crud.options.form.name = fileItems.value[0].file?.name;
  });

  /* 上传前
const beforeUpload = (file: File) => {
  console.log(fileItems);
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-promise-reject-errors
    resolve(true);
  });
}; */

  const dict = useDict('tools_storage_type');
  const { t } = useI18n();
  const crud = useCrud<ToolLocalStorage>({
    tag: '存储管理',
    url: '/tools/storage',
    title: 'tools.storage',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);
  const crudOperation = ref<null | HTMLElement>(null);

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置存储管理 columns信息
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
      title: '文件真实的名称',
      dataIndex: 'realName',
      width: 150,
      display: true,
      slotName: 'realName',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '文件名',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '后缀',
      dataIndex: 'suffix',
      width: 150,
      display: true,
      slotName: 'suffix',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '路径',
      dataIndex: 'path',
      width: 150,
      display: true,
      slotName: 'path',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 150,
      display: true,
      slotName: 'type',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '大小',
      dataIndex: 'size',
      width: 150,
      display: true,
      slotName: 'size',
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
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  const startBitSize = ref(0.0);
  const endBitSize = ref(100.0);

  // region    ↓-------------------------------- rangePicker --------------------------------↓

  // rangePickerCreateTime的值改变
  function rangePickerCreateTimeChange(data: any) {
    crud.update.appendQueryParams({
      startCreateTime: `${data[0]} 00:00:00`,
      endCreateTime: `${data[1]} 00:00:00`,
    });
  }
  // 解决重置params rangerPickerCreateTime不清除数据的问题
  const pickerValueCreateTime = ref([]);

  // rangePickerUpdateTime的值改变
  function rangePickerUpdateTimeChange(data: any) {
    crud.update.appendQueryParams({
      startUpdateTime: `${data[0]} 00:00:00`,
      endUpdateTime: `${data[1]} 00:00:00`,
    });
  }
  // 解决重置params rangerPickerUpdateTime不清除数据的问题
  const pickerValueUpdateTime = ref([]);

  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });
  crud.hook.afterResetParams = () => {
    pickerValueCreateTime.value = [];
    pickerValueUpdateTime.value = [];
    startBitSize.value = 0;
    endBitSize.value = 100;
  };
  crud.hook.beforeAdd = () => {
    if (!fileItems.value[0]) {
      Modal.warning({
        title: '注意',
        content: '请选择一个文件',
      });
    } else if (
      // 文件大小大于100MB
      (fileItems.value[0].file?.size ? fileItems.value[0].file?.size : 0) >
      1024 * 50
    ) {
      Modal.error({
        title: '错误',
        content: '演示环境下文件大小不能超过50KB',
      });
    } else {
      (upload.value as any).submit();
    }

    return false;
  };
  crud.hook.beforeRefresh = () => {
    crud.options.query.startBitSize = parseInt(
      String(1024 * 1024 * startBitSize.value),
      10
    );
    crud.options.query.endBitSize = parseInt(
      String(1024 * 1024 * endBitSize.value),
      10
    );
    return true;
  };

  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'Local',
  };
</script>

<style scoped></style>
