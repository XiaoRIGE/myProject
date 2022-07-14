<template>
  <view class="sign-in-nav u-flex u-relative">
    <image
      class="small-bell"
      src="~@/static/img/small-bell-icon.gif"
      mode="scaleToFill"
    />
    <image
      class="sign-in-bg"
      src="~@/static/img/sign-in-bg.png"
      mode="scaleToFill"
    />
    <view>
      <view class="title">
        {{ signInfo.projectName }}
      </view>
      <view class="sub-title">
        {{ $u.timeFormat(signInfo.timeStart, 'mm-dd hh:MM') }}
      </view>
    </view>
    <u-button
      class="sign-btn u-absolute"
      ripple-bg-color="yellow"
      hover-class="none"
      :custom-style="{
        ...baseBtnStyle
      }"
      :disabled="signInfo.signType === 1 || signInfo.signType === 2"
      @click="handelClick"
    >
      {{ signTitle }}
    </u-button>
  </view>
</template>

<script>
const signStates = {
  1: '去签到',
  2: '二次签到'
};
export default {
  name: 'SignInNav',
  props: {
    signInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      signStates
    };
  },
  computed: {
    signTitle() {
      if (this.signInfo.signType === null || this.signInfo.signType === 0)
        return '去签到';
      if (this.signInfo.signType === 1) return '已签到';
      if (this.signInfo.signType === 2) return '已请假';
      return signStates[this.signInfo.times];
    },
    baseBtnStyle() {
      const result = {
        color: '#fff',
        backgroundColor: 'rgba(252,108,55,1)'
      };
      if (this.signInfo.signType === 1 || this.signInfo.signType === 2) {
        result.backgroundColor = 'rgba(252,108,55,.5)';
      }
      return result;
    }
  },
  methods: {
    handelClick() {
      this.$emit('handelClick', this.signInfo);
    }
  }
};
</script>

<style scoped lang="scss">
.sign-in-nav {
  margin: 16rpx 32rpx 0 32rpx;
  width: 686rpx;
  height: 120rpx;
  background-color: #fff;
  border-radius: 16rpx;
  border: 0.5px solid rgba(219, 218, 230, 0.8);
  .small-bell {
    width: 96rpx;
    height: 96rpx;
  }
  .sign-in-bg {
    width: 200rpx;
    height: 120rpx;
    position: absolute;
    right: 0;
    top: 0;
  }
  .title {
    width: 415rpx;
    font-size: 28rpx;
    color: $u-main-color;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sub-title {
    font-size: 24rpx;
    color: $u-content-color;
  }
  .sign-btn {
    top: 34rpx;
    right: 32rpx;
    width: 128rpx;
    height: 52rpx;
    font-size: 24rpx;
  }
}
</style>
