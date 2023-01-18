<template>
  <div class="container">
    <div class="panel">
      <a-tabs position="left" :justify="true" style="height: 100%">
        <a-tab-pane key="1" title="配置">
          <div style="position: relative; height: 100%; padding-right: 10px">
            <!--查询表单-->
            <a-row :gutter="24" style="margin-bottom: 12px">
              <!--发件人邮箱搜索框-->
              <a-col :span="6">
                <a-input
                  v-model="crud.options.query.fromUser"
                  placeholder="输入发件人邮箱搜索"
                >
                  <template #prefix> Like </template>
                </a-input>
              </a-col>

              <a-col :span="6">
                <RROperation />
              </a-col>
            </a-row>
            <CrudOperation
              :add-permission="['tools:email:add']"
              :edit-permission="['tools:email:edit']"
              :del-permission="['tools:email:del']"
              :download-permission="['tools:email:list']"
              style="margin-bottom: 12px"
            >
              <template #addForm>
                <a-row :gutter="12">
                  <!--发件人邮箱-->
                  <a-col :span="24">
                    <a-form-item
                      field="fromUser"
                      label="发件人邮箱"
                      :rules="[
                        { required: true, message: '发件人邮箱不能为空' },
                      ]"
                    >
                      <a-input v-model="crud.options.form.fromUser" />
                    </a-form-item>
                  </a-col>
                  <!--发件者用户名-->
                  <a-col :span="24">
                    <a-form-item
                      field="user"
                      label="发件者用户名"
                      :rules="[
                        { required: true, message: '发件者用户名不能为空' },
                      ]"
                    >
                      <a-input v-model="crud.options.form.user" />
                    </a-form-item>
                  </a-col>
                  <!--邮件服务器SMTP地址-->
                  <a-col :span="24">
                    <a-form-item
                      field="host"
                      label="邮件服务器SMTP地址"
                      :rules="[
                        {
                          required: true,
                          message: '邮件服务器SMTP地址不能为空',
                        },
                      ]"
                    >
                      <a-input v-model="crud.options.form.host" />
                    </a-form-item>
                  </a-col>
                  <!--密码-->
                  <a-col :span="24">
                    <a-form-item
                      field="pass"
                      label="密码"
                      :rules="[{ required: true, message: '密码不能为空' }]"
                    >
                      <a-input v-model="crud.options.form.pass" />
                    </a-form-item>
                  </a-col>
                  <!--端口-->
                  <a-col :span="24">
                    <a-form-item
                      field="port"
                      label="端口"
                      :rules="[{ required: true, message: '端口不能为空' }]"
                    >
                      <a-input v-model="crud.options.form.port" />
                    </a-form-item>
                  </a-col>
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

              <!--active-->
              <template #active="{ record }">
                <a-tag
                  style="cursor: pointer"
                  :color="record.active ? 'green' : 'red'"
                  :loading="changeCfg.loading.value"
                  @click="activeConfig(record)"
                  >{{ record.active ? '激活' : '未激活' }}</a-tag
                >
              </template>

              <!--发件人邮箱-->
              <template #fromUser="{ record }">
                <!--正常情况下-->
                <div
                  v-show="!record.editable && !crud.options.tableInfo.isEdit"
                >
                  {{ record.fromUser }}
                </div>

                <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
                <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                  <!--未修改的行-->
                  <div v-show="!crud.options.form[record.id]">
                    {{ record.fromUser }}
                  </div>
                  <!--修改完毕提交后-->
                  <div v-if="crud.options.form[record.id]">
                    {{
                      crud.options.form[record.id].fromUser
                        ? crud.options.form[record.id].fromUser
                        : record.fromUser
                    }}
                  </div>
                </div>

                <!--修改情况下-->
                <div v-if="record.editable">
                  <a-input
                    v-model="crud.options.form[record.id].fromUser"
                    :default-value="record.fromUser"
                  />
                </div>
              </template>

              <!--邮件服务器SMTP地址-->
              <template #host="{ record }">
                <!--正常情况下-->
                <div
                  v-show="!record.editable && !crud.options.tableInfo.isEdit"
                >
                  {{ record.host }}
                </div>

                <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
                <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                  <!--未修改的行-->
                  <div v-show="!crud.options.form[record.id]">
                    {{ record.host }}
                  </div>
                  <!--修改完毕提交后-->
                  <div v-if="crud.options.form[record.id]">
                    {{
                      crud.options.form[record.id].host
                        ? crud.options.form[record.id].host
                        : record.host
                    }}
                  </div>
                </div>

                <!--修改情况下-->
                <div v-if="record.editable">
                  <a-input
                    v-model="crud.options.form[record.id].host"
                    :default-value="record.host"
                  />
                </div>
              </template>

              <!--密码-->
              <template #pass="{ record }">
                <!--正常情况下-->
                <div
                  v-show="!record.editable && !crud.options.tableInfo.isEdit"
                >
                  {{ record.pass }}
                </div>

                <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
                <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                  <!--未修改的行-->
                  <div v-show="!crud.options.form[record.id]">
                    {{ record.pass }}
                  </div>
                  <!--修改完毕提交后-->
                  <div v-if="crud.options.form[record.id]">
                    {{
                      crud.options.form[record.id].pass
                        ? crud.options.form[record.id].pass
                        : record.pass
                    }}
                  </div>
                </div>

                <!--修改情况下-->
                <div v-if="record.editable">
                  <a-input
                    v-model="crud.options.form[record.id].pass"
                    :default-value="record.pass"
                  />
                </div>
              </template>

              <!--端口-->
              <template #port="{ record }">
                <!--正常情况下-->
                <div
                  v-show="!record.editable && !crud.options.tableInfo.isEdit"
                >
                  {{ record.port }}
                </div>

                <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
                <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                  <!--未修改的行-->
                  <div v-show="!crud.options.form[record.id]">
                    {{ record.port }}
                  </div>
                  <!--修改完毕提交后-->
                  <div v-if="crud.options.form[record.id]">
                    {{
                      crud.options.form[record.id].port
                        ? crud.options.form[record.id].port
                        : record.port
                    }}
                  </div>
                </div>

                <!--修改情况下-->
                <div v-if="record.editable">
                  <a-input
                    v-model="crud.options.form[record.id].port"
                    :default-value="record.port"
                  />
                </div>
              </template>

              <!--发件者用户名-->
              <template #user="{ record }">
                <!--正常情况下-->
                <div
                  v-show="!record.editable && !crud.options.tableInfo.isEdit"
                >
                  {{ record.user }}
                </div>

                <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
                <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                  <!--未修改的行-->
                  <div v-show="!crud.options.form[record.id]">
                    {{ record.user }}
                  </div>
                  <!--修改完毕提交后-->
                  <div v-if="crud.options.form[record.id]">
                    {{
                      crud.options.form[record.id].user
                        ? crud.options.form[record.id].user
                        : record.user
                    }}
                  </div>
                </div>

                <!--修改情况下-->
                <div v-if="record.editable">
                  <a-input
                    v-model="crud.options.form[record.id].user"
                    :default-value="record.user"
                  />
                </div>
              </template>
            </a-table>
            <Pagination
              style="
                position: absolute;
                right: 0;
                bottom: 0;
                padding-right: 7px;
              "
            />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" title="发送邮件" style="height: 100%">
          <div style="height: 100px; margin-right: 20px">
            <a-form ref="emailForm" :model="emailInfo" :auto-label-width="true">
              <a-form-item
                field="title"
                label="主题"
                :rules="[{ required: true, message: '主题不能为空' }]"
              >
                <a-input v-model="emailInfo.title"></a-input>
              </a-form-item>
              <a-form-item
                field="address"
                label="地址"
                :rules="[{ required: true, message: '地址不能为空' }]"
              >
                <a-input v-model="emailInfo.address"></a-input>
              </a-form-item>
            </a-form>
          </div>
          <div
            style="
              height: calc(100% - 140px);
              margin-right: 20px;
              border: 1px solid skyblue;
            "
          >
            <Toolbar
              style="height: 80px; border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="emailInfo.content"
              style="height: calc(100% - 80px)"
              :default-config="editorConfig"
              mode="default"
              @onCreated="handleCreated"
            />
          </div>
          <div style="padding-top: 5px">
            <a-button
              status="success"
              type="outline"
              shape="round"
              :loading="emailBtn.loading.value"
              @click="send"
              >发送
              <template #icon>
                <icon-send />
              </template>
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" title="说明">
          <a-typography>
            <a-typography-title :heading="5">如何使用</a-typography-title>
            <a-typography-paragraph>
              <ol>
                <li
                  >请先添加配置，然后点击激活，被激活的配置只能有<a-typography-text
                    mark
                    >一个</a-typography-text
                  >。</li
                >
                <li>填写好目标地址，发送人姓名，点击发送</li>
              </ol>
            </a-typography-paragraph>
            <a-typography-title :heading="5">邮件服务器配置</a-typography-title>
            <a-typography-paragraph type="secondary">
              <ul>
                <li>邮件服务器的SMTP地址，可选，默认为smtp</li>
                <li>邮件服务器的SMTP端口，可选，默认465或者25</li>
                <li>发件人（必须正确，否则发送失败）</li>
                <li>用户名，默认为发件人邮箱前缀</li>
                <li
                  >密码（注意，某些邮箱需要为SMTP服务单独设置密码，如QQ和163等等）</li
                >
                <li>是否开启ssl，默认开启</li>
              </ul>
            </a-typography-paragraph>
          </a-typography>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useCrud, CrudStatus } from '@/components/crud/CRUD';
  import {
    activeEmailCfg,
    sendEmail,
    ToolEmailConfig,
  } from '@/api/tools/email';
  import {
    computed,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    provide,
    reactive,
    ref,
    shallowRef,
  } from 'vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import '@wangeditor/editor/dist/css/style.css';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';

  const changeCfg = useLoading(false);
  // 激活配置
  const activeConfig = async (record: any) => {
    changeCfg.toggle();
    try {
      const data = await activeEmailCfg(record.id);
      crud.status.value = CrudStatus.NEED_REFRESH;
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.log(e);
    }
    changeCfg.toggle();
  };

  const emailInfo = reactive({ content: '', title: '', address: '' });

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef();
  const emailForm = ref<null | FormInstance>(null);
  const emailBtn = useLoading(false);
  const send = () => {
    if (emailInfo.content === '') {
      Message.error('邮件内容不能为空');
      return;
    }

    (emailForm.value as FormInstance).validate(async (errors) => {
      if (!errors) {
        try {
          emailBtn.toggle();
          await sendEmail(emailInfo);
          Message.success('发送成功');
        } catch (e) {
          // ignore
        }
        emailBtn.toggle();
      }
    });
  };

  const toolbarConfig = {};
  const editorConfig = { placeholder: '请输入内容...' };

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });

  const handleCreated = (editor: any) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
  };

  const { t } = useI18n();
  const crud = useCrud<ToolEmailConfig>({
    tag: '邮件配置',
    url: '/tools/email/config',
    title: 'tools.email',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置邮件配置 columns信息
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
      title: '状态',
      dataIndex: 'active',
      width: 100,
      display: true,
      slotName: 'active',
    },
    {
      title: '发件人邮箱',
      dataIndex: 'fromUser',
      width: 150,
      display: true,
      slotName: 'fromUser',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '发件者用户名',
      dataIndex: 'user',
      width: 150,
      display: true,
      slotName: 'user',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: 'SMTP地址',
      dataIndex: 'host',
      width: 150,
      display: true,
      slotName: 'host',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '密码',
      dataIndex: 'pass',
      width: 150,
      display: true,
      slotName: 'pass',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '端口',
      dataIndex: 'port',
      width: 150,
      display: true,
      slotName: 'port',
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

<script lang="ts">
  export default {
    name: 'Email',
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
    padding: 16px 0;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.arco-tabs-content-list) {
    height: 100%;
  }

  :deep(.arco-tabs-pane) {
    height: 100%;
  }
</style>
