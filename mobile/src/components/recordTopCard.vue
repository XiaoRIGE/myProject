<template>
  <view class="record-top-card" :style="style">
    <view v-if="backgroundImg === 'run'" class="run-text">{{ text }}</view>
    <view
      class="record-count"
      :style="
        backgroundImg === 'run'
          ? { lineHeight: '144rpx' }
          : { lineHeight: '120rpx' }
      "
    >
      <text
        :class="
          isRule
            ? backgroundImg === 'run'
              ? 'current-value-run'
              : 'current-value-ai'
            : backgroundImg === 'run'
            ? 'target-value-run'
            : 'target-value-ai'
        "
      >
        {{ currentValue }}
      </text>
      <text
        v-if="isRule"
        :class="
          backgroundImg === 'run' ? 'target-value-run' : 'target-value-ai'
        "
      >
        /{{ targetValue }}
      </text>
      <text class="unit">
        {{ unitValue }}
      </text>
    </view>
    <view v-if="backgroundImg === 'ai'" class="ai-record-text">
      <view>{{ text }}</view>
      <view class="btn" @click="clickHandle">
        {{ btnText }}
      </view>
    </view>
    <view v-else class="run-record-text">
      <view @click="clickFaceRunningHandle">岗亭打卡记录</view>
      <image
        src="~@/static/img/triangle-more.png"
        mode="scaleToFill"
        class="triangle-more"
      />
    </view>
  </view>
</template>

<script>
import indexBackGroundRun from '@/static/img/record-run-bg.png';
import indexBackGroundAi from '@/static/img/record-ai-bg.png';

export default {
  name: 'RecordTopCard',
  props: {
    // 背景图
    backgroundImg: {
      type: String,
      default: ''
    },
    // 当前值
    currentValue: {
      type: [String, Number],
      default: 0
    },
    // 目标值
    targetValue: {
      type: [String, Number],
      default: 0
    },
    // 是否有规则
    isRule: {
      type: Boolean,
      default: true
    },
    // 单位值
    unitValue: {
      type: String,
      default: ''
    },
    // 文本内容
    text: {
      type: String,
      default: ''
    },
    // 按钮文本
    btnText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    style() {
      return {
        backgroundImage: `url(${
          this.backgroundImg === 'run' ? indexBackGroundRun : indexBackGroundAi
        })`,
        paddingTop: this.backgroundImg === 'run' ? '32rpx' : '56rpx',
        paddingLeft: this.backgroundImg === 'run' ? '40rpx' : '48rpx',
        height: this.backgroundImg === 'run' ? '300rpx' : '286rpx'
      };
    }
  },
  methods: {
    // 点击历史记录按钮回调
    clickHandle() {
      this.$emit('clickBtn');
    },
    // 点击岗亭打卡记录按钮回调
    clickFaceRunningHandle() {
      this.$emit('clickFaceRunningHandle');
    }
  }
};
</script>

<style lang="scss" scoped>
.record-top-card {
  position: relative;
  width: 686rpx;
  // height: 286rpx;
  border-radius: 16rpx;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
  // background-image: url('../static/img/record-run-bg.png');
  padding: 0 40rpx 40rpx 0;
  .record-count {
    z-index: 1;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    // line-height: 144rpx;
    transform: scale(1, 1.15);
    .current-value-run {
      font-size: 88rpx;
    }
    .current-value-ai {
      font-size: 80rpx;
    }
    .target-value-run {
      font-size: 56rpx;
    }
    .target-value-ai {
      font-size: 48rpx;
    }
    .unit {
      margin-left: 4rpx;
      font-size: 32rpx;
    }
  }
  .ai-record-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 1);
    .btn {
      height: 52rpx;
      padding: 0 18rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 16rpx;
      color: rgba(252, 108, 55, 1);
      text-align: center;
      line-height: 52rpx;
    }
  }
  .run-record-text {
    position: absolute;
    left: 40rpx;
    bottom: 20rpx;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #fc6c37;
    .triangle-more {
      width: 28rpx;
      height: 28rpx;
    }
  }
  .run-text {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
