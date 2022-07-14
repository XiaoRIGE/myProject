<template>
  <view class="admin-work-bench">
    <g-navbar
      back-icon-size="48"
      title="工作台"
      :border-bottom="false"
      class="navbar"
      :title-bold="true"
    />
    <view class="menu">
      <template v-for="(items, idx) in menu">
        <view
          :key="idx"
          class="menu-item u-flex"
          @click="clickMenuHandle(items)"
        >
          <view class="u-flex">
            <image :src="items.icon" mode="scaleToFill" class="menu-img" />
            <view>{{ items.title }}</view>
          </view>
          <image
            src="~@/static/img/more.png"
            mode="scaleToFill"
            class="more-img"
          />
        </view>
      </template>
    </view>
  </view>
</template>

<script>
const menu = [
  {
    icon: './../../static/img/workbench/course-attainability.png',
    title: '课程考勤',
    path: '/pages/chooseClass/index?flag=0'
  },
  {
    icon: './../../static/img/workbench/class-test.png',
    title: '班级体测',
    path: '/pages/chooseClass/index?flag=1'
  },
  {
    icon: './../../static/img/workbench/special-subject.png',
    title: '专项考试',
    path: '/pages/chooseClass/index?flag=2'
  }
];

export default {
  data() {
    return {
      menu
    };
  },
  methods: {
    // 点击菜单回调
    clickMenuHandle(items) {
      uni.navigateTo({
        url: items.path
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  margin-top: 34rpx;
  .menu-item {
    align-items: center;
    justify-content: space-between;
    height: 108rpx;
    border-radius: 2rpx;
    padding: 26rpx 32rpx;
    font-size: 32rpx;
    font-weight: bold;
    background: rgba(255, 255, 255, 1);
    .menu-img {
      width: 56rpx;
      height: 56rpx;
      margin-right: 16rpx;
    }
    .more-img {
      width: 28rpx;
      height: 28rpx;
    }
  }
}
</style>
