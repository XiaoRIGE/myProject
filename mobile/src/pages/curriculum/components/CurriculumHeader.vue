<template>
  <view class="curriculum-header">
    <view class="content">
      <g-navbar
        height="15"
        :is-back="false"
        :border-bottom="false"
        :background="{ backgroundColor: navColor }"
      />
      <!-- title 课程切换 二维码签到 -->
      <view
        class="curriculum-header-navbar u-flex u-row-between"
        :style="{ 'background-color': navColor }"
      >
        <text class="curriculum-header-navbar-title">
          {{ currentSemester.yearRange || '--' }}学年{{ semesterName }}
        </text>
        <view class="curriculum-header-navbar-right u-flex">
          <!-- 课程切换 -->
          <view
            v-if="courseNumber > 1"
            class="switch-curriculum u-flex u-row-around"
            @click="switchCurriculum"
          >
            <image
              class="switch-icon"
              src="~@/static/img/switch-icon.svg"
              mode="aspectFit"
            />
            <text>课程</text>
          </view>
          <navigator
            v-if="courseNumber > 0"
            url="/pages/studentSignIn/qrCode"
            open-type="navigate"
            hover-class="none"
          >
            <image class="qrcode-icon" :src="src" mode="aspectFit" />
          </navigator>
        </view>
      </view>
    </view>
    <!-- 当前课程信息 -->
    <view class="card">
      <g-skeleton :loading="false" :skeleton="cardSkeleton">
        <curriculum-card v-if="courseNumber > 0" :course="course" />
      </g-skeleton>
    </view>
  </view>
</template>

<script>
import CurriculumCard from './CurriculumCard';
import { toRpx } from '@/utils/common';
export default {
  name: 'CurriculumHeader',
  components: {
    'curriculum-card': CurriculumCard
  },
  props: {
    courseNumber: {
      type: Number,
      default: 0
    },
    course: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isSticky: false,
      navColor: 'transparent',
      navSkeleton: ['line{h:50rpx,MB:0}+square-sm{MB:0}'],
      cardSkeleton: ['card']
    };
  },
  computed: {
    top() {
      return toRpx(this.StatusBar);
    },
    src() {
      return this.isSticky
        ? require('@/static/img/qrcode-cu-white-icon.svg')
        : require('@/static/img/qrcode-cu-icon.svg');
    },
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
    uni.$on('onHomePageScroll', ({ scrollTop }) => {
      this.isSticky = scrollTop > 8 ? true : false;
      this.navColor = `rgba(252,108,55,${scrollTop > 2 ? scrollTop / 20 : 0})`;
    });
  },
  beforeDestroy() {
    uni.$off('onHomePageScroll');
  },
  methods: {
    switchCurriculum() {
      // 切换课程
      this.$emit('switch-curriculum');
    }
  }
};
</script>

<style scoped lang="scss">
.curriculum-header {
  position: relative;
  width: 100%;
  height: 380rpx;
  background-image: url(~@/static/img/curriculum-header-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 320rpx;

  .content {
    height: 320rpx;
  }
  .card {
    box-sizing: border-box;
    padding: 0 32rpx;
    position: relative;
    margin-top: -115rpx;
  }
  &-navbar {
    width: 100%;
    box-sizing: border-box;
    padding: 0 32rpx 28rpx;
    position: fixed;
    width: 100%;
    z-index: 9;
    // box-sizing: border-box;
    &-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
    }
    &-right {
      .switch-curriculum {
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
      .qrcode-icon {
        margin-left: 20rpx;
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
  .b {
    background-color: $u-type-primary;
  }
}
</style>
