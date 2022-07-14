<template>
  <view class="user-card u-flex u-row-between">
    <view class="user-card-left">
      <view class="u-flex">
        <text class="user-card-left-name">
          {{ target.name }}
        </text>
        <view class="user-card-left-sex-box">
          <u-icon :name="genders.icon" :color="genders.color" />
          <text class="sex-name">
            {{ genders.title }}
          </text>
        </view>
      </view>
      <view class="user-card-left-code-info">
        <text class="label">
          学号：
        </text>
        <text class="code">
          {{ target.number }}
        </text>
      </view>
    </view>
    <view class="user-card-right u-flex">
      <text class="score">
        {{ target.total }}
      </text>
      <text class="unit">
        分
      </text>
    </view>
  </view>
</template>

<script>
const genders = {
  1: {
    title: '男',
    icon: 'man',
    color: '#265CFF'
  },
  2: {
    title: '女',
    icon: 'woman',
    color: '#FA573E'
  }
};
export default {
  name: 'ExaminationResultsDetailCard',
  props: {
    target: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    genders() {
      if (!this.target.sex) return {};
      return genders[this.target.sex];
    }
  }
};
</script>

<style lang="scss" scoped>
.user-card {
  width: 100%;
  background-image: url(~@/static/img/examinationResults/detail-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-origin: center;
  box-sizing: border-box;
  padding: 32rpx;
  &-left-name {
    font-size: 34rpx;
    color: $u-main-color;
    font-weight: bold;
  }
  &-left-sex-box {
    width: 108rpx;
    line-height: 48rpx;
    text-align: center;
    margin-left: 20rpx;
    background-color: #fff;
    border-radius: 24rpx;
    .sex-name {
      font-size: 24rpx;
      font-weight: 400;
      margin-left: 4rpx;
      color: $u-main-color;
    }
  }
  &-left-code-info {
    margin-top: 24rpx;
    .label,
    .code {
      font-size: 24rpx;
      font-weight: 400;
    }
    .label {
      color: $u-content-color;
    }
    .code {
      color: $u-main-color;
    }
  }
  &-right {
    .score,
    .unit {
      font-weight: bold;
      color: $u-main-color;
    }
    .score {
      font-size: 64rpx;
    }
    .unit {
      margin-left: 8rpx;
      font-size: 36rpx;
    }
  }
}
</style>
