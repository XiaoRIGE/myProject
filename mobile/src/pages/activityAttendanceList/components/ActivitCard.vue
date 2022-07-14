<template>
  <view class="activity-card u-flex u-row-between" @click="clickActivityCard">
    <view class="activity-card-left u-relative">
      <image :src="stateIcon" class="state-icon u-absolute" mode="heightFix" />
      <image
        v-if="cardInfo.bgUrl !== 'string'"
        :lazy-load="true"
        :src="cardInfo.bgUrl || dfaultImg"
        class="bg-icon"
        mode="aspectFill"
      />
    </view>
    <view class="activity-card-right">
      <view class="activity-name u-line-2 u-font-32 u-margin-bottom-16">
        {{ cardInfo.name }}
      </view>
      <view class="activity-time u-line-1 u-font-24 u-margin-bottom-4">
        活动时间: {{ activityTime }}
      </view>
      <view class="activity-site u-line-1 u-font-24">
        活动地点: {{ cardInfo.address }}
      </view>
      <view
        v-if="state === 3 && registerState === 0"
        class="dowm-date u-flex u-margin-top-4"
      >
        <u-icon size="28" name="clock-fill" color="#FC6C37" />
        <text class="f6">
          距报名
        </text>
        <view class="f6 box">
          {{ countDownTime.day }}
        </view>
        天
        <view class="f6 box">
          {{ countDownTime.h }}
        </view>
        时
        <view class="f6 box">
          {{ countDownTime.m }}
        </view>
        分
      </view>
      <view
        class="activity-count-btn u-flex u-row-between u-col-center"
        :style="
          state === 3 && registerState === 0 ? {} : { marginTop: '24rpx' }
        "
      >
        <view class="count u-font-24">
          {{
            cardInfo.limitPeopleNumber
              ? cardInfo.registerPeople + '/' + cardInfo.limitPeopleNumber
              : cardInfo.registerPeople || 0
          }}
          人已报名
        </view>
        <view
          v-if="canOpenSignInState"
          class="btn u-text-center u-font-24"
          :style="cardInfo.signTime > 0 ? { opacity: 0.5 } : {}"
        >
          {{ cardInfo.signTime > 0 ? '签到中' : '开启签到' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getActivityTime, canOpenSignIn } from '../common';
import { getActivityIcon, getRegisterState } from '@/utils/common';
const week = new Date().getDay();

export default {
  name: 'ActivitCard',
  props: {
    cardInfo: {
      type: Object,
      default: null
    },
    current: {
      type: Number,
      default: 0
    },
    state: {
      type: Number,
      default: 0
    }
  },
  computed: {
    stateIcon() {
      if (this.state && this.cardInfo) {
        return getActivityIcon(this.state, getRegisterState(this.cardInfo));
      }
      return undefined;
    },
    activityTime() {
      if (this.cardInfo) {
        return getActivityTime(this.cardInfo.startTime, this.cardInfo.endTime);
      }
      return undefined;
    },
    registerState() {
      if (this.cardInfo) {
        return getRegisterState(this.cardInfo);
      }
      return undefined;
    },
    canOpenSignInState() {
      if (this.cardInfo) {
        return canOpenSignIn(this.cardInfo);
      }
      return 0;
    },
    countDownTime() {
      const result = {
        day: 0,
        h: 0,
        m: 0
      };
      const currentTimestamp = new Date().getTime();
      const start = this.cardInfo.registerStartTime;
      if (start && start > currentTimestamp) {
        const nowStartTime = Number(start);
        const restSec = nowStartTime - currentTimestamp;
        result.day = parseInt(restSec / (60 * 60 * 1000 * 24));
        result.h = parseInt((restSec / (60 * 60 * 1000)) % 24);
        result.m = parseInt((restSec / (60 * 1000)) % 60);
      }
      return result;
    },
    dfaultImg() {
      return require(`@/static/img/studentActivitie/defaultBg/week_${week}.png`);
    }
  },
  methods: {
    clickActivityCard() {
      const { id } = { ...this.cardInfo };
      const info = {
        id,
        state: this.state
      };
      // 触发初始化下拉刷新组件
      // this.$emit('initUpload');
      uni.navigateTo({
        url: `/pages/activityAttendanceDetail/index?info=${JSON.stringify(
          info
        )}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-card {
  width: 702rpx;
  height: 312rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  margin-top: 24rpx;
  padding: 24rpx;
  &-left {
    width: 200rpx;
    height: 264rpx;
    background: rgba(216, 216, 216, 1);
    border-radius: 12rpx;
    .state-icon {
      height: 44rpx;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .bg-icon {
      width: 200rpx;
      height: 264rpx;
      position: absolute;
      right: 0;
      border-radius: 12rpx;
    }
  }
  &-right {
    width: 430rpx;
    height: 264rpx;
    .activity-name {
      height: 88rpx;
      font-weight: bold;
    }
    .activity-time,
    .activity-site {
      color: rgba(102, 102, 102, 1);
    }
    .dowm-date {
      font-size: 12px;
      box-sizing: border-box;
      padding: 4rpx 8rpx;
      height: 36rpx;
      margin-bottom: 6rpx;
      color: $u-type-primary;
      background: linear-gradient(
        270deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(254, 241, 236, 1) 100%
      );
      border-radius: 20rpx 0px 0px 20rpx;
      .f6 {
        font-weight: 600;
      }
      .box {
        box-sizing: border-box;
        padding: 0 5rpx;
        line-height: 28rpx;
        margin: 0 5rpx;
        text-align: center;
        border-radius: 4rpx;
        background: rgba(255, 255, 255, 1);
        border: 0.5rpx solid #c3c2cc;
      }
    }
    .activity-count-btn {
      // height: 64rpx;
      .count {
        color: rgba(153, 153, 153, 1);
      }
      .btn {
        width: 156rpx;
        height: 64rpx;
        line-height: 64rpx;
        background: rgba(252, 108, 55, 1);
        border-radius: 16rpx;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
