<template>
  <view class="course-list-item">
    <view v-if="!showConf" class="course-header">
      <tag v-if="showTag" class="tag" :tag="tagStatus" />
      <!-- 考试时间 -->
      <text class="date">
        考试时间 {{ examinationTimeStart }} - {{ examinationTimeEnd }}
      </text>
    </view>
    <!-- 课程名称 -->
    <view class="course-name">
      <text>{{ data.projectName || '' }}</text>
    </view>
    <view class="course-body u-flex">
      <view class="course-left">
        <!-- 上课时间 -->
        <view class="date item u-flex">
          <image
            class="img"
            src="~@/static/img/curriculumDetail/time-icon.svg"
            mode="scaleToFill"
          />
          <text>上课时间: {{ data.timeStr || '' }}</text>
        </view>
        <!-- 任课教师 -->
        <view class="teacher-info item u-flex">
          <image
            class="img"
            src="~@/static/img/curriculumDetail/teacher-icon.svg"
            mode="scaleToFill"
          />
          <text>任课教师: {{ data.teacherName || '' }}</text>
        </view>
        <!-- 学校名称 -->
        <view class="school-name item u-flex">
          <image
            class="img"
            src="~@/static/img/curriculumDetail/school-detail-icon.svg"
            mode="scaleToFill"
          />
          <text>{{ data.campusName }}｜{{ data.year }}级</text>
        </view>
      </view>
      <view class="course-right">
        <!-- 开始考试, 继续考试 -->
        <view v-if="showDetailBtn">
          <u-button type="primary" :custom-style="customStyle" @click="goExam">
            {{ btnName }}
          </u-button>
        </view>

        <!-- 缺考 -->
        <image
          v-if="isMissExam"
          class="miss-exam-img"
          src="~@/static/img/\theoryExam/missing.svg"
          mode="scaleToFill"
        />

        <!-- 分数显示 -->
        <view v-if="isScore" class="score-info">
          <text class="title">总分</text>
          <text class="score">{{ data.achievement || 0 }}</text>
        </view>

        <!-- 未配置考试 -->
        <view v-if="showConf" class="no-config">
          <text class="bor">.</text>
          <text>暂未配置理论考试</text>
        </view>
      </view>
    </view>
    <!-- 考试确认弹窗 -->
    <g-modal
      v-model="startExamModal"
      :show-cancel-button="true"
      confirm-text="开始考试"
      :content="
        '进入考试不可弃考，中途不可退出，答题时长为' +
        countDown +
        '分钟，时间一到将自动交卷'
      "
      @confirm="confirmExamModal"
      @cancel="startExamModal = false"
    />

    <!-- 教师评价弹窗 -->
    <g-modal
      v-model="teacherEvaluationModal"
      :show-cancel-button="true"
      confirm-text="立即评价"
      content="理论考试开始前需先进行教师评价，是否立即评价？"
      @confirm="confirmTeacherEvaluationModal"
      @cancel="teacherEvaluationModal = false"
    />
  </view>
</template>

<script>
import Tag from './Tag';
import { getTagStatus, getBtnStatus, getBtnsStatusName } from '../common';
import { theoryExam, teacherEvaluation } from '@/request/api/student';

export default {
  name: 'CourseItem',
  components: {
    tag: Tag
  },
  props: {
    data: {
      type: Object,
      default: () => Object.create(null)
    }
  },
  data() {
    return {
      customStyle: {
        width: '160rpx',
        height: '64rpx',
        'border-radius': '16rpx'
      },
      startExamModal: false,
      teacherEvaluationModal: false
    };
  },
  computed: {
    // 格式化考试开始时间
    examinationTimeStart() {
      if (this.data.examinationTimeStart) {
        return this.$u.timeFormat(
          this.data.examinationTimeStart,
          'mm/dd hh:MM'
        );
      }
      return '--:--';
    },

    // 格式化考试结束时间
    examinationTimeEnd() {
      if (this.data.examinationTimeEnd) {
        return this.$u.timeFormat(this.data.examinationTimeEnd, 'mm/dd hh:MM');
      }
      return '--:--';
    },
    // Tag 状态
    tagStatus() {
      return getTagStatus(this.data.theoryExaminationState);
    },

    // 缺考
    isMissExam() {
      // 考试结束，学生状态未开始
      if (
        getTagStatus(this.data.theoryExaminationState) === 'hasEnded' &&
        (getBtnStatus(this.data.studentState) === 'startExam' || // 未考试
          getBtnStatus(this.data.studentState) === 'continueExam') // 继续考试，未提交试卷
      ) {
        return true;
      }
      return false;
    },

    // 已经考试，展示分数
    isScore() {
      // 考试在进行中或者已结束，并且学生状态已考试
      const theoryExaminationState = getTagStatus(
        this.data.theoryExaminationState
      );
      if (
        theoryExaminationState === 'inProgress' ||
        theoryExaminationState === 'hasEnded'
      ) {
        if (getBtnStatus(this.data.studentState) === 'success') {
          return true;
        }
      }
      return false;
    },

    // 是否配置考试，展示Tag
    showTag() {
      // 判断是否配置考试
      return this.data && this.data.theoryExaminationState !== null;
    },

    // 未配置考试展示
    showConf() {
      return this.data && this.data.theoryExaminationState === null;
    },

    // 展示右侧继续考试，去考试按钮状态
    showDetailBtn() {
      // 开始考试， 继续考试
      // studentState 学生考试状态
      // theoryExaminationState 理论考试状态
      // 进行中并且学生状态未考试展示按钮
      if (
        getTagStatus(this.data.theoryExaminationState) === 'inProgress' &&
        getBtnStatus(this.data.studentState) !== 'success'
      ) {
        return true;
      }
      return false;
    },

    // 按钮状态名称 startExam：开始考试，continueExam：继续考试
    btnName() {
      return getBtnsStatusName(getBtnStatus(this.data.studentState));
    },

    // 考题信息
    theoryExam() {
      return this.$store.getters.getCurrentTheoryExam(this.data.courseId) || {};
    },

    // 倒计时
    countDown() {
      let MM = 0;
      if (this.theoryExam.countDown) {
        MM = Math.floor(Math.max(0, this.theoryExam.countDown / 1000 / 60));
      }
      return MM;
    }
  },
  methods: {
    // 去考试
    async goExam() {
      // 判断是否需要去教师评价
      const { code, data } = await teacherEvaluation.checkTeacherEvaluation({
        courseId: this.data.courseId,
        position: 0
      });
      if (code === 0 && !data) {
        const btnStatus = getBtnStatus(this.data.studentState);
        // 去考试展示弹窗
        if (btnStatus === 'startExam') {
          if (this.theoryExam && this.theoryExam.question) {
            // 重置考试状态了，清除之前数据
            await this.$store.commit(
              'theoryExam/DELETE_THEORYEXAM',
              this.data.courseId
            );
          }
          // 下载题库
          await this.getTheoryExaminationInfo();
          // 弹窗提示
          this.startExamModal = true;
        }
        // 继续考试
        if (btnStatus === 'continueExam') {
          if (!this.theoryExam.question) {
            // 用户清除过本地缓存的题库，需要去下载题库
            await this.getTheoryExaminationInfo();
          }
          uni.navigateTo({
            url: `/pages/theoryExam/exam?id=${this.data.courseId}`
          });
        }
      } else if (code === 0 && data) {
        this.teacherEvaluationModal = true;
      }
    },

    // 获取考题
    async getTheoryExaminationInfo() {
      const { courseId, theoryTestConfigId } = this.data;
      const { code, data } = await theoryExam.getTheoryExaminationInfo({
        courseId,
        theoryTestConfigId
      });
      if (code === 0 && data) {
        // 本地缓存题库
        const time = (data.testTime || 0) * 60 * 1000; //考试时长
        // 判断当前考试倒计时时间 距离 考试结束时间 的 时长 是否大于考试时间段时间
        // 考试结束时间
        const end = this.data.examinationTimeEnd;
        // 当前时间
        const current = data.currentTime;
        // 实际时间
        const actualTime = end - current >= time ? time : end - current;
        const exam = {
          question: data,
          countDown: actualTime,
          remainingTime: actualTime
        };
        this.$store.commit('theoryExam/SET_THEORYEXAM', exam);
      }
    },

    // 弹窗确认去考试
    confirmExamModal() {
      this.startExamModal = false;
      uni.navigateTo({
        url: `/pages/theoryExam/exam?id=${this.data.courseId}`
      });
    },

    // 去教师评价
    confirmTeacherEvaluationModal() {
      uni.navigateTo({
        url: `/pages/teacherEvaluation/evaluate?courseId=${this.data.courseId}`
      });
    },

    // 检查是否开启教师评价
    async checkTeacherEvaluation() {
      const { code, data } = await teacherEvaluation.checkTeacherEvaluation();
      if (code === 0 && data) {
        // 可以去
        console.log(data);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.course-list-item {
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  .course-header {
    box-sizing: border-box;
    padding: 24rpx 32rpx;
    border-bottom: 1px solid #ececec;
    .tag {
      margin-right: 8rpx;
    }
    .date {
      font-size: 24rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: $u-main-color;
    }
  }
  .course-name {
    box-sizing: border-box;
    padding: 24rpx 32rpx 16rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: $u-main-color;
  }
  .course-body {
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 32rpx 24rpx;
    .course-left {
      flex: 1;
      .item {
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
      .date {
        flex-wrap: nowrap;
        flex-shrink: 0;
        word-break: break-all;
      }
    }
    .course-right {
      width: 206rpx;
      position: relative;
      display: flex;
      align-self: flex-end;
      justify-content: flex-end;
      .miss-exam-img {
        position: absolute;
        right: -42rpx;
        bottom: -32rpx;
        width: 188rpx;
        height: 184rpx;
      }
      .no-config {
        font-size: 24rpx;
        font-weight: bold;
        color: $u-tips-color;
        .bor {
          font-size: 32rpx;
          margin-right: 4rpx;
        }
      }
      .score-info {
        width: 100%;
        text-align: right;
        .title {
          margin-right: 8rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
          color: $u-main-color;
        }
        .score {
          font-size: 48rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
          color: $uni-color-primary;
        }
      }
    }
  }
}
</style>
