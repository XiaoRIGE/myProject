<template>
  <view class="face-running-details-list">
    <view
      v-for="(item, index) in recordData"
      :key="index"
      class="face-running-details-list__item"
    >
      <view
        class="face-running-details-list__item__state"
        :class="getStateClassString(item.state)"
      >
        {{ getStateString(item.state) }}
      </view>
      <view class="face-running-details-list__item__icon">
        <image
          :src="getstateIcon(item.state, item.routeFlag)"
          mode="scaleToFill"
          class="state-img"
        />
        <u-line
          v-if="index !== recordData.length - 1"
          length="100%"
          direction="col"
          :hair-line="false"
          margin="0 0 0 -4rpx"
          :color="getColor(item.routeFlag)"
        />
      </view>
      <view class="face-running-details-list__item__content">
        <view
          class="face-running-details-list__item__content__name u-line-1"
          :class="item.state === 4 ? 'color-gray' : ''"
        >
          {{ item.locationName }}
        </view>
        <view
          class="face-running-details-list__item__content__time"
          :class="item.state === 4 ? 'color-gray' : ''"
        >
          {{ $u.timeFormat(item.uploadingTime, 'hh:MM:ss') }}
        </view>
        <view class="face-running-details-list__item__content__reason">
          {{ item.unEffectiveReason ? item.unEffectiveReason : '' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import invalidIcon from '@/static/img/runningResult/face-running-invalid.png';
import betweenIcon from '@/static/img/runningResult/face-running-between.png';
import startIcon from '@/static/img/runningResult/face-running-start.png';
import endIcon from '@/static/img/runningResult/face-running-end.png';
export default {
  name: 'FaceRunningDetailsList',
  props: {
    recordData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      invalidIcon,
      betweenIcon,
      startIcon,
      endIcon
    };
  },
  methods: {
    getStateString(state) {
      switch (state) {
        case 1:
          return '暂未处理';
        case 2:
          return '有效';
        case 3:
          return '无效';
        case 4:
          return '重复打卡';
        default:
          return '';
      }
    },
    getStateClassString(state) {
      switch (state) {
        case 1:
          return 'no-processing';
        case 2:
          return 'effective';
        case 3:
          return 'invalid-and-repeat';
        case 4:
          return 'invalid-and-repeat';
        default:
          return '';
      }
    },
    getstateIcon(state, routeFlag) {
      if (state === 1 || state === 3 || state === 4) {
        return invalidIcon;
      } else if (state === 2 && routeFlag === 'START') {
        return startIcon;
      } else if (state === 2 && routeFlag === 'END') {
        return endIcon;
      } else {
        return betweenIcon;
      }
    },
    getColor(routeFlag) {
      return routeFlag === 'PASS' || routeFlag === 'START'
        ? '#FC6C37'
        : '#E8E8EB';
    }
  }
};
</script>

<style lang="scss" scoped>
.face-running-details-list {
  &__item {
    width: 100%;
    display: flex;
    &__state {
      width: 116rpx;
      height: 48rpx;
      border-radius: 24rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      text-align: center;
      padding: 6rpx 0 8rpx 0;
    }
    &__icon {
      width: 28rpx;
      margin: 0 16rpx;
      position: relative;
      .state-img {
        position: absolute;
        top: 10rpx;
        left: 50%;
        margin-left: -14rpx;
        width: 28rpx;
        height: 28rpx;
        z-index: 1;
      }
      .u-line {
        position: absolute;
        top: 14rpx;
        left: 50%;
        border-left-width: 8rpx !important ;
      }
    }
    .no-processing {
      color: #8b8a99;
      background: #ffffff;
      border: 2rpx solid #d6d6d9;
    }
    .effective {
      color: #fc6c37;
      background: #fee2d7;
    }
    .invalid-and-repeat {
      background: #e8e8eb;
      color: #8b8a99;
    }
    &__content {
      margin-bottom: 50rpx;
      &__name {
        width: 512rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2b2d33;
      }
      .color-gray {
        color: #c3c2cc;
      }
      &__time {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        margin: 4rpx 0 8rpx 0;
      }
      &__reason {
        width: 512rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2b2d33;
        line-height: 40rpx;
      }
    }
  }
}
</style>
