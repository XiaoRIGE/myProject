<template>
  <a-tabs>
    <a-tab-pane key="1" tab="考试设置">
      <ExaminationSetting />
    </a-tab-pane>
    <a-tab-pane key="2" tab="科目管理">
      <SubjectSetting />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExaminationSetting from '@/views/ComprehensiveSetting/SpecialExamination/ExaminationSetting/Index.vue';
import SubjectSetting from '@/views/ComprehensiveSetting/SpecialExamination/SubjectSetting/Index.vue';

export default defineComponent({
  components: {
    ExaminationSetting,
    SubjectSetting
  },

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
</style>
