<template>
  <view class="sign-in-title u-flex">
    <view class="title-text">
      第{{ week.weekNumber }}周
    </view>
    <view v-if="week.currentSureWeek" class="current-week">
      本周
    </view>
  </view>
</template>

<script>
export default {
  name: 'SignInTitle',
  props: {
    week: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.sign-in-title {
  .title-text {
    font-size: 36rpx;
    font-weight: bold;
    margin-right: 8rpx;
  }
  .current-week {
    width: 72rpx;
    height: 32rpx;
    background: linear-gradient(
      90deg,
      rgba(32, 61, 107, 1) 0%,
      rgba(35, 66, 117, 1) 100%
    );
    border-radius: 8rpx;
    text-align: center;
    line-height: 32rpx;
    color: rgba(255, 255, 255, 1);
    font-size: 22rpx;
  }
}
</style>
