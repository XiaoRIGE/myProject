<template>
  <view>
    <view class="history-row u-flex u-row-between u-relative">
      <image
        v-if="mileageState === 0"
        class="u-absolute"
        src="~@/static/img/map-bg.png"
        mode="scaleToFill"
      />
      <text class="title">
        {{
          mileageState === 0
            ? data.scoringType === 1
              ? '本学期里程'
              : data.scoringType === 2
                ? '本学期段数'
                : ''
            : '累计里程'
        }}
      </text>
      <view class="btn u-text-center" @click="runningRecordDetail">
        记录
      </view>
    </view>
    <view
      class="mileage-progress"
      :class="{ 'mileage-xq': mileageState === 0 }"
    >
      <!-- 学期里程 -->
      <template v-if="mileageState === 0">
        <view class="progress-info">
          <text v-if="data.scoringType === 1" class="current-pro">
            {{ data.totalMileage || 0 }}
          </text>
          <text v-if="data.scoringType === 1" class="count-pro">
            /{{ data.semesterMileage || 0 }}
          </text>
          <text v-if="data.scoringType === 1" class="unit">
            km
          </text>
          <text v-if="data.scoringType === 2" class="current-pro">
            {{ data.totalPart || 0 }}
          </text>
          <text v-if="data.scoringType === 2" class="current-pro">
            /{{ data.semesterParagraph || 0 }}
          </text>
        </view>
        <u-line-progress
          :height="26"
          :percent="percent"
          :round="true"
          :striped="true"
          :striped-active="true"
          :show-percent="false"
          active-color="#FC6C37"
          inactive-color="#F5F6FA"
        />
      </template>
      <!-- 累计里程 -->
      <template v-if="mileageState === 1">
        <view class="progress-info progress-lj-info u-flex u-row-between">
          <view class="left">
            <text class="current-pro">
              {{ data.totalMileage || 0 }}
            </text>
            <text class="unit">
              km
            </text>
          </view>
          <image
            class="u-relative absolute"
            src="~@/static/img/running-bg.png"
            mode="scaleToFill"
          />
        </view>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MileageNav',
  props: {
    mileageState: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    percent() {
      if (this.mileageState === 1) return 0;
      const {
        totalMileage,
        semesterMileage,
        scoringType,
        totalPart,
        semesterParagraph
      } = this.data;
      if (this.mileageState === 0) {
        if (scoringType === 1) {
          return (totalMileage / semesterMileage) * 100;
        }
        if (scoringType === 2) {
          return (totalPart / semesterParagraph) * 100;
        }
      }
      return 0;
    }
  },
  methods: {
    runningRecordDetail() {
      uni.navigateTo({
        url: `/pages/runningRecord/index?data=${JSON.stringify(this.data)}`
      });
    }
  }
};
</script>

<style scoped lang="scss">
.history-row {
  width: 100%;
  height: 114rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
  .title,
  .btn {
    z-index: 9;
  }
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: $u-main-color;
  }
  .btn {
    width: 108rpx;
    line-height: 52rpx;
    font-size: 24rpx;
    border-radius: 16rpx;
    color: $u-main-color;
    border: 1px solid #c3c2cc;
  }
  image {
    left: 0;
    width: 686rpx;
    height: 114rpx;
  }
}
.mileage-xq {
  background-color: #fff;
  border-bottom-right-radius: 20rpx;
  border-bottom-left-radius: 20rpx;
  padding-bottom: 48rpx !important;
}
.mileage-progress {
  box-sizing: border-box;
  padding: 0 32rpx;

  .progress-info {
    box-sizing: border-box;
    padding: 16rpx 0;
    color: $u-main-color;
    .current-pro {
      font-size: 64rpx;
      font-weight: bold;
    }
    .count-pro {
      font-size: 40rpx;
      font-weight: bold;
    }
    .unit {
      margin-left: 8rpx;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
  .progress-lj-info {
    padding-bottom: 0;
    image {
      right: -32rpx;
      width: 364rpx;
      height: 142rpx;
    }
  }
}
</style>
