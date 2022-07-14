<template>
  <view class="upload-container" @click="change">
    <image class="img" src="~@/static/img/camera.svg" mode="scaleToFill" />
    <p class="title">上传图片</p>
  </view>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 4
    },
    sizeType: {
      type: Array,
      default: () => ['original', 'compressed']
    },
    sourceType: {
      type: Array,
      default: () => ['album']
    }
  },
  methods: {
    change() {
      const _this = this;
      // 选择文件
      uni.chooseImage({
        count: _this.count, //默认图片张数
        sizeType: _this.sizeType, //可以指定是原图还是压缩图，默认二者都有
        sourceType: _this.sourceType, //从相册选择
        success({ tempFiles }) {
          if (tempFiles && tempFiles.length > 0) {
            _this.$emit('on-change', tempFiles);
          }
        },
        fail(err) {
          throw Error(err);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.upload-container {
  width: 156rpx;
  height: 156rpx;
  border-radius: 16rpx;
  box-sizing: border-box;
  padding: 30rpx 0;
  border: 4rpx dotted #c7cde3;
  text-align: center;
  .img {
    width: 56rpx;
    height: 56rpx;
  }
  .title {
    text-align: center;
    font-size: 24rpx;
    color: #c1c7d2;
  }
}
</style>
