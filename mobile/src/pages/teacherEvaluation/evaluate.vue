<template>
  <view class="evaluate-container">
    <!-- Page-Meta 防止滚动穿透 -->
    <page-meta :page-style="showTitleNumberModal ? pageStyle : ''" />
    <g-navbar :border-bottom="false" title="教师评价" />
    <!-- 题目列表 -->
    <view v-if="countQuestion > 0" class="subject-list">
      <!-- 单选题 -->
      <template v-if="singleChoiceQuestionListVO.length > 0">
        <view
          v-for="(question, index) in singleChoiceQuestionListVO"
          :id="'Ref--' + question.questionId"
          :key="question.questionId"
          class="subject-list--item bg-white"
        >
          <!-- 标题信息 -->
          <subject-item-title
            :index="question.index"
            :type-name="getQuestionTypesName(1)"
            :title="question.questionName"
          />
          <view class="subject-list--item--content">
            <template
              v-if="question.answerList && question.answerList.length > 0"
            >
              <radio-group @change="changeGroup(index, '1', ...arguments)">
                <view
                  v-for="answers in question.answerList"
                  :key="answers.tag"
                  class="subject-list--item--content--select-box"
                >
                  <radio
                    :value="answers.tag"
                    color="#fc6c37"
                    :checked="answers.tag === question.answer"
                  >
                    <text class="label-name">
                      {{ answers.tag }}. {{ answers.answerContent }}
                    </text>
                  </radio>
                </view>
              </radio-group>
            </template>
          </view>
        </view>
      </template>
      <!-- 多选题 -->
      <template v-if="multipleChoiceQuestionListVO.length > 0">
        <view
          v-for="(question, index) in multipleChoiceQuestionListVO"
          :id="'Ref--' + question.questionId"
          :key="question.questionId"
          class="subject-list--item bg-white"
        >
          <!-- 标题信息 -->
          <subject-item-title
            :index="question.index"
            :type-name="getQuestionTypesName(2)"
            :title="question.questionName"
          />
          <view class="subject-list--item--content">
            <!-- 多选题 -->
            <template
              v-if="question.answerList && question.answerList.length > 0"
            >
              <checkbox-group
                active-color="#fc6c37"
                @change="changeGroup(index, '2', ...arguments)"
              >
                <view
                  v-for="answers in question.answerList"
                  :key="answers.tag"
                  class="subject-list--item--content--select-box"
                >
                  <checkbox color="#fff" :value="answers.tag" :checked="false">
                    <text class="label-name">
                      {{ answers.tag }}. {{ answers.answerContent }}
                    </text>
                  </checkbox>
                </view>
              </checkbox-group>
            </template>
          </view>
        </view>
      </template>
      <!-- 评分题 -->
      <template v-if="scoringQuestionListVO.length > 0">
        <view
          v-for="question in scoringQuestionListVO"
          :id="'Ref--' + question.questionId"
          :key="question.questionId"
          class="subject-list--item bg-white"
        >
          <!-- 标题信息 -->
          <subject-item-title
            :index="question.index"
            :type-name="getQuestionTypesName(3)"
            :title="question.questionName"
          />
          <view class="subject-list--item--content">
            <grade-input
              ref="validates"
              :subject="question"
              :tps="question.tps"
              :rules="question.rules"
              @blur="blur"
            />
          </view>
        </view>
      </template>
      <!-- 简答题 -->
      <template v-if="briefAnswerQuestionListVO.length > 0">
        <view
          v-for="question in briefAnswerQuestionListVO"
          :id="'Ref--' + question.questionId"
          :key="question.questionId"
          class="subject-list--item bg-white"
        >
          <!-- 标题信息 -->
          <subject-item-title
            :index="question.index"
            :type-name="getQuestionTypesName(4)"
            :title="question.questionName"
          />
          <view class="subject-list--item--content">
            <brief-input ref="validates" :subject="question" @blur="blur" />
          </view>
        </view>
      </template>
    </view>
    <!-- 底部按钮 -->
    <view v-show="showSubmitBtn" class="footer-btns">
      <!-- 答题进度 -->
      <view class="answer-progress u-flex" @click="showTitleNumberModal = true">
        <image
          class="info-icon"
          src="~@/static/img/theoryExam/info.svg"
          mode="scaleToFill"
        />
        <text class="label">答题进度：</text>
        <view class="counts">
          <text class="current-count">{{ currentQuestion }}</text>
          <text class="target-count">/{{ countQuestion }}</text>
        </view>
      </view>
      <view>
        <u-button
          :disabled="disabledSubmit"
          :custom-style="customStyle"
          type="primary"
          @click="submitSuccess"
        >
          提交
        </u-button>
      </view>
    </view>
    <!-- 底部导航卡片  -->
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
            <text class="current">{{ currentQuestion }}</text>
            <text class="target">/{{ countQuestion }}</text>
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
          <template v-if="countQuestion > 0">
            <!-- 单选题 -->
            <view class="content">
              <view class="title">
                <text>单选题</text>
              </view>
              <view class="list u-flex">
                <view
                  v-for="question in singleChoiceQuestionListVO"
                  :key="question.index"
                  class="list-item"
                  :class="[question.answer && 'selected']"
                  @click="getCurrentSubject('Ref--' + question.questionId)"
                >
                  {{ question.index }}
                </view>
              </view>
            </view>
            <!-- 多选题 -->
            <view class="content">
              <view class="title">
                <text>非固定选题</text>
              </view>
              <view class="list u-flex">
                <view
                  v-for="question in multipleChoiceQuestionListVO"
                  :key="question.index"
                  class="list-item"
                  :class="[question.answer && 'selected']"
                  @click="getCurrentSubject('Ref--' + question.questionId)"
                >
                  {{ question.index }}
                </view>
              </view>
            </view>
            <!-- 评分题 -->
            <view class="content">
              <view class="title">
                <text>评分题</text>
              </view>
              <view class="list u-flex">
                <view
                  v-for="question in scoringQuestionListVO"
                  :key="question.index"
                  class="list-item"
                  :class="[question.answer && 'selected']"
                  @click="getCurrentSubject('Ref--' + question.questionId)"
                >
                  {{ question.index }}
                </view>
              </view>
            </view>
            <!-- 问答题 -->
            <view class="content">
              <view class="title">
                <text>简答题</text>
              </view>
              <view class="list u-flex">
                <view
                  v-for="question in briefAnswerQuestionListVO"
                  :key="question.index"
                  class="list-item"
                  :class="[question.answer && 'selected']"
                  @click="getCurrentSubject('Ref--' + question.questionId)"
                >
                  {{ question.index }}
                </view>
              </view>
            </view>
          </template>
        </scroll-view>
      </view>
    </u-popup>
    <!-- 返回弹窗 -->
    <g-modal
      v-model="backModal"
      :show-title="false"
      :show-cancel-button="true"
      content="返回后此次教师评价将不会被存储，是否继续返回？"
      confirm-text="继续返回"
      cancel-text="取消"
      @cancel="isBack = false"
      @confirm="goBack"
    />
  </view>
</template>

<script>
import { teacherEvaluation } from '@/request/api/student';
import { getQuestionTypesName, getQuestionTypes } from './commom';
import GradeInput from './components/GradeInput';
import BriefInput from './components/BriefInput';
import SubjectItemTitle from './components/SubjectItemTitle';
// 题目类型枚举
const QuestionTypes = {
  1: 'singleChoiceQuestionListVO', // 单选
  2: 'multipleChoiceQuestionListVO', // 多选
  3: 'scoringQuestionListVO', // 评分
  4: 'briefAnswerQuestionListVO' // 简答题
};
export default {
  components: {
    'grade-input': GradeInput,
    'brief-input': BriefInput,
    'subject-item-title': SubjectItemTitle
  },
  onBackPress() {
    if (!this.isBack) {
      this.backModal = true;
    }
    return !this.isBack;
  },
  onLoad(options) {
    this.courseId = options.courseId;
    this.getTeacherEvaluationInfo();
    uni.onKeyboardHeightChange((res) => {
      console.log('res-height:', res.height);
      if (res.height > 5 && this.showSubmitBtn) {
        this.showSubmitBtn = false;
      } else if (res.height <= 5 && !this.showSubmitBtn) {
        this.showSubmitBtn = true;
      }
    });
  },
  data() {
    return {
      showSubmitBtn: true,
      courseId: '',
      pageStyle: 'overflow: hidden',
      currentQuestion: 0, // 已完成题目数量
      isBack: false, // 是否可以返回
      backModal: false, // 返回弹窗
      singleChoiceQuestionListVO: [], // 单选题
      multipleChoiceQuestionListVO: [], // 多选题
      scoringQuestionListVO: [], // 评分题
      briefAnswerQuestionListVO: [], // 简答题
      showTitleNumberModal: false,
      preventTop: 0, // 上一次点击滚动出现的位置
      customStyle: {
        width: '256rpx',
        height: '92rpx',
        fontSize: '32rpx',
        borderRadius: '24rpx',
        fontWeight: 600
      }
    };
  },
  computed: {
    // 未答完题 disabled 按钮
    disabledSubmit() {
      if (this.countQuestion === 0) return true;
      return this.countQuestion > this.currentQuestion;
    },
    countQuestion() {
      // 题目总数
      return (
        this.singleChoiceQuestionListVO.length +
        this.multipleChoiceQuestionListVO.length +
        this.scoringQuestionListVO.length +
        this.briefAnswerQuestionListVO.length
      );
    }
  },
  methods: {
    // 获取范围
    getNumberValue(value, d) {
      if (typeof value === 'number') {
        return value;
      } else {
        return d === 'min' ? -Infinity : Infinity;
      }
    },

    // 获取题目列表
    async getTeacherEvaluationInfo() {
      uni.showLoading({
        title: '加载中...'
      });
      try {
        const { code, data } = await teacherEvaluation.getTeacherEvaluationInfo(
          {
            courseId: this.courseId
          }
        );
        if (code === 0 && data) {
          const {
            singleChoiceQuestionListVO,
            scoringQuestionListVO,
            multipleChoiceQuestionListVO,
            briefAnswerQuestionListVO
          } = data;
          const singLen = (singleChoiceQuestionListVO || []).length,
            multipLen = (multipleChoiceQuestionListVO || []).length,
            scoringLen = (scoringQuestionListVO || []).length;
          this.singleChoiceQuestionListVO = // 单选题
          (singleChoiceQuestionListVO || []).map((question, index) => {
            return {
              ...question,
              answer: '',
              index: index + 1
            };
          });
          this.multipleChoiceQuestionListVO = // 多选题
          (multipleChoiceQuestionListVO || []).map((question, index) => {
            return {
              index: singLen + index + 1,
              ...question,
              answer: ''
            };
          });
          this.scoringQuestionListVO = (scoringQuestionListVO || []).map(
            // 评分题
            (question, index) => {
              const tps = `请输入${question.scoreLowerLimit}-${question.scoreUpperLimit}范围内的值`;
              return {
                index: singLen + multipLen + index + 1,
                ...question,
                rules: [
                  {
                    required: true,
                    min: this.getNumberValue(question.scoreLowerLimit, 'min'),
                    max: this.getNumberValue(question.scoreUpperLimit, 'max'),
                    message: tps
                  },
                  {
                    decimal: 2,
                    message: '最多保留2位小数'
                  }
                ],
                tps,
                answer: ''
              };
            }
          );
          this.briefAnswerQuestionListVO = (
            briefAnswerQuestionListVO || []
          ).map(
            // 简答题
            (question, index) => {
              return {
                index: singLen + multipLen + scoringLen + index + 1,
                ...question,
                answer: ''
              };
            }
          );
        }
      } finally {
        this.$nextTick(() => {
          uni.hideLoading();
        });
      }
    },

    // 获取题目类型
    getQuestionTypes(state) {
      return getQuestionTypes(state);
    },

    // 获取题目类型名称
    getQuestionTypesName(state) {
      return getQuestionTypesName(getQuestionTypes(state));
    },

    // 点击获取元素
    getCurrentSubject(ref) {
      if (ref) {
        this.scrollToTop(ref, this.StatusBar + 44 + uni.upx2px(20));
      }
    },

    // 滚动到对应位置
    scrollToTop(ref, topMargin) {
      // 判断当前页面是否超出屏幕高度
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select(`#${ref}`)
          .boundingClientRect((data) => {
            if (data) {
              const { top } = data;
              const currentTop = top - topMargin + this.preventTop;
              // 记录当前滚动位置
              uni.pageScrollTo({
                scrollTop: currentTop,
                selector: `#${ref}`,
                duration: 200
              });
              this.showTitleNumberModal = false;
            }
          })
          .exec();
      });
    },

    // 单选，多选题目选择
    changeGroup(index, type, event) {
      let value = event.detail.value;
      // 多选需要处理 value
      if (type === '2') {
        value = event.detail.value.join(',');
      }
      const currentQuestion = this.$u.deepClone(
        this[QuestionTypes[type]][index]
      );
      currentQuestion.answer = value;
      this.$set(this[QuestionTypes[type]], index, currentQuestion);
      this.$nextTick(() => {
        this.getCurrentQuestion();
      });
    },

    // 评分题，问答题失去焦点
    blur(type, value, { questionId }) {
      const index = this[QuestionTypes[type]].findIndex(
        (question) => question.questionId === questionId
      );
      if (index > -1) {
        this[QuestionTypes[type]][index].answer = value;
        this.getCurrentQuestion();
      }
    },

    // 获取已经答题数量
    getCurrentQuestion() {
      let count = 0;
      [
        ...this.singleChoiceQuestionListVO,
        ...this.multipleChoiceQuestionListVO,
        ...this.scoringQuestionListVO,
        ...this.briefAnswerQuestionListVO
      ].map((answers) => {
        if (answers.answer) {
          count += 1;
        }
      });
      this.currentQuestion = count;
    },

    // 提交成功，跳转页面
    submitSuccess() {
      this.$nextTick(() => {
        this.validatesForm().then(async (validate) => {
          if (validate) {
            const query = this.formatSubmitQuery();
            const { code, data } = await teacherEvaluation.submit(query);
            if (code === 0 && data) {
              uni.redirectTo({
                url: '/pages/teacherEvaluation/success'
              });
            }
          }
        });
      });
    },

    // 表单验证
    async validatesForm() {
      let state = true;
      const validates = this.$refs.validates;
      if (validates && Array.isArray(validates)) {
        const len = validates.length;
        for (let i = 0; i < len; i++) {
          const { validate, message } = await validates[i].validate();
          if (!validate) {
            state = validate;
            uni.showToast({
              title: message,
              icon: 'none'
            });
            break;
          }
        }
      }
      return state;
    },

    // 格式化提交参数
    formatSubmitQuery() {
      const result = {
        courseId: this.courseId,
        questionVOList: []
      };
      [
        ...this.singleChoiceQuestionListVO,
        ...this.multipleChoiceQuestionListVO,
        ...this.scoringQuestionListVO,
        ...this.briefAnswerQuestionListVO
      ].map((question) => {
        const {
          questionId,
          questionName,
          questionType,
          scoreLowerLimit,
          scoreUpperLimit,
          sort,
          answerList,
          answer
        } = question;
        const common = {
          questionId,
          questionName,
          questionType,
          scoreLowerLimit,
          scoreUpperLimit,
          sort,
          answerVOList: answerList
        };

        if (questionType === 1 && common.answerVOList) {
          // 单选
          common.answerVOList.forEach((item) => {
            item['choice'] = item.tag === answer;
          });
        }
        if (questionType === 2 && common.answerVOList) {
          // 多选
          common.answerVOList.forEach((item) => {
            item['choice'] = answer.includes(item.tag);
          });
        }
        if (questionType === 3 || questionType === 4) {
          common.answerVOList = [
            {
              tag: null,
              answerContent: answer
            }
          ];
        }
        result.questionVOList.push(common);
      });
      return result;
    },

    // 继续返回
    goBack() {
      this.isBack = true;
      uni.navigateBack();
    }
  },
  onPageScroll({ scrollTop }) {
    this.$u.throttle(() => {
      this.preventTop = scrollTop;
    }, 30);
  }
};
</script>

<style lang="scss" scoped>
.evaluate-container {
  box-sizing: border-box;
  .subject-list {
    &--item {
      margin-top: 20rpx;
      box-sizing: border-box;
      padding: 24rpx 32rpx;
    }
    &--item--content {
      &--select-box {
        box-sizing: border-box;
        padding: 20rpx 0;
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
            width: 32rpx;
            height: 32rpx;
          }
          uni-checkbox .uni-checkbox-input {
            flex-shrink: 0;
            width: 32rpx;
            height: 32rpx;
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
    ::v-deep {
      .u-btn--primary--disabled {
        background-color: #fdb59b !important;
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
          font-weight: 600;
          color: $u-main-color;
        }
        .current,
        .target {
          font-size: 36rpx;
          font-weight: 600;
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
.subject-list {
  padding-bottom: calc(160rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
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
