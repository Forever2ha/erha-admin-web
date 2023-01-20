<template>
  <a-card
    class="general-card"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '17px 20px 21px 20px' }"
  >
    <a-typography :style="{ marginTop: '10px' }">
      <a-typography-title :heading="4"
        >🍀 欢迎使用ErHa-Admin v0.0.1</a-typography-title
      >
      <a-typography-paragraph>
        <ul>
          <li
            >在线文档：<a-link status="success" href="http://175.24.198.241/"
              >http://175.24.198.241/</a-link
            >
          </li>
          <li>欢迎大家参与贡献，QQ群：727793103</li>
        </ul>
      </a-typography-paragraph>

      <a-typography-title :heading="4">🍂 源码地址</a-typography-title>
      <a-typography-paragraph blockquote>
        Github
        <a-link href="https://github.com/Forever2ha/erha-admin-web "
          >前端</a-link
        >
        <a-link href="https://github.com/Forever2ha/erha-admin-main"
          >后端</a-link
        >
      </a-typography-paragraph>

      <a-typography-paragraph blockquote>
        Gitee
        <a-link href="https://gitee.com/erha_a/erha-admin-web"> 前端</a-link>
        <a-link href="https://gitee.com/erha_a/erha-admin-main"> 后端</a-link>
      </a-typography-paragraph>
      <a-typography-text
        >两个网站都是同步更新的。如果你觉得还不错，就给我点个免费的star吧🥰🥰🥰</a-typography-text
      >

      <a-typography-title :heading="4">🌵 更新公告</a-typography-title>
      v0.0.1 2023-01-20 基础功能完成
      <a-typography-title :heading="4">⚠️ 注意</a-typography-title>
      当前为线上预览版，部分功能限制使用
    </a-typography>
  </a-card>
</template>

<script lang="ts" setup></script>

<style scoped lang="less">
  .general-card {
    min-height: 495px;
  }
</style>
