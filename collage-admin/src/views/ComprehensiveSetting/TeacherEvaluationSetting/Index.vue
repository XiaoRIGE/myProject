<template>
  <a-tabs>
    <a-tab-pane key="1" tab="评价配置">
      <EvaluationConfiguration />
    </a-tab-pane>
    <a-tab-pane key="2" tab="题目管理">
      <SubjectConfiguration />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EvaluationConfiguration from './EvaluationConfiguration/Index.vue';
import SubjectConfiguration from './SubjectConfiguration/Index.vue';
export default defineComponent({
  name: 'TeacherEvaluation',
  components: { EvaluationConfiguration, SubjectConfiguration },
  setup() {
    return {};
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
