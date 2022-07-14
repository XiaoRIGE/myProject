<template>
  <view class="running-rules-container">
    <scroll-view scroll-y="true" style="height: 852rpx">
      <view class="rules-title">
        历史记录
      </view>
      <view class="content">
        <view v-if="rule" class="all-valid-mileage">
          {{ scoringType === 1 ? '总计入有效里程' : '总计入有效段数' }}
          <text class="num">
            {{ scoringType === 1 ? totalMileage || 0 : totalPart || 0 }}
          </text>
          {{ scoringType === 1 ? 'km' : '(段)' }}
        </view>
        <view v-else class="all-valid-mileage">
          累计里程
          <text class="num">
            {{ totalMileage || 0 }}
          </text>
          km
        </view>
        <view
          v-for="(item, index) in mileageData"
          :key="index"
          class="semester-mileage"
        >
          <view class="name">
            {{ item.name }}
          </view>
          <view class="mileage-num">
            {{
              item.scoringType === 2
                ? item.totalPart || 0
                : item.totalMileage || 0
            }}
            <text v-if="item.scoringType !== null" class="unit">
              {{ item.scoringType === 2 ? '段' : 'km' }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { running } from '@/request/api/student';
export default {
  props: {
    scoringType: {
      type: Number,
      default: 0
    },
    rule: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mileageData: [],
      totalMileage: 0,
      totalPart: 0
    };
  },
  mounted() {
    this.getHistoryDetails();
  },
  methods: {
    getHistoryDetails() {
      running.getHistoryDetails().then(res => {
        if (res.code === 0 && res.data) {
          this.totalMileage = res.data.totalMileage;
          this.totalPart = res.data.totalPart;
          this.mileageData = res.data.semesterTotal;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.running-rules-container {
  color: rgba(43, 45, 51, 1);
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
    border-bottom: 1rpx solid rgba(240, 240, 240, 1);
  }
  .content {
    // margin-top: 26rpx;
    padding: 26rpx 64rpx 0;
    .all-valid-mileage {
      width: 622rpx;
      height: 108rpx;
      background: rgba(245, 246, 250, 1);
      border-radius: 16rpx;
      text-align: center;
      line-height: 108rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: rgba(84, 82, 102, 1);
      .num {
        display: inline-block;
        margin: 0 10rpx;
        font-size: 44rpx;
        color: rgba(34, 34, 34, 1);
        transform: scale(0.9, 1.1);
      }
    }
    .semester-mileage {
      display: flex;
      margin-top: 40rpx;
      justify-content: space-between;
      align-items: center;
      .name {
        font-size: 32rpx;
        color: rgba(102, 102, 102, 1);
      }
      .mileage-num {
        font-size: 36rpx;
        font-weight: bold;
        color: rgba(43, 45, 51, 1);
        .unit {
          font-size: 32rpx;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
