<template>
  <view class="current-course-container">
    <view class="title u-flex">
      <image class="book-img" src="~@/static/img/book.png" mode="scaleToFill" />
      <view class="title-text">
        当前课程
      </view>
    </view>
    <view class="content">
      {{ currentCourse.name }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'CurrentCourse',
  props: {
    currentCourse: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.current-course-container {
  padding: 24rpx;
  width: 686rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  .title {
    .book-img {
      width: 48rpx;
      height: 48rpx;
      margin-right: 8rpx;
    }
    .title-text {
      font-size: 36rpx;
      font-weight: bold;
    }
  }
  .content {
    margin-top: 24rpx;
    font-weight: 400;
  }
}
</style>
