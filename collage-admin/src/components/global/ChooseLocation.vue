<template>
  <a-modal
    v-model:visible="visible"
    :destroy-on-close="true"
    :width="800"
    :mask-closable="false"
    title="签到地点"
    @ok="handleOk"
    @cancel="cancel"
  >
    <div class="map-box">
      <div id="container" />
      <!-- 地图搜索 -->
      <div v-show="mapProps.needSearch" class="search-div">
        <a-input id="tipinput" placeholder="搜索地点" />
      </div>
    </div>

    <div class="map-info">
      <p>签到地点：{{ circleName }}</p>
      <p>
        经纬度坐标：{{ circlePosition.lat }}
        <span v-show="circleName">,</span>
        {{ circlePosition.lng }}
        <img
          v-show="circleName"
          src="@/assets/copy.png"
          class="copy-image"
          @click="copyPosition(circlePosition.lat, circlePosition.lng)"
        />
      </p>

      <p>
        签到区域半径：
        <a-input-number
          id="inputNumber"
          v-model:value="radiusRef"
          :step="5"
          :min="10"
          :max="500"
          :precision="0"
        />
        m
      </p>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';

import { useMap } from '@/hooks/useMap';
import { copy } from '@/utils/common';

export default defineComponent({
  name: 'ChooseLocation',

  props: {
    // 半径范围
    radius: {
      type: Number,
      default: 100
    },
    // 经纬度信息 第一项是纬度，第二项是经度
    defaultPosition: {
      type: Array,
      default: () => {
        return [];
      }
    },
    showVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['handle-sure', 'handle-close'],
  setup(props, { emit }) {
    const radiusRef = ref<number>(100);
    watch(
      () => props.radius,
      newVal => {
        radiusRef.value = newVal;
      }
    );

    const visible = ref<boolean>(false);
    const mapProps = reactive({
      needSearch: true,
      radius: radiusRef,
      position: props.defaultPosition,
      visible: props.showVisible
    });
    watch(
      () => props.defaultPosition,
      newVal => {
        mapProps.position = newVal;
      }
    );

    const copyPosition = (lat: number, lng: number) => {
      copy(`${lat},${lng}`);
    };

    const { circlePosition, circleName } = useMap(mapProps);
    watch(
      () => props.showVisible,
      () => {
        visible.value = props.showVisible;
        mapProps.visible = props.showVisible;
      }
    );

    const handleOk = () => {
      // 暴露出去的最终信息
      emit('handle-sure', circlePosition, circleName.value, radiusRef.value);
      circlePosition.lng = (null as unknown) as number;
      circlePosition.lat = (null as unknown) as number;
      circleName.value = '';
      visible.value = false;
    };
    const cancel = () => {
      emit('handle-close');
      circlePosition.lng = (null as unknown) as number;
      circlePosition.lat = (null as unknown) as number;
      circleName.value = '';
      visible.value = false;
    };
    return {
      mapProps,
      visible,
      handleOk,
      cancel,
      radiusRef,
      circlePosition,
      circleName,
      copyPosition
    };
  }
});
</script>

<style lang="less" scoped>
.map-box {
  position: relative;
  display: inline-block;
  #container {
    height: 400px;
    width: 750px;
  }
  .search-div {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.map-info {
  p {
    margin-top: 24px;
  }
}
.copy-image {
  height: 15px;
  margin-bottom: 5px;
  margin-left: 5px;
}
</style>
