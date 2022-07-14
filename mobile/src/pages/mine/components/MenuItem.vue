<template>
  <view class="menu-item-container">
    <view class="mine-list-item u-flex u-row-between" @click="contactCustomer">
      <view class="mine-list-item-left u-flex">
        <image :src="menuItem.icon" mode="aspectFit" />
        <text>{{ menuItem.label || 'label' }}</text>
      </view>
      <image
        class="arrow-img"
        src="~@/static/img/cell/right-arrow.svg"
        mode="aspectFit"
      />
    </view>
  </view>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    menuItem: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    isImg(path) {
      if (!path) return false;
      // Base 64图片
      const isBase64 = path.includes('data:image/png;base64');
      const imgs = ['png', 'jpg', 'bmp', 'jpeg'];
      if (isBase64) return true;

      // 图片路径
      const fileType = path
        .substring(path.lastIndexOf('.') + 1, path.length)
        .toLowerCase();
      const isImgPath = imgs.includes(fileType);
      if (isImgPath) return true;
      return false;
    },
    contactCustomer() {
      if (this.menuItem.path) {
        uni.navigateTo({ url: this.menuItem.path });
      } else {
        this.$emit('menu-click', this.menuItem);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.menu-item-container {
  .mine-list-item {
    box-sizing: border-box;
    padding: 32rpx 64rpx;
    &-left {
      image {
        width: 44rpx;
        height: 44rpx;
      }
      text {
        font-size: 32rpx;
        margin-left: 16rpx;
        color: $u-main-color;
      }
    }
    .arrow-img {
      width: 36rpx;
      height: 36rpx;
    }
  }
}
</style>
