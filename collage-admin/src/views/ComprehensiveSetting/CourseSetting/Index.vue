
<template>
  <ProjectSetting />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ProjectSetting from './ProjectSetting/Index.vue';
export default defineComponent({
  components: { ProjectSetting },
  setup() {
    return {
      activeKey: ref('1')
    };
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
