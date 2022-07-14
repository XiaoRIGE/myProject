<template>
  <view class="course-selection-container">
    <template v-if="courseCount > 0 && courseList.length > 0">
      <view id="header" class="header-content">
        <g-navbar
          :border-bottom="false"
          :background="{ backgroundColor: navBarColor }"
          back-icon-color="#38364D"
          back-icon-size="48"
          title="选课"
        />
        <!-- 基础信息 -->
        <view class="base-info">
          <view class="num">
            <text class="count">
              {{ courseCount || 0 }}
            </text>
            <text>门</text>
          </view>
          <text>本学期需选课数量</text>
        </view>
      </view>
      <view class="content" :style="[{ 'min-height': contentHeight + 'px' }]">
        <!-- 选课列表 -->
        <view class="grade-list">
          <view
            v-for="course in courseList"
            :key="course.year"
            class="grade-list-item"
          >
            <view class="grade-title">
              <text class="grade-title-name">
                {{ course.title }}({{ course.year }}级)
              </text>
            </view>
            <view class="grade-course-list">
              <template v-for="(courseItem, index) in course.courseList">
                <view
                  v-if="courseItem.id"
                  :key="index"
                  class="grade-course-list-item"
                >
                  <course-item
                    :course="courseItem"
                    :grade="course.title"
                    @on-update="updateCourse"
                    @on-cancel="cancelCourse"
                  />
                </view>
                <view
                  v-if="!courseItem.id"
                  :key="index"
                  class="grade-course-list-item"
                >
                  <add-course :course="course" @on-click="addCourse" />
                </view>
              </template>
            </view>
          </view>
        </view>
      </view>
      <!-- 取消选课弹窗 -->
      <g-modal
        v-model="showCancelCourseModal"
        confirm-text="确定取消"
        cancel-text="再想想"
        :show-title="true"
        confirm-color="#FC6C37"
        :show-cancel-button="true"
        title="取消选课"
        @confirm="cancelConfirm"
      >
        <view class="slot-content">
          <text>确定取消该课程吗？</text>
          <view>{{ cancelCourseContent.courseName }}</view>
        </view>
      </g-modal>
    </template>
    <!-- 无数据状态 -->
    <template v-else>
      <g-navbar
        :border-bottom="false"
        :background="{ backgroundColor: 'transparent' }"
        back-icon-color="#38364D"
        back-icon-size="48"
        title="选课"
      />

      <view v-if="!isRequest" class="no-info">
        <image src="~@/static/img/no-curriculum-bg.png" mode="scaleToFill" />
        <view>本学期暂时无需选课</view>
      </view>
    </template>
  </view>
</template>

<script>
import { courseSelection } from '@/request/api/student';
import CourseItem from './components/CourseItem';
import AddCourse from './components/AddCourse';
import _ from 'lodash';
const yearlist = {
  1: '大一',
  2: '大二',
  3: '大三',
  4: '大四'
};
export default {
  name: 'CourseSelection',
  components: {
    'course-item': CourseItem,
    'add-course': AddCourse
  },
  data() {
    return {
      courseCount: 0,
      isRequest: false, // 是否在数据请求中
      refresh: false,
      cancelCourseContent: {}, // 需要取消的课程
      navBarColor: 'rgba(255,255,255,0)',
      showCancelCourseModal: false,
      contentHeight: 0,
      courseList: []
    };
  },
  onLoad() {
    this.getCourseList('first');
  },
  onShow() {
    if (this.refresh) {
      this.refresh = false;
      this.getCourseList();
    }
  },
  computed: {
    semesterId() {
      return this.$store.state.semester.currentSemester.id;
    },
    userId() {
      return this.$store.state.app.userInfo.id;
    }
  },
  methods: {
    // 获取列表
    async getCourseList(state) {
      if (state === 'first') this.isRequest = true;
      try {
        const { semesterId, userId } = this;
        const res = await courseSelection.getOptionalPageList({
          semesterId,
          userId
        });
        if (res.code === 0 && res.data) {
          const { total, courseMap } = _.cloneDeep(res.data);
          this.courseCount = total;
          if (courseMap) {
            const list = [];
            for (const key in courseMap) {
              const { number, courseList, semesterYear } = courseMap[key];
              const course = courseList || [];
              // 当已选课程小于可选课程时，放入剩余可选可选到list中便于循环去选课按钮
              if (courseList.length < number) {
                const surplusNumber = Math.max(0, number - courseList.length);
                for (let i = 0; i < surplusNumber; i++) {
                  course.push({});
                }
              }
              list.push({
                title: yearlist[semesterYear],
                courseList: course,
                year: key,
                number
              });
            }
            this.courseList = list;
          }
        }
      } catch (err) {
        throw Error(err);
      }
      this.isRequest = false;
      // 请求接口后执行该函数,否则无法获取DOM元素
      this.getHeaderHeight();
    },
    // 获取header DOM 高度
    getHeaderHeight() {
      if (this.contentHeight > 0) return;
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('#header')
          .boundingClientRect((headerData) => {
            if (headerData && headerData.height) {
              this.contentHeight =
                this.screenHeight - headerData.height + uni.upx2px(34);
            }
          })
          .exec();
      });
    },
    setNavBar(height) {
      this.navBarColor = `rgba(255,255,255,${height > 20 ? height / 45 : 0})`;
    },
    addCourse({ year, title }) {
      this.$store.commit('courseSelection/DELETE_COURSE');
      uni.navigateTo({
        url: `/pages/courseCandidateList/index?type=add&year=${year}&grade=${title}`
      });
    },
    updateCourse(course = null, grade) {
      this.$store.commit('courseSelection/SET_COURSE', course);
      const { year } = course;
      uni.navigateTo({
        url: `/pages/courseCandidateList/index?type=update&grade=${grade}&year=${year}`
      });
    },
    cancelCourse(course) {
      this.showCancelCourseModal = true;
      this.cancelCourseContent = course;
    },
    cancelConfirm() {
      this.cancelCouresRequest();
      this.showCancelCourseModal = false;
    },
    async cancelCouresRequest() {
      const { id, year } = this.cancelCourseContent;
      const res = await courseSelection.cancelCourse({ courseId: id });
      if (res.code === 0 && res.data.isSuccess) {
        // 去级列表中查找取消的课程所属年级
        const yearIndex = this.courseList.findIndex(
          (yearItem) => Number(yearItem.year) === Number(year)
        );
        if (yearIndex > -1) {
          const newCourse = _.cloneDeep(this.courseList[yearIndex]);
          const courseIndex = newCourse.courseList.findIndex(
            (course) => course.id === id
          );
          // 删除该课程
          newCourse.courseList.splice(courseIndex, 1);
          // 放入一个新的空按钮
          newCourse.courseList.push({});
          // 替换新的数据
          this.courseList.splice(yearIndex, 1, newCourse);
          uni.showToast({
            title: '取消成功',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: '前端数据异常',
            icon: 'none'
          });
        }
      } else {
        uni.showToast({
          title: res.data.reason,
          icon: 'none'
        });
      }
    }
  },
  onPageScroll(e) {
    this.$u.throttle(this.setNavBar(e.scrollTop), 100);
  }
};
</script>

<style scoped lang="scss">
.course-selection-container {
  .header-content {
    width: 100%;
    background-image: url(~@/static/img/course-selection-header-bg.png);
    background-repeat: no-repeat;
    background-size: 100% 530rpx;
    height: 530rpx;
    .base-info {
      font-size: 32rpx;
      font-weight: 400;
      box-sizing: border-box;
      padding: 110rpx 60rpx 0;
      color: $u-main-color;
      .num {
        .count {
          font-size: 80rpx;
          font-weight: bold;
        }
        text {
          font-size: 36rpx;
          font-weight: 500;
          margin-left: 16rpx;
        }
      }
    }
  }
  .content {
    margin-top: -36rpx;
    width: 100%;
    box-sizing: border-box;
    padding: 56rpx 32rpx 32rpx;
    border-radius: 24rpx 24rpx 0 0;
    background-color: #fff;
    .grade-list {
      &-item {
        margin-bottom: 56rpx;
      }
      .grade-title,
      .grade-course-list-item {
        margin-bottom: 32rpx;
        &-name {
          font-size: 36rpx;
          font-weight: 600;
          color: $u-main-color;
        }
      }
    }
  }
  .slot-content {
    box-sizing: border-box;
    padding: 24rpx 48rpx 56rpx;
    font-size: 34rpx;
    text {
      color: $u-content-color;
    }
    view {
      margin-top: 12rpx;
      color: $u-main-color;
      font-weight: bold;
      word-wrap: break-word;
    }
  }
  .no-info {
    margin-top: 240rpx;
    text-align: center;
    image {
      width: 400rpx;
      height: 300rpx;
    }
    view {
      margin-top: 40rpx;
      text-align: center;
      font-size: 32rpx;
      color: $u-main-color;
    }
  }
}
</style>
