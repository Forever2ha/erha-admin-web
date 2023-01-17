<template>
  <div class="container">
    <!--一键部署上传文件-->
    <a-modal
      :visible="showUpload"
      width="580px"
      @cancel="showUpload = false"
      @ok="uploadFile"
    >
      <template #title> 一键部署 </template>
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
          <!--应用编号搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.appId"
              placeholder="选择应用编号搜索"
            >
              <a-option v-for="app in appMap" :key="app.id" :value="app.id">
                {{ app.name }}
              </a-option>
            </a-select>
          </a-col>
          <!--服务器搜索框-->
          <a-col :span="6">
            <a-select
              v-model="crud.options.query.serverId"
              placeholder="选择服务器搜索"
            >
              <a-option
                v-for="server in serverMap"
                :key="server.id"
                :value="server.id"
              >
                {{ server.name }}
              </a-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <RROperation />
          </a-col>
        </a-row>
        <CrudOperation
          :add-permission="['operation:oraDeploy:add']"
          :edit-permission="['operation:oraDeploy:edit']"
          :del-permission="['operation:oraDeploy:del']"
          :download-permission="['operation:oraDeploy:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--应用编号-->
              <a-col :span="24">
                <a-form-item
                  field="appId"
                  label="应用编号"
                  :rules="[{ required: true, message: '应用编号不能为空' }]"
                >
                  <a-select v-model="crud.options.form.appId">
                    <a-option
                      v-for="(app, index) in appMap"
                      :key="index"
                      :value="index"
                    >
                      {{ app.name }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!--服务器-->
              <a-col :span="24">
                <a-form-item
                  field="serverId"
                  label="服务器"
                  :rules="[{ required: true, message: '服务器不能为空' }]"
                >
                  <a-select v-model="crud.options.form.serverId" multiple>
                    <a-option
                      v-for="(server, index) in serverMap"
                      :key="index"
                      :value="index"
                    >
                      {{ server.name }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <template #right>
            <a-divider direction="vertical" />
            <a-space size="mini">
              <a-button
                type="dashed"
                status="success"
                size="mini"
                :loading="startLoading.loading.value"
                :disabled="crud.options.tableInfo.selectKeys.length !== 1"
                @click="start"
              >
                <template #icon><icon-check-circle /></template>
                启动</a-button
              >
              <a-button
                type="dashed"
                status="danger"
                size="mini"
                :loading="stopLoading.loading.value"
                :disabled="crud.options.tableInfo.selectKeys.length !== 1"
                @click="stop"
              >
                <template #icon><icon-stop /></template>停止</a-button
              >
              <a-button
                type="dashed"
                size="mini"
                :loading="checkLoading.loading.value"
                :disabled="crud.options.tableInfo.selectKeys.length !== 1"
                @click="checkServer"
              >
                <template #icon><icon-search /></template>
                状态查看</a-button
              >
            </a-space>
            <a-divider direction="vertical" />
            <a-space size="mini">
              <a-button
                type="outline"
                size="small"
                status="warning"
                :disabled="crud.options.tableInfo.selectKeys.length !== 1"
                @click="showUpload = true"
              >
                <template #icon>
                  <icon-upload />
                </template>
                一键部署</a-button
              >

              <a-button
                type="outline"
                size="small"
                :disabled="crud.options.tableInfo.selectKeys.length !== 1"
                @click="clickReduction"
              >
                <template #icon>
                  <icon-cloud />
                </template>
                系统还原</a-button
              >
              <deploy-history />
            </a-space>
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

          <!--应用-->
          <template #appId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{
                appMap
                  ? appMap[record.appId]
                    ? appMap[record.appId].name
                    : ''
                  : ''
              }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{
                  appMap
                    ? appMap[record.appId]
                      ? appMap[record.appId].name
                      : ''
                    : ''
                }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  appMap
                    ? appMap[
                        crud.options.form[record.id].appId
                          ? crud.options.form[record.id].appId
                          : record.appId
                      ]
                      ? appMap[
                          crud.options.form[record.id].appId
                            ? crud.options.form[record.id].appId
                            : record.appId
                        ].name
                      : ''
                    : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].appId"
                :default-value="record.appId + ''"
              >
                <a-option
                  v-for="(app, index) in appMap"
                  :key="index"
                  :value="index"
                >
                  {{ app.name }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--服务器-->
          <template #serverId="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              <a-space>
                <a-tag
                  v-for="server in record.server"
                  :key="server.id"
                  color="purple"
                  >{{ server.name }}</a-tag
                >
              </a-space>
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                <a-space>
                  <a-tag
                    v-for="server in record.server"
                    :key="server.id"
                    color="purple"
                    >{{ server.name }}</a-tag
                  >
                </a-space>
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                <a-select
                  v-model="crud.options.form[record.id].serverId"
                  :default-value="record.server.map((v) => v.id)"
                  placeholder="请选择..."
                  multiple
                  :disabled="true"
                >
                  <a-option
                    v-for="server in serverMap"
                    :key="server.id"
                    :value="server.id"
                    :tag-props="{ color: 'purple' }"
                    >{{ server.name }}
                  </a-option>
                </a-select>
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].serverId"
                :default-value="record.server.map((v) => v.id)"
                placeholder="请选择..."
                multiple
              >
                <a-option
                  v-for="server in serverMap"
                  :key="server.id"
                  :value="server.id"
                  :tag-props="{ color: 'purple' }"
                  >{{ server.name }}
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
    checkServerStatus,
    OraDeploy,
    startServer,
    stopServer,
    uploadApp,
  } from '@/api/operation/deploy';
  import {
    computed,
    getCurrentInstance,
    onBeforeMount,
    onMounted,
    onUnmounted,
    provide,
    ref,
  } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import { getOraServer, OraServer } from '@/api/operation/server';
  import { getOraApp, OraApp } from '@/api/operation/app';
  import useWebSocket from '@/hooks/websocket';
  import useApiStore from '@/store/modules/api';
  import { useUserStore } from '@/store';
  import { Message, Modal } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { localUpload } from '@/api/tools/storage';
  import DeployHistory from '@/views/operation/deploy/deploy-history.vue';

  const { t } = useI18n();
  const crud = useCrud<OraDeploy>({
    tag: '部署管理',
    url: '/operation/deploy',
    title: 'operation.deploy',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);

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
      title: '应用',
      dataIndex: 'appId',
      width: 150,
      display: true,
      slotName: 'appId',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '服务器',
      dataIndex: 'serverId',
      width: 150,
      display: true,
      slotName: 'serverId',
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
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  const serverMap = ref<{ [key: number]: OraServer }>({});
  const appMap = ref<{ [key: number]: OraApp }>({});
  // 获取服务器和应用信息
  const getServerAndApp = async () => {
    const server = await getOraServer();
    serverMap.value = {};
    server.data.list.forEach((val) => {
      serverMap.value[val.id] = val;
    });
    const app = await getOraApp();
    appMap.value = {};
    app.data.list.forEach((val) => {
      appMap.value[val.id] = val;
    });
  };

  const { user } = useUserStore();
  const websocket = ref<null | WebSocket>(null);
  const startLoading = useLoading(false);
  // 检查是否勾选了一个数据
  const checkSelectOne: () => boolean = () => {
    if (crud.options.tableInfo.selectKeys.length !== 1) {
      Message.warning('请先勾选数据/只能勾选1个数据');
      return false;
    }
    return true;
  };
  // 启动websocket
  const startWebsocket = () => {
    if (!websocket.value) {
      websocket.value = useWebSocket({
        url: `/webSocket/${user?.username}`,
        onOpen: () => {
          Message.info('[部署管理]websocket已建立');
        },
        onClose: () => {
          Message.warning('[部署管理]websocket已关闭');
        },
        onMessage: (res: any) => {
          const data = JSON.parse(res.data);
          if (data.msgType === 'ERROR') {
            Message.error({
              content: `[${data.msgType}] ${data.msg}`,
              duration: 8000,
              closable: true,
            });
          } else {
            Message.info({
              content: `[${data.msgType}] ${data.msg}`,
              duration: 8000,
              closable: true,
            });
          }
        },
        onError: (res: any) => {
          const data = JSON.parse(res.data);
          Message.error({
            content: `[${data.msgType}] ${data.msg}`,
            duration: 8000,
            closable: true,
          });
        },
      }).init();
    }
  };
  provide('websocket', websocket);
  provide('startWebsocket', startWebsocket);

  // 启动
  const start = async () => {
    startLoading.toggle();
    try {
      if (!checkSelectOne()) return;
      startWebsocket();
      const { data } = await startServer(crud.options.tableInfo.selectKeys[0]);
      Message.success({ content: data, duration: 8000, closable: true });
    } catch (e) {
      // ignore
    }
    startLoading.toggle();
  };

  const stopLoading = useLoading(false);
  // 停止
  const stop = async () => {
    stopLoading.toggle();
    try {
      if (!checkSelectOne()) return;
      startWebsocket();
      const data: any = await stopServer(crud.options.tableInfo.selectKeys[0]);
      if (data.code !== 20000) {
        Message.error(`停止失败：${data.msg}`);
      }
    } catch (e) {
      // ignore
    }
    stopLoading.toggle();
  };

  const checkLoading = useLoading(false);
  // 检查运行状态
  const checkServer = async () => {
    checkLoading.toggle();
    try {
      if (!checkSelectOne()) return;
      startWebsocket();
      const data = await checkServerStatus(
        crud.options.tableInfo.selectKeys[0]
      );
      if ((data as any).code !== 20000) {
        Message.error(`出错了：${(data as any).msg}`);
      }
    } catch (e) {
      // ignore
    }
    checkLoading.toggle();
  };

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
        const res = await uploadApp(
          {
            controller,
            onUploadProgress,
          },
          formData,
          crud.options.tableInfo.selectKeys[0]
        );
        global.$message.success('上传成功！');
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
      startWebsocket();
      (upload.value as any).submit();
    }
  };

  const showDeployHis = ref(false);
  const selectDeployId = ref(0);
  const clickReduction = () => {
    if (checkSelectOne()) {
      selectDeployId.value = crud.options.tableInfo.selectKeys[0] as number;
      showDeployHis.value = true;
    }
  };
  provide('showDeployHis', showDeployHis);
  provide('selectDeployId', selectDeployId);
  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
    getServerAndApp();
  });
  crud.hook.beforeOpenAdd = () => {
    getServerAndApp();
    return true;
  };
  onUnmounted(() => {
    // 关闭websocket
    if (websocket.value) {
      websocket.value.close();
      console.log('[部署管理]websocket已关闭');
    }
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
