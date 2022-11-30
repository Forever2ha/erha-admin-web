<template>
  <a-row :gutter="24" style="height: 100%">
    <a-col :span="12" style="height: 100%">
      <a-scrollbar style="height: 100%; overflow: auto">
        <a-form
          ref="refForm"
          :model="isPreview ? recentConfig : configForm"
          auto-label-width
          style="padding-right: 15px"
        >
          <a-form-item
            field="author"
            label="作者名称"
            :rules="[{ required: true, message: '作者名不能为空' }]"
            extra="类上面的作者"
          >
            <a-input v-show="!isPreview" v-model="configForm.author" />
            <a-input
              v-show="isPreview"
              v-model="recentConfig.author"
              style="color: rgb(var(--green-5))"
            >
            </a-input>
          </a-form-item>
          <a-form-item
            field="moduleName"
            label="模块名"
            extra="模块的名称，请选择项目中已存在的模块"
            :rules="[{ required: true, message: '模块名不能为空' }]"
          >
            <a-input v-show="!isPreview" v-model="configForm.moduleName" />
            <a-input
              v-show="isPreview"
              v-model="recentConfig.moduleName"
              style="color: rgb(var(--green-5))"
            />
          </a-form-item>
          <a-form-item
            field="pack"
            label="至于包下"
            extra="项目包的名称,java中package名称"
            :rules="[{ required: true, message: '包名不能为空' }]"
          >
            <a-input v-show="!isPreview" v-model="configForm.pack" />
            <a-input
              v-show="isPreview"
              v-model="recentConfig.pack"
              style="color: rgb(var(--green-5))"
            />
          </a-form-item>
          <a-form-item
            field="apiAlias"
            label="接口名称"
            extra="用于swagger接口文档，请用冒号分割  例如: 系统：用户"
            :rules="[{ required: true, message: '接口名不能为空' }]"
          >
            <a-input v-show="!isPreview" v-model="configForm.apiAlias" />
            <a-input
              v-show="isPreview"
              v-model="recentConfig.apiAlias"
              style="color: rgb(var(--green-5))"
            />
          </a-form-item>
          <a-form-item
            field="apiPath"
            label="后端API路径"
            :rules="[{ required: true, message: '后端API路径不能为空' }]"
            extra="后端RequestMapping的匹配路径"
          >
            <a-input v-show="!isPreview" v-model="configForm.apiPath" />
            <a-input
              v-show="isPreview"
              v-model="recentConfig.apiPath"
              style="color: rgb(var(--green-5))"
            />
          </a-form-item>
          <a-form-item
            field="path"
            label="前端路径"
            :rules="[{ required: true, message: '前端路径不能为空' }]"
            extra="前端views文件夹下的目录，不存在即创建"
          >
            <a-input v-show="!isPreview" v-model="configForm.path" />
            <a-input
              v-show="isPreview"
              v-model="recentConfig.path"
              style="color: rgb(var(--green-5))"
            />
          </a-form-item>

          <a-form-item
            field="prefix"
            label="去表前缀"
            extra="默认不去除表的前缀，可自定义"
          >
            <a-input v-show="!isPreview" v-model="configForm.prefix" />
            <a-input
              v-show="isPreview"
              v-model="recentConfig.prefix"
              style="color: rgb(var(--green-5))"
            />
          </a-form-item>
          <a-form-item
            field="cover"
            label="是否覆盖"
            :rules="[{ required: true, message: '是否覆盖不能为空' }]"
            extra="！慎重选择。会覆盖已存在的目录"
          >
            <a-radio-group
              v-show="!isPreview"
              v-model="configForm.cover"
              type="button"
            >
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>

            <a-radio-group
              v-show="isPreview"
              v-model="recentConfig.cover"
              type="button"
            >
              <a-radio :value="true" style="color: rgb(var(--green-5))"
                >是</a-radio
              >
              <a-radio :value="false" style="color: rgb(var(--green-5))"
                >否</a-radio
              >
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-scrollbar>
    </a-col>
    <a-col :span="12" style="height: 100%">
      <div style="height: 100%; padding-right: 20px">
        <a-alert :show-icon="false" type="success"
          >最近配置 : 点击预览然后可以修改内容，再点应用即可保存</a-alert
        >
        <a-scrollbar style="height: calc(100% - 40px); overflow: auto">
          <a-list :bordered="false">
            <a-list-item
              v-for="(config, index) in allRecentConfig"
              :key="config.configId"
            >
              <span>{{ config.tableName }}</span>
              <span style="position: absolute; right: 0">
                <a-space>
                  <a-button
                    v-if="index !== preIndex"
                    size="mini"
                    :disabled="
                      allRecentConfig[index].tableName === info.table.tableName
                    "
                    @click="previewConfig(index)"
                    >预览</a-button
                  >
                  <a-button
                    v-if="index === preIndex"
                    size="mini"
                    status="warning"
                    @click="cancelPre"
                    >取消</a-button
                  >
                  <a-button
                    size="mini"
                    status="success"
                    :disabled="preIndex !== index"
                    @click="apply"
                    >应用</a-button
                  >
                </a-space>
              </span>
            </a-list-item>
          </a-list>
        </a-scrollbar>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  // 生成配置
  import { getCurrentInstance, inject, onMounted, reactive, ref } from 'vue';
  import axios from 'axios';
  import { Form, ValidatedError } from '@arco-design/web-vue';
  import { LoginData } from '@/api/user';

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;
  const configForm = ref({ cover: false });
  const info: any = inject('info');
  const recentConfig = ref({});
  const allRecentConfig = ref([]);
  const isPreview = ref(false);
  // 正在预览最近配置的编号
  const preIndex = ref(-1);
  const refForm = ref<InstanceType<typeof Form> | null>(null);

  const submitForm = async (): Promise<boolean> => {
    const errors = await refForm.value?.validate();
    if (!errors) {
      // 如果没有configId，则是第一次填写保存，需要指定tableName
      if (!(configForm.value as any).configId) {
        (configForm.value as any).tableName = info.table.tableName;
      }
      const data = await axios.put(
        'generate/table/genConfig',
        configForm.value
      );
      return (data as any).code === 20000;
    }
    return false;
  };

  const previewConfig = (index: number) => {
    isPreview.value = true;
    preIndex.value = index;
    recentConfig.value = allRecentConfig.value[index];
  };
  const cancelPre = () => {
    preIndex.value = -1;
    isPreview.value = false;
  };
  const apply = async () => {
    delete (recentConfig.value as any).configId;

    const updateId = (configForm.value as any).configId;
    if (updateId) (recentConfig.value as any).configId = updateId;
    (configForm as any).value = recentConfig.value;

    const success = await submitForm();
    if (success) {
      global.$message.success('应用成功！');
      cancelPre();
    } else {
      global.$message.error('应用失败！');
    }
  };

  const getGenConfig = async () => {
    // 获取当前表的配置
    const data = await axios.get(
      `/generate/table/genConfig?tableName=${info.table.tableName}`
    );
    if (data.data) {
      configForm.value = data.data;
    }
    // 获取最近表的数据
    const data2 = await axios.get(`/generate/table/genConfig`);
    allRecentConfig.value = data2.data;
  };

  defineExpose({ submitForm });

  onMounted(() => {
    getGenConfig();
  });
</script>

<style scoped>
  :deep(.arco-scrollbar) {
    height: 100%;
  }
</style>
