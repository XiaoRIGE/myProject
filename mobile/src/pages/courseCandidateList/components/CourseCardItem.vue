<template>
  <view
    class="course-card-item"
    :class="itemData.courseStatus === 2 ? 'gray-color' : ''"
  >
    <view class="project-name u-line-1">
      {{ itemData.projectName }}
    </view>
    <view class="same-width u-line-1">
      上课时间: {{ itemData.weekLabel }}
      {{ $u.timeFormat(itemData.startTime, 'hh:MM') }}-{{
        $u.timeFormat(itemData.endTime, 'hh:MM')
      }}
    </view>
    <view class="same-width u-line-1 u-margin-top-12 u-margin-bottom-12">
      任课老师: {{ itemData.teacherName }}
    </view>
    <view
      class="campus-week same-width u-line-1"
      :class="itemData.courseStatus === 2 ? 'gray-color' : ''"
    >
      {{ itemData.campusName }} | {{ itemData.weekRange }}
    </view>
    <!-- 5-选课，4-已满，3-未开始，2-已结束，1-已选 -->
    <view v-if="itemData.courseStatus === 2" class="state-3">
      <image class="over-img" src="~@/static/img/over.png" mode="scaleToFill" />
      <view class="u-font-12">
        {{ registeredPeopleNumber }}
        / {{ limitPeopleNumber }}
      </view>
    </view>
    <view v-else-if="itemData.courseStatus === 5" class="state-1">
      <view class="u-font-12">
        {{ registeredPeopleNumber }}
        / {{ limitPeopleNumber }}
      </view>
      <view class="sel-btn" @click="selectCourseHandle(itemData)">
        选课
      </view>
    </view>
    <view v-else-if="itemData.courseStatus === 4" class="state-2">
      <view class="gray-color u-font-12">
        {{ registeredPeopleNumber }}
        / {{ limitPeopleNumber }}
      </view>
      <view class="sel-btn change-color">
        已满
      </view>
    </view>
    <view v-else-if="itemData.courseStatus === 1" class="state-2">
      <view class="gray-color u-font-12">
        {{ registeredPeopleNumber }}
        / {{ limitPeopleNumber }}
      </view>
      <view class="sel-btn change-color">
        已选
      </view>
    </view>
    <view v-else-if="itemData.courseStatus === 3" class="state-0">
      <view class="u-flex">
        <image
          src="~@/static/img/clock.png"
          class="clock-img"
          mode="scaleToFill"
        />
        <view>距开始</view>
      </view>
      <view class="count-down">
        {{ countDownTime.day }}天{{ countDownTime.h }}时{{ countDownTime.m }}分
      </view>
      <view class="sel-btn change-color">
        未开始
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CourseCardItem',
  props: {
    itemData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {};
  },
  computed: {
    registeredPeopleNumber() {
      if (this.itemData.limitPeopleNumber === null) {
        return this.itemData.registeredPeopleNumber;
      } else {
        return this.itemData.registeredPeopleNumber >=
          this.itemData.limitPeopleNumber
          ? this.itemData.limitPeopleNumber
          : this.itemData.registeredPeopleNumber;
      }
    },
    limitPeopleNumber() {
      return this.itemData.limitPeopleNumber === null
        ? '无上限'
        : this.itemData.limitPeopleNumber;
    },
    countDownTime() {
      const result = {
        day: 0,
        h: 0,
        m: 0
      };
      const currentTimestamp = new Date().getTime();
      const start = this.itemData.registerStartTime;
      if (start && start > currentTimestamp) {
        const nowStartTime = Number(start);
        const restSec = nowStartTime - currentTimestamp;
        result.day = parseInt(restSec / (60 * 60 * 1000 * 24));
        result.h = parseInt((restSec / (60 * 60 * 1000)) % 24);
        result.m = parseInt((restSec / (60 * 1000)) % 60);
      }
      return result;
    }
  },
  methods: {
    // 选课失败弹窗显示回调
    confirmHandle() {
      this.$emit('confirmHandle');
    },
    // 选课二次确认弹窗回调
    selectCourseHandle(item) {
      this.$emit('selectCourseHandle', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.course-card-item {
  width: 686rpx;
  height: 280rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  padding: 32rpx 32rpx 0;
  font-size: 28rpx;
  position: relative;
  .project-name {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  .campus-week {
    font-size: 24rpx;
    color: #666666;
  }
  .same-width {
    width: 438rpx;
  }
  .avatar-img {
    width: 60rpx;
    height: 60rpx;
    margin-right: 8rpx;
  }
  .over-img {
    width: 170rpx;
    height: 170rpx;
  }
  .state-3 {
    position: absolute;
    right: 32rpx;
    top: 32rpx;
    text-align: center;
  }
  .state-0 {
    color: rgba(255, 171, 2, 1);
    font-size: 24rpx;
    text-align: right;
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
    .clock-img {
      width: 28rpx;
      height: 28rpx;
      margin-left: 50rpx;
      margin-right: 8rpx;
    }
    .count-down {
      font-size: 28rpx;
      height: 40rpx;
      line-height: 40rpx;
    }
  }
  .state-1,
  .state-2 {
    text-align: center;
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
  }
  .sel-btn {
    width: 156rpx;
    height: 64rpx;
    background: rgba(252, 108, 55, 1);
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 64rpx;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    margin-top: 4rpx;
  }
  .change-color {
    background: rgba(252, 108, 55, 0.5);
  }
}
.gray-color {
  color: rgba(204, 204, 204, 1) !important;
}
</style>
