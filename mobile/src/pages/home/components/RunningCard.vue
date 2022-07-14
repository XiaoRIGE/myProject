<template>
  <view class="card-item" :class="{ 'recommend-content': isRecommend }">
    <image class="bg-img" :src="src" mode="scaleToFill" />
    <view class="title">{{ title }} {{ runningData.hot }}</view>
    <view class="sub-title">
      {{ subTitle }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    runningData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isRecommend: false,
      src: '',
      title: '',
      subTitle: ''
    };
  },
  watch: {
    runningData: {
      handler(nval) {
        if (nval && typeof nval === 'object') {
          const { isRecommend, bgImg, title, subTitle } = nval;
          this.isRecommend = isRecommend;
          this.title = title;
          this.subTitle = subTitle;
          this.src = require(`@/static/img/${bgImg}`);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped lang="scss">
.recommend-content {
  position: relative;
  &::before {
    position: absolute;
    right: 0;
    top: 0;
    border-top-right-radius: 18rpx;
    border-bottom-left-radius: 20rpx;
    font-size: 24rpx;
    width: 120rpx;
    line-height: 40rpx;
    text-align: center;
    content: '学校规定';
    z-index: 2;
    background: linear-gradient(to right, #ff2159 0%, #ff8c08 100%);
  }
}
.card-item {
  position: relative;
  width: 300rpx;
  height: 150rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding-left: 16rpx;
  margin-right: 16rpx;
  color: #fff;
  .sub-title,
  .title {
    z-index: 2;
  }
  .title {
    font-size: 28rpx;
    font-weight: bold;
  }
  .sub-title {
    font-size: 24rpx;
  }
  .bg-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 300rpx;
    height: 150rpx;
    border-radius: 18rpx;
  }
}
</style>
