<template>
  <view class="tabbar-list u-flex u-row-around" :style="{ 'z-index': zIndex }">
    <template v-for="(item, index) in list">
      <view
        v-if="item.text !== '运动'"
        :key="index"
        class="bar-item"
        @click="changeTabbar(item, index)"
      >
        <image
          v-if="isBase64(currentSrc(index, item))"
          :src="currentSrc(index, item)"
          mode="aspectFit"
        />
        <u-icon
          v-else
          :size="item.size || 50"
          :color="item.color"
          :name="currentSrc(index, item)"
        />
        <text :class="{ 'active-color': value === index }">
          {{ item.text }}
        </text>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'Tabbar',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Number,
      require: true,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: [Number, String],
      default: 99
    }
  },
  methods: {
    changeTabbar(item, index) {
      this.$emit('input', index);
      this.$emit('on-change', index);
      if (item.path) {
        uni.redirectTo({ url: item.path });
      }
    },
    // 获取当前的图片base或者icon图标name
    currentSrc(index, item) {
      return this.value === index ? item.selectedIconPath : item.iconPath;
    },
    // 判断是否是base64图片
    isBase64(str) {
      if (!str || typeof str !== 'string') return false;
      return str.includes('data:image/png;base64');
    }
  }
};
</script>
<style scoped>
.tabbar-list {
  /* 安全区域适配 */
  height: calc(106rpx + constant(safe-area-inset-bottom));
  height: calc(106rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
<style scoped lang="scss">
.tabbar-list {
  width: 750rpx;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -4rpx 10rpx 1rpx rgba(152, 152, 153, 0.14);
  .bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text {
      font-size: 22rpx;
      color: $u-main-color;
    }
    .active-color {
      color: $u-type-primary;
    }
    image {
      max-width: 52rpx;
      max-height: 52rpx;
    }
  }
}
</style>
