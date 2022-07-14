<template>
  <view class="course-card">
    <view class="course-card-top u-flex u-row-between">
      <view class="course-card-top-left u-flex">
        <image src="~@/static/img/book-icon.png" mode="aspectFit" />
        <text>当前课程</text>
      </view>
      <view class="course-card-top-right" @click="clickDetailHandle">
        <text>查看详情</text>
        <u-icon siz="24" name="arrow-right" />
      </view>
    </view>
    <view class="course-card-bottom">
      {{ currentCourse ? currentCourse.name : '' }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'CourseCard',
  props: {
    currentCourse: {
      type: Object,
      default: null
    }
  },
  computed: {
    courseId() {
      if (this.$props.currentCourse) {
        return this.$props.currentCourse.id;
      }
      return '';
    },
    courseName() {
      if (this.$props.currentCourse) {
        return this.$props.currentCourse.name;
      }
      return '';
    }
  },
  methods: {
    clickDetailHandle() {
      const { courseId, courseName } = this;
      uni.navigateTo({
        url: `/pages/curriculum/detail?id=${courseId} + &title=${courseName}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.course-card {
  width: 100%;
  border-radius: 20rpx;
  box-sizing: border-box;
  padding: 24rpx 24rpx 32rpx 24rpx;
  background-color: #fff;
  &-top {
    &-left {
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
    &-right {
      font-size: 24rpx;
      color: $u-content-color;
      text {
        margin-right: 8rpx;
      }
    }
  }
  &-bottom {
    margin-top: 26rpx;
    font-size: 28rpx;
    color: $u-main-color;
  }
}
</style>
