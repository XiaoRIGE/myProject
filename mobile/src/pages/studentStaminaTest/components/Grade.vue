<template>
  <view class="grade-content" :class="['level-' + level]">
    {{ content }}
  </view>
</template>

<script>
const gradeState = {
  0: '未测',
  1: '优秀',
  2: '及格',
  3: '良好',
  4: '不及格'
};
export default {
  name: 'Grade',
  props: {
    level: {
      type: Number,
      default: -1
    }
  },
  computed: {
    content() {
      return gradeState[this.level];
    }
  }
};
</script>

<style scoped lang="scss">
.grade-content {
  font-size: 22rpx;
  text-align: center;
  line-height: 40rpx;
  border-radius: 6rpx;
  box-sizing: border-box;
  padding: 0 10rpx;
  color: #fff;
}
.level-0 {
  background-color: #9599a4;
}
.level-1 {
  background-color: #6196ff;
}
.level-3 {
  background-color: #40c79a;
}
.level-2 {
  background-color: #ffae00;
}
.level-4 {
  background-color: #f66267;
}
</style>
