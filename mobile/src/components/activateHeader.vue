<template>
  <view class="header">
    <view class="header-nav u-flex u-col-center u-row-between">
      <image
        class="header-back-icon"
        src="~@/static/img/left.svg"
        mode="scaleToFill"
        @click="onClickBackIcon"
      />
      <view v-if="isRightShow" class="header-right">
        已有账号？
        <text class="login" @click="onClickLogin">
          直接登录
        </text>
      </view>
    </view>
    <view class="title">
      {{ title }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isRightShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClickLogin() {
      uni.reLaunch({
        url: '/pages/login/index'
      });
    },
    onClickBackIcon() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  width: 750rpx;
  height: 356rpx;
  background: url('~@/static/img/choose-bg.png');
  background-size: cover;
  &-nav {
    width: 100%;
    position: absolute;
    top: 108rpx;
    padding: 0 48rpx 0 32rpx;
  }
  &-back-icon {
    height: 48rpx;
    width: 48rpx;
  }
  &-right {
    font-size: 24rpx;
    color: rgba(153, 153, 153, 1);
    .login {
      font-weight: bold;
      color: rgba(252, 108, 55, 1);
    }
  }
  .navbar {
    .nav-right {
      margin-right: 48rpx;
      font-size: 24rpx;
      color: rgba(153, 153, 153, 1);
      .login {
        font-weight: bold;
        color: rgba(252, 108, 55, 1);
      }
    }
  }
  .title {
    position: absolute;
    top: 208rpx;
    left: 48rpx;
    font-size: 64rpx;
    font-weight: bold;
    color: #222222;
    line-height: 45px;
  }
}
</style>
