<template>
  <navigator
    :url="
      '/pages/studentStaminaTest/detail?type=' + single.type + '&year=' + year
    "
    open-type="navigate"
    hover-class="none"
  >
    <view class="single-item-container">
      <view class="project-info u-flex">
        <image class="img" :src="src" mode="aspectFit" />
        <text class="title">
          {{ single.title }}
        </text>
      </view>
      <view class="score-tags">
        <view class="u-flex">
          <text class="score">
            {{ data[single.score] || 0 }}
          </text>
          <text class="fn">
            分
          </text>
          <grade :level="data[single.level] || 0" />
        </view>
        <view class="sub-title u-flex">
          <template v-if="single.render">
            <text>{{ single.render(data) }}</text>
          </template>
          <template v-if="!single.render && data[single.value] !== null">
            <text>{{ data[single.value] || 0 }}</text>
            <text style="margin-left: 6rpx">
              {{ single.unit }}
            </text>
          </template>
        </view>
      </view>
    </view>
  </navigator>
</template>

<script>
import Grade from './Grade';
export default {
  name: 'SingleItem',
  components: {
    grade: Grade
  },
  props: {
    single: {
      type: Object,
      default: () => {}
    },
    year: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    src() {
      if (!this.single.src) return '';
      return require(`@/static/img/studentStamina/${this.single.src}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.single-item-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 24rpx;
  width: 324rpx;
  height: 242rpx;
  box-sizing: border-box;
  padding: 24rpx 32rpx;
  background-color: #fafafc;
  border-radius: 16rpx;
  .project-info {
    .img {
      width: 70rpx;
      height: 70rpx;
    }
    .title {
      margin-left: 16rpx;
      font-size: 30rpx;
      color: $u-main-color;
    }
  }
  .score-tags {
    font-size: 24rpx;
    color: $u-content-color;
    & > view {
      color: $u-main-color;
    }
    .fn {
      margin: 0 18rpx 0 4rpx;
    }
    .score {
      font-size: 48rpx;
      font-weight: bold;
      color: $u-main-color;
    }
    .sub-title {
      font-size: 24rpx;
      line-height: 34rpx;
      color: $u-content-color;
    }
  }
}
</style>
