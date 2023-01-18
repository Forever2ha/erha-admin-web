<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="email"
      :label="$t('userSetting.basicInfo.form.label.email')"
      :rules="[
        {
          message: $t('userSetting.form.error.email.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.email"
        :placeholder="$t('userSetting.basicInfo.placeholder.email')"
      />
    </a-form-item>
    <a-form-item
      field="nickname"
      :label="$t('userSetting.basicInfo.form.label.nickname')"
      :rules="[
        {
          message: $t('userSetting.form.error.nickname.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.nickname"
        :placeholder="$t('userSetting.basicInfo.placeholder.nickname')"
      />
    </a-form-item>
    <a-form-item field="phone" label="电话">
      <a-input v-model="formData.phone" placeholder="请输入您的电话" />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="submit"> 修改 </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import axios from 'axios';
  import { useUserStore } from '@/store';

  const instance = getCurrentInstance();
  const userStore = useUserStore();
  const global = (instance as any).appContext.config.globalProperties;
  const formRef = ref<FormInstance>();
  const formData = ref({
    email: undefined,
    nickname: undefined,
    phone: undefined,
  });
  const validate = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      // do some thing
      // you also can use html-type to submit
    }
  };
  const reset = async () => {
    await formRef.value?.resetFields();
  };
  const submit = async () => {
    const res = await axios.put('/system/user/update', { ...formData.value });
    if ((res as any).code === 20000) {
      await userStore.info();
      global.$message.success('修改成功！');
    } else {
      global.$message.error(`${(res as any).data[0].errorMsg}`);
    }
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 20px 20px;
  }
</style>
