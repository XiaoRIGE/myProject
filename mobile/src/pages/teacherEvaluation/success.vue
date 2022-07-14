<template>
  <view class="success-container">
    <g-navbar :border-bottom="false" title="" />
    <view class="content">
      <image
        class="img"
        src="~@/static/img/teacherEvaluation/success.png"
        mode="scaleToFill"
      />
      <view class="tps">
        <text>评价成功</text>
      </view>
      <view class="sub-tps">
        <text>感谢您完成该课程的教师评价！</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.success-container {
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #fff;
  .content {
    margin: 144rpx auto 0;
    text-align: center;
    .img {
      width: 280rpx;
      height: 280rpx;
    }
    .tps {
      margin-top: 48rpx;
    }
    .tps text {
      font-size: 40rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: $u-main-color;
    }
    .sub-tps {
      margin-top: 16rpx;
    }
    .sub-tps text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $u-main-color;
    }
  }
}
</style>
