<template>
  <a-scrollbar style="height: 100%; overflow-x: auto">
    <div v-code class="hljs-container">
      <highlightjs
        :autodetect="props.lang === ''"
        :language="props.lang"
        :code="props.code"
      ></highlightjs>
    </div>
  </a-scrollbar>
</template>

<script lang="ts" setup>
  const props = withDefaults(defineProps<{ code: string; lang: string }>(), {
    code: '',
    lang: '',
  });
</script>

<style scoped>
  .arco-scrollbar {
    width: 100% !important;
    height: 100% !important;
  }
</style>
