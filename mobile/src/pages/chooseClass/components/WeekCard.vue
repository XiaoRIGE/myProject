<template>
  <view class="week-card-container">
    <view class="title u-flex u-row-between">
      <view class="u-flex">
        <view class="line" />
        <view>{{ weekNumber }}</view>
      </view>
      <image :src="weekIcon" mode="scaleToFill" class="week-img" />
    </view>
    <template v-for="(item, index) in weekInfo">
      <view :key="index" class="info-item" @click="clickCourseHandle(item)">
        <view class="name">
          {{ item.name }}
        </view>
        <view class="time">
          上课时间: {{ item.timeStr }}
        </view>
        <view v-if="item.courseStatusStr === '未开始'" class="tag color-gray">
          {{ item.courseStatusStr }}
        </view>
        <view
          v-else-if="item.courseStatusStr === '进行中'"
          class="tag color-green"
        >
          {{ item.courseStatusStr }}
        </view>
        <view v-else class="tag color-red">
          {{ item.courseStatusStr }}
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { getWeekIcon } from '@/utils/common';

export default {
  name: 'WeekCard',
  props: {
    weekInfo: {
      type: Array,
      default: null
    },
    weekNumber: {
      type: String,
      default: ''
    }
  },
  computed: {
    weekIcon() {
      return getWeekIcon(this.$props.weekNumber);
    }
  },
  methods: {
    clickCourseHandle(item) {
      this.$emit('onClickCourse', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.week-card-container {
  width: 686rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4rpx 20rpx 0px rgba(75, 77, 83, 0.05);
  border-radius: 16rpx;
  border: 2rpx solid rgba(234, 236, 240, 1);
  margin-bottom: 32rpx;
  .title {
    font-size: 36rpx;
    font-weight: bold;
    .line {
      width: 8rpx;
      height: 44rpx;
      margin-right: 24rpx;
      background: rgba(252, 108, 55, 1);
      border-radius: 0px 4rpx 4rpx 0px;
    }
    .week-img {
      width: 212rpx;
      height: 112rpx;
    }
  }
  .info-item {
    width: 638rpx;
    margin: 0 auto 0;
    padding: 24rpx;
    background: rgba(246, 250, 251, 1);
    border-radius: 16rpx;
    border: 2rpx solid rgba(234, 236, 240, 1);
    margin-bottom: 24rpx;
    .name {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 8rpx;
    }
    .time {
      font-size: 28rpx;
      margin-bottom: 16rpx;
    }
    .tag {
      width: 82rpx;
      font-size: 22rpx;
      line-height: 32rpx;
      text-align: center;
      border-radius: 8rpx;
    }
    .color-gray {
      background: rgba(246, 246, 247, 1);
      border: 2rpx solid rgba(139, 138, 153, 1);
      color: rgba(139, 138, 153, 1);
    }
    .color-green {
      background: rgba(237, 248, 239, 1);
      border: 2rpx solid rgba(74, 186, 93, 1);
      color: rgba(74, 186, 93, 1);
    }
    .color-red {
      background: rgba(255, 243, 243, 1);
      border: 2rpx solid rgba(255, 103, 103, 1);
      color: rgba(255, 103, 103, 1);
    }
  }
}
</style>
