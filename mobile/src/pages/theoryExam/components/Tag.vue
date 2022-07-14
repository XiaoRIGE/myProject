<template>
  <view class="tag-container" :class="tag">{{ statusName }}</view>
</template>

<script>
import { getTagStatusNames } from '../common';
export default {
  name: 'Tag',
  props: {
    tag: {
      type: String,
      default: ''
    }
  },
  computed: {
    statusName() {
      return getTagStatusNames(this.tag);
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-container {
  display: inline-block;
  box-sizing: border-box;
  padding: 4rpx 8rpx;
  font-size: 20rpx;
  color: #fff;
}
.inProgress {
  background: linear-gradient(90deg, #32b849 0%, #2ed131 100%);
  border-radius: 12rpx 12rpx 0 12rpx;
}
.notStarted {
  background: linear-gradient(
    90deg,
    rgba(50, 184, 73, 0.7) 0%,
    rgba(46, 209, 49, 0.7) 100%
  );
  border-radius: 12rpx 12rpx 0 12rpx;
  opacity: 0.7;
}
.hasEnded {
  background-color: #b3b3b3;
  border-radius: 12rpx 12rpx 0 12rpx;
}
</style>
