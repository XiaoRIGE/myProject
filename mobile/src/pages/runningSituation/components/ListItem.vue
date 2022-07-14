<template>
  <view
    class="list-item-content u-flex"
    :style="{ 'background-color': backgroundColor }"
  >
    <view class="student-info list-item-content-col">
      <view class="student-info-name">
        {{ target.name }}({{ target.sex }})
      </view>
      <text class="student-info-code">
        {{ target.number }}
      </text>
    </view>
    <view class="student-score list-item-content-col">
      <view class="student-score-label">
        <text>{{ currentNum }}</text>
        <text>/{{ target.semesterTarget }}{{ unit }}</text>
      </view>
      <view>
        <custom-progress :percentage="progress" />
      </view>
    </view>
    <view class="student-achievement list-item-content-col">
      <text>{{ target.grade }}</text>
    </view>
  </view>
</template>

<script>
import CustomProgress from './CustomProgress';
export default {
  components: {
    'custom-progress': CustomProgress
  },
  props: {
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    target: {
      type: Object,
      default: () => ({})
    },
    scoringType: {
      type: Number,
      default: 0
    }
  },
  computed: {
    currentNum() {
      const { operationMileage, mileage, operationPart, part } = this.target;
      // 里程模式
      if (this.scoringType === 1) return operationMileage || mileage || 0;
      // 段数模式
      if (this.scoringType === 2) return operationPart || part || 0;
      return 0;
    },
    unit() {
      return this.scoringType === 1 ? 'km' : this.scoringType === 2 ? '段' : '';
    },
    progress() {
      const { semesterTarget } = this.target;
      return (this.currentNum / semesterTarget) * 100;
    }
  }
};
</script>

<style lang="scss" scoped>
.list-item-content {
  height: 132rpx;
  justify-content: space-between;
  .student-info {
    &-name {
      font-size: 28rpx;
      color: $u-main-color;
      font-weight: 400;
      margin-bottom: 4rpx;
    }
    &-code {
      font-size: 24rpx;
      color: $u-content-color;
      font-weight: 400;
    }
  }
  .student-score {
    &-label text {
      &:first-child {
        font-size: 32rpx;
        font-weight: 500;
        color: $u-main-color;
      }
      &:last-child {
        font-size: 24rpx;
        color: $u-main-color;
        font-weight: 400;
      }
    }
  }
  .student-achievement {
    font-size: 32rpx;
    font-weight: bold;
    color: $u-main-color;
    text-align: center;
  }
  &-col {
    box-sizing: border-box;
    &:first-child {
      width: 292rpx;
      padding-left: 32rpx;
    }
    &:nth-child(2) {
      width: 292rpx;
    }
    &:last-child {
      width: 166rpx;
      justify-content: center;
      padding-right: 32rpx;
    }
  }
}
</style>
