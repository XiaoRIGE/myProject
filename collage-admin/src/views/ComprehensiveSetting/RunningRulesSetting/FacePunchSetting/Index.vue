<template>
  <div class="face-punch-setting">
    <campus-selector v-model:value="campusId" />
    <PointSetting
      v-model:point-list="pointList"
      :campus-id="campusId"
      class="face-punch-setting__component"
    />
    <RouteSetting
      :point-list="pointList"
      :campus-id="campusId"
      class="face-punch-setting__component"
    />
  </div>
</template>

<script lang="ts">
import { FacePunchPointBasicInfo } from '@/@types/facePunch';
import { defineComponent, ref } from 'vue';
import PointSetting from './PointSetting/Index.vue';
import RouteSetting from './RouteSetting/Index.vue';

export default defineComponent({
  components: {
    PointSetting,
    RouteSetting
  },
  setup() {
    /**
     * 当前选中的校区ID
     */
    const campusId = ref('');

    /**
     * 点位列表
     */
    const pointList = ref<FacePunchPointBasicInfo[]>([]);

    return {
      campusId,
      pointList
    };
  }
});
</script>

<style lang="less" scoped>
.face-punch-setting {
  background-color: #fff;
  height: 100%;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
  &__component {
    margin-top: 50px;
  }
}
</style>
