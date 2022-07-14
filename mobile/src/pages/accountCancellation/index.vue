<template>
  <view class="logoff-page">
    <g-navbar
      class="navbar"
      title="注销账号"
      back-icon-size="48"
      :border-bottom="false"
    />
    <view class="u-flex u-col-center u-row-center">
      <image
        class="warn-icon"
        src="~@/static/img/warn.svg"
        mode="scaleToFill"
      />
    </view>
    <p class="strong text-center">注销账号须知</p>
    <p class="warn-text text-center">
      请您仔细阅读以下内容，成功提交注销申请后系统审核将在7个自然日内完成账号注销
    </p>
    <view class="card">
      <ul>
        <li>无法登录、使用乐健体育账号</li>
        <li>
          移除该账号下所有关联数据
          (包括但不限于：跑步里程、AI运动分数、体测数据、体育课成绩等)
        </li>
        <li>注销后数据无法恢复</li>
      </ul>
    </view>
    <view class="fixed-btn">
      <p>请您再次确认是否注销？</p>
      <u-button
        class="bold-btn"
        :custom-style="customStyle"
        type="primary"
        @click="onCancelAccount"
      >
        我已知晓，确认注销
      </u-button>
    </view>
    <g-modal
      v-model="showModal"
      content="您正在注销该账号，是否继续？"
      :show-cancel-button="true"
      confirm-text="取消"
      cancel-text="继续"
      @cancel="handleConfirm"
    ></g-modal>
  </view>
</template>

<script>
import { cancellation } from '@/request/api/authorization/index.js';
import { logOut } from '@/utils/common';

export default {
  data() {
    return {
      customStyle: {
        height: '92rpx',
        borderRadius: '24rpx'
      },
      showModal: false
    };
  },
  methods: {
    onCancelAccount() {
      this.showModal = true;
    },
    async handleConfirm() {
      try {
        const res = await cancellation();
        if (res) {
          uni.showToast({
            title: '账户已注销',
            icon: 'none'
          });

          setTimeout(() => {
            logOut();
          }, 1500);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.logoff-page {
  padding: 0 32rpx;
  .warn-icon {
    margin: 64rpx 0 32rpx;
    width: 200rpx;
    height: 200rpx;
  }
  .strong {
    margin-bottom: 16rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: #222222;
    line-height: 56rpx;
  }
  .warn-text {
    font-size: 28rpx;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
  }
  .text-center {
    text-align: center;
  }
  .card {
    margin-top: 48rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 32rpx;
    ul {
      padding: 0 32rpx;
    }
    li:not(:last-child) {
      margin-bottom: 32rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #222222;
      line-height: 40rpx;
    }
  }
  .fixed-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 88rpx;
    box-sizing: border-box;
    padding: 0 32rpx;
    p {
      margin-bottom: 36rpx;
      text-align: center;
      font-size: 28rpx;
      font-weight: 400;
      color: #666666;
      line-height: 40rpx;
    }
    .bold-btn {
      font-weight: 600;
    }
  }
  ::v-deep .u-model__content__message {
    padding: 80rpx 48rpx;
    font-size: 34rpx;
    font-weight: 600;
    color: #353535 !important;
  }
}
</style>
