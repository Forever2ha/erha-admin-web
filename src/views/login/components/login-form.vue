<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <!--账号-->
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <!--密码-->
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <!--验证码-->
      <a-form-item
        field="captcha"
        :rules="[{ required: true, message: $t('login.form.captcha.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.captcha"
          :placeholder="$t('login.form.captcha.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input>
        <img
          :src="imgSrc"
          style="height: 32px; padding-left: 10px; cursor: pointer"
          width="150"
          alt="验证码加载失败"
          @click="getCode"
        />
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
        <a-button type="text" long class="login-form-register-btn">
          {{ $t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { LoginData, getCaptcha } from '@/api/user';
  import encrypt from '@/utils/RsaUtils';
  import app from '@/store/modules/app';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const appStore = useAppStore();

  const imgSrc = ref('');

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: '', // 演示默认值
    password: '', // demo default value
  });
  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
    captcha: '',
    uuid: '',
  });

  // 获取验证码
  const getCode = async () => {
    try {
      if (errorMessage.value === '获取验证码失败') {
        errorMessage.value = '';
      }
      const res = await getCaptcha();
      imgSrc.value = res.data.img;
      userInfo.uuid = res.data.uuid;
    } catch (e) {
      errorMessage.value = '获取验证码失败';
    }
  };

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: LoginData;
  }) => {
    if (!errors) {
      setLoading(true);
      try {
        // 交给pinia，登录成功后转向要访问的路径或者是Workplace
        // 密码加密

        if (loginConfig.value.password !== values.password) {
          values = {
            ...values,
            password: encrypt(values.password),
          };
        }

        await userStore.login(values);
        await appStore.fetchServerMenuConfig();
        const { redirect, ...othersQuery } = router.currentRoute.value.query;

        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberPassword ? username : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        await getCode();
        userInfo.captcha = '';

        if (
          (err as Error).message !== '验证码错误' &&
          (err as Error).message !== '验证码过期'
        ) {
          errorMessage.value = (err as Error).message;
          userInfo.username = '';
          userInfo.password = '';
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };

  onMounted(() => {
    getCode();
  });
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
