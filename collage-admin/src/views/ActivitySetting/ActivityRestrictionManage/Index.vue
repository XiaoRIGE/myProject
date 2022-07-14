<template>
  <a-tabs>
    <a-tab-pane key="1" tab="学期限制">
      <SemesterImpose />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SemesterImpose from './SemesterImpose/Index.vue';

export default defineComponent({
  components: {
    SemesterImpose
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-tabs-bar) {
  border: none;
  margin-bottom: 0;
}
:deep(.ant-tabs-nav-wrap) {
  padding: 0 24px;
  background: #fff;
}
.container {
  padding: 24px;
  background: #f0f2f5;
}
</style>
