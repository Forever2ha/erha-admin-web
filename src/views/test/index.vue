<template>
  main
  <hr />
  <div>
    <son1 />
  </div>
  <hr />
  <div>
    <son2 />
  </div>
</template>

<script setup lang="ts">
  import son1 from '@/views/test/son1.vue';
  import son2 from '@/views/test/son2.vue';
  import { useCrud } from '@/components/crud/CRUD';
  import { Dict } from '@/api/system/dict';
</script>
