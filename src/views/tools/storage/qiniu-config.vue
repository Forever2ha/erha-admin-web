<template>
  <a-modal :visible="visible" width="80vw" @cancel="visible = false">
    <template #title>七牛云配置</template>
    <!--查询表单-->
    <a-row :gutter="24" style="margin-bottom: 12px">
      <!--没有查询字段，字段生成主键的查询方式-->
      <a-col :span="6">
        <!--id搜索框-->
        <a-input-number
          v-model="crud.options.query.configId"
          placeholder="输入id搜索"
        />
      </a-col>
      <a-col :span="6">
        <RROperation />
      </a-col>
    </a-row>
    <CrudOperation
      :add-permission="['storage:qiniu:add']"
      :edit-permission="['storage:qiniu:edit']"
      :del-permission="['storage:qiniu:del']"
      :download-permission="['storage:qiniu:list']"
      style="margin-bottom: 12px"
    >
      <template #addForm>
        <a-row :gutter="12">
          <!--accessKey-->
          <a-col :span="24">
            <a-form-item
              field="accessKey"
              label="accessKey"
              :rules="[{ required: true, message: 'accessKey不能为空' }]"
            >
              <a-input v-model="crud.options.form.accessKey" />
            </a-form-item>
          </a-col>
          <!--Bucket 识别符-->
          <a-col :span="24">
            <a-form-item
              field="bucket"
              label="Bucket 识别符"
              :rules="[{ required: true, message: 'Bucket 识别符不能为空' }]"
            >
              <a-input v-model="crud.options.form.bucket" />
            </a-form-item>
          </a-col>
          <!--外链域名-->
          <a-col :span="24">
            <a-form-item
              field="host"
              label="外链域名"
              :rules="[{ required: true, message: '外链域名不能为空' }]"
            >
              <a-input v-model="crud.options.form.host" />
            </a-form-item>
          </a-col>
          <!--secretKey-->
          <a-col :span="24">
            <a-form-item
              field="secretKey"
              label="secretKey"
              :rules="[{ required: true, message: 'secretKey不能为空' }]"
            >
              <a-input v-model="crud.options.form.secretKey" />
            </a-form-item>
          </a-col>
          <!--机房-->
          <a-col :span="24">
            <a-form-item field="zone" label="机房">
              <a-select
                v-model="crud.options.form.zone"
                placeholder="请选择"
                allow-search
              >
                <a-option
                  v-for="s in dict.tools_storage_qiniu_area"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <!--空间类型-->
          <a-col :span="24">
            <a-form-item
              field="type"
              label="空间类型"
              :rules="[{ required: true, message: '空间类型不能为空' }]"
            >
              <a-radio-group v-model="crud.options.form.type">
                <a-radio
                  v-for="s in dict.tools_storage_qiniu_control"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}</a-radio
                >
              </a-radio-group>
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

      <!--accessKey-->
      <template #accessKey="{}"> ****** </template>

      <!--Bucket 识别符-->
      <template #bucket="{ record }">
        <!--正常情况下-->
        <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
          {{ record.bucket }}
        </div>

        <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
        <div v-if="!record.editable && crud.options.tableInfo.isEdit">
          <!--未修改的行-->
          <div v-show="!crud.options.form[record.id]">
            {{ record.bucket }}
          </div>
          <!--修改完毕提交后-->
          <div v-if="crud.options.form[record.id]">
            {{
              crud.options.form[record.id].bucket
                ? crud.options.form[record.id].bucket
                : record.bucket
            }}
          </div>
        </div>

        <!--修改情况下-->
        <div v-if="record.editable">
          <a-input
            v-model="crud.options.form[record.id].bucket"
            :default-value="record.bucket"
          />
        </div>
      </template>

      <!--外链域名-->
      <template #host="{ record }">
        <!--正常情况下-->
        <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
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

      <!--secretKey-->
      <template #secretKey="{}"> ****** </template>

      <!--空间类型-->
      <template #type="{ record }">
        <!--正常情况下-->
        <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
          {{ record.type }}
        </div>

        <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
        <div v-if="!record.editable && crud.options.tableInfo.isEdit">
          <!--未修改的行-->
          <div v-show="!crud.options.form[record.id]">
            {{ record.type }}
          </div>
          <!--修改完毕提交后-->
          <div v-if="crud.options.form[record.id]">
            {{
              crud.options.form[record.id].type
                ? crud.options.form[record.id].type
                : record.type
            }}
          </div>
        </div>

        <!--修改情况下-->
        <div v-if="record.editable">
          <a-select
            v-model="crud.options.form[record.id].type"
            :default-value="record.type"
          >
            <a-option
              v-for="s in dict.tools_storage_qiniu_control"
              :key="s.detailId"
              :value="s.label"
              >{{ s.label }}
            </a-option>
          </a-select>
        </div>
      </template>

      <!--机房-->
      <template #zone="{ record }">
        <!--正常情况下-->
        <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
          {{ record.zone }}
        </div>

        <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
        <div v-if="!record.editable && crud.options.tableInfo.isEdit">
          <!--未修改的行-->
          <div v-show="!crud.options.form[record.id]">
            {{ record.zone }}
          </div>
          <!--修改完毕提交后-->
          <div v-if="crud.options.form[record.id]">
            {{
              crud.options.form[record.id].zone
                ? crud.options.form[record.id].zone
                : record.zone
            }}
          </div>
        </div>

        <!--修改情况下-->
        <div v-if="record.editable">
          <a-select
            v-model="crud.options.form[record.id].zone"
            :default-value="record.zone"
          >
            <a-option
              v-for="s in dict.tools_storage_qiniu_area"
              :key="s.detailId"
              :value="s.label"
              >{{ s.label }}
            </a-option>
          </a-select>
        </div>
      </template>
    </a-table>
    <template #footer>
      <Pagination />
    </template>
  </a-modal>
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
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import { useI18n } from 'vue-i18n';
  import { activeQiniuCfg, ToolQiniuConfig } from '@/api/tools/storage';
  import useLoading from '@/hooks/loading';
  import encrypt from '@/utils/RsaUtils';

  const { t } = useI18n();
  const crud = useCrud<ToolQiniuConfig>({
    tag: '七牛云配置',
    url: '/tools/storage/qiniuConfig',
    title: 'tools.storage.qiniuConfig',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);
  const visible = inject('visible');
  // 字典
  const dict = useDict(
    'tools_storage_qiniu_control',
    'tools_storage_qiniu_area'
  );
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
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      display: true,
      slotName: 'id',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'active',
      width: 100,
      display: true,
      slotName: 'active',
    },
    {
      title: 'accessKey',
      dataIndex: 'accessKey',
      width: 150,
      display: true,
      slotName: 'accessKey',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: 'secretKey',
      dataIndex: 'secretKey',
      width: 150,
      display: true,
      slotName: 'secretKey',
      tooltip: true,
      ellipsis: true,
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
      title: '外链域名',
      dataIndex: 'host',
      width: 150,
      display: true,
      slotName: 'host',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '空间类型',
      dataIndex: 'type',
      width: 150,
      display: true,
      slotName: 'type',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '机房',
      dataIndex: 'zone',
      width: 150,
      display: true,
      slotName: 'zone',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  const changeCfg = useLoading(false);
  // 激活配置
  const activeConfig = async (record: any) => {
    changeCfg.toggle();
    try {
      const data = await activeQiniuCfg(record.id);
      crud.status.value = CrudStatus.NEED_REFRESH;
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.log(e);
    }
    changeCfg.toggle();
  };

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });
  crud.hook.beforeAdd = () => {
    // 加密sk和ak
    crud.options.form.accessKey = encrypt(crud.options.form.accessKey);
    crud.options.form.secretKey = encrypt(crud.options.form.secretKey);
    return true;
  };

  // endregion ↑-------------------------------- 钩子 --------------------------------↑
</script>

<script lang="ts">
  export default {
    name: 'QiniuConfig',
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
</style>
