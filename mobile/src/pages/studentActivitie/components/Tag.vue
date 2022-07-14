<template>
  <view class="tag-content" :class="[classIcon]">
    {{ title }}
  </view>
</template>

<script>
const tagStatus = {
  0: '报名未开始',
  1: '报名中',
  2: '报名结束',
  // 3: '活动未开始',
  4: '进行中',
  5: '活动结束'
};
export default {
  name: 'Tag',
  props: {
    tag: {
      type: [Number, String],
      default: -1
    }
  },
  computed: {
    title() {
      return tagStatus[this.tag];
    },
    classIcon() {
      return `tag__${this.tag}__icon`;
    }
  }
};
</script>

<style scoped lang="scss">
.tag-content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  line-height: 44rpx;
  text-align: center;
  font-size: 24rpx;
  box-sizing: border-box;
  padding: 3rpx 12rpx;
  color: #fff;
  border-radius: 12rpx 0px 12rpx 0px;
}
.tag__0__icon,
.tag__3__icon {
  background-color: #fdb59b;
}
.tag__1__icon {
  background: linear-gradient(
    270deg,
    rgba(255, 78, 2, 1) 0%,
    rgba(255, 32, 90, 1) 100%
  );
}
.tag__4__icon {
  background: linear-gradient(
    90deg,
    rgba(50, 184, 73, 1) 0%,
    rgba(46, 209, 49, 1) 100%
  );
}
.tag__5__icon,
.tag__2__icon {
  background-color: #b3b3b3;
}
</style>
