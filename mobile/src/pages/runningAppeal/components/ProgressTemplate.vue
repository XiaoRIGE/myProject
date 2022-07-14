<template>
  <view v-if="appealInfo" class="progress-template-content">
    <view class="current-progress line t32">
      <!-- 当前状态 处理中 成功 失败 -->
      <view class="content">
        <view class="left u-flex">
          <image class="icon" :src="icon" mode="scaleToFill" />
          <text class="text">
            {{ statusName }}
            <text v-if="status === 'processing'">，请耐心等待</text>
          </text>
        </view>
        <!-- 申诉成功，或者失败内容 -->
        <template v-if="status !== 'processing'">
          <text class="date">
            {{
              appealInfo.handleTime
                ? $u.timeFormat(appealInfo.handleTime, 'yyyy-mm-dd hh:MM')
                : '--:--:--'
            }}
          </text>
          <view
            class="success-info u-flex"
            :class="[status === 'fail' && 'pad0']"
          >
            <!-- 申诉成功 -->
            <template v-if="status === 'success'">
              <image
                class="icon"
                src="~@/static/img/appeal/success-tips.svg"
                mode="scaleToFill"
              />
              <text class="text">
                {{ appealInfo.handleResult || '' }}
              </text>
            </template>
            <!-- 申诉失败 -->
            <template v-if="status === 'fail'">
              <g-readMore
                :text-box-style="textBoxStyle"
                :text-value="appealInfo.handleResult"
                :line-num="2"
              />
            </template>
          </view>
        </template>
        <!-- ----- -->
      </view>
    </view>
    <view class="create-content line">
      <!-- 创建时间 -->
      <view class="title u-flex">
        <view class="circular" />
        提交申诉
      </view>
      <text class="create-date">
        {{
          appealInfo.appealTime
            ? $u.timeFormat(appealInfo.appealTime, 'yyyy-mm-dd hh:MM')
            : '--:--:--'
        }}
      </text>
    </view>
  </view>
</template>

<script>
import { getStatus, getStatusName } from '../common';
export default {
  name: 'ProgressTemplate',
  props: {
    appealStatus: {
      type: Number,
      default: -1
    },
    appealInfo: {
      type: Object,
      default: Object.create(null)
    }
  },
  data() {
    return {
      textBoxStyle: {
        margin: 0,
        padding: '20rpx 22rpx 32rpx'
      }
    };
  },
  computed: {
    status() {
      return getStatus(this.appealStatus);
    },
    statusName() {
      return getStatusName(this.status);
    },
    icon() {
      if (!this.status) return '';
      return require(`@/static/img/appeal/${this.status}-icon.svg`);
    }
  },
  methods: {
    parseLoaded() {
      this.$refs.uReadMore.init();
    }
  }
};
</script>

<style lang="scss" scoped>
.progress-template-content {
  box-sizing: border-box;
  padding: 32rpx;
  width: 100%;
  min-height: 206rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  .current-progress {
    .content {
      justify-content: space-between;
      box-sizing: border-box;
      padding-bottom: 36rpx;
    }
    .success-info {
      margin-left: 48rpx;
      margin-top: 24rpx;
      min-height: 68rpx;
      box-sizing: border-box;
      padding: 18rpx;
      background-color: #f5f6fa;
      border-radius: 12rpx;
      .text-content {
        font-size: 24rpx;
      }
      .icon {
        width: 28rpx;
        height: 28rpx;
      }
      .text {
        margin-left: 12rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $uni-text-color;
      }
    }
    .pad0 {
      padding: 0;
    }
    .date {
      box-sizing: border-box;
      padding-left: 48rpx;
      font-size: 24rpx;
      color: $uni-text-color-grey;
    }
    .left {
      .icon {
        width: 32rpx;
        height: 32rpx;
      }
      .text {
        font-size: 24rpx;
        font-weight: 500;
        margin-left: 16rpx;
        color: $u-main-color;
      }
    }
    .appeal-btn {
      width: 148rpx;
      text-align: center;
      height: 52rpx;
      line-height: 52rpx;
      border-radius: 16rpx;
      border: 1px solid $uni-color-primary;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $uni-color-primary;
    }
  }
  .create-content {
    position: relative;
    .title,
    .create-date {
      box-sizing: border-box;
      padding-left: 48rpx;
      font-size: 24rpx;
      color: $uni-text-color-grey;
    }
  }
  .line {
    position: relative;
    &::before {
      position: absolute;
      left: 15rpx;
      top: 0;
      bottom: 0;
      display: inline-block;
      content: '';
      width: 2rpx;
      background-color: #f0f0f0;
    }
  }
  .t32 {
    &::before {
      top: 32rpx;
    }
  }
  .circular {
    position: absolute;
    display: inline-block;
    left: 10rpx;
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    z-index: 1;
    background-color: #d8d8d8;
  }
}
</style>
