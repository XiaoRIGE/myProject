<template>
  <view
    class="u-flex u-col-center u-row-center add-course-content"
    @click="handleClick"
  >
    <image
      class="add-icon"
      src="~@/static/img/add-icon.svg"
      mode="scaleToFill"
    />
    <view class="add-text">
      <text class="text">
        {{ title }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      title: '去选课'
    };
  },
  methods: {
    handleClick() {
      this.$emit('on-click', this.course);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-course-content {
  width: 100%;
  flex-direction: column !important;
  height: 176rpx;
  border-radius: 16rpx;
  border: 1px dashed #eaecf0;
  .add-icon {
    width: 64rpx;
    height: 64rpx;
  }
  .add-text {
    margin-top: 4rpx;
    .text {
      font-size: 28rpx;
      font-weight: 400;
      color: $u-main-color;
    }
  }
}
</style>
