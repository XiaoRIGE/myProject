<template>
  <view class="record-history">
    <scroll-view scroll-y="true" style="max-height: 852rpx">
      <view class="record-history-title">
        {{ title }}
      </view>
      <view class="record-history-content">
        <view class="total-sorce">
          <text class="total-sorce-text">
            {{ textValue }}
          </text>
          <text class="total-sorce-sorce">
            {{ getScore(sorceValue) }}
          </text>
          <text class="total-sorce-unit">
            {{ unitValue }}
          </text>
        </view>
        <view
          v-for="(item, index) in semesterItemInfo"
          :key="index"
          class="semester-item u-flex u-row-between u-col-center"
        >
          <view class="semester-item-name">
            {{ item.yearRange
            }}{{ item.semesterType === 1 ? '上学期' : '下学期' }}
          </view>
          <view>
            <text class="semester-item-value">
              {{ getScore(item.score) }}
            </text>
            <text class="semester-item-unit">
              分
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getScore } from '../common';

export default {
  name: 'RecordHistory',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 总计得分文本
    textValue: {
      type: String,
      default: ''
    },
    // 总得分 1,100,222
    sorceValue: {
      type: [String, Number],
      default: ''
    },
    // 单位
    unitValue: {
      type: String,
      default: ''
    },
    // 历史学期数据
    semesterItemInfo: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      getScore
    };
  }
};
</script>

<style lang="scss" scoped>
.record-history {
  color: rgba(43, 45, 51, 1);
  padding-top: 100rpx;
  &-title {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100rpx;
    font-weight: bold;
    font-size: 36rpx;
    text-align: center;
    line-height: 100rpx;
    border-bottom: 1rpx solid rgba(240, 240, 240, 1);
  }
  &-content {
    padding: 26rpx 64rpx 100rpx;
    .total-sorce {
      width: 622rpx;
      height: 108rpx;
      background: rgba(245, 246, 250, 1);
      border-radius: 16rpx;
      text-align: center;
      line-height: 108rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: rgba(84, 82, 102, 1);
      &-sorce {
        display: inline-block;
        margin: 0 10rpx;
        font-size: 44rpx;
        color: rgba(34, 34, 34, 1);
        transform: scale(0.9, 1.1);
      }
      &-unit {
        font-size: 28rpx;
      }
    }
    .semester-item {
      margin-top: 40rpx;
      &-name {
        font-size: 32rpx;
        color: rgba(102, 102, 102, 1);
      }
      &-value {
        font-size: 36rpx;
        font-weight: bold;
        color: rgba(43, 45, 51, 1);
      }
      &-unit {
        display: inline-block;
        margin-left: 8rpx;
        font-size: 28rpx;
        color: #999999;
      }
    }
  }
}
</style>
