<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <a-upload
        :custom-request="customRequest"
        list-type="picture-card"
        :file-list="fileList"
        :show-upload-button="true"
        :show-file-list="false"
        @change="uploadChange"
      >
        <template #upload-button>
          <a-avatar :size="100" class="info-avatar">
            <template #trigger-icon>
              <icon-camera />
            </template>
            <img v-if="fileList.length" :src="fileList[0].url" />
          </a-avatar>
        </template>
      </a-upload>
      <a-descriptions
        size="large"
        :data="renderData"
        :column="4"
        align="left"
        layout="inline-horizontal"
        :label-style="{
          width: '60px',
          paddingBottom: '8px',
          paddingTop: '8px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          width: '200px',
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <template #label="{ label }">{{ $t(label) }}</template>
        <template #value="{ value, data }">
          <a-tag
            v-if="data.label === 'userSetting.label.nowRole'"
            color="green"
            size="small"
          >
            {{ value }}
          </a-tag>
          <a-tag
            v-else-if="data.label === 'userSetting.label.deptName'"
            color="blue"
            size="small"
          >
            {{ value }}
          </a-tag>
          <div v-else-if="data.label === 'userSetting.label.jobs'">
            <a-space>
              <span v-for="job in value" :key="job.id">
                <a-tag color="red" size="small">
                  {{ job.name }}
                </a-tag>
              </span>
            </a-space>
          </div>

          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref } from 'vue';
  import {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { useUserStore } from '@/store';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
  import { userUploadApi } from '@/api/user';
  import useApiStore from '@/store/modules/api';

  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;
  const userStore = useUserStore();
  const { baseApi } = useApiStore();
  const file = {
    uid: '-2',
    name: 'avatar.png',
    url: `${baseApi}/avatar/${userStore.user?.avatarName}`,
  };
  const renderData = [
    {
      label: 'userSetting.label.accountId',
      value: userStore.user?.userId,
    },
    {
      label: 'userSetting.label.name',
      value: userStore.user?.username,
    },
    {
      label: 'userSetting.label.nickName',
      value: userStore.user?.nickName,
    },
    {
      label: 'userSetting.label.deptName',
      value: userStore.user?.deptName,
    },
    {
      label: 'userSetting.label.gender',
      value: userStore.user?.gender,
    },
    {
      label: 'userSetting.label.jobs',
      value: userStore.userInfo.jobs,
    },
    {
      label: 'userSetting.label.email',
      value: userStore.user?.email,
    },
    {
      label: 'userSetting.label.nowRole',
      value: userStore.nowRole,
    },

    {
      label: 'userSetting.label.phone',
      value: userStore.user?.phone,
    },
    {
      label: 'userSetting.label.registrationDate',
      value: userStore.user?.createTime,
    },
  ] as DescData[];
  const fileList = ref<FileItem[]>([file]);
  const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    fileList.value = [fileItem];
  };
  const customRequest = (options: RequestOption) => {
    // docs: https://axios-http.com/docs/cancellation
    const controller = new AbortController();

    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'avatar',
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
        // https://github.com/axios/axios/issues/1630
        // https://github.com/nuysoft/Mock/issues/127

        const res = await userUploadApi(formData, {
          controller,
          onUploadProgress,
        });
        userStore.setAvatarPath(res.data.avatar);
        global.$message.success('修改成功！');
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
</script>

<style scoped lang="less">
  .arco-card {
    padding: 14px 0 4px 4px;
    border-radius: 4px;
  }

  :deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: #e8f3ff;

    .arco-icon-camera {
      margin-top: 8px;
      color: rgb(var(--arcoblue-6));
      font-size: 14px;
    }
  }
</style>
