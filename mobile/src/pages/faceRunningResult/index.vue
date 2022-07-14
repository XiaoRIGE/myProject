<template>
  <view class="face-running-result-container">
    <g-navbar
      back-icon-size="48"
      title="线路打卡记录"
      :border-bottom="false"
      class="navbar"
    ></g-navbar>
    <view class="face-running-result-container__content">
      <view class="face-running-result-container__content__time">
        <text class="face-running-result-container__content__time-date">
          {{ getDateString }}
        </text>
        <text class="face-running-result-container__content__time-hr">/</text>
        <text class="face-running-result-container__content__time-year">
          {{ getYearString }}
        </text>
      </view>
      <g-faceRunningDetailsList
        class="face-running-result-container__content__details"
        :record-data="recordData"
      />
    </view>
  </view>
</template>

<script>
import { running } from '@/request/api/student';
import { getMonthItem, getDateItem, getYearItem } from '@/utils/common';
export default {
  data() {
    return {
      recordData: []
    };
  },
  computed: {
    getDateString() {
      return `${getMonthItem(1653878047000)}月${getDateItem(1653878047000)}日`;
    },
    getYearString() {
      return `${getYearItem(1653878047000)}年`;
    }
  },
  onLoad(option) {
    const startTime = option.startTime;
    this.getFaceRunningDetailsOfDay(startTime);
  },
  methods: {
    getFaceRunningDetailsOfDay(startTime) {
      running
        .getFaceRunningDetailsOfDay({
          startTime
        })
        .then((res) => {
          this.recordData = res.data;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.face-running-result-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
  padding: 0 32rpx;
  .navbar {
    margin-bottom: 26rpx;
  }
  &__content {
    &__time {
      color: #999999;
      margin-bottom: 46rpx;
      &-date {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
      &-hr {
        display: inline-block;
        margin-left: 8rpx;
        margin-right: 16rpx;
      }
      &-year {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
    }
  }
}
</style>
