<template>
  <view class="detail-content">
    <g-navbar
      :background="{ backgroundColor: navBarBgColor }"
      :border-bottom="false"
      back-icon-color="#222"
      back-icon-size="48"
      title="课程详情"
    />
    <!-- 课程信息-->
    <view id="detailContent" class="curriculum-info">
      <view class="curriculum-info-top">
        <view class="title">
          {{ courseInfo.title }}
        </view>
        <view class="row u-flex">
          <image
            src="~@/static/img/curriculumDetail/time-icon.svg"
            mode="aspectFit"
          />
          <text class="label">
            上课时间
          </text>
          <text class="name">
            {{ courseInfo.startTime }}
          </text>
        </view>
        <view class="row u-flex">
          <image
            src="~@/static/img/curriculumDetail/teacher-icon.svg"
            mode="aspectFit"
          />
          <text class="label">
            任课教师
          </text>
          <text class="name">
            {{ courseInfo.teacherName }}
          </text>
        </view>
        <view class="row u-flex">
          <image
            src="~@/static/img/curriculumDetail/course-icon.svg"
            mode="aspectFit"
          />
          <text class="label">
            上课项目
          </text>
          <text class="name">
            {{ courseInfo.projectName }}
          </text>
        </view>
      </view>
      <view class="line" />
      <view class="detail">
        <view class="info-title">
          课程信息
        </view>
        <view class="row u-flex">
          <image
            src="~@/static/img/curriculumDetail/class-icon.svg"
            mode="aspectFit"
          />
          <text class="label">
            年级
          </text>
          <text class="name">
            {{ courseInfo.year }}级
          </text>
        </view>
        <view class="row u-flex">
          <image
            src="~@/static/img/curriculumDetail/address-icon.svg"
            mode="aspectFit"
          />
          <text class="label">
            上课地点
          </text>
          <text class="name">
            {{ courseInfo.address }}
          </text>
        </view>
        <view class="row u-flex">
          <image
            src="~@/static/img/curriculumDetail/school-detail-icon.svg"
            mode="aspectFit"
          />
          <text class="label">
            校区
          </text>
          <text class="name">
            {{ courseInfo.campusName }}
          </text>
        </view>
        <view class="row u-flex">
          <image
            src="~@/static/img/curriculumDetail/begin-icon.svg"
            mode="aspectFit"
          />
          <text class="label">
            开始日期
          </text>
          <text class="name">
            {{ startDate }}
          </text>
        </view>
        <view class="row u-flex">
          <image
            src="~@/static/img/curriculumDetail/end-icon.svg"
            mode="aspectFit"
          />
          <text class="label">
            结束日期
          </text>
          <text class="name">
            {{ endDate }}
          </text>
        </view>
      </view>
    </view>
    <!-- 备注信息 -->
    <view class="remarks-info">
      <view class="info-title">
        备注信息
      </view>
      <view class="remarks">
        {{ courseInfo.content || '' }}
        <text v-if="!courseInfo.content">
          该课程暂无备注信息
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { course } from '@/request/api/student';
export default {
  name: 'Detail',
  onLoad(e) {
    this.courseInfo.title = e.title;
    this.getStudentCourseDetail(e.id);
  },
  data() {
    return {
      navBarBgColor: 'transparent',
      courseInfo: {}
    };
  },
  computed: {
    startDate() {
      if (this.courseInfo.startDate) {
        return this.$u.timeFormat(this.courseInfo.startDate, 'yyyy/mm/dd');
      }
      return '';
    },
    endDate() {
      if (this.courseInfo.endDate) {
        return this.$u.timeFormat(this.courseInfo.endDate, 'yyyy/mm/dd');
      }
      return '';
    }
  },
  methods: {
    setNavBarBgColor(top) {
      this.navBarBgColor = top <= 20 ? 'transparent' : '#fff';
    },
    // 获取课程详情
    async getStudentCourseDetail(courseId) {
      const res = await course.getStudentCourseDetail({ courseId });
      if (res.code === 0 && res.data) {
        this.courseInfo = Object.assign({}, this.courseInfo, res.data);
      }
    }
  },
  onPageScroll(e) {
    this.setNavBarBgColor(e.scrollTop);
  }
};
</script>

<style scoped lang="scss">
.detail-content {
  background-color: #f5f6fa;
  min-height: 100vh;
  background-image: url(~@/static/img/curriculum-detail-header-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 320rpx;
  box-sizing: border-box;
  padding: 0 32rpx 50rpx;
  .curriculum-info {
    margin-top: 48rpx;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 32rpx;
    border-radius: 20rpx;
    background-color: #fff;
    .curriculum-info-top {
      .title {
        margin-bottom: 12rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: $u-main-color;
      }
    }
    .line {
      width: 100%;
      height: 0.5px;
      margin: 26rpx 0;
      background-color: #f0f0f0;
    }
    &::before {
      position: absolute;
      left: -20rpx;
      top: 290rpx;
      display: inline-block;
      content: '';
      width: 40rpx;
      height: 36rpx;
      border-radius: 50%;
      background-color: #f5f6fa;
    }
    &::after {
      position: absolute;
      right: -20rpx;
      top: 290rpx;
      display: inline-block;
      content: '';
      width: 40rpx;
      height: 36rpx;
      border-radius: 50%;
      background-color: #f5f6fa;
    }
  }
  .remarks-info {
    margin-top: 32rpx;
    width: 100%;
    box-sizing: border-box;
    padding: 32rpx;
    border-radius: 20rpx;
    background-color: #fff;
    .remarks {
      font-size: 28rpx;
      line-height: 50rpx;
      color: $u-main-color;
      text {
        color: #8b8a99;
      }
    }
  }
  .info-title {
    font-size: 32rpx;
    font-weight: bold;
    color: $u-main-color;
    margin-bottom: 16rpx;
  }
  .row {
    height: 60rpx;
    image {
      width: 36rpx;
      height: 36rpx;
    }
    .label {
      margin: 0 40rpx 0 5rpx;
      font-size: 28rpx;
      color: $u-content-color;
    }
    .name {
      font-size: 28rpx;
      color: $u-main-color;
    }
  }
}
</style>
