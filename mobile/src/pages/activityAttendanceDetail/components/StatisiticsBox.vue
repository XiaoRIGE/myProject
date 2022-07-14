<template>
  <view class="statisitics-box u-flex">
    <view class="all-stu">
      <view class="all-stu-num">
        {{
          limitPeopleNumber === null
            ? userCount
            : userCount + '/' + limitPeopleNumber
        }}
        <!-- {{ countInfo }}
        {{ limitPeopleNumber }} -->
      </view>
      <view class="all-stu-text">
        报名人数
      </view>
    </view>
    <view class="u-flex u-row-between u-flex-wrap">
      <view
        v-for="(item, index) in countInfoVo"
        :key="index"
        class="data-item u-flex u-row-between"
      >
        <view>
          <view
            class="diamonds"
            :style="{ background: stateColorArr[item.index] }"
          />
          {{ stateArr[item.index] }}
        </view>
        <view class="item-count">
          {{ item.count }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCountInfo } from '@/utils/common';

export default {
  name: 'StatisiticsBox',
  props: {
    countInfo: {
      type: Object,
      default: null
    },
    limitPeopleNumber: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      stateArr: ['未签到', '首次签到', '二次签到', '请假'], // 0:未签到 1:首次签到 2:二次签到 3:请假
      stateColorArr: ['#8B8A99', '#76BF26', '#2DB7B2', '#FFAB02']
    };
  },
  computed: {
    countInfoVo() {
      if (this.countInfo) {
        return getCountInfo(this.countInfo);
      }
      return getCountInfo(null);
    },
    userCount() {
      if (this.countInfo) {
        return this.countInfo.userCount || 0;
      }
      return 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.statisitics-box {
  width: 100%;
  height: 136rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  border: 2rpx solid rgba(219, 218, 230, 1);
  margin-top: 24rpx;
  padding: 20rpx 32rpx;
  color: $u-content-color;
  .all-stu {
    margin-right: 40rpx;
    text-align: center;
    &-text {
      width: 112rpx;
    }
    &-num {
      font-size: 32rpx;
      font-weight: bold;
      line-height: 48rpx;
      color: $u-main-color;
    }
  }
  .data-item {
    width: 49%;
    .diamonds {
      display: inline-block;
      width: 12rpx;
      height: 12rpx;
      margin-bottom: 4rpx;
      margin-right: 8rpx;
    }
    .item-count {
      font-size: 32rpx;
      font-weight: bold;
      line-height: 48rpx;
      color: $u-main-color;
    }
  }
  .data-item:nth-child(2n) {
    width: 43%;
  }
}
</style>
