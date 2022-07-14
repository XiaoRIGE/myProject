<template>
  <view class="course-header">
    <view class="course-header-info u-flex u-col-top">
      <image
        class="book-icon"
        src="~@/static/img/workbench/book.svg"
        mode="scaleToFill"
      />
      <view class="course-name">
        {{ currentCourse.name }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CourseHeader',
  props: {
    currentCourse: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.course-header {
  width: 100%;
  box-sizing: border-box;
  padding: 16rpx 32rpx 12rpx;
  &-info {
    width: 100%;
    border-radius: 20rpx;
    box-sizing: border-box;
    padding: 18rpx;
    border: 1px solid #eaecf0;
  }
  .book-icon {
    width: 48rpx;
    height: 48rpx;
    margin-right: 10rpx;
  }
  .course-name {
    width: calc(100% - 58rpx);
    font-size: 28rpx;
    box-sizing: border-box;
    padding: 8rpx 0 0;
    font-weight: 600;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    color: $u-main-color;
  }
}
</style>
