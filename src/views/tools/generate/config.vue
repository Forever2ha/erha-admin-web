<template>
  <div style="height: 100%">
    <a-steps type="arrow" :current="currentIndex">
      <a-step description="你可以自定义表单、查询..."
        >字段配置 [{{ info.table.tableName }}]</a-step
      >
      <a-step description="定义生成的代码位置、作者信息..."
        >生成配置 [{{ info.table.tableName }}]</a-step
      >
      <a-step description="你可以生成代码了"
        >完成 [{{ info.table.tableName }}]</a-step
      >
    </a-steps>
    <a-spin
      :loading="loading"
      tip="保存中..."
      style="width: 100%; height: 100%"
    >
      <a-card
        :style="{ width: '100%' }"
        :bordered="false"
        style="height: calc(100% - 130px)"
      >
        <template #title>
          <a-space>
            <a-button
              v-show="currentIndex === 1"
              type="outline"
              size="mini"
              @click="sync"
              ><template #icon><icon-sync /></template>同步</a-button
            >
            <span v-show="errInfo[0].errorMsg !== ''" style="color: red"
              >错误： {{ errInfo[0].errorMsg }}</span
            >
          </a-space>
        </template>
        <!--操作按钮-->
        <template #extra>
          <a-space>
            <a-button
              type="outline"
              size="mini"
              :disabled="currentIndex === 1"
              @click="prev"
            >
              <template #icon>
                <icon-arrow-left />
              </template>
              上一步</a-button
            >
            <a-button
              type="outline"
              size="mini"
              status="warning"
              @click="info.show = 1"
            >
              <template #icon>
                <icon-close />
              </template>
              退出</a-button
            >
            <a-button
              type="outline"
              size="mini"
              status="success"
              :disabled="currentIndex === 3"
              @click="next"
            >
              <template #icon>
                <icon-arrow-right />
              </template>
              下一步</a-button
            >
          </a-space>
        </template>

        <!--字段配置-->
        <Transition :name="transition" style="height: 100%">
          <div
            v-show="currentIndex === 1"
            :key="colKey"
            style="
              position: absolute;
              width: 100%;
              height: 100%;
              padding-right: 30px;
            "
          >
            <ConfigCol ref="configCol" />
          </div>
        </Transition>
        <!--生成配置-->
        <Transition :name="transition" style="height: 100%">
          <div
            v-show="currentIndex === 2"
            style="position: absolute; width: 100%; height: 100%"
          >
            <ConfigGen ref="configGen" :key="genKey" />
          </div>
        </Transition>

        <!--完成-->
        <Transition :name="transition" style="height: 100%">
          <div
            v-show="currentIndex === 3"
            style="position: absolute; width: 100%; height: 100%"
          >
            <a-result
              status="success"
              title="配置已经生效"
              style="padding-top: 50px"
            >
              <template #subtitle> 请继续下面的操作 </template>

              <template #extra>
                <a-space>
                  <a-button
                    type="outline"
                    status="success"
                    @click="info.show = 3"
                    >预览</a-button
                  >
                  <a-button
                    type="outline"
                    :loading="generateL.loading.value"
                    @click="generate"
                    >生成</a-button
                  >
                </a-space>
              </template>
              <a-typography
                style="padding: 24px; background: var(--color-fill-2)"
              >
                <a-typography-paragraph>注意:</a-typography-paragraph>
                <ul>
                  <li
                    >生成前请确保 [erha-admin-main] [erha-admin-web]
                    在同一个目录下，否则前端生成文件位置会失败！</li
                  >
                  <li>生成后菜单已经自动添加，重启后端即可</li>
                  <li>有任何问题请加QQ群【727793103】或者提issue</li>
                </ul>
              </a-typography>
            </a-result>
          </div>
        </Transition>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import {
    getCurrentInstance,
    inject,
    onMounted,
    provide,
    reactive,
    ref,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import ConfigGen from '@/views/tools/generate/config-gen.vue';
  import axios from 'axios';
  import ConfigCol from '@/views/tools/generate/config-col.vue';

  const { t } = useI18n();
  const instance = getCurrentInstance();
  const global = (instance as any).appContext.config.globalProperties;

  // 利用key改变刷新dom节点
  const colKey = ref(1);
  const genKey = ref(1);

  // 字段设置
  const info: any = inject('info');
  const errInfo = ref([{ errorMsg: '' }]);
  const form: { [key: string]: any } = reactive({});
  const configCol = ref(null);
  const configGen = ref<InstanceType<typeof ConfigGen> | null>(null);
  provide('form', form);
  // 步骤条
  const currentIndex = ref(1);
  const transition = ref('slide-right');
  const { loading } = useLoading(false);
  const next = async () => {
    const nextPage = () => {
      currentIndex.value += 1;
      transition.value = 'slide-right';
    };

    switch (currentIndex.value) {
      case 1: // 从第一步离开要保存修改的信息
        // eslint-disable-next-line no-case-declarations
        const dealtForm: any[] = [];
        Object.keys(form).forEach((id) => {
          if (Object.keys(form[id]).length > 1) {
            dealtForm.push(form[id]);
          }
        });
        if (dealtForm.length !== 0) {
          loading.value = true;
          const data = await axios.put('/generate/table/columns', dealtForm);
          loading.value = false;
          if ((data as any).code === 20000) {
            // 清除表单数据
            Object.keys(form).forEach((id) => {
              form[id] = { id };
            });

            errInfo.value = [{ errorMsg: '' }];
            nextPage();
            genKey.value += 1;
          } else {
            errInfo.value = data.data;
            global.$message.error(`保存失败`);
          }
        } else {
          nextPage();
          genKey.value += 1;
        }
        break;
      case 2:
        loading.value = true;
        // eslint-disable-next-line no-case-declarations
        const success: boolean = await configGen.value.submitForm();
        if (success) {
          currentIndex.value += 1;
          transition.value = 'slide-right';
        } else {
          global.$message.error('保存失败！');
        }
        loading.value = false;
        break;
      default:
        currentIndex.value += 1;
        transition.value = 'slide-right';
        break;
    }
  };
  const prev = async () => {
    const prevPage = () => {
      currentIndex.value -= 1;
      transition.value = 'slide-left';
    };
    switch (currentIndex.value) {
      case 2:
        prevPage();
        colKey.value += 1;
        break;
      case 3:
        prevPage();
        genKey.value += 1;
        break;
      default:
        prevPage();
    }
  };

  // 同步字段数据
  const sync = async () => {
    const data: any = await axios.put(
      `/generate/table/columns/sync/${info.table.tableName}`
    );
    if (data.code === 20000) {
      Object.keys(form).forEach((key) => {
        delete form[key];
      });
      colKey.value += 1;
      global.$message.success('同步成功');
    } else {
      global.$message.error('同步失败');
    }
  };

  const generateL = useLoading(false);
  const generate = async () => {
    generateL.toggle();
    await info.gen(info.table);
    generateL.toggle();
  };
</script>

<style scoped>
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-right-enter-from {
    transform: translateX(30px);
    opacity: 0;
  }

  .slide-right-leave-to {
    transform: translateX(-30px);
    opacity: 0;
  }

  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-left-enter-from {
    transform: translateX(-30px);
    opacity: 0;
  }

  .slide-left-leave-to {
    transform: translateX(30px);
    opacity: 0;
  }

  :deep(.arco-card-body) {
    height: 100%;
  }
</style>
