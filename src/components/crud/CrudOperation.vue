<template>
  <div ref="rootDiv">
    <a-row align="end">
      <a-col flex="auto">
        <a-modal
          v-model:visible="addVisible"
          :mask-closable="false"
          :title="$t('crud.add') + $t(crud.options.title)"
          :popup-container="rootDiv"
          :width="650"
          @cancel="handleCancel"
          @before-ok="handleBeforeOk"
          @before-open="handleBeforeOpen"
        >
          <a-form
            ref="addForm"
            :model="crud.options.form"
            :style="{ marginTop: '10px' }"
            auto-label-width
          >
            <slot name="addForm"></slot>
          </a-form>
        </a-modal>
        <a-space>
          <!--左侧插槽-->
          <slot name="left" />
          <!--新增,修改,删除,下载-->
          <a-button
            v-if="!crud.options.tableInfo.isEdit && props.showAdd"
            v-permission="props.addPermission"
            :disabled="!props.enabledAdd || disableAll"
            type="outline"
            size="small"
            @click="addVisible = true"
          >
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('crud.add') }}
          </a-button>
          <a-button
            v-if="!crud.options.tableInfo.isEdit && props.showEdit"
            v-permission="props.editPermission"
            :disabled="
              crud.options.tableInfo.selectKeys.length === 0 ||
              !props.enabledAdd ||
              disableAll
            "
            type="outline"
            size="small"
            status="success"
            @click="editClick"
          >
            <template #icon>
              <icon-edit />
            </template>
            {{ $t('crud.edit') }}
          </a-button>

          <a-popconfirm
            content="你确定要删除所选的行吗?"
            @ok="crud.update.setStatus(CrudStatus.NEED_DELETE)"
          >
            <a-button
              v-if="!crud.options.tableInfo.isEdit && props.showDel"
              v-permission="props.delPermission"
              :disabled="
                crud.options.tableInfo.selectKeys.length === 0 ||
                !props.enabledDel ||
                disableAll
              "
              :loading="crud.status.value === CrudStatus.DELETING"
              type="outline"
              size="small"
              status="danger"
            >
              <template #icon>
                <icon-delete />
              </template>
              {{ $t('crud.delete') }}
            </a-button>
          </a-popconfirm>

          <a-button
            v-if="!crud.options.tableInfo.isEdit && props.showDownload"
            v-permission="props.downloadPermission"
            type="outline"
            size="small"
            status="warning"
            :disabled="!props.enabledDownload || disableAll"
            :loading="crud.status.value === CrudStatus.DOWNLOADING"
            @click="download"
          >
            <template #icon>
              <icon-download />
            </template>
            {{ $t('crud.download') }}
          </a-button>
          <!--确认修改/取消修改-->
          <a-button
            v-if="crud.options.tableInfo.isEdit"
            type="dashed"
            status="success"
            size="small"
            :loading="crud.status.value === CrudStatus.UPDATING"
            @click="confirmEdit"
          >
            <template #icon>
              <icon-check />
            </template>
            {{ $t('crud.confirmEdit') }}</a-button
          >
          <a-button
            v-if="crud.options.tableInfo.isEdit"
            type="dashed"
            status="warning"
            size="small"
            @click="cancelEdit"
          >
            <template #icon>
              <icon-close />
            </template>
            {{ $t('crud.cancelEdit') }}</a-button
          >
          <!--右侧插槽-->
          <slot name="right" />
        </a-space>
      </a-col>
      <!--右侧三个按钮：刷新，设置显示列，设置表格信息-->
      <a-col flex="150px">
        <a-button
          size="mini"
          type="dashed"
          style="width: 50px"
          :disabled="
            crud.options.tableInfo.isEdit || !props.enabledRefresh || disableAll
          "
          @click="crud.method.refresh"
        >
          <template #icon><icon-refresh /></template>
        </a-button>

        <a-trigger trigger="click" show-arrow :popup-translate="[-60, 10]">
          <a-button
            size="mini"
            type="dashed"
            style="width: 50px"
            :disabled="
              crud.options.tableInfo.isEdit ||
              !props.enabledTabHeadSet ||
              disableAll
            "
          >
            <template #icon><icon-list /></template>
          </a-button>
          <template #content>
            <div
              style="
                width: 150px;
                padding: 15px 10px;
                background-color: var(--color-bg-1);
                box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
              "
            >
              <a-space direction="vertical">
                <a-checkbox
                  v-for="col in columns"
                  :key="col.dataIndex"
                  v-model="col.display"
                >
                  {{ col.title }}
                </a-checkbox>
              </a-space>
            </div>
          </template>
        </a-trigger>

        <a-trigger trigger="click" show-arrow :popup-translate="[-60, 10]">
          <a-button
            size="mini"
            type="dashed"
            style="width: 50px"
            :disabled="
              crud.options.tableInfo.isEdit ||
              !props.enabledSettings ||
              disableAll
            "
          >
            <template #icon><icon-settings /></template>
          </a-button>
          <template #content>
            <div
              style="
                width: 150px;
                padding: 15px 10px;
                background-color: var(--color-bg-1);
                box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
              "
            >
              <a-space direction="vertical">
                <a-checkbox
                  v-for="(bool, index) in crud.options.tableInfo
                    .componentConfig"
                  :key="index"
                  v-model="crud.options.tableInfo.componentConfig[index]"
                >
                  {{ $t('crud.table.config.' + index) }}
                </a-checkbox>
              </a-space>
            </div></template
          >
        </a-trigger>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { CrudStatus, CRUD } from '@/components/crud/CRUD';
  import { inject, ref, reactive, getCurrentInstance, computed } from 'vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import axios from 'axios';
  import { TableData } from '@arco-design/web-vue/es/table/interface';

  const crud = inject('crud') as CRUD<any>;
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  const props = withDefaults(
    defineProps<{
      showAdd?: boolean;
      showEdit?: boolean;
      showDel?: boolean;
      showDownload?: boolean;
      enabledAdd?: boolean;
      enabledEdit?: boolean;
      enabledDel?: boolean;
      enabledDownload?: boolean;
      enabledRefresh?: boolean;
      enabledTabHeadSet?: boolean;
      enabledSettings?: boolean;
      disableAll?: boolean;
      addPermission?: string[];
      editPermission?: string[];
      delPermission?: string[];
      downloadPermission?: string[];
    }>(),
    {
      showAdd: true,
      showEdit: true,
      showDel: true,
      showDownload: true,
      enabledAdd: true,
      enabledEdit: true,
      enabledDel: true,
      enabledDownload: true,
      enabledRefresh: true,
      enabledTabHeadSet: true,
      enabledSettings: true,
      disableAll: false,
      addPermission: () => ['admin'],
      editPermission: () => ['admin'],
      delPermission: () => ['admin'],
      downloadPermission: () => ['admin'],
    }
  );
  /*
  * 'addPermission',
    'editPermission',
    'delPermission',
    'downloadPermission',
  * */

  // 不显示修改结果列result
  const columns = computed(() => {
    return crud.options.tableInfo.columns?.filter((t) => {
      return !t.ignoreSwitch;
    });
  });

  // region    ↓-------------------------------- add表单 --------------------------------↓
  const addVisible = ref(false);
  const addForm = ref(null);
  const rootDiv = ref(null);

  // 暴露addForm的显示属性
  defineExpose({ addVisible });
  const handleBeforeOpen = () => {
    if (!crud.hook.beforeOpenAdd()) {
      addVisible.value = false;
    }
  };

  const handleBeforeOk = async (done: any) => {
    let validate = false;
    await (addForm.value as any).validate(
      (errors: undefined | Record<string, ValidatedError>) => {
        if (!errors) validate = true;
      }
    );
    if (validate) {
      // 发送请求添加
      await crud.method.add();
      if (crud.options.props.addForm.success) {
        global.$notification.success('添加成功');
        done();
      } else {
        global.$notification.warning(
          `添加失败:${crud.options.props.addForm.reason}`
        );
        done(false);
      }
    } else {
      done(false);
    }
  };

  const handleCancel = () => {
    crud.update.setForm({});
    addVisible.value = false;
  };
  // endregion ↑-------------------------------- add表单 --------------------------------↑
  // region    ↓-------------------------------- edit表单 --------------------------------↓

  // 点击修改触发
  const editClick = async () => {
    const canEdit = await crud.hook.beforeOpenEdit();
    if (!canEdit) {
      return;
    }
    // 显示数据操作结果列
    crud.update.displayColRes(true);
    // 准备好form容器
    crud.update.setForm({});
    // 让选择的表格列可以编辑,要修改的id进行标注

    crud.update.turnToEditable(crud.options.tableInfo.data as any[]);
    // 准备好保存修改成功列的id数组
    crud.options.props.formUpdateSuccessIds = [];
    // 编辑状态
    crud.update.setTableIsEdit(true);
    // 禁止继续选择列
    crud.update.appendTableConfig({ checkbox: false });

    crud.hook.afterOpenEdit();
  };
  // 取消修改
  const cancelEdit = () => {
    crud.update.setTableIsEdit(false);
    crud.update.turnToUnEditable(crud.options.tableInfo.data as any[]);
    crud.update.setTableSelectKeys([]);
    crud.update.appendTableConfig({ checkbox: true });
    crud.update.setForm({});
    delete crud.options.props.formUpdateSuccessIds;
    // 取消结果列显示
    crud.update.displayColRes(false);
    crud.method.refresh();
  };

  // 点击确认修改触发
  const confirmEdit = () => {
    crud.update.setStatus(CrudStatus.NEED_UPDATE);
  };
  // endregion ↑-------------------------------- edit表单 --------------------------------↑
  // region    ↓-------------------------------- 下载 --------------------------------↓
  const download = () => {
    crud.update.setStatus(CrudStatus.NEED_DOWNLOAD);
  };
  // endregion ↑-------------------------------- 下载 --------------------------------↑
</script>

<style scoped></style>
