<template>
  <a-tabs>
    <a-tab-pane key="1" tab="待处理">
      <WaitingTask />
    </a-tab-pane>
    <a-tab-pane key="3" tab="已处理">
      <Processed />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WaitingTask from '../WaitingTask/Index.vue';
import Processed from '../Processed/Index.vue';

export default defineComponent({
  components: {
    WaitingTask,
    Processed
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
