<template>
  <view class="my-grade-header">
    <g-navbar
      id="navBar"
      height="44"
      :background="background"
      :border-bottom="false"
      :is-back="true"
      back-icon-size="48"
      :back-icon="background.backIcon"
      :title="background.title"
    >
      <view v-show="background.title" slot="right">
        <view class="nav-right" @click="switchCourse">切换课程</view>
      </view>
    </g-navbar>
    <view class="my-grade-header-title u-flex u-row-between">
      <view class="my-grade-header-title-semester">
        {{ currentSemester.yearRange || '--' }}学年{{ semesterName }}
      </view>
      <view
        v-show="isCourse"
        class="my-grade-header-title-switch u-flex u-row-around"
        @click="switchCourse"
      >
        <image
          class="switch-icon"
          src="~@/static/img/myGrade/change-icon.svg"
          mode="aspectFit"
        />
        <text>课程</text>
      </view>
    </view>
    <view v-show="isCourse" class="my-grade-header-card">
      <course-card :current-course="currentCourse" />
    </view>
  </view>
</template>

<script>
import { toRpx } from '@/utils/common';
import CourseCard from './CourseCard';

export default {
  name: 'MyGradeHeader',
  components: {
    'course-card': CourseCard
  },
  props: {
    isCourse: {
      type: Boolean,
      default: false
    },
    currentCourse: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      background: {
        backgroundColor: 'transparent',
        backIcon: 'white',
        title: ''
      }
    };
  },
  computed: {
    currentSemester() {
      return this.$store.state.semester.currentSemester;
    },
    semesterName() {
      const { index } = this.currentSemester;
      if (index) {
        return index === 1 ? '上学期' : index === 2 ? '下学期' : '--';
      }
      return '--';
    }
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select('#navBar')
      .boundingClientRect(({ height }) => {
        this.top = 420 - toRpx(height);
      })
      .exec();
  },
  methods: {
    setNavBar(height) {
      this.background.backgroundColor = `rgba(255,255,255,${
        height > 10 ? height / 44 : 0
      })`;
      if (height > 44) {
        this.background.backIcon = 'black';
        this.background.title = '我的成绩';
      } else {
        this.background.backIcon = 'white';
        this.background.title = '';
      }
    },
    switchCourse() {
      // 切换课程
      this.$emit('switch-course');
    }
  }
};
</script>

<style lang="scss" scoped>
.my-grade-header {
  width: 100%;
  height: 380rpx;
  background-image: url(~@/static/img/myGrade/my-grade-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 350rpx;
  .nav-right {
    font-size: 30rpx;
    box-sizing: border-box;
    padding-right: 32rpx;
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
  }
  &-title {
    width: 100%;
    box-sizing: border-box;
    padding: 0 32rpx;
    margin: 20rpx 0 32rpx;
    &-semester {
      font-size: 36rpx;
      font-weight: 600;
      color: #ffffff;
    }
    &-switch {
      width: 108rpx;
      height: 52rpx;
      box-sizing: border-box;
      padding: 0 10rpx;
      font-size: 24rpx;
      border: 1px solid $u-type-primary;
      border-radius: 16rpx;
      background-color: rgba($color: #fff, $alpha: 0.85);
      color: $u-type-primary;
      .switch-icon {
        width: 36rpx;
        height: 36rpx;
      }
    }
  }
  &-card {
    box-sizing: border-box;
    padding: 0 32rpx;
  }
}
</style>
