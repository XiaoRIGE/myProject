<template>
  <view class="running-rules-container">
    <scroll-view scroll-y="true" style="max-height: 980rpx">
      <view class="rules-title">
        AI运动规则
      </view>
      <view class="content">
        <text class="hint">
          * 超过每日/周上限得分，不计入学期累计有效得分
        </text>
        <view class="rules">
          <view class="ruleItem">
            <view class="rule-title">
              每日得分上限
            </view>
            <view class="rule-detail">
              {{ setThousandMark(ruleInfo.dayGoals || 0) }}
            </view>
          </view>
          <view class="ruleItem">
            <view class="rule-title">
              每周得分上限
            </view>
            <view class="rule-detail">
              {{ setThousandMark(ruleInfo.weekGoals || 0) }}
            </view>
          </view>
          <view class="ruleItem">
            <view class="rule-title">
              学期得分目标
            </view>
            <view class="rule-detail">
              {{ setThousandMark(ruleInfo.semesterGoals || 0) }}
            </view>
          </view>
        </view>
        <view class="run-row">
          <view class="run-row-title font-size16">
            AI运动日期
          </view>
          <view class="run-row-content">
            {{ ruleInfo.startDate }} 至 {{ ruleInfo.endDate }}
          </view>
        </view>
        <view class="run-row">
          <view class="run-row-title font-size16">
            自选运动
          </view>
          <view class="run-row-content">
            <view class="run-row-content-desc">
              <text>1.建议每日保证运动时间超过10分钟；</text>
            </view>
            <view class="run-row-content-desc">
              <text>2.建议每周运动3~4天，每日至少运动10分钟；</text>
            </view>
            <view class="run-row-content-desc">
              <text>
                3.建议运动详情页勾选“运动前后热身拉伸”防止受伤，舒展身体；
              </text>
            </view>
            <view class="run-row-content-desc">
              <text>
                4.运动时请使用稳定的网络，失败数据运动结束60分钟后计入无效得分
              </text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { setThousandMark } from '@/utils/common';
export default {
  props: {
    ruleInfo: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    setThousandMark(num) {
      return setThousandMark(num);
    }
  }
};
</script>

<style lang="scss" scoped>
.running-rules-container {
  padding-top: 100rpx;
  .rules-title {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100rpx;
    font-weight: bold;
    font-size: 36rpx;
    text-align: center;
    line-height: 100rpx;
  }
  .content {
    margin: 16rpx 0 32rpx;
    padding: 0 32rpx;
    .hint {
      color: rgba(102, 102, 102, 1);
      margin-bottom: 24rpx;
    }
    .rules {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 24rpx;
      margin-bottom: 8rpx;
      .ruleItem {
        width: 218rpx;
        height: 136rpx;
        text-align: center;
        background: rgba(245, 246, 250, 1);
        border-radius: 16rpx;
        margin-bottom: 16rpx;
        .rule-title {
          font-size: 24rpx;
          color: rgba(102, 102, 102, 1);
          margin: 24rpx 0 10rpx;
        }
        .rule-detail {
          font-size: 32rpx;
          font-weight: bold;
          transform: scale(0.85, 1.1);
          color: rgba(34, 34, 34, 1);
        }
      }
    }
    .run-row {
      margin-bottom: 32rpx;
      &-title {
        font-size: 32rpx;
        font-weight: bold;
        color: $u-main-color;
      }
      &-content {
        margin-top: 8rpx;
        font-size: 28rpx;
        color: $u-main-color;
        &-desc {
          box-sizing: border-box;
          padding: 6rpx 0;
          font-size: 28rpx;
          color: $u-main-color;
        }
      }
    }
    .scope-run {
      margin-bottom: 32rpx;
    }
  }
}
.font-size16 {
  font-size: 32rpx;
  font-weight: bold;
}
.line-h20 {
  font-weight: 400;
  line-height: 40rpx;
}
</style>
