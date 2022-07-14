<template>
  <view class="scroll-header-content u-flex">
    <view class="scroll-header-content-col u-flex">
      <text>学生名单({{ count }})</text>
    </view>
    <view class="scroll-header-content-col u-flex">
      <text>签到次数</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ScrollHeader',
  props: {
    count: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-header-content {
  height: 88rpx;
  justify-content: space-between;
  border-bottom: 0.5px solid #e8e8e8;
  &-col {
    height: 88rpx;
    box-sizing: border-box;
    font-size: 24rpx;
    font-weight: 500;
    color: $u-tips-color;
    &:first-child {
      width: 250rpx;
      padding-left: 32rpx;
    }
    &:last-child {
      width: 388rpx;
      padding-right: 32rpx;
    }
  }
}
</style>
