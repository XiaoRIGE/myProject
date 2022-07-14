<template>
  <!-- 单项申诉信息 -->
  <view class="appeal-item">
    <view class="appeal-info">
      <view class="appeal-info-item">
        <image
          class="icon"
          src="~@/static/img/appeal/appeal-time.svg"
          mode="scaleToFill"
        />
        <text class="appeal-info-item-label">申诉时间：</text>
        <text class="appeal-info-item-value">{{ cardInfo.appealTime }}</text>
      </view>
      <view class="appeal-status">{{ cardInfo.handleStateStr }}</view>
    </view>
    <view class="appeal-info">
      <view class="appeal-info-item">
        <image
          class="icon"
          src="~@/static/img/appeal/appeal-type.svg"
          mode="scaleToFill"
        />
        <text class="appeal-info-item-label">申诉类型：</text>
        <text class="appeal-info-item-value">{{ cardInfo.appealTypeStr }}</text>
      </view>
    </view>
    <view v-if="cardInfo.handleState === 0" class="cancel-btn">
      <text class="btn">取消申诉</text>
    </view>

    <g-readMore
      v-if="cardInfo.handleState !== 0"
      :text-value="cardInfo.handleResult"
      :line-num="2"
    >
      <image
        v-if="cardInfo.handleState === 1"
        class="notice-icon"
        src="~@/static/img/appeal/notice.svg"
        mode="scaleToFill"
      />
    </g-readMore>
  </view>
</template>

<script>
export default {
  name: 'AppealItem',
  components: {},
  props: {
    // 申诉信息
    cardInfo: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
.appeal-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  margin-top: 24rpx;
  .appeal-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
    &-item {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      .icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 12rpx;
      }
      &-label {
        font-size: 28rpx;
        font-weight: 400;
        color: #666;
      }
      &-value {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
      }
    }
    .appeal-status {
      font-size: 24rpx;
      font-weight: 400;
      color: #999;
    }
  }

  .cancel-btn {
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 148rpx;
      height: 52rpx;
      border-radius: 16rpx;
      border: 2rpx solid #fc6c37;
      font-size: 24rpx;
      text-align: center;
      font-weight: 400;
      color: #fc6c37;
      line-height: 52rpx;
    }
  }
}
</style>
