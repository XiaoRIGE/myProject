<template>
  <view class="grade-content">
    <!-- 总分 -->
    <view class="tatal-points-box">
      <qiun-data-charts
        type="arcbar"
        :chart-data="chartData"
        background="none"
        :onmouse="false"
        :opts="opts"
      />
    </view>
    <!-- 成绩详情 -->
    <view v-show="!isOnlyShowAll" class="grade-details">
      <!-- 成绩列表 -->
      <view class="grade-details-list">
        <view class="grade-details-list-title">
          成绩明细
        </view>
        <template v-for="(item, index) in gradeList">
          <view
            v-if="item.proportion"
            :key="index"
            class="grade-details-list-item u-flex u-row-between u-col-center"
          >
            <view class="grade-details-list-item-left">
              <view class="grade-details-list-item-name">
                {{ item.title }}
              </view>
              <view
                v-show="item.key !== 'additionalPoints'"
                class="grade-details-list-item-proportion"
              >
                占总分{{ item.proportion }}%
              </view>
            </view>
            <view>
              <view class="grade-details-list-item-grade">
                {{ item.grade }}
              </view>
            </view>
          </view>
        </template>
      </view>
      <!-- 备注 -->
      <view class="grade-details-remark">
        <view class="grade-details-remark-title">
          备注
        </view>
        <view class="grade-details-remark-content">
          {{ content }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getOpts } from '../common';

export default {
  name: 'GradeContent',
  props: {
    gradeList: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    content: {
      type: String,
      default: ''
    },
    isOnlyShowAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // chartData: {
      //   categories: [],
      //   series: [{ data: 0.5655 }]
      // },
      // opts: Object.freeze(opts)
    };
  },
  computed: {
    chartData() {
      return {
        categories: [],
        series: [{ data: this.$props.total / 100 }]
      };
    },
    opts() {
      return Object.freeze(getOpts(this.$props.total));
    }
  }
};
</script>

<style lang="scss" scoped>
.grade-content {
  margin: 60rpx 32rpx;
  width: 686rpx;
  background: #ffffff;
  border-radius: 16rpx;
  .tatal-points-box {
    width: 100%;
    height: 306rpx;
  }
  .grade-details {
    margin-top: 8rpx;
    &-list {
      &-title {
        padding: 0 28rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #222222;
        margin-bottom: 8rpx;
      }
      &-item {
        width: 100%;
        min-height: 116rpx;
        padding: 16rpx 28rpx;
        border-bottom: solid 2rpx #ececec;
        &-left {
          width: 412rpx;
        }
        &-name,
        &-grade {
          font-size: 28rpx;
          font-weight: bold;
          color: #222222;
        }
        &-proportion {
          font-size: 24rpx;
          font-weight: 400;
          color: #666666;
        }
      }
    }
    &-remark {
      width: 100%;
      padding: 14rpx 28rpx 40rpx;
      &-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #222222;
        margin-bottom: 4rpx;
      }
    }
  }
}
</style>
