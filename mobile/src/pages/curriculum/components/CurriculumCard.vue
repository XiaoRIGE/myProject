<template>
  <view class="curriculum-card" v-bind="$attrs">
    <view class="curriculum-card-nav u-flex u-row-between">
      <view class="curriculum-card-nav-left u-flex">
        <image src="~@/static/img/book-icon.png" mode="aspectFit" />
        <text>当前课程</text>
      </view>
      <navigator
        :url="
          '/pages/curriculum/detail?id=' + course.id + '&title=' + course.name
        "
        open-type="navigate"
        hover-class="none"
      >
        <view class="curriculum-card-nav-right">
          <text>查看详情</text>
          <u-icon siz="24" name="arrow-right" />
        </view>
      </navigator>
    </view>
    <view class="curriculum-card-title">
      {{ course.name || '' }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
.curriculum-card {
  width: 100%;
  border-radius: 20rpx;
  box-sizing: border-box;
  padding: 24rpx 24rpx 32rpx;
  background-color: #fff;
  &-nav-left {
    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 8rpx;
    }
    text {
      font-size: 36rpx;
      color: $u-main-color;
      font-weight: bold;
    }
  }
  &-nav-right {
    font-size: 24rpx;
    color: $u-content-color;
    text {
      margin-right: 8rpx;
    }
  }
  &-title {
    margin-top: 26rpx;
    font-size: 28rpx;
    color: $u-main-color;
  }
}
</style>
