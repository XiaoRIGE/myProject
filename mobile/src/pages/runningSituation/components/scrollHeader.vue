<template>
  <view class="scroll-header-content u-flex">
    <view class="scroll-header-content-col u-flex">
      <text>学生名单({{ count }})</text>
    </view>
    <view class="scroll-header-content-col u-flex">
      <text>跑步{{ unitName }}</text>
    </view>
    <view class="scroll-header-content-col u-flex">
      <text>跑步成绩</text>
    </view>
  </view>
</template>

<script>
const unitNames = {
  1: '里程',
  2: '段数'
};
export default {
  props: {
    scoringType: {
      type: Number,
      default: -1
    },
    count: {
      type: Number,
      default: 0
    }
  },
  computed: {
    unitName() {
      return unitNames[this.scoringType];
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-header-content {
  height: 88rpx;
  justify-content: space-between;
  border-bottom: 0.5px solid #e8e8e8;
  &-col {
    height: 88rpx;
    box-sizing: border-box;
    color: $u-tips-color;
    &:first-child {
      width: 292rpx;
      padding-left: 32rpx;
    }
    &:nth-child(2) {
      width: 292rpx;
    }
    &:last-child {
      width: 166rpx;
      justify-content: center;
      padding-right: 32rpx;
    }
  }
}
</style>
