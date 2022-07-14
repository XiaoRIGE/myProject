<template>
  <view class="subject-list--item--title">
    <!-- 标题信息 -->
    {{ index }}.
    <view class="subject-list--item--title--tag">
      {{ typeName }}
    </view>
    {{ title }}
  </view>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    typeName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.subject-list {
  &--item--title {
    box-sizing: border-box;
    padding-bottom: 26rpx;
    flex-wrap: wrap;
    flex-shrink: 0;
    font-size: 30rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $u-main-color;
    border-bottom: 1px solid #ececec;
    &--tag {
      height: 32rpx;
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      margin: 0 8rpx;
      padding: 0 8rpx;
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $u-type-primary;
      background-color: rgba(252, 108, 55, 0.1);
      border-radius: 8rpx;
    }
  }
}
</style>
