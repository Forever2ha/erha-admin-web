<template>
  <div class="container">
    <div class="panel">
      <a-row :gutter="14" style="height: 100%">
        <!--左侧部门树控件-->
        <a-col
          :xs="24"
          :sm="8"
          :md="8"
          :lg="8"
          :xl="5"
          :xxl="5"
          style="height: 100%"
        >
          <a-input-search
            v-model="searchKey"
            style="margin-bottom: 8px"
            :placeholder="$t('system.user.searchDept')"
          />
          <a-tree
            v-show="!crud.options.tableInfo.isEdit"
            :data="treeData"
            show-line
            @select="treeSelect"
          >
            <template #title="nodeData">
              <template
                v-if="((index = getMatchIndex(nodeData?.title)), index < 0)"
                >{{ nodeData?.title }}</template
              >
              <span v-else>
                {{ nodeData?.title?.substr(0, index) }}
                <span style="color: var(--color-primary-light-4)">
                  {{ nodeData?.title?.substr(index, searchKey.length) }} </span
                >{{ nodeData?.title?.substr(index + searchKey.length) }}
              </span>
            </template>
          </a-tree>
          <a-alert v-show="crud.options.tableInfo.isEdit"
            >你正在修改数据,无法选择部门</a-alert
          >
        </a-col>
        <!--右侧用户表格-->
        <a-col
          style="position: relative; height: 100%; padding-left: 10px"
          :xs="24"
          :sm="16"
          :md="16"
          :lg="16"
          :xl="19"
          :xxl="19"
        >
          <!--搜索条件栏-->
          <a-row class="grid-demo" :gutter="24" style="margin-bottom: 12px">
            <a-col :xs="24" :sm="16" :md="13" :lg="8" :xl="7" :xxl="7">
              <a-input
                v-model="crud.options.query.name"
                v-size-change="change"
                :placeholder="$t('system.user.searchNameOrEmail')"
              >
              </a-input>
            </a-col>
            <a-col :xs="24" :sm="16" :md="13" :lg="8" :xl="7" :xxl="7">
              <a-range-picker
                v-model="pickerValue"
                :style="{ width: rangePickerWidth }"
                @change="rangePickerChange"
              />
            </a-col>
            <a-col :xs="7" :sm="6" :md="5" :lg="4" :xl="3" :xxl="3">
              <a-select
                v-model="crud.options.query.userStatus"
                :placeholder="$t('system.user.status')"
              >
                <a-option
                  v-for="s in dict.user_status"
                  :key="s.detailId"
                  :value="s.value"
                >
                  {{
                    s.value == 'true'
                      ? $t('system.user.status.activate')
                      : $t('system.user.status.lock')
                  }}
                </a-option>
              </a-select>
            </a-col>
            <a-col :xs="15" :sm="8" :md="7" :lg="6" :xl="5" :xxl="5">
              <rr-operation />
            </a-col>
          </a-row>

          <!--增删改查组件-->
          <crud-operation
            :add-permission="['user:add']"
            :edit-permission="['user:edit']"
            :del-permission="['user:del']"
            :download-permission="['user:list']"
            style="margin-bottom: 12px"
          >
            <!--添加用户表单项-->
            <template #addForm>
              <a-row>
                <a-col :span="12">
                  <a-form-item
                    field="username"
                    :label="$t('system.user.table.username')"
                    :rules="[
                      { required: true, message: '用户名不能为空' },
                      {
                        minLength: 2,
                        maxLength: 20,
                        message: '长度在2-20之间',
                      },
                    ]"
                  >
                    <a-input v-model="crud.options.form.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    field="phone"
                    :label="$t('system.user.table.phone')"
                    :rules="[
                      { required: true, message: '电话不能为空' },
                      {
                        match: /1[3-9][0-9]{9}/,
                        message: '请输入正确的电话号码',
                      },
                    ]"
                  >
                    <a-input v-model="crud.options.form.phone" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-item
                    field="nickName"
                    :label="$t('system.user.table.nickName')"
                    :rules="[
                      { required: true, message: '昵称不能为空' },
                      {
                        minLength: 2,
                        maxLength: 20,
                        message: '长度在2-20之间',
                      },
                    ]"
                  >
                    <a-input v-model="crud.options.form.nickName" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    field="email"
                    :label="$t('system.user.table.email')"
                    :rules="[
                      { required: true, message: '邮箱不能为空' },
                      {
                        match:
                          /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: '请输入正确的邮箱地址',
                      },
                    ]"
                  >
                    <a-input v-model="crud.options.form.email" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-item
                    field="deptId"
                    label="部门"
                    :rules="[{ required: true, message: '部门不能为空' }]"
                  >
                    <a-tree-select
                      v-model="crud.options.form.deptId"
                      :data="crud.options.props.deptTreeData"
                      placeholder="请选择部门"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    field="jobIds"
                    :label="$t('system.user.table.jobs')"
                    :rules="[{ required: true, message: '职位不能为空' }]"
                  >
                    <a-select
                      v-model="crud.options.form.jobIds"
                      placeholder="请选择职位"
                      multiple
                    >
                      <a-option
                        v-for="job in crud.options.props.jobList"
                        :key="job.jobId"
                        :value="job.jobId"
                        :tag-props="{ color: 'cyan' }"
                      >
                        {{ job.name }}
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-item
                    field="gender"
                    :label="$t('system.user.table.gender')"
                    :rules="[{ required: true, message: '性别不能为空' }]"
                  >
                    <a-radio-group v-model="crud.options.form.gender">
                      <a-radio value="男">男</a-radio>
                      <a-radio value="女">女</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    field="enabled"
                    :label="$t('system.user.table.enabled')"
                    :rules="[{ required: true, message: '状态不能为空' }]"
                  >
                    <a-radio-group v-model="crud.options.form.enabled">
                      <a-radio value="true">{{
                        $t('system.user.status.activate')
                      }}</a-radio>
                      <a-radio value="false">{{
                        $t('system.user.status.lock')
                      }}</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-item
                    field="roleIds"
                    :label="$t('system.user.table.roles')"
                    :rules="[{ required: true, message: '角色不能为空' }]"
                  >
                    <a-select
                      v-model="crud.options.form.roleIds"
                      placeholder="请选择角色"
                      multiple
                    >
                      <a-option
                        v-for="role in crud.options.props.roleList"
                        :key="role.roleId"
                        :value="role.roleId"
                        :tag-props="{ color: 'pinkpurple' }"
                        >{{ role.name }}</a-option
                      >
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </template>
          </crud-operation>
          <!--表格主体-->
          <a-table
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
                            [{{
                              $t(
                                `${crud.options.title}.table.${err.errorField}`
                              )
                            }}]
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

            <!--昵称-->
            <template #nickName="{ record, rowIndex }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ record.nickName }}
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <div v-show="!crud.options.form[record.id]">
                  {{ record.nickName }}
                </div>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  {{
                    crud.options.form[record.id].nickName
                      ? crud.options.form[record.id].nickName
                      : record.nickName
                  }}
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <a-input
                  v-model="crud.options.form[record.id].nickName"
                  :default-value="
                    crud.options.tableInfo.data[rowIndex].nickName
                  "
                ></a-input>
              </div>
            </template>

            <!--性别-->
            <template #gender="{ record, rowIndex }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ record.gender }}
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <div v-show="!crud.options.form[record.id]">
                  {{ record.gender }}
                </div>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  {{
                    crud.options.form[record.id].gender
                      ? crud.options.form[record.id].gender
                      : record.gender
                  }}
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <a-select
                  v-model="crud.options.form[record.id].gender"
                  :default-value="crud.options.tableInfo.data[rowIndex].gender"
                >
                  <a-option>男</a-option>
                  <a-option>女</a-option>
                </a-select>
              </div>
            </template>
            <!--电话-->
            <template #phone="{ record, rowIndex }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ record.phone }}
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <div v-show="!crud.options.form[record.id]">
                  {{ record.phone }}
                </div>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  {{
                    crud.options.form[record.id].phone
                      ? crud.options.form[record.id].phone
                      : record.phone
                  }}
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <a-input
                  v-model="crud.options.form[record.id].phone"
                  :default-value="crud.options.tableInfo.data[rowIndex].phone"
                ></a-input>
              </div>
            </template>

            <!--邮箱-->
            <template #email="{ record, rowIndex }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                {{ record.email }}
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <div v-show="!crud.options.form[record.id]">
                  {{ record.email }}
                </div>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  {{
                    crud.options.form[record.id].email
                      ? crud.options.form[record.id].email
                      : record.email
                  }}
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <a-input
                  v-model="crud.options.form[record.id].email"
                  :default-value="crud.options.tableInfo.data[rowIndex].email"
                ></a-input>
              </div>
            </template>

            <!--岗位-->
            <template #jobs="{ record }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                <a-space>
                  <a-tag
                    v-for="job in record.jobs"
                    :key="job.id"
                    color="cyan"
                    bordered
                  >
                    {{ job.name }}
                  </a-tag>
                </a-space>
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <a-space v-show="!crud.options.form[record.id]">
                  <a-tag
                    v-for="job in record.jobs"
                    :key="job.id"
                    color="cyan"
                    bordered
                  >
                    {{ job.name }}
                  </a-tag>
                </a-space>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  <a-select
                    v-model="crud.options.form[record.id].jobIds"
                    :default-value="record.jobs.map((v) => v.id)"
                    placeholder="请选择职位"
                    multiple
                    :disabled="true"
                  >
                    <a-option
                      v-for="job in crud.options.props.jobList"
                      :key="job.jobId"
                      :value="job.jobId"
                      :tag-props="{ color: 'cyan' }"
                      >{{ job.name }}
                    </a-option>
                  </a-select>
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <a-select
                  v-model="crud.options.form[record.id].jobIds"
                  :default-value="record.jobs.map((v) => v.id)"
                  placeholder="请选择职位"
                  multiple
                >
                  <a-option
                    v-for="job in crud.options.props.jobList"
                    :key="job.jobId"
                    :value="job.jobId"
                    :tag-props="{ color: 'cyan' }"
                    >{{ job.name }}
                  </a-option>
                </a-select>
              </div>
            </template>

            <!--角色-->
            <template #roles="{ record }">
              <!--正常情况下-->
              <div v-show="!record.editable && !crud.options.tableInfo.isEdit">
                <a-space>
                  <a-tag
                    v-for="role in record.roles"
                    :key="role.id"
                    color="pinkpurple"
                    bordered
                  >
                    {{ role.id }} {{ role.name }}
                  </a-tag>
                </a-space>
              </div>
              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <a-space v-show="!crud.options.form[record.id]">
                  <a-tag
                    v-for="role in record.roles"
                    :key="role.id"
                    color="pinkpurple"
                    bordered
                  >
                    {{ role.name }}
                  </a-tag>
                </a-space>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  <a-select
                    v-model="crud.options.form[record.id].roleIds"
                    :default-value="record.roles.map((v) => v.id)"
                    placeholder="请选择职位"
                    multiple
                    :disabled="true"
                  >
                    <a-option
                      v-for="role in crud.options.props.roleList"
                      :key="role.roleId"
                      :value="role.roleId"
                      :tag-props="{ color: 'pinkpurple' }"
                      >{{ role.name }}
                    </a-option>
                  </a-select>
                </div>
              </div>
              <!--修改情况下-->
              <div v-if="record.editable">
                <a-select
                  v-model="crud.options.form[record.id].roleIds"
                  :default-value="record.roles.map((v) => v.id)"
                  placeholder="请选择角色"
                  multiple
                >
                  <a-option
                    v-for="role in crud.options.props.roleList"
                    :key="role.roleId"
                    :value="role.roleId"
                    :tag-props="{ color: 'pinkpurple' }"
                    >{{ role.name }}
                  </a-option>
                </a-select>
              </div>
            </template>

            <template #deptName="{ record }">
              <!--正常情况下-->
              <div v-if="!record.editable && !crud.options.tableInfo.isEdit">
                {{ record.deptName }}
              </div>

              <!--修改完毕提交后/未修改的行(若修改全部成功则不会显示)-->
              <div v-if="!record.editable && crud.options.tableInfo.isEdit">
                <!--未修改的行-->
                <div v-show="!crud.options.form[record.id]">
                  {{ record.deptName }}
                </div>
                <!--修改完毕提交后-->
                <div v-if="crud.options.form[record.id]">
                  <a-tree-select
                    v-model="crud.options.form[record.id].deptId"
                    :data="crud.options.props.deptTreeData"
                    :default-value="record.deptName"
                    :disabled="true"
                  />
                </div>
              </div>

              <!--修改情况下-->
              <div v-if="record.editable">
                <a-tree-select
                  v-model="crud.options.form[record.id].deptId"
                  :data="crud.options.props.deptTreeData"
                  :default-value="record.deptName"
                />
              </div>
            </template>

            <!--状态-->
            <template #enabled="{ record }">
              <div>
                <a-switch
                  v-model="record.enabled"
                  :loading="loading"
                  @change="enableChange(record)"
                >
                  <template #checked> 启用 </template>
                  <template #unchecked> 禁用 </template>
                </a-switch>
              </div>
            </template>
          </a-table>
          <Pagination
            style="position: absolute; right: 0; bottom: 0; padding-right: 7px"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    getCurrentInstance,
    nextTick,
    onMounted,
    provide,
    reactive,
    ref,
  } from 'vue';
  import { getDeptListTree } from '@/api/system/department';
  import { getJobList } from '@/api/system/job';
  import RrOperation from '@/components/crud/RROperation.vue';
  import CrudOperation from '@/components/crud/CrudOperation.vue';
  import { useDict } from '@/components/dict';
  import { CrudStatus, useCrud } from '@/components/crud/CRUD';
  import { user } from '@/store/modules/user/types';
  import { useI18n } from 'vue-i18n';
  import Pagination from '@/components/crud/Pagination.vue';
  import { getRoleList, Role } from '@/api/system/role';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import axios from 'axios';

  // 字典
  const dict = useDict('user_status');
  // 国际化
  const { t } = useI18n();
  // userStore
  const userStore = useUserStore();
  // crud组件
  const crud = useCrud<user>({
    tag: '用户',
    url: '/user',
    title: 'system.user',
  });
  provide('crud', crud);
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;
  // region    ↓-------------------------------- crud --------------------------------↓

  const { loading, toggle } = useLoading();
  crud.hook.beforeOpenAdd = () => {
    // 查部门列表树
    getDeptListTree().then(({ data }) => {
      crud.options.props.deptTreeData = data;
    });
    // 查岗位
    getJobList().then(({ data }) => {
      crud.options.props.jobList = data;
    });
    // 查角色信息
    getRoleList().then(({ data }) => {
      // 过滤权限level高于自己的role
      // 查出自己的level先
      const nowRole = userStore.userInfo.roles?.filter(
        (role) => role.name === userStore.nowRole
      );
      crud.options.props.roleList = data.list.filter(
        (role) => (nowRole as any)[0].level <= role.level
      ) as Role[];
    });
    return true;
  };
  crud.hook.beforeOpenEdit = async () => {
    // 查岗位
    getJobList().then(({ data }) => {
      crud.options.props.jobList = data;
    });
    // 查角色信息
    getRoleList().then(({ data }) => {
      // 过滤权限level高于自己的role
      // 查出自己的level先
      const nowRole = userStore.userInfo.roles?.filter(
        (role) => role.name === userStore.nowRole
      );
      crud.options.props.roleList = data.list.filter(
        (role) => (nowRole as any)[0].level <= role.level
      );
    });

    // 查部门列表树
    getDeptListTree().then(({ data }) => {
      crud.options.props.deptTreeData = data;
    });
    return true;
  };
  // 用户状态改变
  const enableChange = async (record: any) => {
    toggle();
    const data = (await axios.put(crud.options.url, [
      { id: record.id, enabled: record.enabled },
    ])) as any;
    if (data.code === 20000) {
      global.$notification.success('更改成功');
    } else {
      global.$notification.warning(`更改失败:${data.msg}`);
      record.enabled = !record.enabled;
    }
    toggle();
  };

  // endregion ↑-------------------------------- crud --------------------------------↑

  // region    ↓-------------------------------- 左侧部门 --------------------------------↓
  const originTreeData = ref([]);
  const searchKey = ref('');
  function searchData(keyword: string) {
    const loop = (data: any) => {
      const result: any[] = [];
      data.forEach((item: any) => {
        if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          result.push({ ...item });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({
              ...item,
              children: filterData,
            });
          }
        }
      });
      return result;
    };

    return loop(originTreeData.value);
  }
  function getMatchIndex(title: any) {
    if (!searchKey.value) return -1;
    return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
  }
  const treeData = computed(() => {
    if (!searchKey.value) return originTreeData.value;
    return searchData(searchKey.value);
  });

  async function getDept() {
    const response = await getDeptListTree();
    originTreeData.value = response.data as any;
  }
  function treeSelect(selectedKeys: Array<string | number>, data: any) {
    crud.update.appendQueryParams({ deptIds: selectedKeys[0] });
    crud.update.setStatus(CrudStatus.NEED_REFRESH);
    crud.update.setTableSelectKeys([]);
  }
  // endregion ↑-------------------------------- 左侧部门 --------------------------------↑

  // region    ↓-------------------------------- 右侧用户信息 --------------------------------↓

  // 解决重置params rangerPicker不清除数据的问题
  const pickerValue = ref([]);
  crud.hook.afterResetParams = () => {
    pickerValue.value = [];
  };

  // 解决rangePicker长度不充满容器的bug
  const rangePickerWidth = ref('');
  function change(obj: any) {
    rangePickerWidth.value = obj.width;
  }
  // rangePicker的值改变
  function rangePickerChange(data: any) {
    crud.update.appendQueryParams({
      startCreateTime: `${data[0]} 00:00:00`,
      endCreateTime: `${data[1]} 00:00:00`,
    });
  }
  // 设置表格user columns信息
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
      title: t('system.user.table.username'),
      dataIndex: 'username',
      width: 90,
      display: true,
    },
    {
      title: t('system.user.table.nickName'),
      dataIndex: 'nickName',
      width: 150,
      display: true,
      slotName: 'nickName',
    },
    {
      title: t('system.user.table.gender'),
      dataIndex: 'gender',
      width: 100,
      display: true,
      slotName: 'gender',
    },
    {
      title: t('system.user.table.phone'),
      dataIndex: 'phone',
      width: 150,
      display: true,
      slotName: 'phone',
    },
    {
      title: t('system.user.table.email'),
      dataIndex: 'email',
      width: 180,
      display: true,
      slotName: 'email',
    },
    {
      dataIndex: 'jobs',
      title: t('system.user.table.jobs'),
      width: 200,
      display: true,
      slotName: 'jobs',
    },
    {
      dataIndex: 'roles',
      title: t('system.user.table.roles'),
      width: 200,
      display: true,
      slotName: 'roles',
    },
    {
      dataIndex: 'nowRoleId',
      title: t('system.user.table.nowRoleId'),
      width: 150,
      display: true,
    },
    {
      title: t('system.user.table.deptName'),
      dataIndex: 'deptName',
      width: 150,
      display: true,
      slotName: 'deptName',
    },
    {
      title: t('system.user.table.enabled'),
      dataIndex: 'enabled',
      width: 90,
      slotName: 'enabled',
      display: true,
    },
    {
      title: t('system.user.table.createTime'),
      dataIndex: 'createTime',
      width: 180,
      display: true,
    },
    {
      dataIndex: 'createBy',
      title: t('system.user.table.createBy'),
      width: 110,
      display: true,
    },
    {
      dataIndex: 'updateTime',
      title: t('system.user.table.updateTime'),
      width: 180,
      display: true,
    },
    {
      dataIndex: 'updateBy',
      title: t('system.user.table.updateBy'),
      width: 110,
      display: true,
    },
  ]);

  const tableColumns = computed(() => {
    return crud.options.tableInfo.columns?.filter((val) => val.display);
  });

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });
  // endregion ↑-------------------------------- 右侧用户信息 --------------------------------↑

  onMounted(() => {
    getDept();
    crud.method.refresh();
  });
</script>

<script lang="ts">
  export default {
    name: 'User',
  };
</script>

<style scoped lang="less">
  .container {
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
