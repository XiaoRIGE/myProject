<template>
  <view class="choose-class-container">
    <g-navbar
      back-icon-size="48"
      title="选择班级"
      :border-bottom="false"
      class="navbar"
    />
    <view v-if="loading">
      <view v-if="!empty" class="choose-class-content">
        <view v-if="soonList.length" class="soon-course">
          <view class="soon-course-top u-flex">
            <image
              src="~@/static/img/clock-course.png"
              mode="scaleToFill"
              class="clock-img"
            />
            <view>当前课程</view>
          </view>
          <template v-for="(item, index) in soonList">
            <view
              :key="index"
              class="soon-course-item"
              @click="onClickCourse(item)"
            >
              <view class="name">
                {{ item.name }}
              </view>
              <view class="time">
                {{ item.timeStr }}
              </view>
            </view>
          </template>
        </view>
        <template v-for="(value, key, index) in list">
          <week-card
            v-if="value.length"
            :key="index"
            :week-info="value"
            :week-number="key"
            @onClickCourse="onClickCourse"
          />
        </template>
        <view class="content-bottom u-flex u-row-between">
          <u-line color="#C3C2CC" length="60rpx" />
          <view>没有更多啦</view>
          <u-line color="#C3C2CC" length="60rpx" />
        </view>
      </view>
      <view v-else class="empty">
        <image
          src="~@/static/img/empty-course.png"
          class="empty-img"
          mode="scaleToFill"
        />
        <view class="empty-text">
          本学期暂未配置班级
        </view>
      </view>
    </view>
    <u-modal
      v-model="show"
      :show-title="false"
      content="该班级未配置专项考试"
      confirm-text="我知道了"
      confirm-color="#FC6C37"
      @confirm="show = false"
    />
  </view>
</template>

<script>
import { course, specialSubject } from '@/request/api/teacher';
import { getCourseList, getSoonCourseList } from '@/utils/common';
import weekCard from './components/WeekCard';

export default {
  name: 'ChooseClass',
  components: {
    'week-card': weekCard
  },
  data() {
    return {
      list: [], // 课程列表
      empty: false,
      soonList: [], //即将上课的课程列表
      flag: '0', //0: 课程考勤  1: 班集体测 2: 专项考试 3：考试成绩 4：跑步情况 5：课外活动
      show: false,
      loading: false
    };
  },
  onLoad(e) {
    this.flag = e.flag;
    this.getClassList();
  },

  methods: {
    // 点击课程回调
    onClickCourse(item) {
      const { id, name, year } = item;
      if (typeof item !== 'object') {
        uni.showToast({
          title: '参数错误',
          icon: 'none',
          mask: true
        });
        return;
      }
      // 跳转课程考勤
      if (this.flag === '0') {
        const info = { id, name };
        uni.navigateTo({
          url: `/pages/courseAttendance/index?item=${encodeURIComponent(
            JSON.stringify(info)
          )}`
        });
      } else if (this.flag === '1') {
        uni.navigateTo({
          url: `/pages/teacherStaminaTest/project?pageType=class&data=${JSON.stringify(
            { id, name }
          )}`
        });
      } else if (this.flag === '2') {
        this.getSubjectList(id, name);
      } else if (this.flag === '3') {
        // 考试成绩
        uni.navigateTo({
          url: `/pages/examinationResults/list?id=${id}&name=${encodeURIComponent(
            name
          )}`
        });
      } else if (this.flag === '4') {
        // 跑步情况
        uni.navigateTo({
          url: `/pages/runningSituation/index?id=${id}&year=${year}&name=${encodeURIComponent(
            name
          )}`
        });
      } else if (this.flag === '5') {
        // 课外活动
        uni.navigateTo({
          url: `/pages/teacherActivity/index?item=${encodeURIComponent(
            JSON.stringify({ id, name })
          )}`
        });
      }
    },
    // 获取科目列表
    getSubjectList(id, name) {
      specialSubject
        .getSubjectList({
          courseId: id
        })
        .then(res => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              const info = {
                courseId: id,
                name,
                subject: res.data
              };
              uni.navigateTo({
                url: `/pages/specialSubject/index?info=${encodeURIComponent(
                  JSON.stringify(info)
                )}`
              });
            } else {
              this.show = true;
            }
          }
        });
    },
    async getClassList() {
      const res = await course.getForTeacherList();
      if (res.code === 0) {
        this.loading = true;
        if (res.data) {
          this.empty = false;
          this.list = getCourseList(res.data);
          this.soonList = getSoonCourseList(res.data);
        } else {
          this.empty = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.choose-class-container {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  min-height: 100vh;
  background-color: #fff;
  .choose-class-content {
    padding: 32rpx;
    .soon-course {
      width: 686rpx;
      background: rgba(254, 240, 235, 1);
      border-radius: 16rpx;
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 32rpx;
      &-top {
        width: 100%;
        height: 72rpx;
        margin-top: 16rpx;
        margin-left: 16rpx;
        color: rgba(252, 108, 55, 1);
        .clock-img {
          width: 48rpx;
          height: 48rpx;
          margin-right: 8rpx;
        }
      }
      &-item {
        width: 100%;
        padding: 24rpx;
        background: linear-gradient(
          180deg,
          rgba(255, 130, 44, 1) 0%,
          rgba(255, 104, 49, 1) 100%
        );
        border-radius: 16rpx;
        color: rgba(255, 255, 255, 1);
        line-height: 44rpx;
        .name {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 8rpx;
        }
        .time {
          font-size: 28rpx;
          font-weight: 400;
        }
      }
    }
    .content-bottom {
      width: 280rpx;
      margin: 48rpx auto 66rpx;
      font-size: 24rpx;
      color: rgba(153, 153, 153, 1);
    }
  }
  .empty {
    margin: 224rpx auto 0;
    text-align: center;
    &-img {
      width: 400rpx;
      height: 300rpx;
    }
    &-text {
      margin-top: 40rpx;
      font-size: 32rpx;
    }
  }
}
</style>
