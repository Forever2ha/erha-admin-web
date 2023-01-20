<template>
  <div class="container">
    <!--sql脚本上传文件-->
    <a-modal
      :visible="showUpload"
      width="580px"
      @cancel="showUpload = false"
      @ok="uploadFile"
    >
      <template #title> 上传sql脚本 </template>
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
    </a-modal>
    <div class="panel">
      <div style="position: relative; height: 100%">
        <!--查询表单-->
        <a-row :gutter="24" style="margin-bottom: 12px">
          <!--名称搜索框-->
          <a-col :span="6">
            <a-input
              v-model="crud.options.query.name"
              placeholder="输入名称搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>
          <!--账号搜索框-->
          <a-col :span="6">
            <a-input
              v-model="crud.options.query.userName"
              placeholder="输入账号搜索"
            >
              <template #prefix> Like </template>
            </a-input>
          </a-col>
          <!--类型搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.typeDatabese"
              placeholder="输入类型搜索"
            >
              <a-option
                v-for="s in dict.type_database"
                :key="s.detailId"
                :value="s.label"
              >
                {{ s.label }}
              </a-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>

        <CrudOperation
          :add-permission="['operation:oraDatabase:add']"
          :edit-permission="['operation:oraDatabase:edit']"
          :del-permission="['operation:oraDatabase:del']"
          :download-permission="['operation:oraDatabase:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--名称-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="名称"
                  :rules="[{ required: true, message: '名称不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <!--jdbc连接-->
              <a-col :span="12">
                <a-form-item
                  field="jdbcUrl"
                  label="jdbc连接"
                  :rules="[{ required: true, message: 'jdbc连接不能为空' }]"
                >
                  <a-input v-model="crud.options.form.jdbcUrl" />
                </a-form-item>
              </a-col>
              <!--账号-->
              <a-col :span="12">
                <a-form-item
                  field="userName"
                  label="账号"
                  :rules="[{ required: true, message: '账号不能为空' }]"
                >
                  <a-input v-model="crud.options.form.userName" />
                </a-form-item>
              </a-col>
              <!--密码-->
              <a-col :span="12">
                <a-form-item
                  field="pwd"
                  label="密码"
                  :rules="[{ required: true, message: '密码不能为空' }]"
                >
                  <a-input v-model="crud.options.form.pwd" type="password" />
                </a-form-item>
              </a-col>
              <!--类型-->
              <a-col :span="12">
                <a-form-item
                  field="typeDatabese"
                  label="类型"
                  :rules="[{ required: true, message: '类型不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.typeDatabese"
                    placeholder="请选择"
                  >
                    <a-option
                      v-for="s in dict.type_database"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <template #right>
            <a-divider direction="vertical" />
            <a-space>
              <a-button
                type="dashed"
                size="small"
                status="success"
                :loading="connectLoading.value"
                :disabled="crud.options.tableInfo.selectKeys.length !== 1"
                @click="clickConnect"
              >
                <template #icon>
                  <icon-search />
                </template>
                测试连接</a-button
              >
              <a-button
                type="dashed"
                size="small"
                status="warning"
                :disabled="crud.options.tableInfo.selectKeys.length !== 1"
                @click="showUpload = true"
              >
                <template #icon>
                  <icon-upload />
                </template>
                执行sql脚本</a-button
              >
            </a-space>
            <div style="color: red">
              ⚠️演示环境下，请勿输入自己的真实账户密码以及信息，被盗概不负责</div
            >
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
              />
            </div>
          </template>

          <!--jdbc连接-->
          <template #jdbcUrl="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.jdbcUrl }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.jdbcUrl }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].jdbcUrl
                    ? crud.options.form[record.id].jdbcUrl
                    : record.jdbcUrl
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].jdbcUrl"
                :default-value="record.jdbcUrl"
              />
            </div>
          </template>

          <!--账号-->
          <template #userName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.userName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.userName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].userName
                    ? crud.options.form[record.id].userName
                    : record.userName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].userName"
                :default-value="record.userName"
              />
            </div>
          </template>

          <!--密码-->
          <template #pwd="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              ******
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              ******
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input
                v-model="crud.options.form[record.id].pwd"
                :default-value="record.pwd"
                type="password"
              />
            </div>
          </template>

          <!--类型-->
          <template #typeDatabese="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.typeDatabese }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.typeDatabese }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].typeDatabese
                    ? crud.options.form[record.id].typeDatabese
                    : record.typeDatabese
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].typeDatabese"
                :default-value="record.typeDatabese"
              >
                <a-option
                  v-for="s in dict.type_database"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
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
  import {
    OraDatabase,
    testConnection,
    uploadSql,
  } from '@/api/operation/datebase';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Message, Modal } from '@arco-design/web-vue';
  import {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';

  const { t } = useI18n();
  const crud = useCrud<OraDatabase>({
    tag: '部署管理',
    url: '/operation/database',
    title: 'operation.database',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);

  // 检查是否勾选了一个数据
  const checkSelectOne: () => boolean = () => {
    if (crud.options.tableInfo.selectKeys.length !== 1) {
      Message.warning('请先勾选数据/只能勾选1个数据');
      return false;
    }
    return true;
  };

  // 测试连接
  const connectLoading = useLoading(false);
  const clickConnect = async () => {
    connectLoading.toggle();
    try {
      const { data } = await testConnection(
        crud.options.tableInfo.selectKeys[0]
      );
      if (data) {
        Message.success('连接成功！');
      } else {
        Message.error('连接失败！');
      }
    } catch (e) {
      // ignore
    }
    connectLoading.toggle();
  };

  // 上传sql脚本
  const showUpload = ref(false);
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
        const res = await uploadSql(
          {
            controller,
            onUploadProgress,
          },
          formData,
          crud.options.tableInfo.selectKeys[0]
        );
        Message.info(res.data);
        showUpload.value = false;
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
  // 上传文件
  const uploadFile = () => {
    if (!checkSelectOne()) {
      return;
    }

    if (!fileItems.value[0]) {
      Message.error('请选择一个文件上传');
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
  };

  // 字典
  const dict = useDict('type_database');
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
      title: '名称',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: 'jdbc连接',
      dataIndex: 'jdbcUrl',
      width: 150,
      display: true,
      slotName: 'jdbcUrl',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '账号',
      dataIndex: 'userName',
      width: 150,
      display: true,
      slotName: 'userName',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '密码',
      dataIndex: 'pwd',
      width: 150,
      display: true,
      slotName: 'pwd',
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
      title: '创建时间',
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
    {
      title: '类型',
      dataIndex: 'typeDatabese',
      width: 150,
      display: true,
      slotName: 'typeDatabese',
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
