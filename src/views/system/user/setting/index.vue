<template>
  <div class="container">
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <UserPanel />
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" :title="$t('userSetting.tab.basicInformation')">
            <a-scrollbar style="height: 40vh; overflow: auto">
              <BasicInformation />
            </a-scrollbar>
          </a-tab-pane>

          <a-tab-pane key="2" :title="$t('userSetting.tab.securitySettings')">
            <SecuritySettings />
          </a-tab-pane>
          <a-tab-pane key="3" title="其他设置"> </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import UserPanel from './components/user-panel.vue';
  import BasicInformation from './components/basic-information.vue';
  import SecuritySettings from './components/security-settings.vue';
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
    height: 80vh;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    height: 55vh;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
