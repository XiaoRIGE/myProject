<template>
  <view class="course-container">
    <view class="course-container-header-title">
      <text>{{ course.projectName || '' }}</text>
    </view>
    <view class="course-container-content u-flex">
      <view class="course-container-content-left">
        <!-- 上课时间 -->
        <view class="course-container-content-left-item u-flex date">
          <image
            class="img"
            src="~@/static/img/curriculumDetail/time-icon.svg"
            mode="scaleToFill"
          />
          <text>上课时间: {{ course.timeStr || '--' }}</text>
        </view>
        <!-- 任课教师 -->
        <view class="course-container-content-left-item u-flex teacher-info">
          <image
            class="img"
            src="~@/static/img/curriculumDetail/teacher-icon.svg"
            mode="scaleToFill"
          />
          <text>任课教师: {{ course.teacherName || '--' }}</text>
        </view>
        <!-- 校区 -->
        <view class="course-container-content-left-item u-flex school-name">
          <image
            class="img"
            src="~@/static/img/curriculumDetail/school-detail-icon.svg"
            mode="scaleToFill"
          />
          <text>
            {{ course.campusName || '--' }}｜{{ course.year || '--' }}级
          </text>
        </view>
      </view>
      <view class="course-container-content-right">
        <!-- 未配置 -->
        <view v-if="status === 'notConfigured'" class="not-configured">
          {{ statusName }}
        </view>
        <!-- 去评价 -->
        <view v-if="status === 'notEvaluated'">
          <u-button
            type="primary"
            :custom-style="customStyle"
            @click="goEvaluation"
          >
            {{ statusName }}
          </u-button>
        </view>
        <!-- 已评价 -->
        <view v-if="status === 'evaluated'" class="evaluated">
          {{ statusName }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getEvaluateStatus, getEvaluateStatusNames } from '../commom';
export default {
  props: {
    course: {
      type: Object,
      default: Object.create(null)
    }
  },
  data() {
    return {
      customStyle: {
        width: '160rpx',
        height: '64rpx',
        'border-radius': '16rpx'
      }
    };
  },
  computed: {
    status() {
      return getEvaluateStatus(this.course.teacherEvaluationState);
    },
    statusName() {
      return getEvaluateStatusNames(
        getEvaluateStatus(this.course.teacherEvaluationState)
      );
    }
  },
  methods: {
    goEvaluation() {
      const { courseId } = this.course;
      uni.navigateTo({
        url: `/pages/teacherEvaluation/evaluate?courseId=${courseId}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.course-container {
  box-sizing: border-box;
  padding: 32rpx;
  background-color: #fff;
  border-radius: 20rpx;
  &-header-title {
    font-size: 32rpx;
    margin-bottom: 16rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: $u-main-color;
  }
  &-content {
    align-items: flex-end;
    &-left {
      flex: 1;
      &-item {
        margin-bottom: 8rpx;
        .img {
          width: 28rpx;
          height: 28rpx;
        }
        text {
          margin-left: 12rpx;
          font-size: 24rpx;
          font-family: PingFangSC-Regu lar, PingFang SC;
          font-weight: 400;
          color: $u-content-color;
        }
      }
    }
    &-right {
      max-width: 208rpx;
      .not-configured,
      .evaluated {
        font-size: 24rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
      }
      .not-configured {
        color: $u-tips-color;
      }
      .evaluated {
        color: #4aba5d;
      }
    }
  }
}
</style>
