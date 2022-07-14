<template>
  <view class="exam-tag-container">
    <text>{{ tagName }}</text>
  </view>
</template>

<script>
import { getExamTagStatusName } from './../common';
export default {
  name: 'ExamTag',
  props: {
    tag: {
      type: String,
      default: ''
    }
  },
  computed: {
    tagName() {
      return getExamTagStatusName(this.tag);
    }
  }
};
</script>
<style lang="scss" scoped>
.exam-tag-container {
  height: 32rpx;
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0 8rpx;
  background: rgba(252, 108, 55, 0.1);
  border-radius: 8rpx;
  text {
    padding: 0;
    margin: 0;
    font-size: 22rpx;
    transform: scale(0.83);
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $u-type-primary;
  }
}
</style>
