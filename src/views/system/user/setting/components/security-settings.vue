<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.password') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ $t('userSetting.SecuritySettings.placeholder.password') }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link @click="showModifyPass = true">
              {{ $t('userSetting.SecuritySettings.button.update') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.securityQuestion') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph class="tip">
              {{
                $t('userSetting.SecuritySettings.placeholder.securityQuestion')
              }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link>
              {{ $t('userSetting.SecuritySettings.button.settings') }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.phone') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              已绑定：{{ user.userInfo.user.phone }}
            </a-typography-paragraph>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.email') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              已绑定：{{ user.userInfo.user.email }}
            </a-typography-paragraph>
          </div>
          <div class="operation"> </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <!--修改密码-->
    <a-modal
      :visible="showModifyPass"
      :ok-loading="modifyPassLoading.loading.value"
      @cancel="showModifyPass = false"
      @ok="modifyPass"
    >
      <template #title>修改密码</template>
      <a-form ref="passFormInstance" :model="passForm" auto-label-width>
        <a-row>
          <a-form-item
            label="旧密码"
            field="oldPassword"
            feedback
            :rules="[{ required: true, message: '旧密码不能为空' }]"
          >
            <a-input v-model="passForm.oldPassword" type="password" />
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item
            label="新密码"
            field="newPassword1"
            feedback
            :rules="[{ required: true, message: '新密码不能为空' }]"
          >
            <a-input v-model="passForm.newPassword1" type="password" />
          </a-form-item> </a-row
        ><a-row>
          <a-form-item
            label="确认密码"
            field="newPassword2"
            feedback
            validate-trigger="blur"
            :rules="[
              { required: true, message: '新密码不能为空' },
              { validator: passValidator },
            ]"
          >
            <a-input v-model="passForm.newPassword2" type="password" />
          </a-form-item>
        </a-row>
      </a-form>
    </a-modal>
  </a-list>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import encrypt from '@/utils/RsaUtils';
  import { editPassword, logout } from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { useUserStore } from '@/store';
  import useUser from '@/hooks/user';

  const user = useUserStore();

  const modifyPassLoading = useLoading(false);
  const passFormInstance = ref<FormInstance | null>(null);
  const showModifyPass = ref(false);
  const passForm = reactive({
    oldPassword: '',
    newPassword1: '',
    newPassword2: '',
  });
  const passValidator = (
    value: string | undefined,
    callback: (error?: string) => void
  ) => {
    if (value) {
      if (passForm.newPassword1 !== passForm.newPassword2) {
        callback('两次输入的密码不一致');
      }
      callback();
    }
  };
  // 修改密码
  const modifyPass = () => {
    (passFormInstance.value as FormInstance).validate(async (err) => {
      if (!err) {
        modifyPassLoading.toggle();
        try {
          const oldPass = encrypt(passForm.oldPassword);
          const newPass = encrypt(passForm.newPassword1);
          const data: any = await editPassword(oldPass, newPass);
          if (data.code === 20000) {
            Message.success({
              content: '修改成功！,3s后将重新登录',
              duration: 3000,
            });
            setTimeout(() => {
              localStorage.removeItem('EH-ADMIN-TOKEN');
              window.location.reload();
            }, 3000);
          } else {
            Message.error(`修改失败:${data.msg}`);
          }
        } catch (e) {
          // ignore
        }
        modifyPassLoading.toggle();
      }
    });
  };
</script>

<style scoped lang="less">
  :deep(.arco-list-item) {
    border-bottom: none !important;

    .arco-typography {
      margin-bottom: 20px;
    }

    .arco-list-item-meta-avatar {
      margin-bottom: 1px;
    }

    .arco-list-item-meta {
      padding: 0;
    }
  }

  :deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);

    .arco-list-item-meta-description {
      display: flex;
      flex-flow: row;
      justify-content: space-between;

      .tip {
        color: rgb(var(--gray-6));
      }

      .operation {
        margin-right: 6px;
      }
    }
  }
</style>
