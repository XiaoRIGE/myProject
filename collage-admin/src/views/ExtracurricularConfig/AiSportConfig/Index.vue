<template>
  <a-tabs>
    <a-tab-pane key="1" tab="运动限制与目标设置">
      <sportLimitAndTarget />
    </a-tab-pane>
    <a-tab-pane key="2" tab="有效时间设置" force-render>
      <effectivity />
    </a-tab-pane>
    <a-tab-pane key="3" tab="运动风险自查清单">
      <sportRisk />
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import effectivity from './effectivity/index.vue';
import sportLimitAndTarget from './sportLimitAndTarget/index.vue';
import sportRisk from './sportRisk/index.vue';

export default defineComponent({
  components: {
    effectivity,
    sportLimitAndTarget,
    sportRisk
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
.container {
  padding: 24px;
  background: #f0f2f5;
}
</style>
