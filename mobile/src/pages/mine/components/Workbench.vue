<template>
  <view class="workbench-container">
    <view class="workbench-container-card u-flex u-row-between">
      <view>
        <view class="workbench-container-card-left-title">
          工作台
        </view>
        <view class="workbench-container-card-left-sub-title">
          你已拥有班级管理权限
        </view>
      </view>
      <navigator
        url="/pages/adminWorkbench/index"
        hover-class="none"
        class="workbench-container-card-btn u-text-center"
      >
        点击查看
      </navigator>
    </view>
  </view>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.workbench-container {
  width: 750rpx;
  box-sizing: border-box;
  padding: 32rpx;
  &-card {
    width: 100%;
    height: 188rpx;
    box-sizing: border-box;
    padding: 34rpx 54rpx;
    background-image: url(~@/static/img/workbench-bg.png);
    background-repeat: no-repeat;
    background-size: 100% 188rpx;
    color: #fff;
    &-left-title {
      font-size: 48rpx;
      font-weight: 500;
    }
    &-left-sub-title {
      font-size: 28rpx;
      margin-top: 18rpx;
    }
    &-btn {
      width: 148rpx;
      line-height: 52rpx;
      background-color: #fff;
      border-radius: 16rpx;
      color: $u-main-color;
    }
  }
}
</style>
