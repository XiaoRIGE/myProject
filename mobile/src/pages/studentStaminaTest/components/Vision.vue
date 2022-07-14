<template>
  <view class="vision-content">
    <view class="title-box u-flex">
      <image
        src="~@/static/img/studentStamina/t6-icon.svg"
        mode="scaleToFill"
      />
      <text>视力</text>
    </view>
    <view class="vision-info u-flex">
      <view class="vision-info-left">
        <view class="row u-flex">
          <text class="value">
            {{ data.leftEyeVision || '0' }}
          </text>
          <text class="tps">
            屈光不正：{{ refractionList[data.leftEyeAmetropia] }}
          </text>
        </view>
        <view class="row">
          <text class="row-title">左眼</text>
          <text class="tps">
            串镜：{{ mirrorList[data.leftEyeStrandMirror] }}
          </text>
        </view>
      </view>
      <view class="vision-info-right">
        <view class="u-flex">
          <text class="value">
            {{ data.rightEyeVision || '0' }}
          </text>
          <text class="tps">
            屈光不正：{{ refractionList[data.rightEyeAmetropia] }}
          </text>
        </view>
        <view>
          <text class="row-title">右眼</text>
          <text class="tps">
            串镜：{{ mirrorList[data.rightEyeStrandMirror] }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const refractionList = {
  // 屈光不正列表
  0: '正常',
  1: '近视',
  2: '远视',
  3: '其它',
  9: '未测'
};
const mirrorList = {
  // 串镜列表
  0: '正常',
  '-1': '正下负上',
  1: '正上负下',
  2: '其它',
  9: '未测'
};

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      refractionList,
      mirrorList
    };
  }
};
</script>

<style lang="scss" scoped>
.vision-content {
  width: 100%;
  height: 242rpx;
  margin-top: 24rpx;
  box-sizing: border-box;
  padding: 24rpx 32rpx;
  background: #fafafc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16rpx;
  // border: 1px solid #efefef;
  .title-box {
    image {
      width: 64rpx;
      height: 64rpx;
      margin-right: 16rpx;
    }
    text {
      font-size: 30rpx;
      color: $u-main-color;
    }
  }
  .vision-info {
    justify-content: space-between;
    &-left,
    &-right {
      .value {
        width: 80rpx;
        display: inline-block;
        margin-right: 10rpx;
        font-size: 48rpx;
        font-weight: bold;
        color: $u-main-color;
      }
      .tps {
        color: $u-content-color;
      }
      .row-title {
        width: 80rpx;
        display: inline-block;
        margin-right: 10rpx;
        font-size: 24rpx;
        color: $u-main-color;
      }
    }
  }
}
</style>
