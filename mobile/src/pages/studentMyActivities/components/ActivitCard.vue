<template>
  <view class="activity-card u-flex u-row-between" @click="clickActivityCard">
    <view class="activity-card-left u-relative">
      <image :src="stateIcon" class="state-icon u-absolute" mode="heightFix" />
      <image
        v-if="cardInfo.bgUrl !== 'string'"
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
        活动时间: {{ week }}
        {{ `(${$u.timeFormat(Number(cardInfo.startTime), 'mm月dd日')})` }}
        {{ $u.timeFormat(Number(cardInfo.startTime), 'hh:MM') }} -
        {{ $u.timeFormat(Number(cardInfo.endTime), 'hh:MM') }}
      </view>
      <view class="activity-site u-line-1 u-font-24 u-margin-bottom-24">
        活动地点: {{ cardInfo.address }}
      </view>
      <view class="activity-count-btn u-flex u-row-between u-col-center">
        <view class="count u-font-24">
          {{
            cardInfo.limitPeopleNumber
              ? cardInfo.registerPeople + '/' + cardInfo.limitPeopleNumber
              : cardInfo.registerPeople || 0
          }}
          人已报名
        </view>
        <view
          v-if="stateStr"
          class="btn u-text-center u-font-24"
          :style="
            stateStr !== '去签到' && stateStr !== '取消报名'
              ? { opacity: 0.5 }
              : {}
          "
        >
          <text>
            {{ stateStr }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getWeekItem } from '@/utils/common';
import { getStateStr, getMyActivityIcon } from '../common';
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
    }
  },
  computed: {
    stateIcon() {
      if (this.cardInfo) {
        return getMyActivityIcon(this.cardInfo.state);
      }
      return undefined;
    },
    week() {
      if (this.cardInfo) {
        return getWeekItem(this.cardInfo.startTime);
      }
      return undefined;
    },
    stateStr() {
      if (this.cardInfo) {
        return getStateStr(this.cardInfo);
      }
      return undefined;
    },
    dfaultImg() {
      return require(`@/static/img/studentActivitie/defaultBg/week_${week}.png`);
    }
  },
  methods: {
    clickActivityCard() {
      // 触发初始化下拉刷新组件
      // this.$emit('initUpload');
      uni.navigateTo({
        url: `/pages/studentActivitie/detail?id=${this.cardInfo.id}`
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
    .activity-count-btn {
      height: 64rpx;
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
