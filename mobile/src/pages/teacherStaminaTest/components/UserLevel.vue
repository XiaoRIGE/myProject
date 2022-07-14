<template>
  <view class="user-level-container u-flex u-row-between">
    <!-- 判断是是否存在等级状态 -->
    <template v-if="levelInfo.level && levelInfo.level >= 0">
      <view class="user-level-container-left u-flex">
        <image src="~@/static/img/student-star.png" mode="scaleToFill" />
        <text class="score">
          {{ levelInfo.score }}
        </text>
        <text class="fen">
          分
        </text>
      </view>
      <view class="user-level-container-right u-flex">
        <text v-if="levelInfo.bmi" class="value">
          {{ levelInfo.bmi }}
        </text>
        <grade :level="levelInfo.level" />
      </view>
    </template>
    <!-- 不存在分数 -->
    <template v-else>
      <view class="user-level-container-left u-flex">
        <image src="~@/static/img/student-star.png" mode="scaleToFill" />
        <text>{{ levelInfo.message }}</text>
      </view>
    </template>
  </view>
</template>

<script>
import Grade from './Grade';
export default {
  name: 'UserLevel',
  components: {
    grade: Grade
  },
  props: {
    levelInfo: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
.user-level-container {
  position: relative;
  height: 112rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
  // border: 1px solid red;
  &-left {
    image {
      width: 48rpx;
      height: 48rpx;
    }
    text {
      margin-left: 16rpx;
      font-size: 32rpx;
      color: $u-content-color;
    }
    .score {
      margin: 0 8rpx 0 16rpx;
      font-size: 40rpx;
      font-weight: bold;
      color: $u-main-color;
    }
    .fen {
      font-size: 32rpx;
      color: $u-main-color;
    }
  }
  &-right {
    .value {
      margin-right: 16rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: $u-main-color;
    }
  }
  &::after {
    display: block;
    content: '';
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 32rpx;
    right: 32rpx;
    background-color: #f0f0f0;
  }
}
</style>
