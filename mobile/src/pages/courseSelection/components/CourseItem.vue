<template>
  <view class="course-item-container">
    <view class="course-content">
      <view class="course-name mt8">
        <text class="text">
          {{ course.courseName }}
        </text>
      </view>
      <view class="course-date mt8">
        <text class="text">
          上课时间：{{ course.weekLabel }} {{ course.startTimeStr }}
        </text>
      </view>
      <view class="course-teacher mt8">
        <text class="text">
          任课教师：{{ course.teacherName }}
        </text>
      </view>
      <view class="coures-school mt8">
        <text class="text">
          {{ course.campusName }}|{{ course.weekRange }}
        </text>
      </view>
    </view>
    <!-- 已选或者选课已结束 --- 不能修改或者取消选课 -->
    <template v-if="!isEditCourse">
      <view class="tps-content u-flex">
        <image
          class="warning-icon"
          src="~@/static/img/warning-icon.svg"
          mode="scaleToFill"
        />
        <text class="text">
          {{ courseTps }}
        </text>
      </view>
    </template>
    <!-- 可以修改或者取消选课 -->
    <template v-else>
      <view class="btns">
        <u-button
          class="cancel-btn"
          :custom-style="{ ...customStyle, ...cancelBtn }"
          @click="cancel"
        >
          取消课程
        </u-button>
        <u-button
          :custom-style="{ ...customStyle, ...updateBtn }"
          @click="handleUpdate"
        >
          修改课程
        </u-button>
      </view>
    </template>
  </view>
</template>

<script>
const courseStatusTps = {
  '-1': '老师已将你加入到该课程中',
  2: '选课已结束'
};
export default {
  name: 'CourseItem',
  props: {
    course: {
      type: Object,
      default: () => ({})
    },
    grade: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      customStyle: {
        width: '156rpx',
        display: 'inline-flex',
        height: '64rpx',
        fontSize: '24rpx',
        border: 'none'
      },
      cancelBtn: {
        color: '#222',
        backgroundColor: '#F5F6FA'
      },
      updateBtn: {
        color: '#fff',
        backgroundColor: '#FC6C37'
      }
    };
  },
  computed: {
    courseTps() {
      return courseStatusTps[this.course.courseStatus];
    },
    isEditCourse() {
      const courseStatus = this.course.courseStatus;
      return courseStatus !== -1 && courseStatus !== 2;
    }
  },
  methods: {
    cancel() {
      this.$emit('on-cancel', this.course, this.grade);
    },
    handleUpdate() {
      this.$emit('on-update', this.course, this.grade);
    }
  }
};
</script>

<style scoped lang="scss">
.course-item-container {
  width: 100%;
  height: 332rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  border: 1px solid #eaecf0;
  box-sizing: border-box;
  padding: 32rpx;
  .course-content {
    .course-name {
      overflow: hidden;
      display: block;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      .text {
        font-size: 36rpx;
        font-weight: 600;
        color: $u-main-color;
      }
    }

    .course-date .text,
    .course-teacher .text {
      font-size: 28rpx;
      color: $u-main-color;
    }
    .coures-school .text {
      font-size: 24rpx;
      color: $u-content-color;
    }
  }
  .btns {
    margin-top: 16rpx;
    text-align: right;
    .cancel-btn {
      margin-right: 24rpx;
    }
  }
  .tps-content {
    width: 100%;
    height: 80rpx;
    box-sizing: border-box;
    padding: 24rpx;
    background-color: #ffefd9;
    border-radius: 10rpx;
    .warning-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 24rpx;
    }
    .text {
      font-size: 24rpx;
      font-weight: 400;
      color: #6c4333;
    }
  }
  .mt8 {
    margin-bottom: 8rpx;
  }
  ::v-deep .u-hairline-border:after {
    border: none;
  }
}
</style>
