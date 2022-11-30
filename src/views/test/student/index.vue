<template>
  <div class="container">
    <div class="panel">
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
                  <!--学生姓名搜索框-->
                  <a-col :span="8">
                    <a-form-item field="name" label="学生姓名">
                      <a-input
                        v-model="crud.options.query.name"
                        placeholder="输入学生姓名搜索"
                      >
                        <template #prefix> Like </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <!--水果搜索框-->
                  <a-col :span="8">
                    <a-form-item field="likeFood" label="水果">
                      <a-select
                        v-model="crud.options.query.likeFood"
                        placeholder="输入水果搜索"
                        multiple
                      >
                        <a-option
                          v-for="s in dict.furit"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--班级名搜索框-->
                  <a-col :span="8">
                    <a-form-item field="clazzName" label="班级名">
                      <a-select
                        v-model="crud.options.query.clazzName"
                        placeholder="输入班级名搜索"
                      >
                        <a-option
                          v-for="s in dict.test_clazz"
                          :key="s.detailId"
                          :value="s.label"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--性别搜索框-->
                  <a-col :span="8">
                    <a-form-item field="gender" label="性别">
                      <a-select
                        v-model="crud.options.query.gender"
                        placeholder="输入性别搜索"
                      >
                        <a-option
                          v-for="s in dict.gender"
                          :key="s.detailId"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!--综合评分搜索框-->
                  <a-col :span="8">
                    <a-form-item field="avgScore" label="综合评分">
                      <a-input-group>
                        <a-input
                          v-model="crud.options.query.startAvgScore"
                          placeholder="综合评分"
                        >
                          <template #prefix>[</template>
                          <template #suffix>,</template>
                        </a-input>
                        <a-input
                          v-model="crud.options.query.endAvgScore"
                          placeholder="综合评分"
                        >
                          <template #suffix>]</template>
                        </a-input>
                      </a-input-group>
                    </a-form-item>
                  </a-col>
                  <!--更新时间搜索框-->
                  <a-col :span="8">
                    <a-form-item field="updateTime" label="更新时间">
                      <a-date-picker
                        v-model="crud.options.query.updateTime"
                        placeholder="检索方式: NotNull"
                        show-time
                        format="YYYY-MM-DD HH:mm:ss"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                  <!--账号过期时间搜索框-->
                  <a-col :span="8">
                    <a-form-item field="expireTime" label="账号过期时间">
                      <a-date-picker
                        v-model="crud.options.query.expireTime"
                        placeholder="检索方式: >="
                        show-time
                        format="YYYY-MM-DD HH:mm:ss"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-scrollbar>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <a-space size="medium" direction="vertical">
              <a-button
                status="success"
                long
                :disabled="crud.options.tableInfo.isEdit"
                @click="crud.method.refresh"
              >
                <template #icon> <icon-search /> </template
                >{{ $t('crud.search') }}</a-button
              ><a-button
                status="warning"
                :disabled="crud.options.tableInfo.isEdit"
                @click="crud.update.resetParams"
              >
                <template #icon> <icon-refresh /> </template>
                {{ $t('crud.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider style="margin-top: 0" />
        <CrudOperation
          :add-permission="['testStudent:list']"
          :edit-permission="['testStudent:edit']"
          :del-permission="['testStudent:del']"
          :download-permission="['testStudent:list']"
          style="margin-bottom: 12px"
        >
          <template #addForm>
            <a-row :gutter="12">
              <!--学生姓名-->
              <a-col :span="12">
                <a-form-item
                  field="name"
                  label="学生姓名"
                  :rules="[{ required: true, message: '学生姓名不能为空' }]"
                >
                  <a-input v-model="crud.options.form.name" />
                </a-form-item>
              </a-col>
              <!--水果-->
              <a-col :span="12">
                <a-form-item
                  field="likeFood"
                  label="水果"
                  :rules="[{ required: true, message: '水果不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.likeFood"
                    placeholder="请选择"
                    multiple
                  >
                    <a-option
                      v-for="s in dict.furit"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--年龄-->
              <a-col :span="12">
                <a-form-item
                  field="age"
                  label="年龄"
                  :rules="[{ required: true, message: '年龄不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.age" />
                </a-form-item>
              </a-col>
              <!--班级名-->
              <a-col :span="12">
                <a-form-item
                  field="clazzName"
                  label="班级名"
                  :rules="[{ required: true, message: '班级名不能为空' }]"
                >
                  <a-select
                    v-model="crud.options.form.clazzName"
                    placeholder="请选择"
                  >
                    <a-option
                      v-for="s in dict.test_clazz"
                      :key="s.detailId"
                      :value="s.label"
                      >{{ s.label }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <!--性别-->
              <a-col :span="12">
                <a-form-item
                  field="gender"
                  label="性别"
                  :rules="[{ required: true, message: '性别不能为空' }]"
                >
                  <a-radio-group
                    v-model="crud.options.form.gender"
                    type="button"
                  >
                    <a-radio
                      v-for="s in dict.gender"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-radio
                    >
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <!--综合评分-->
              <a-col :span="12">
                <a-form-item
                  field="avgScore"
                  label="综合评分"
                  :rules="[{ required: true, message: '综合评分不能为空' }]"
                >
                  <a-input-number v-model="crud.options.form.avgScore" />
                </a-form-item>
              </a-col>
              <!--状态-->
              <a-col :span="12">
                <a-form-item
                  field="enabled"
                  label="状态"
                  :rules="[{ required: true, message: '状态不能为空' }]"
                >
                  <a-radio-group v-model="crud.options.form.enabled">
                    <a-radio
                      v-for="s in dict.user_status"
                      :key="s.detailId"
                      :value="s.value"
                      >{{ s.label }}</a-radio
                    >
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <!--账号过期时间-->
              <a-col :span="12">
                <a-form-item
                  field="expireTime"
                  label="账号过期时间"
                  :rules="[{ required: true, message: '账号过期时间不能为空' }]"
                >
                  <a-date-picker
                    v-model="crud.options.form.expireTime"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
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

          <!--学生姓名-->
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

          <!--水果-->
          <template #likeFood="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              <a-space v-show="!crud.options.form[record.id]">
                <a-tag
                  v-for="(d, index) in record.likeFood"
                  :key="index"
                  bordered
                >
                  {{ d }}
                </a-tag>
              </a-space>
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <a-space v-show="!crud.options.form[record.id]">
                <a-tag
                  v-for="(d, index) in record.likeFood"
                  :key="index"
                  bordered
                >
                  {{ d }}
                </a-tag>
              </a-space>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                <a-select
                  v-model="crud.options.form[record.id].likeFood"
                  :default-value="record.likeFood"
                  multiple
                  :disabled="true"
                >
                  <a-option
                    v-for="(di, index) in dict.furit"
                    :key="index"
                    :value="di.label"
                    >{{ di.label }}
                  </a-option>
                </a-select>
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].likeFood"
                :default-value="record.likeFood"
                multiple
              >
                <a-option
                  v-for="(di, index) in dict.furit"
                  :key="index"
                  :value="di.label"
                  >{{ di.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--年龄-->
          <template #age="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.age }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.age }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].age
                    ? crud.options.form[record.id].age
                    : record.age
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].age"
                :default-value="record.age"
              />
            </div>
          </template>

          <!--班级名-->
          <template #clazzName="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.clazzName }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.clazzName }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].clazzName
                    ? crud.options.form[record.id].clazzName
                    : record.clazzName
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].clazzName"
                :default-value="record.clazzName"
              >
                <a-option
                  v-for="s in dict.test_clazz"
                  :key="s.detailId"
                  :value="s.label"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--性别-->
          <template #gender="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ dict.gender ? (dict.gender.filter((di: any) => di.value === (record.gender ? '1' : '0') || di.value === (record.gender + '')))[0].label : ''}}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ dict.gender ? (dict.gender.filter((di: any) => di.value === (record.gender ? '1' : '0') || di.value === (record.gender + '')))[0].label : '' }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].gender
                   ? dict.gender ? (dict.gender.filter((di: any) => di.value === (crud.options.form[record.id].gender ? '1' : '0') || di.value === (record.gender + '')))[0].label : ''
                   : dict.gender ? (dict.gender.filter((di: any) => di.value === (record.gender ? '1' : '0') || di.value === (record.gender + '')))[0].label : ''
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-select
                v-model="crud.options.form[record.id].gender"
                :default-value="record.gender ? '1' : '0'"
              >
                <a-option
                  v-for="s in dict.gender.map((di) => {
                    if (di.value === 'true') di.value = '1';
                    if (di.value === 'false') di.value = '0';
                    return di;
                  })"
                  :key="s.detailId"
                  :value="s.value"
                  >{{ s.label }}
                </a-option>
              </a-select>
            </div>
          </template>

          <!--综合评分-->
          <template #avgScore="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.avgScore }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.avgScore }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].avgScore
                    ? crud.options.form[record.id].avgScore
                    : record.avgScore
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-input-number
                v-model="crud.options.form[record.id].avgScore"
                :default-value="record.avgScore"
              />
            </div>
          </template>

          <!--状态-->
          <template #enabled="{ record }">
            <div>
              <a-switch
                v-model="record.enabled"
                :loading="enabled.loading.value"
                @change="enableEnabledChange(record)"
              >
                <template #checked>{{
                  dict.user_status
                    ? dict.user_status.filter(
                        (di) => di.value === '1' || di.value === 'true'
                      )[0].label
                    : ''
                }}</template>
                <template #unchecked>{{
                  dict.user_status
                    ? dict.user_status.filter(
                        (di) => di.value === '0' || di.value === 'false'
                      )[0].label
                    : ''
                }}</template>
              </a-switch>
            </div>
          </template>

          <!--账号过期时间-->
          <template #expireTime="{ record }">
            <!--正常情况下-->
            <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
              {{ record.expireTime }}
            </div>

            <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
            <div v-if="!record.editable && crud.options.tableInfo.isEdit">
              <!--未修改的行-->
              <div v-show="!crud.options.form[record.id]">
                {{ record.expireTime }}
              </div>
              <!--修改完毕提交后-->
              <div v-if="crud.options.form[record.id]">
                {{
                  crud.options.form[record.id].expireTime
                    ? crud.options.form[record.id].expireTime
                    : record.expireTime
                }}
              </div>
            </div>

            <!--修改情况下-->
            <div v-if="record.editable">
              <a-date-picker
                v-model="crud.options.form[record.id].expireTime"
                show-time
                :default-value="record.expireTime"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
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
  import { TestStudent } from '@/api/test/student';
  import { computed, getCurrentInstance, onMounted, provide, ref } from 'vue';
  import { useDict } from '@/components/dict';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import RROperation from '@/components/crud/RROperation.vue';
  import Pagination from '@/components/crud/Pagination.vue';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const crud = useCrud<TestStudent>({
    tag: '学生',
    url: '/test/student',
    title: 'test.student',
    tableInfo: {
      componentConfig: {
        stripe: false,
      },
    },
  });
  provide('crud', crud);

  const parseToArray = (str: string): string[] => {
    const s = str
      .replace('[', '')
      .replace(']', '')
      .split(/[,，] /);
    const res: string[] = [];
    for (let i = 0; i < s.length; i += 1) {
      res.push(s[i]);
    }
    return res;
  };

  // 字典
  const dict = useDict('furit', 'test_clazz', 'gender', 'user_status');
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 设置学生 columns信息
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
      title: '学生姓名',
      dataIndex: 'name',
      width: 150,
      display: true,
      slotName: 'name',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '水果',
      dataIndex: 'likeFood',
      width: 150,
      display: true,
      slotName: 'likeFood',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 150,
      display: true,
      slotName: 'age',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '班级名',
      dataIndex: 'clazzName',
      width: 150,
      display: true,
      slotName: 'clazzName',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 150,
      display: true,
      slotName: 'gender',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '综合评分',
      dataIndex: 'avgScore',
      width: 150,
      display: true,
      slotName: 'avgScore',
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
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      display: true,
      slotName: 'enabled',
      tooltip: true,
      ellipsis: true,
    },
    {
      title: '账号过期时间',
      dataIndex: 'expireTime',
      width: 180,
      display: true,
      slotName: 'expireTime',
      tooltip: true,
      ellipsis: true,
    },
  ]);
  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  // region    ↓-------------------------------- switch --------------------------------↓
  // 状态loading
  const enabled = useLoading();
  // 状态状态改变
  const enableEnabledChange = async (record: any) => {
    enabled.toggle();
    const data = (await axios.put(crud.options.url, [
      { id: record.id, enabled: record.enabled },
    ])) as any;
    if (data.code === 20000) {
      global.$notification.success('更改成功');
    } else {
      global.$notification.warning(`更改失败:${data.msg}`);
      record.enabled = !record.enabled;
    }
    enabled.toggle();
  };

  // endregion ↑-------------------------------- switch --------------------------------↑

  // region    ↓-------------------------------- rangePicker --------------------------------↓

  // endregion ↑-------------------------------- rangePicker --------------------------------↑

  // region    ↓-------------------------------- 钩子 --------------------------------↓
  onMounted(() => {
    crud.method.refresh();
  });

  crud.hook.afterRefresh = () => {
    for (let i = 0; i < (crud.options.tableInfo as any).data.length; i += 1) {
      (crud.options.tableInfo as any).data[i].likeFood = parseToArray(
        (crud.options.tableInfo as any).data[i].likeFood
      );
    }
    if (crud.options.query.likeFood) {
      crud.options.query.likeFood = parseToArray(crud.options.query.likeFood);
    }
  };

  crud.hook.beforeRefresh = () => {
    if (crud.options.query.likeFood) {
      let newStr = '';
      for (let i = 0; i < crud.options.query.likeFood.length; i += 1) {
        newStr += crud.options.query.likeFood[i];
        if (i !== crud.options.query.likeFood.length - 1) newStr += ', ';
      }
      crud.options.query.likeFood = newStr;
    }

    return true;
  };

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
