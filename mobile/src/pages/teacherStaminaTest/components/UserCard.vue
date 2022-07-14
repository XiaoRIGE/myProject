<template>
  <view class="user-card-page">
    <view class="user-info-content">
      <view class="base-info u-flex">
        <text class="base-info-name">
          {{ userInfo.realName }}
        </text>
        <view class="base-info-sex-box u-flex u-row-center">
          <!-- woman -->
          <u-icon
            v-if="userInfo.gender === 1"
            color="#265CFF"
            size="36"
            name="man"
          />
          <u-icon
            v-if="userInfo.gender === 2"
            color="#FA573E"
            size="36"
            name="woman"
          />
          <text class="sex">
            {{ userInfo.genderStr }}
          </text>
        </view>
      </view>
      <view class="code">
        学号：
        <text>{{ userInfo.organizationUserNumber }}</text>
      </view>
      <view class="class-info u-flex">
        <view class="u-left">
          年级：
          <text>{{ userInfo.year }}级</text>
        </view>
        <view class="u-right u-flex-1">
          学院：
          <text>{{ userInfo.organizationName }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
.user-card-page {
  box-sizing: border-box;
  padding: 32rpx;
  .user-info-content {
    background-image: url(~@/static/img/student-stamina-detail-bg.png);
    background-size: 686rpx 222rpx;
    width: 686rpx;
    height: 222rpx;
    box-sizing: border-box;
    padding: 32rpx;
    color: $u-content-color;
    .base-info {
      &-name {
        font-size: 34rpx;
        font-weight: bold;
        color: $u-main-color;
      }
      &-sex-box {
        margin-left: 16rpx;
        width: 108rpx;
        height: 48rpx;
        border-radius: 24rpx;
        background-color: #fff;
        text {
          font-size: 24rpx;
          margin-left: 8rpx;
          color: $u-main-color;
        }
      }
    }
    .code {
      margin-top: 20rpx;
      font-size: 24rpx;
      text {
        margin-left: 8rpx;
        color: $u-main-color;
      }
    }
    .class-info {
      margin-top: 20rpx;
      font-size: 24rpx;
      text {
        color: $u-main-color;
      }
      .u-left {
        width: 45%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .u-right {
        margin-left: 38rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
