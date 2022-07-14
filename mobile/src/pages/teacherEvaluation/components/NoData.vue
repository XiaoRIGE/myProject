<template>
  <view class="no-data-container">
    <image class="img" src="~@/static/img/empty-course.svg" mode="widthFix" />
    <view class="tps">
      <text>{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '本学期暂无课程'
    }
  }
};
</script>

<style lang="scss" scoped>
.no-data-container {
  width: 100%;
  box-sizing: border-box;
  padding: 224rpx 0 0 0;
  text-align: center;
  .img {
    width: 400rpx;
    margin: 0 auto 40rpx;
  }
  .tps text {
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $u-main-color;
  }
}
</style>
