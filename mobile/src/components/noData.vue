<template>
  <view class="empty">
    <image
      src="~@/static/img/empty-course.png"
      class="empty-img"
      mode="scaleToFill"
    />
    <view class="empty-text">{{ noticeText }}</view>
  </view>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    noticeText: {
      type: String,
      default: '暂无申诉哦～'
    }
  }
};
</script>

<style scoped lang="scss">
.empty {
  margin: 224rpx auto 0;
  text-align: center;
  &-img {
    width: 400rpx;
    height: 300rpx;
  }
  &-text {
    margin-top: 40rpx;
    font-size: 32rpx;
  }
}
</style>
