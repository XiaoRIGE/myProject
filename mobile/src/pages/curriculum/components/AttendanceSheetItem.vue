<template>
  <view class="attend-item" :style="[{ background: bgColor }]">
    <template v-if="isGpsSignIn">
      <view class="attend-item-week white">
        第{{ attendance.weekNumber }}周
      </view>
      <view class="attend-item-date white">
        {{
          attendance.startSignDate
            ? $u.timeFormat(attendance.startSignDate, 'mm/dd')
            : ''
        }}
      </view>
      <view class="attend-item-opt qd white" @click="sigin">
        <text v-if="attendance.startSignNumber === 1">
          去签到
        </text>
        <text v-if="attendance.startSignNumber === 2">
          二次签到
        </text>
      </view>
    </template>
    <template v-else>
      <view class="attend-item-week main-color">
        第{{ attendance.weekNumber }}周
      </view>
      <view class="attend-item-date gray">
        {{
          attendance.startSignDate
            ? $u.timeFormat(attendance.startSignDate, 'mm/dd')
            : ''
        }}
      </view>
      <view class="attend-item-opt u-flex u-row-center">
        <!-- 未开启 -->
        <text v-if="!attendance.startSignDataStatus" class="s-wkq">
          未开启
        </text>
        <!-- 假期 -->
        <image
          v-if="attendance.signType === 2"
          src="~@/static/img/jia-icon.svg"
          mode="aspectFit"
        />
        <!-- 未签到 -->
        <image
          v-if="attendance.signType === 0"
          src="~@/static/img/close-icon.svg"
          mode="aspectFit"
        />
        <!-- 已签到 -->
        <image
          v-if="attendance.signType === 1"
          src="~@/static/img/success-icon.svg"
          mode="aspectFit"
        />
      </view>
    </template>
  </view>
</template>

<script>
export default {
  props: {
    attendance: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    // 是否GPS签到状态，包括第一次签到和第二次签到，
    isGpsSignIn() {
      // allowSign: 是否允许签到并且开启GPS签到
      // signNumber: 签到次数 1：首次签到，2：二次签到
      // signType：签到状态 0：未签到，1：已签到，2：请假
      return this.attendance.allowSign;
    },
    // 设置背景色
    bgColor() {
      return this.isGpsSignIn
        ? 'linear-gradient(180deg,rgba(35,66,117,1) 0%,rgba(23,43,76,1) 100%)'
        : '#F5F6FA';
    }
  },
  methods: {
    sigin() {
      this.$emit('sigin', this.attendance);
    }
  }
};
</script>

<style scoped lang="scss">
.attend-item {
  width: 142rpx;
  height: 172rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 16rpx 0;
  border-radius: 16rpx;
  & view {
    text-align: center;
  }
  &-week {
    font-size: 28rpx;
    font-weight: bold;
  }
  &-date {
    font-size: 24rpx;
  }
  &-opt image {
    width: 48rpx;
    height: 48rpx;
  }
}
.white {
  color: #fff;
}
.gray {
  color: $u-content-color;
}
.qd {
  width: 112rpx;
  text-align: center;
  line-height: 52rpx;
  font-size: 24rpx;
  border-radius: 16rpx;
  background-color: $u-type-primary;
}
.main-color {
  color: $u-main-color;
}
.s-wkq {
  font-size: 28rpx;
  font-weight: bold;
  color: #c3c2cc;
}
</style>
