<template>
  <view class="educationals-system-login-page">
    <g-navbar back-icon-size="48" title="选课" :border-bottom="false" />
    <view class="educationals-system-login-page__icon">
      <image src="~@/static/img/university/southwest-jiaotong-university.png" />
    </view>
    <view class="educationals-system-login-page__title">
      登录教务系统
    </view>
    <view class="educationals-system-login-page__student-number">
      <view class="educationals-system-login-page__student-number__label">
        学号：
      </view>
      <view class="educationals-system-login-page__student-number__value">
        20191234
      </view>
    </view>
    <u-form
      ref="uForm"
      :model="form"
      label-position="top"
      label-width="28rpx"
      :error-type="errorType"
      :label-style="{ 'font-weight': 'bold' }"
      class="educationals-system-login-page__form"
    >
      <u-form-item label="教务登录密码" prop="password">
        <u-input
          v-model="form.password"
          type="password"
          placeholder="请输入教务登录密码"
          placeholder-style="font-size:32rpx;color:rgba(162,165,170,1);"
        />
      </u-form-item>
    </u-form>
    <view class="educationals-system-login-page__action-bar">
      <u-button
        type="primary"
        class="educationals-system-login-page__action-bar__login-button"
      >
        登录
      </u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        password: ''
      }
    };
  }
};
</script>

<style lang="scss">
page {
  background: white;
}
</style>

<style lang="scss" scoped>
.educationals-system-login-page {
  padding-top: 48rpx;
  padding-left: 48rpx;
  padding-right: 48rpx;
  &__icon {
    margin: 0 auto;
    width: 144rpx;
    height: 144rpx;
    border-radius: 32rpx;
    box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(45, 48, 53, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 110rpx;
      height: 110rpx;
    }
  }

  &__title {
    margin-top: 32rpx;
    text-align: center;
    font-size: 32rpx;
    color: #222;
  }

  &__student-number {
    margin-top: 96rpx;
    display: flex;
    align-items: center;
    color: #222;
    &__label {
      font-size: 28rpx;
      font-weight: bold;
    }
    &__value {
      font-size: 32rpx;
    }
  }

  &__form {
    margin-top: 31rpx;
  }

  &__action-bar {
    margin-top: 88rpx;
    &__login-button {
      height: 110rpx;
      font-size: 32rpx;
      border-radius: 24rpx;
    }
  }
}
</style>
