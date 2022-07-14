<template>
  <view class="account-page">
    <g-navbar
      class="navbar"
      title="账号安全"
      back-icon-size="48"
      :border-bottom="false"
    />
    <view class="account-page__content">
      <view class="account-page__content__group">
        <navigator
          url="/pages/changePassword/index?type=1"
          open-type="navigate"
          hover-class="none"
        >
          <g-cell title="修改密码" />
        </navigator>
      </view>
      <view>
        <navigator
          url="/pages/accountCancellation/index"
          open-type="navigate"
          hover-class="none"
        >
          <g-cell title="注销账号" :divided="false" />
        </navigator>
      </view>
    </view>
    <!-- <u-popup
      v-model="cancelAccountModal"
      :safe-area-inset-bottom="true"
      :border-radius="24"
      :mask-close-able="false"
      mode="bottom"
    >
      <view class="account-modal-content">
        <view class="title">
          <text>注销账号提示</text>
        </view>
        <view class="content">
          <text>
            帐号注销后，您的帐号权益及帐号相关数据将无法找回，若您已经知晓并接受注销帐号带来的风险和损失，可以联系官方客服确认注销。官方收到您的注销申请后，会在14个工作日内为您注销帐号。注销申请一旦发起，将无法撤回，请谨慎操作。官方客服联系方式：4000222985
          </text>
        </view>
        <view>
          <u-button
            :custom-style="customStyle"
            type="primary"
            @click="cancelAccountModal = false"
          >
            我知道了
          </u-button>
        </view>
      </view>
    </u-popup> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      customStyle: {
        height: '92rpx',
        borderRadius: '24rpx'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.account-page {
  &__content {
    &__group {
      margin-top: 32rpx;
    }
  }
  .account-modal-content {
    box-sizing: border-box;
    padding: 24rpx 40rpx;
    .title {
      text-align: center;
      text {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: $u-main-color;
      }
    }
    .content {
      margin: 50rpx 0 72rpx;
      text {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $u-main-color;
      }
    }
  }
}
</style>
