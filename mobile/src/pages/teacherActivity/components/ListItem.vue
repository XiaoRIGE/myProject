<template>
  <view
    class="list-item-content u-flex"
    :style="{ 'background-color': backgroundColor }"
  >
    <view class="student-info list-item-content-col">
      <view class="student-info-name u-flex">
        <view class="u-line-1">
          {{ stuInfo.name }}
        </view>
        <view>({{ stuInfo.sex === 1 ? '男' : '女' }})</view>
      </view>
      <view class="student-info-code u-line-1">
        {{ stuInfo.number }}
      </view>
    </view>
    <view class="student-score list-item-content-col">
      <view class="student-score-label">
        <text>{{ stuInfo.signedTimes }}</text>
        <text>/{{ stuInfo.totalTimes }}次</text>
      </view>
      <view>
        <custom-progress :percentage="percentage" />
      </view>
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
    stuInfo: {
      type: Object,
      default: null
    }
  },
  computed: {
    percentage() {
      if (this.stuInfo.totalTimes === 0 && this.stuInfo.signedTimes === 0) {
        return 0;
      } else if (
        this.stuInfo.totalTimes === 0 &&
        this.stuInfo.signedTimes !== 0
      ) {
        return 100;
      } else {
        return (
          (this.stuInfo.signedTimes / this.stuInfo.totalTimes).toFixed(2) * 100
        );
      }
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
      :first-child {
        max-width: 140rpx;
      }
    }
    &-code {
      max-width: 228rpx;
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
      width: 250rpx;
      padding-left: 32rpx;
    }
    &:last-child {
      width: 388rpx;
      padding-right: 32rpx;
    }
  }
}
</style>
