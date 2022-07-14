<template>
  <view class="activity-statistic-container">
    <view class="title">
      活动统计
    </view>
    <view class="content">
      <view class="content-top">
        <view class="tip">
          计入成绩
        </view>
        <view class="content-top-content">
          <view class="content-top-content-title">
            我的活动签到目标
          </view>
          <view class="content-top-content-times">
            <text class="content-top-content-times-num">
              {{ activityStatistic.signedTimes }}/{{
                activityStatistic.totalTimes
              }}
            </text>
            <text class="content-top-content-times-unin">
              次
            </text>
          </view>
          <u-line-progress
            active-color="#FC6C37"
            inactive-color="#FFDACC "
            height="12"
            :show-percent="false"
            :percent="percent"
          />
          <view class="content-top-content-footer u-flex u-row-between">
            <view>
              活动报名
              <text class="content-top-content-footer-num">
                {{ activityStatistic.registerNumber }}
              </text>
              次
            </view>
            <view>
              活动签到
              <text class="content-top-content-footer-num">
                {{ activityStatistic.signedTimes }}
              </text>
              次
            </view>
          </view>
        </view>
      </view>
      <view class="content-bottom">
        <view class="tip">
          不计入成绩
        </view>
        <view class="content-bottom-content u-flex u-row-between">
          <view>
            活动报名
            <text class="content-bottom-content-num">
              {{ activityStatistic.registerNoGradeNumber }}
            </text>
            次
          </view>
          <view>
            活动签到
            <text class="content-bottom-content-num">
              {{ activityStatistic.signedTimesNoGrade }}
            </text>
            次
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ActivityStatistic',
  props: {
    activityStatistic: {
      type: Object,
      default: null
    }
  },
  computed: {
    percent() {
      if (
        this.activityStatistic.totalTimes === 0 &&
        this.activityStatistic.signedTimes === 0
      ) {
        return 0;
      } else if (
        this.activityStatistic.totalTimes === 0 &&
        this.activityStatistic.signedTimes !== 0
      ) {
        return 100;
      } else {
        return (
          (
            this.activityStatistic.signedTimes /
            this.activityStatistic.totalTimes
          ).toFixed(2) * 100
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-statistic-container {
  color: rgba(43, 45, 51, 1);
  // height: 740rpx;
  .title {
    width: 100%;
    height: 100rpx;
    font-weight: bold;
    font-size: 36rpx;
    text-align: center;
    line-height: 100rpx;
  }
  .content {
    margin: 16rpx 32rpx;
    width: 682rpx;
    &-top,
    &-bottom {
      width: 100%;
      border-radius: 16rpx;
      border: 2rpx solid #eaecf0;
      .tip {
        margin-top: 28rpx;
        width: 156rpx;
        height: 44rpx;
        border-radius: 4rpx 200rpx 200rpx 4rpx;
        text-align: center;
        font-size: 24rpx;
        line-height: 44rpx;
        font-weight: 500;
      }
    }
    &-top {
      height: 308rpx;
      margin-bottom: 32rpx;
      .tip {
        color: #fc6c37;
        background: #ffeae2;
      }
      &-content {
        padding: 0 90rpx;
        text-align: center;
        &-title {
          font-weight: 500;
          color: #222222;
        }
        &-times {
          &-num {
            font-weight: bold;
            font-size: 48rpx;
            margin: 8rpx 6rpx 16rpx 0;
          }
          &-unin {
            font-weight: 500;
            color: #999999;
          }
        }
        &-footer {
          margin-top: 22rpx;
          font-weight: 500;
          color: #999999;
          font-size: 24rpx;
          &-num {
            font-weight: bold;
            color: #222222;
            font-size: 32rpx;
            margin: 0 6rpx;
          }
        }
      }
    }
    &-bottom {
      height: 168rpx;
      margin-bottom: 48rpx;
      .tip {
        color: #7f9aa1;
        background: #e3edef;
      }
      &-content {
        margin: 22rpx 90rpx 0;
        font-weight: 500;
        color: #999999;
        font-size: 24rpx;
        &-num {
          font-weight: bold;
          color: #222222;
          font-size: 32rpx;
          margin: 0 6rpx;
        }
      }
    }
  }
}
</style>
