<template>
  <a-tabs>
    <a-tab-pane key="1" tab="考试配置">
      <ExamConfiguration />
    </a-tab-pane>
    <a-tab-pane key="2" tab="题目管理" force-render>
      <TopicConfiguration />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExamConfiguration from './ExamConfiguration/Index.vue';
import TopicConfiguration from './TopicConfiguration/Index.vue';

export default defineComponent({
  components: {
    ExamConfiguration,
    TopicConfiguration
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
