<template>
  <view class="activity-title-info-container">
    <view class="title u-line-2">
      <image :src="stateIcon" class="state-icon" mode="heightFix" />
      <text class="title-text u-font-36">
        {{ activityData.name }}
      </text>
    </view>
    <view class="info-item u-flex u-col-center">
      <view class="circle" />
      <view class="info-right u-font-28 u-line-1 u-flex u-col-center">
        <view class="text">
          报名时间
        </view>
        <view class="time u-line-1">
          {{
            $u.timeFormat(Number(activityData.registerStartTime), 'yyyy/mm/dd')
          }}
          {{ $u.timeFormat(Number(activityData.registerStartTime), 'hh:MM') }} -
          {{
            $u.timeFormat(Number(activityData.registerEndTime), 'yyyy/mm/dd')
          }}
          {{ $u.timeFormat(Number(activityData.registerEndTime), 'hh:MM') }}
        </view>
      </view>
    </view>
    <view class="info-item u-flex u-col-center">
      <view class="circle" />
      <view class="info-right u-font-28 u-line-1 u-flex u-col-center">
        <text class="text">
          活动时间
        </text>
        <text class="time u-line-1">
          {{
            `${$u.timeFormat(
              Number(activityData.startTime),
              'yyyy/mm/dd'
            )} ${$u.timeFormat(
              Number(activityData.startTime),
              'hh:MM'
            )} - ${$u.timeFormat(Number(activityData.endTime), 'hh:MM')}`
          }}
        </text>
      </view>
    </view>
    <view class="info-item u-flex u-col-center">
      <view class="circle" />
      <view class="info-right u-font-28 u-line-1 u-flex u-col-center">
        <text class="text">
          活动地点
        </text>
        <text class="time u-line-1">
          {{ activityData.address }}
        </text>
      </view>
    </view>
    <view
      v-if="activityData.organizations === null"
      class="info-item u-flex u-col-center"
    >
      <view class="circle" />
      <view class="info-right u-font-28 u-line-1 u-flex u-col-center">
        <text class="text">
          适用学院
        </text>
        <text class="time u-line-1">
          全部
        </text>
      </view>
    </view>
    <view v-else>
      <view id="readMore" class="info-item" :class="show ? '' : 'u-line-2'">
        <view>
          <text class="circle" />
          <text class="text">
            适用学院
          </text>
          <text
            v-for="(item, index) in activityData.organizations"
            :key="index"
          >
            <text class="time">
              {{ item }}
            </text>
            <text v-if="index < activityData.organizations.length - 1">
              、
            </text>
          </text>
        </view>
      </view>
      <view
        v-if="!hideBtn"
        class="action u-flex u-row-center"
        @click="changeShow"
      >
        <text class="text">
          {{ show ? '收起' : '展开查看更多' }}
        </text>
        <u-icon
          :name="show ? 'arrow-down' : 'arrow-up'"
          color="rgba(252, 108, 55, 1)"
        />
      </view>
    </view>
    <view v-if="state === 3 && registerState === 0" class="dowm-date u-flex">
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
  </view>
</template>

<script>
import { getActivityDetailsIcon, getRegisterState } from '@/utils/common';

export default {
  name: 'ActivityTitleInfo',
  props: {
    activityData: {
      type: Object,
      default: null
    },
    state: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      shadowStyle: {
        background: 'none',
        paddingTop: '0',
        marginTop: '20rpx'
      },
      show: true,
      hideBtn: false
    };
  },
  computed: {
    stateIcon() {
      if (this.activityData) {
        return getActivityDetailsIcon(
          this.state,
          getRegisterState(this.activityData)
        );
      }
      return undefined;
    },
    registerState() {
      if (this.activityData) {
        return getRegisterState(this.activityData);
      }
      return undefined;
    },
    countDownTime() {
      const result = {
        day: 0,
        h: 0,
        m: 0
      };
      const currentTimestamp = new Date().getTime();
      const start = this.activityData.registerStartTime;
      if (start && start > currentTimestamp) {
        const nowStartTime = Number(start);
        const restSec = nowStartTime - currentTimestamp;
        result.day = parseInt(restSec / (60 * 60 * 1000 * 24));
        result.h = parseInt((restSec / (60 * 60 * 1000)) % 24);
        result.m = parseInt((restSec / (60 * 1000)) % 60);
      }
      return result;
    }
  },
  mounted() {
    uni
      .createSelectorQuery()
      .select('#readMore')
      .boundingClientRect(res => {
        if (res) {
          this.hideBtn = res.height <= 44;
          this.show = false;
        }
      })
      .exec();
  },
  methods: {
    parseLoaded() {
      this.$nextTick(() => {
        this.$refs.uReadMore.init();
      });
    },
    changeShow() {
      this.show = !this.show;
      this.$emit('changeShow');
    }
  }
};
</script>

<style lang="scss">
.activity-title-info-container {
  margin-bottom: 32rpx;
  .title {
    margin-bottom: 24rpx;
    .state-icon {
      // width: 108rpx;
      height: 44rpx;
      margin-right: 8rpx;
      vertical-align: middle;
    }
    .title-text {
      font-weight: bold;
      font-size: 36rpx;
      vertical-align: middle;
    }
  }
  .info-item {
    width: 100%;
    margin-bottom: 8rpx;
    .circle {
      display: inline-block;
      width: 8rpx;
      height: 8rpx;
      background: rgba(195, 194, 204, 1);
      border-radius: 50% 50%;
      vertical-align: middle;
    }
    .text {
      font-weight: bold;
      margin-right: 16rpx;
      margin-left: 8rpx;
    }
  }
  .dowm-date {
    width: 400rpx;
    font-size: 28rpx;
    box-sizing: border-box;
    padding: 6rpx;
    height: 52rpx;
    margin-top: 16rpx;
    color: $u-type-primary;
    background: rgba(255, 234, 227, 1);
    border-radius: 200rpx;
    justify-content: center;
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
  .read-more {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .action {
    width: 100%;
    margin-top: 20rpx;
    .text {
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(252, 108, 55, 1);
      margin-right: 12rpx;
    }
  }
}
</style>
