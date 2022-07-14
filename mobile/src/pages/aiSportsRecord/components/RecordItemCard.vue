<template>
  <view
    class="record-item-card u-flex u-col-top u-row-between"
    @click="clickRecordCard"
  >
    <view class="record-item-card-circle" />
    <view class="record-item-card-info">
      <view class="record-item-card-info-top u-flex u-row-between">
        <view class="u-flex">
          <view class="name u-line-1">
            {{ cardRecord.projectName }}
          </view>
          <view class="date">
            <text>{{ cardRecord.date }}</text>
            <text class="time">
              {{ cardRecord.time }}
            </text>
            <text>{{ cardRecord.week }}</text>
          </view>
        </view>
        <image src="~@/static/img/arrow.png" class="arrow" />
      </view>
      <view class="record-item-card-info-bottom u-flex">
        <view class="sorce-box total-sorce">
          <view class="title">
            总得分
          </view>
          <view class="sorce">
            {{ getScore(cardRecord.totalScore) }}
          </view>
        </view>
        <view v-if="cardRecord.effivtiveScore !== null" class="sorce-box">
          <view class="title">
            有效得分
          </view>
          <view class="sorce">
            {{ getScore(cardRecord.effivtiveScore) }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getScore } from '../common';

export default {
  name: 'RecordItemCard',
  props: {
    cardRecord: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      getScore
    };
  },
  methods: {
    clickRecordCard() {
      this.$emit('clickRecordCard', this.cardRecord.recordId);
    }
  }
};
</script>

<style lang="scss" scoped>
.record-item-card {
  &-circle {
    z-index: 1;
    width: 20rpx;
    height: 20rpx;
    background: #e4e6ea;
    border-radius: 50%;
  }
  &-info {
    width: 638rpx;
    height: 264rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 28rpx 24rpx 24rpx;
    &-top {
      margin-bottom: 24rpx;
      .name {
        max-width: 200rpx;
        font-weight: 500;
        margin-right: 16rpx;
      }
      .date {
        color: #999999;
        font-size: 24rpx;
        .time {
          margin: 0 8rpx;
        }
      }
      .arrow {
        width: 28rpx;
        height: 28rpx;
        float: right;
      }
    }
    &-bottom {
      width: 100%;
      height: 148rpx;
      background: rgba(245, 246, 250, 0.5);
      border-radius: 12rpx;
      padding: 26rpx 0 26rpx 62rpx;
      .sorce-box {
        width: 120rpx;
        color: #2b2d33;
        .title {
          font-size: 24rpx;
          margin-bottom: 10rpx;
        }
        .sorce {
          font-size: 36rpx;
          font-weight: bold;
          transform: scale(1, 1.15);
        }
      }
      .total-sorce {
        margin-right: 124rpx;
      }
    }
  }
}
</style>
