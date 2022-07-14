<template>
  <view class="progress-content">
    <view class="base-line" />
    <view id="progress" :class="getClass">
      <view
        class="current-prrogress"
        :class="{ 'progress-radius': percentage < 100 }"
        :style="{ width: width }"
      />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      width: 0
    };
  },
  computed: {
    getClass() {
      return [
        'current-line',
        {
          'left-semi-circle': this.percentage > 0
        },
        {
          'right-semi-circle': this.percentage >= 100
        }
      ];
    }
  },
  watch: {
    percentage: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.getWidth();
        });
      }
    }
  },
  methods: {
    getWidth() {
      const pagination = uni.createSelectorQuery().select('#progress');
      pagination
        .boundingClientRect(dom => {
          if (dom) {
            const baseWidth = dom.width;
            const radiusWidth = uni.upx2px(8); // 转为px
            let percentage = Number.parseFloat(String(this.percentage));
            if (percentage >= 100) percentage = Math.min(100, percentage);
            if (percentage <= 0) percentage = Math.max(0, percentage);
            const currentPx =
              (baseWidth - radiusWidth * 2) * (percentage / 100);
            this.width = `${currentPx}px`;
          } else {
            this.getWidth();
          }
        })
        .exec();
    }
  }
};
</script>

<style lang="scss" scoped>
.progress-content {
  position: relative;
  .base-line {
    width: 100%;
    height: 20rpx;
    border-radius: 12rpx;
    background: linear-gradient(180deg, #ffece4 0%, #ffdacc 100%);
  }
  .current-line {
    width: 100%;
    position: absolute;
    left: 0;
    top: 50%;
    bottom: 0;
    height: 20rpx;
    transform: translateY(-50%);
    &::before,
    &::after {
      display: inline-block;
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 10rpx;
    }
  }
  .progress-radius {
    border-top-right-radius: 12rpx;
    border-bottom-right-radius: 12rpx;
  }
  .current-prrogress {
    position: absolute;
    left: 9rpx;
    right: 9rpx;
    top: 50%;
    bottom: 0;
    height: 20rpx;
    transform: translateY(-50%);
    background: linear-gradient(180deg, #ffd57f 0%, #fc6c37 100%);
  }
  .left-semi-circle {
    &::after {
      left: 0;
      border-top-left-radius: 12rpx;
      border-bottom-left-radius: 12rpx;
      background: linear-gradient(180deg, #ffd57f 0%, #fc6c37 100%);
    }
  }
  .right-semi-circle {
    &::before {
      right: 0;
      border-top-right-radius: 12rpx;
      border-bottom-right-radius: 12rpx;
      background: linear-gradient(180deg, #ffd57f 0%, #fc6c37 100%);
    }
  }
}
</style>
