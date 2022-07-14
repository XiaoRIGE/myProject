<template>
  <view class="list-content u-flex u-row-between" @click="handelClick">
    <view class="left-content">
      <view class="name">
        {{ userInfo.realName }}({{ userInfo.genderStr }})
      </view>
      <view class="code">
        {{ userInfo.organizationUserNumber }}
      </view>
    </view>
    <view class="right-content u-flex u-row-right">
      <template v-if="listType === 'vision'">
        <view class="item score">
          {{ userInfo.leftEyeVision || '--' }}
        </view>
        <view class="item score">
          {{ userInfo.rightEyeVision || '--' }}
        </view>
      </template>
      <template v-else>
        <view class="item data">
          {{ userInfo.level ? fitnessData(userInfo.fitnessData) : '--'
          }}{{ unit }}
        </view>
        <view class="item score">
          {{ userInfo.totalScore || 0 }}分
        </view>
        <view class="item u-flex u-row-center level">
          <grade :level="userInfo.level || 0" />
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import Grade from './Grade';
import { units } from './../stamina';
export default {
  components: {
    grade: Grade
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    },
    listType: {
      type: String,
      default: ''
    },
    projectType: {
      type: String,
      default: ''
    }
  },
  computed: {
    unit() {
      if (!this.userInfo.level) return '';
      return units[this.projectType] ? units[this.projectType] : '';
    }
  },
  methods: {
    handelClick() {
      this.$emit('click', this.userInfo);
    },
    fitnessData(value) {
      if (this.projectType === 't8' || this.projectType === 't10') {
        if (!value) return value || 0;
        if (value < 60) return `${value}秒`;
        const M = Math.floor(value / 60); //  分
        const s = value % 60; // 秒
        const format = s > 0 ? `${M}分${s}秒` : `${M}分`;
        return format;
      }
      return value;
    }
  }
};
</script>

<style scoped lang="scss">
.list-content {
  width: 750rpx;
  height: 152rpx;
  box-sizing: border-box;
  padding: 0 32rpx;
  .left-content {
    .name {
      font-size: 32rpx;
      color: $u-main-color;
    }
    .code {
      margin-top: 8rpx;
      font-size: 24rpx;
      color: $u-content-color;
    }
    view {
      width: 200rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .right-content {
    width: 550rpx;
    overflow: hidden;
    flex-shrink: 1;
    .score,
    .level {
      width: 120rpx;
    }
    .data {
      flex: 1;
    }
    .item {
      font-size: 32rpx;
      color: $u-main-color;
      margin-left: 20rpx;
      text-align: center;
      // border: 1px solid red;
    }
  }
}
</style>
