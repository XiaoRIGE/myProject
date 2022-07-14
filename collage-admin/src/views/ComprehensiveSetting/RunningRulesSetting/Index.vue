<template>
  <a-tabs>
    <a-tab-pane key="1" tab="录入终端设置">
      <InputTerminal />
    </a-tab-pane>
    <a-tab-pane key="2" tab="APP跑步模式设置" force-render>
      <RunModalSetting />
    </a-tab-pane>
    <a-tab-pane key="3" tab="岗亭打卡设置">
      <FacePunchSetting />
    </a-tab-pane>
    <a-tab-pane key="4" tab="跑步限制与目标设置">
      <RunLimiting />
    </a-tab-pane>
    <a-tab-pane key="5" tab="跑步有效时间设置">
      <EffectiveTimeSetting />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputTerminal from '@/views/ComprehensiveSetting/RunningRulesSetting/InputTerminal/Index.vue';
import RunModalSetting from '@/views/ComprehensiveSetting/RunningRulesSetting/RunModalSetting/Index.vue';
import RunLimiting from '@/views/ComprehensiveSetting/RunningRulesSetting/Runlimiting/Index.vue';
import EffectiveTimeSetting from './EffectiveTimeSetting/Index.vue';
import FacePunchSetting from './FacePunchSetting/Index.vue';

export default defineComponent({
  components: {
    InputTerminal,
    RunModalSetting,
    RunLimiting,
    EffectiveTimeSetting,
    FacePunchSetting
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
