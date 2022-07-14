<template>
  <view class="my-grade-container">
    <!-- 我的成绩头部 -->
    <my-grade-header
      ref="myGradeHeader"
      :is-course="isCourse"
      :current-course="currentCourse"
      @switch-course="switchCourse"
    />
    <!-- 我的成绩内容 -->
    <template v-if="!switchConfig">
      <grade-content
        v-show="isCourse && isGrade && show"
        :grade-list="gradeList"
        :total="total"
        :content="content"
        :is-only-show-all="isOnlyShowAll"
      />
      <!-- 课程为空 || 成绩为空 -->
      <view v-show="!isCourse || !isGrade" class="empty-course">
        <image src="~@/static/img/no-curriculum-bg.png" mode="aspectFit" />
        <text v-show="!isCourse">本学期暂无课程</text>
        <text v-show="isCourse && !isGrade">暂无成绩数据</text>
      </view>
    </template>
    <template v-else>
      <view class="evaluation-content">
        <image
          class="img"
          src="~@/static/img/empty-course.svg"
          mode="widthFix"
        />
        <view class="title">查看成绩前请先进行教师评价</view>
        <u-button
          class="btn"
          type="primary"
          :custom-style="customStyle"
          @click="goEvaluation"
        >
          立即评价
        </u-button>
      </view>
    </template>
    <!-- 课程切换弹窗 -->
    <u-select
      v-model="courseModel"
      :safe-area-inset-bottom="true"
      :default-value="defaultValue"
      cancel-color="#222"
      confirm-color="#FC6C37"
      title="选择课程"
      :list="courseList"
      @confirm="confirm"
    />
  </view>
</template>

<script>
import MyGradeHeader from './components/MyGradeHeader.vue';
import GradeContent from './components/GradeContent.vue';
import { course, grade, teacherEvaluation } from '@/request/api/student';
import { getUserInfo } from '@/utils/common';
import { getGradeList } from './common';

export default {
  name: 'StudentMyGrade',
  components: {
    'my-grade-header': MyGradeHeader,
    'grade-content': GradeContent
  },
  data() {
    return {
      switchConfig: false, // 是否需要教师评价
      isCourse: false,
      isGrade: true,
      isOnlyShowAll: false,
      gradeList: [],
      courseList: [], //课程列表
      gradeData: null, //学生成绩数据
      gradeHead: null, //学生成绩表头
      total: 0, //总分
      content: '', //备注
      currentCourse: null,
      defaultValue: [0],
      courseModel: false,
      show: false, // 展示总分
      customStyle: {
        width: '232rpx',
        height: '80rpx',
        borderRadius: '20rpx'
      }
    };
  },
  computed: {
    userId() {
      return getUserInfo().id;
    }
  },
  onLoad(e) {
    this.isOnlyShowAll = e.isOnlyShowAll === 'true' ? true : false;
  },
  onShow() {
    this.getStudentCourseList();
  },
  // 监听页面滚动
  onPageScroll(e) {
    this.$u.throttle(() => {
      this.$refs.myGradeHeader.setNavBar(e.scrollTop);
    }, 10);
  },
  methods: {
    // 获取学生课程列表
    getStudentCourseList() {
      course
        .getStudentCourseList()
        .then((res) => {
          if (res.code === 0) {
            if (res.data) {
              this.courseList = res.data.map((item) => ({
                label: item.name,
                value: item.id,
                ...item
              }));
              this.currentCourse = res.data[0];
              this.isCourse = true;
              this.getGrade();
            } else {
              this.isCourse = false;
            }
          }
        })
        .catch((err) => {
          this.isCourse = false;
          throw Error(err);
        });
    },

    // 获取成绩
    async getGrade() {
      /**
       * @description 需要判断是否需要教师评价
       * */
      const { code, data } = await teacherEvaluation.checkTeacherEvaluation({
        courseId: this.currentCourse.id,
        position: 1
      });
      this.switchConfig = data;
      if (code === 0 && !data) {
        await this.getStudentGrade();
        await this.getStudentGradeHead();
        this.gradeList = getGradeList(this.gradeData, this.gradeHead);
      }
    },

    // 获取成绩详情
    async getStudentGrade() {
      const { userId, currentCourse } = this;
      try {
        const res = await grade.getMyGradeData({
          courseId: currentCourse.id,
          userId
        });
        if (res.code === 0) {
          this.gradeData = res.data;
          this.total = res.data.total;
          this.show = true;
          this.isGrade = true;
          this.content = res.data.content;
        }
      } catch (err) {
        if (err.code === 80006) {
          this.isGrade = false;
        }
        this.isGrade = false;
        throw new Error(err);
      }
    },

    // 获取成绩表头
    async getStudentGradeHead() {
      const { currentCourse } = this;
      try {
        const res = await grade.getMyGradeDataHead({
          courseId: currentCourse.id
        });
        if (res.code === 0) {
          this.gradeHead = res.data;
          this.isGrade = true;
        }
      } catch (err) {
        this.isGrade = false;
        throw new Error(err);
      }
    },

    // 切换课程
    switchCourse() {
      this.courseModel = true;
    },

    // 去教师评价
    goEvaluation() {
      uni.navigateTo({
        url: `/pages/teacherEvaluation/evaluate?courseId=${this.currentCourse.id}`
      });
    },

    // 确认切换
    confirm(e) {
      const value = e[0] ? e[0].value : undefined;
      const newCourse = this.courseList.find((item) => item.id === value);
      const index = this.courseList.findIndex((item) => item.id === value);
      this.gradeList = [];
      this.defaultValue = [index];
      this.currentCourse = JSON.parse(JSON.stringify(newCourse));
      this.getGrade();
    }
  }
};
</script>

<style lang="scss" scoped>
.my-grade-container {
  .empty-course {
    margin-top: 160rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    image {
      width: 400rpx;
      height: 300rpx;
    }
    text {
      box-sizing: border-box;
      padding: 40rpx 0;
      font-size: 32rpx;
      color: $u-main-color;
    }
  }
  .evaluation-content {
    text-align: center;
    box-sizing: border-box;
    padding-top: 160rpx;
    .img {
      width: 400rpx;
      height: 300rpx;
    }
    .title {
      margin: 40rpx 0;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $u-main-color;
    }
  }
}
</style>
