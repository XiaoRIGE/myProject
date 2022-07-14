<template>
  <a-tabs>
    <a-tab-pane key="1" tab="学期设置">
      <SchoolSemester />
    </a-tab-pane>
    <a-tab-pane key="2" tab="校区设置" force-render>
      <SchoolCampus />
    </a-tab-pane>
    <a-tab-pane key="3" tab="学院设置">
      <SchoolCollege />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import SchoolCampus from '@/views/ComprehensiveSetting/SchoolSetting/CampusSetting/SchoolCampus.vue';
import SchoolCollege from '@/views/ComprehensiveSetting/SchoolSetting/CollegeSetting/SchoolCollege.vue';
import SchoolSemester from '@/views/ComprehensiveSetting/SchoolSetting/SemesterSetting/SchoolSemester.vue';

export default defineComponent({
  components: {
    SchoolCampus,
    SchoolCollege,
    SchoolSemester
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
