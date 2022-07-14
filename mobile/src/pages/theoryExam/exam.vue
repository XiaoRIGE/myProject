<template>
  <view class="exam-container" :class="[countExercises <= 0 && 'white']">
    <!-- Page-Meta 防止滚动穿透 -->
    <page-meta :page-style="showTitleNumberModal ? pageStyle : ''" />

    <g-navbar :border-bottom="false" title="理论考试">
      <template #right>
        <view v-if="countExercises > 0" class="nav-bar-right u-flex">
          <image
            class="clock-icon"
            src="~@/static/img/theoryExam/clock.svg"
            mode="scaleToFill"
          />
          <text class="text">
            {{ MM + ':' + ss }}
          </text>
        </view>
      </template>
    </g-navbar>

    <view class="exam-content">
      <!-- 有题目情况 -->
      <template v-if="countExercises > 0">
        <!-- 单选 -->
        <view
          v-for="(single, index) in singleChoiceQuestionListVO"
          :id="'Ref' + single.questionId"
          :key="single.questionId"
          class="exam-content-item"
        >
          <view class="title">
            <text class="exam-code">{{ single.grade }}.</text>
            <exam-tag tag="radio" />
            <text class="exam-name">
              {{ single.questionName || '' }}
              <text class="exam-score">
                ({{ single.questionAchievement }}分)
              </text>
            </text>
          </view>
          <view class="content">
            <radio-group
              :wrap="true"
              :disabled="disabledPaper"
              @change="changeGroupSingleJudgment(index, 'single', ...arguments)"
            >
              <view
                v-for="item in single.answerList"
                :key="item.questionId"
                class="exam-item"
              >
                <radio
                  :key="item.tag"
                  :value="item.tag"
                  color="#fc6c37"
                  :checked="item.tag === single.answer"
                >
                  <text class="label-name">
                    {{ item.tag }}. {{ item.answerContent }}
                  </text>
                </radio>
              </view>
            </radio-group>
          </view>
        </view>
        <!-- 多选 -->
        <view
          v-for="(multiple, index) in multipleChoiceQuestionListVO"
          :id="'Ref' + multiple.questionId"
          :key="multiple.questionId"
          class="exam-content-item"
        >
          <view class="title">
            <text class="exam-code">{{ multiple.grade }}.</text>
            <exam-tag tag="checkbox" />
            <text class="exam-name">
              {{ multiple.questionName || '' }}
              <text class="exam-score">
                ({{ multiple.questionAchievement }}分)
              </text>
            </text>
          </view>
          <view class="content">
            <checkbox-group
              active-color="#fc6c37"
              :disabled="disabledPaper"
              @change="changeGroup(index, ...arguments)"
            >
              <view
                v-for="item in multiple.answerList"
                :key="item.tag"
                class="exam-item"
              >
                <checkbox color="#fff" :value="item.tag" :checked="item.answer">
                  <text class="label-name">
                    {{ item.tag }}. {{ item.answerContent }}
                  </text>
                </checkbox>
              </view>
            </checkbox-group>
          </view>
        </view>
        <!-- 判断题 -->
        <view
          v-for="(judgment, index) in judgmentQuestionListVO"
          :id="'Ref' + judgment.questionId"
          :key="judgment.questionId"
          class="exam-content-item"
        >
          <view class="title">
            <text class="exam-code">{{ judgment.grade }}.</text>
            <exam-tag tag="judge" />
            <text class="exam-name">
              {{ judgment.questionName || '' }}
              <text class="exam-score">
                ({{ judgment.questionAchievement }}分)
              </text>
            </text>
          </view>
          <view class="content">
            <radio-group
              :disabled="disabledPaper"
              @change="
                changeGroupSingleJudgment(index, 'judgment', ...arguments)
              "
            >
              <view
                v-for="item in judgment.answerList"
                :key="item.tag"
                class="exam-item"
              >
                <radio
                  color="#fc6c37"
                  :checked="judgment.answer === item.tag"
                  :value="item.tag"
                >
                  <text class="label-name">
                    {{ item.answerContent }}
                  </text>
                </radio>
              </view>
            </radio-group>
          </view>
        </view>
      </template>
      <!-- 无题目情况 -->
      <template v-else>
        <no-data text="老师暂未配置考试题目" />
      </template>
    </view>

    <!-- 底部按钮 -->
    <view v-if="countExercises > 0" class="footer-btns">
      <!-- 答题进度 -->
      <view class="answer-progress u-flex" @click="showTitleNumberModal = true">
        <image
          class="info-icon"
          src="~@/static/img/theoryExam/info.svg"
          mode="scaleToFill"
        />
        <text class="label">答题进度：</text>
        <view class="counts">
          <text class="current-count">{{ currentSpeed }}</text>
          <text class="target-count">/{{ countExercises }}</text>
        </view>
      </view>
      <view>
        <u-button
          :custom-style="customStyle"
          type="primary"
          @click="submitExam"
        >
          提交答卷
        </u-button>
      </view>
    </view>

    <!-- 查看所有题目号弹窗 -->
    <u-popup
      v-model="showTitleNumberModal"
      :safe-area-inset-bottom="true"
      :closeable="false"
      :border-radius="24"
      :close-icon-size="38"
      mode="bottom"
    >
      <view class="popup-container-modal">
        <view class="pop-title u-flex">
          <view class="label">
            <text class="title">答题进度：</text>
            <text class="current">{{ currentSpeed }}</text>
            <text class="target">/{{ countExercises }}</text>
          </view>
          <view class="close-icon" @click="showTitleNumberModal = false">
            <image
              class="icon"
              src="~@/static/img/theoryExam/close.svg"
              mode="scaleToFill"
            />
          </view>
        </view>
        <scroll-view
          scroll-y="true"
          :style="{ 'max-height': screenHeight * 0.78 + 'px' }"
        >
          <!-- 单选题 -->
          <view v-if="singleChoiceQuestionListVO.length > 0" class="content">
            <view class="title">
              <text>单选题</text>
            </view>
            <view class="list u-flex">
              <view
                v-for="single in singleChoiceQuestionListVO"
                :key="single.questionId"
                class="list-item"
                :class="[single.answer && 'selected']"
                @click="getCurrentSubject('Ref' + single.questionId)"
              >
                {{ single.grade }}
              </view>
            </view>
          </view>
          <!-- 多选题 -->
          <view v-if="multipleChoiceQuestionListVO.length > 0" class="content">
            <view class="title">
              <text>非固定选题</text>
            </view>
            <view class="list u-flex">
              <view
                v-for="multiple in multipleChoiceQuestionListVO"
                :key="multiple.questionId"
                class="list-item"
                :class="[multiple.answer && 'selected']"
                @click="getCurrentSubject('Ref' + multiple.questionId)"
              >
                {{ multiple.grade }}
              </view>
            </view>
          </view>
          <!-- 判断题 -->
          <view v-if="judgmentQuestionListVO.length > 0" class="content">
            <view class="title">
              <text>判断题</text>
            </view>
            <view class="list u-flex">
              <view
                v-for="judgmen in judgmentQuestionListVO"
                :key="judgmen.questionId"
                class="list-item"
                :class="[judgmen.answer && 'selected']"
                @click="getCurrentSubject('Ref' + judgmen.questionId)"
              >
                {{ judgmen.grade }}
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </u-popup>

    <!-- 未答完试卷主动提交 -->
    <g-modal
      v-model="submitModal"
      :show-title="false"
      :show-cancel-button="true"
      content="未完成试卷中的全部题目，是否提交答卷？"
      confirm-text="继续答题"
      cancel-text="确认交卷"
      @cancel="handPaper"
      @confirm="confirmPaper"
    />

    <!-- 网络时间差，是否继续提交弹窗 -->
    <g-modal
      v-model="networkStatusModal"
      :show-title="false"
      :show-cancel-button="true"
      content="当天网络状态差，是否重新提交答卷？"
      confirm-text="重新提交"
      cancel-text="稍后再试"
      @cancel="networkStatusModal = false"
      @confirm="submitTheoryExamination"
    />

    <!-- 考试时间已过，返回列表弹窗 -->
    <g-modal
      v-model="timeOutModal"
      :show-title="false"
      :show-cancel-button="false"
      :content="errContent"
      confirm-text="返回课程列表"
      @confirm="goBack"
    />
  </view>
</template>

<script>
import ExamTag from './components/ExamTag';
import NoData from './components/NoData';
import { theoryExam } from '@/request/api/student';
export default {
  components: {
    'exam-tag': ExamTag,
    'no-data': NoData
  },
  data() {
    return {
      disabledPaper: false, // 是否禁用试卷，倒计时完成，提交试卷时不允许操作
      pageStyle: 'overflow: hidden',
      courseId: '', // 课程id
      countDownTimer: null,
      remainingTime: 0,
      preventTop: 0, // 上一次点击滚动出现的位置
      singleChoiceQuestionListVO: [], // 单选题
      multipleChoiceQuestionListVO: [], // 多选题
      judgmentQuestionListVO: [], // 判断题
      currentSpeed: 0, // 当前答题进度
      showTitleNumberModal: false, // 展示答题卡片题号弹窗
      submitModal: false, // 提交时 未完成答卷 提示弹窗
      networkStatusModal: false, // 网络状态弹窗
      timeOutModal: false, // 考试时间已过
      errContent: '', // 错误信息
      customStyle: {
        width: '256rpx',
        height: '92rpx',
        fontWeight: 'bold',
        fontSize: '32rpx',
        borderRadius: '24rpx'
      }
    };
  },
  onReady() {
    setTimeout(() => {
      this.initCountDownTimer();
    }, 100);
  },
  computed: {
    theoryExam() {
      return this.$store.getters.getCurrentTheoryExam(this.courseId);
    },

    // 倒计时 分钟
    MM() {
      const minutes = Math.max(0, Math.floor(this.remainingTime / 1000 / 60));
      return minutes > 9 ? minutes : `0${minutes}`;
    },

    // 倒计时 秒
    ss() {
      const seconds = Math.max(0, Math.floor((this.remainingTime / 1000) % 60));
      return seconds > 9 ? seconds : `0${seconds}`;
    },

    // 总的题目
    countExercises() {
      return (
        this.singleChoiceQuestionListVO.length +
        this.multipleChoiceQuestionListVO.length +
        this.judgmentQuestionListVO.length
      );
    }
  },
  mounted() {
    uni.hideLoading();
  },
  onLoad(options) {
    this.courseId = options.id;
    // 初始化题库
    this.initQuestion();
    uni.showLoading({
      title: '加载中...'
    });
  },
  onUnload() {
    if (this.countDownTimer) {
      clearInterval(this.countDownTimer);
      this.countDownTimer = null;
    }
  },
  methods: {
    // 考试提交
    submitExam() {
      const list = this.getQuestionsAnsweredCount();
      if (list && list.length > 0) {
        this.submitModal = true;
      } else {
        this.submitTheoryExamination();
      }
    },

    // 修改store中的时间
    updateStoreCountDownTimer(storeObj) {
      this.$store.commit('theoryExam/SET_REMAINING_TIME', storeObj);
    },

    // 初始化倒计时定时器
    initCountDownTimer() {
      if (this.theoryExam && this.countExercises > 0) {
        // 剩余的时间
        const { remainingTime } = this.theoryExam;
        this.remainingTime = remainingTime;
        if (remainingTime > 0) {
          this.countDownTimer = setInterval(() => {
            this.remainingTime = Math.max(this.remainingTime - 1000, 0);
            if (this.remainingTime <= 1000) {
              // 自动提交试卷,并取消定时器
              this.submitTheoryExamination();
              clearInterval(this.countDownTimer);
              this.countDownTimer = null;
              this.disabledPaper = true;
            }
            // 更新store倒计时数据,下次进入页面不从头计算
            const storeObj = {
              courseId: this.courseId,
              ms: this.remainingTime
            };
            this.updateStoreCountDownTimer(storeObj);
          }, 1000);
        }
        // 如果剩余时间小于1秒，则自动提交试题
        if (remainingTime <= 1000) {
          this.submitTheoryExamination();
          this.disabledPaper = true;
        }
      }
    },

    // 初始化题库
    initQuestion() {
      const theoryExam = this.theoryExam;
      if (theoryExam && theoryExam.question) {
        // 添加序号 单选 多选 判断
        const {
          judgmentQuestionListVO,
          multipleChoiceQuestionListVO,
          singleChoiceQuestionListVO
        } = theoryExam.question;
        // 单选题
        if (
          singleChoiceQuestionListVO &&
          singleChoiceQuestionListVO.length > 0
        ) {
          this.singleChoiceQuestionListVO = singleChoiceQuestionListVO.map(
            (judgmentItem, index) => {
              const project = this.$u.deepClone(judgmentItem);
              // 答案标识
              if (!('answer' in project)) {
                project['answer'] = '';
              }
              // 设置题目标号 -> 单选 -> 多选 -> 判断
              if (!('grade' in project)) {
                project['grade'] = index + 1;
              }
              return project;
            }
          );
        }

        // 多选题
        if (
          multipleChoiceQuestionListVO &&
          multipleChoiceQuestionListVO.length > 0
        ) {
          this.multipleChoiceQuestionListVO = multipleChoiceQuestionListVO.map(
            (multiple, index) => {
              const project = this.$u.deepClone(multiple);
              // 设置题目标号 -> 单选 -> 多选 -> 判断
              if (!('grade' in project)) {
                project['grade'] =
                  index + 1 + singleChoiceQuestionListVO.length;
              }
              // 答案绑定题目
              if (!('answer' in project)) {
                project['answer'] = '';
              }

              if (project && project.answerList.length > 0) {
                project.answerList.forEach((answerProject) => {
                  // 判断之前是否选择过该题,上一次考试缓存
                  if (!('answer' in answerProject)) {
                    answerProject.answer = false;
                  }
                });
              }
              return project;
            }
          );
        }
        // 判断题
        if (judgmentQuestionListVO && judgmentQuestionListVO.length > 0) {
          this.judgmentQuestionListVO = judgmentQuestionListVO.map(
            (judgmentItem, index) => {
              const project = this.$u.deepClone(judgmentItem);
              if (!('answer' in project)) {
                project['answer'] = '';
              }
              // 设置题目标号 -> 单选 -> 多选 -> 判断
              if (!('grade' in project)) {
                project['grade'] =
                  index +
                  1 +
                  multipleChoiceQuestionListVO.length +
                  singleChoiceQuestionListVO.length;
              }
              return project;
            }
          );
        }

        // 初始化已经答题数量
        this.getQuestionsAnsweredCount();
      }
    },

    // 多选题选择
    changeGroup(index, event) {
      // id: 题目id, answer: 答案
      if (index > -1) {
        // answers
        const answers = event.detail.value;
        const currentQuestion = this.$u.deepClone(
          this.multipleChoiceQuestionListVO[index]
        );
        const answer = answers.length > 0 ? answers.join(',') : '';
        currentQuestion.answer = answer;
        currentQuestion.answerList.forEach((answer) => {
          answer.answer = answers.includes(answer.tag);
        });
        this.$set(this.multipleChoiceQuestionListVO, index, currentQuestion);

        // 初始化已经答题数量
        this.getQuestionsAnsweredCount();

        // 修改store 中的多选题数据
        this.$nextTick(() => {
          this.$store.commit('theoryExam/SET_QUESTION', {
            type: 'multiple',
            courseId: this.courseId,
            answer,
            answers,
            questionId: currentQuestion.questionId
          });
        });
      }
    },

    // 判断题和单选题选择
    changeGroupSingleJudgment(index, type, event) {
      // 题号,类型，答案
      const menuTypes = {
        single: 'singleChoiceQuestionListVO',
        judgment: 'judgmentQuestionListVO'
      };
      if (index > -1) {
        const answer = event.detail.value;
        const currentQuestion = this.$u.deepClone(this[menuTypes[type]][index]);
        currentQuestion.answer = answer;
        this.$set(this[menuTypes[type]], index, currentQuestion);

        // 初始化已经答题数量
        this.getQuestionsAnsweredCount();

        // 修改store 中的多选题数据
        this.$nextTick(() => {
          this.$store.commit('theoryExam/SET_QUESTION', {
            type,
            questionId: currentQuestion.questionId,
            courseId: this.courseId,
            answer
          });
        });
      }
    },

    // 获取已答题数量
    getQuestionsAnsweredCount() {
      // 获取已经答题数量,包括选题则,多选题,判断题
      let count = 0;
      const answers = []; // 存储未答题的id
      const sLen = (this.singleChoiceQuestionListVO || []).length;
      const mLen = (this.multipleChoiceQuestionListVO || []).length;
      const jLen = (this.judgmentQuestionListVO || []).length;
      for (let i = 0; i < sLen; i++) {
        const answer = this.singleChoiceQuestionListVO[i].answer;
        if (answer && String(answer).trim()) {
          // 已经答题
          count += 1;
        } else {
          // 放进id
          answers.push(this.singleChoiceQuestionListVO[i].questionId);
        }
      }
      for (let i = 0; i < mLen; i++) {
        const answer = this.multipleChoiceQuestionListVO[i].answer;
        if (answer && String(answer).trim()) {
          // 已经答题
          count += 1;
        } else {
          answers.push(this.multipleChoiceQuestionListVO[i].questionId);
        }
      }
      for (let i = 0; i < jLen; i++) {
        const answer = this.judgmentQuestionListVO[i].answer;
        if (answer && String(answer).trim()) {
          // 已经答题
          count += 1;
        } else {
          answers.push(this.judgmentQuestionListVO[i].questionId);
        }
      }
      this.currentSpeed = count;
      return answers;
    },

    // 点击底部答题卡片,将当前未答题目滚动到对应顶部位置
    getCurrentSubject(id) {
      if (id) {
        // 当前未选择答案, 需要滚动到顶部
        // top 第一个元素位置 状态栏高度 + tabbar + padding
        this.scrollToTop(id, this.StatusBar + 44 + uni.upx2px(20));
        this.showTitleNumberModal = false;
      }
    },

    // 滚动到顶部, 滚动元素的id,需要距离顶部的位置
    scrollToTop(id, topMargin) {
      if (!id) return;
      // 判断当前页面是否超出屏幕高度
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select(`#${id}`)
          .boundingClientRect((data) => {
            if (data) {
              const { top } = data;
              const currentTop = top - topMargin + this.preventTop;
              // 记录当前滚动位置
              uni.pageScrollTo({
                scrollTop: currentTop,
                selector: `#${id}`,
                duration: 200
              });
            }
          })
          .exec();
      });
    },

    // 确认提交试卷
    handPaper() {
      this.submitModal = false;
      this.submitTheoryExamination();
    },

    // 继续答题
    confirmPaper() {
      // 定位到未答题的第一道题位置
      // 关闭弹窗
      const list = this.getQuestionsAnsweredCount();
      if (list[0]) {
        this.scrollToTop(`Ref${list[0]}`, this.StatusBar + 44 + uni.upx2px(20));
      }
    },

    // 提交时获取答案和题号
    filterQuestionList() {
      const questionList = [];
      const sLen = this.singleChoiceQuestionListVO.length;
      const mLen = this.multipleChoiceQuestionListVO.length;
      const jLen = this.judgmentQuestionListVO.length;
      const setValue = (value) => {
        if (!value || value === '') return [];
        if (value && typeof value === 'string') {
          return value.split(',');
        }
        return [];
      };

      for (let i = 0; i < sLen; i++) {
        const { answer, questionId, grade, questionType } =
          this.singleChoiceQuestionListVO[i];
        questionList.push({
          questionId,
          sort: grade,
          questionType,
          answer: setValue(answer)
        });
      }

      for (let i = 0; i < mLen; i++) {
        const { answer, questionId, grade, questionType } =
          this.multipleChoiceQuestionListVO[i];
        questionList.push({
          questionId,
          questionType,
          sort: grade,
          answer: setValue(answer)
        });
      }
      for (let i = 0; i < jLen; i++) {
        const { answer, questionId, grade, questionType } =
          this.judgmentQuestionListVO[i];
        questionList.push({
          questionId,
          sort: grade,
          questionType,
          answer: setValue(answer)
        });
      }
      return questionList;
    },

    // 提交试题
    async submitTheoryExamination() {
      const { question } = this.theoryExam;
      // 获取用户的考试时常
      const { countDown, remainingTime } =
        this.$store.getters.getCurrentTheoryExam(this.courseId);
      const currentTime = new Date().setHours(0, 0, 0, 0);
      const query = {
        courseId: this.courseId,
        questionList: this.filterQuestionList(),
        theoryTestConfigId: question.theoryTestConfigId,
        answerTime: currentTime + Math.max(0, countDown - remainingTime)
      };
      try {
        const { code, data } = await theoryExam.submitTheoryExamination(query);
        if (code === 0 && data) {
          uni.redirectTo({
            url: `/pages/theoryExam/detail?id=${question.theoryTestConfigId}`,
            success: () => {
              // 清除store数据
              this.$store.commit('theoryExam/DELETE_THEORYEXAM', this.courseId);
            }
          });
        }
      } catch (err) {
        const { code, message } = err;
        // 错误提示信息
        this.errContent = message;
        if (code === 90005 || code === 90006) {
          this.timeOutModal = true;
        } else {
          uni.showToast({
            title: message,
            icon: 'none'
          });
        }
      }
    },
    // 考试时间过，返回上一页
    goBack() {
      uni.navigateBack();
    }
  },
  onPageScroll(e) {
    this.preventTop = e.scrollTop;
  }
};
</script>

<style lang="scss" scoped>
.white {
  min-height: 100vh;
  background-color: #fff;
}

.exam-container {
  .nav-bar-right {
    box-sizing: border-box;
    padding: 0 32rpx 0 0;
    .clock-icon {
      width: 48rpx;
      height: 48rpx;
    }
    .text {
      font-size: 32rpx;
      font-weight: bold;
      color: $u-main-color;
    }
  }
  .exam-content {
    .exam-content-item {
      margin-top: 20rpx;
      box-sizing: border-box;
      padding: 24rpx 32rpx;
      background-color: #fff;
      .title {
        flex-wrap: wrap;
        box-sizing: border-box;
        padding-bottom: 26rpx;
        border-bottom: 1px solid #ececec;
        .exam-code,
        .exam-name,
        .exam-score {
          font-size: 30rpx;
          font-weight: 400;
        }
        .exam-code {
          margin-right: 16rpx;
          color: $u-main-color;
        }
        .exam-name {
          margin-left: 16rpx;
          color: $u-main-color;
        }
        .exam-score {
          color: $u-tips-color;
        }
      }
      .content {
        margin-top: 22rpx;
        .exam-item {
          margin: 20rpx 0;
        }
        .label-name {
          box-sizing: border-box;
          padding-left: 14rpx;
          font-size: 28rpx;
          font-weight: 400;
          color: $u-main-color;
        }
        &::v-deep {
          .uni-checkbox-input:hover {
            border-color: #d1d1d1;
          }
          .uni-radio-input:hover {
            border-color: #d1d1d1;
          }
          .uni-checkbox-input-checked {
            background-color: $uni-color-primary;
            border: 1px solid $uni-color-primary;
          }
          .uni-checkbox-input-checked:hover {
            border-color: $uni-color-primary;
          }
          .uni-radio-input-checked {
            background-color: $uni-color-primary;
            border: 1px solid $uni-color-primary;
          }

          uni-radio .uni-radio-input {
            flex-shrink: 0;
            width: 36rpx;
            height: 36rpx;
          }
          uni-checkbox .uni-checkbox-input {
            flex-shrink: 0;
            width: 36rpx;
            height: 36rpx;
          }
        }
      }
    }
  }
  .footer-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1rpx solid #ececec;
    background-color: #fff;
    .answer-progress {
      .info-icon {
        width: 48rpx;
        height: 48rpx;
      }
      .label {
        font-size: 28rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: $u-main-color;
      }
      .current-count {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: $u-main-color;
      }
      .target-count {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: $u-content-color;
      }
    }
  }
  .popup-container-modal {
    position: relative;
    box-sizing: border-box;
    padding: 0 32rpx;
    .pop-title {
      width: 100%;
      height: 100rpx;
      justify-content: space-between;
      .close-icon .icon {
        width: 44rpx;
        height: 44rpx;
      }
      .label {
        .title {
          font-size: 28rpx;
          font-weight: bold;
          color: $u-main-color;
        }
        .current,
        .target {
          font-size: 36rpx;
          font-weight: bold;
        }
        .current {
          color: $u-main-color;
        }
        .target {
          color: $u-tips-color;
        }
      }
    }
    .content {
      margin-top: 48rpx;
      .title {
        font-size: 28rpx;
        color: $u-main-color;
      }
      .list {
        margin-top: 32rpx;
        flex-wrap: wrap;
        justify-content: flex-start;
        .list-item:nth-of-type(5n) {
          margin-right: 0;
        }
        .list-item {
          width: 80rpx;
          height: 80rpx;
          line-height: 80rpx;
          text-align: center;
          margin-right: 68rpx;
          margin-bottom: 32rpx;
          border-radius: 50%;
          font-size: 32rpx;
          font-weight: 400;
          color: $u-main-color;
          background-color: #f0f1f5;
        }
        .selected {
          color: #fff;
          background-color: $u-type-primary;
        }
      }
    }
  }
}
</style>
<style scoped>
.exam-content {
  box-sizing: border-box;
  padding-bottom: calc(150rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
}
.footer-btns {
  /* 安全区域适配 */
  height: calc(140rpx + constant(safe-area-inset-bottom));
  height: calc(140rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  padding-left: 32rpx;
  padding-right: 32rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
