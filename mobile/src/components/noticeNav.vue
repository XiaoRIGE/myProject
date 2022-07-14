<template>
  <navigator hover-class="none" url="/pages/noticeList/index">
    <view class="notice-nav u-flex">
      <view class="left-content u-col-center">
        <image src="~@/static/img/notice-icon.svg" mode="aspectFit" />
      </view>
      <view class="swiper-container u-flex u-row-between u-flex-1">
        <swiper
          class="swiper u-flex-1"
          :circular="true"
          :indicator-dots="false"
          :autoplay="true"
          :interval="2000"
          :duration="500"
          :vertical="true"
        >
          <swiper-item v-for="item in noticeList" :key="item.id">
            <view class="swiper-item u-flex">
              <view class="left u-flex">
                <view class="entry-box">
                  {{ supplementary(item.publishTime) }}
                </view>
                <view class="title">
                  {{ item.title }}
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <u-icon name="arrow-right" color="#9EA7BA" size="30" />
      </view>
    </view>
  </navigator>
</template>
<script>
export default {
  name: 'NoticeNav',
  props: {
    noticeList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    supplementary(value) {
      if (!value) return '';
      return this.$u.timeFormat(value, 'mm/dd');
    }
  }
};
</script>
<style scoped lang="scss">
.notice-nav {
  box-sizing: border-box;
  padding: 0 32rpx;
  .left-content {
    display: inline-flex;
    image {
      width: 88rpx;
      height: 88rpx;
    }
  }
  .swiper-container {
    .swiper {
      height: 60rpx;
      .swiper-item {
        box-sizing: border-box;
        padding-left: 18rpx;
        width: 400rpx;
        height: 60rpx;
        .title {
          width: 450rpx;
          font-size: 28rpx;
          color: $u-main-color;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        .entry-box {
          font-size: 24rpx;
          font-weight: bold;
          margin-right: 12rpx;
          width: 80rpx;
          text-align: center;
          line-height: 32rpx;
          border-radius: 8rpx;
          color: $u-main-color;
          border: 1rpx solid #545266;
        }
      }
    }
  }
}
</style>
