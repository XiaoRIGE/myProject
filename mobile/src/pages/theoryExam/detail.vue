<template>
  <view class="detail-container">
    <!-- 头部 -->
    <view class="detail-header">
      <g-navbar
        :back-icon="navBg === 'transparent' ? 'white' : 'black'"
        :background="{ backgroundColor: navBg }"
        :border-bottom="navBg === '#fff'"
        :title="navBg === '#fff' ? '考试结果' : ''"
      />
    </view>
    <!-- Card 卡片 -->
    <view id="scoreCard" class="score-info-card">
      <view class="count-score">
        <view class="score-line">
          <text class="score">{{ result.achievement || 0 }}</text>
          <text class="label">分</text>
        </view>
        <view class="title">成绩总分</view>
      </view>
      <view class="score-info-item">
        <view class="score-item">
          <view class="top u-flex">
            <text class="score-type">单选题</text>
            <view class="right">
              <text class="yes">{{ result.singleChoiceSureCount || 0 }}</text>
              <text class="count">/{{ result.singleChoiceCount || 0 }}</text>
            </view>
          </view>
          <view class="bottom u-flex">
            <text>每题{{ result.singleChoiceAchievement || 0 }}分</text>
            <text>答对题数/题型总数</text>
          </view>
        </view>
        <view class="score-item">
          <view class="top u-flex">
            <text class="score-type">非固定选题</text>
            <view class="right">
              <text class="yes">{{ result.multipleChoiceSureCount || 0 }}</text>
              <text class="count">/{{ result.multipleChoiceCount || 0 }}</text>
            </view>
          </view>
          <view class="bottom u-flex">
            <text>每题{{ result.multipleChoiceAchievement || 0 }}分</text>
            <text>答对题数/题型总数</text>
          </view>
        </view>
        <view class="score-item">
          <view class="top u-flex">
            <text class="score-type">判断题</text>
            <view class="right">
              <text class="yes">{{ result.judgmentSureCount || 0 }}</text>
              <text class="count">/{{ result.judgmentCount || 0 }}</text>
            </view>
          </view>
          <view class="bottom u-flex">
            <text>每题{{ result.judgmentAchievement || 0 }}分</text>
            <text>答对题数/题型总数</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 题目列表 -->
    <view class="question-list">
      <text class="title">考试回顾</text>
      <view v-if="list && list.length > 0" class="question-container">
        <view
          v-for="(question, index) in list"
          :key="question.questionId"
          class="question-item"
        >
          <!-- 题目 -->
          <view class="question-item-title">
            <!-- 题号 -->
            <text class="code">{{ index + 1 }}.</text>
            <!-- 题类型 -->
            <text class="question-name">{{ question.questionTypeName }}</text>
            <!-- 题目 -->
            <text class="name">{{ question.questionName || '' }}</text>
          </view>
          <!-- 题目列表 -->
          <view v-if="!question.judgment" class="question-item-list">
            <view
              v-for="item in question.answerList"
              :key="item.tag"
              class="item"
            >
              <text>{{ item.tag }}. {{ item.answerContent || '' }}</text>
            </view>
          </view>
          <!-- 答题结果 -->
          <view class="question-item-result u-flex">
            <!-- 判断题 -->
            <text v-if="question.judgment" class="yes">
              正确答案：{{ answerEnum[question.sureTag] || '' }}
            </text>
            <!-- 非判断题 -->
            <text v-else class="yes">
              正确答案：{{ question.sureTag || '' }}
            </text>
            <!-- 错误 -->
            <view v-if="!question.sureChoice" class="result no">
              <image
                class="icon"
                src="~@/static/img/theoryExam/error.svg"
                mode="scaleToFill"
              />
              <text v-if="question.judgment">
                答错 {{ answerEnum[question.choiceTag] || '' }}
              </text>
              <text v-else>答错 {{ question.choiceTag || '' }}</text>
            </view>
            <view v-if="question.sureChoice" class="result ok">
              <image
                class="icon"
                src="~@/static/img/theoryExam/correct.svg"
                mode="scaleToFill"
              />
              <text>答对</text>
            </view>
            <!-- 正确 -->
          </view>
        </view>
      </view>
    </view>

    <!-- 返回弹窗 -->
    <g-modal
      v-model="backModal"
      :show-title="false"
      :show-cancel-button="true"
      content="返回后无法再次查看试卷内容，是否继续返回？"
      confirm-text="继续返回"
      cancel-text="取消"
      @cancel="cancelBack"
      @confirm="goBack"
    />
  </view>
</template>

<script>
import { theoryExam } from '@/request/api/student';
export default {
  data() {
    return {
      navBg: 'transparent',
      result: {},
      list: [], // 题库列表
      isBack: false, // 是否可以返回
      backModal: false, // 返回弹窗
      id: '',
      answerEnum: {
        A: '正确',
        B: '错误'
      }
    };
  },

  onBackPress() {
    if (!this.isBack) {
      this.backModal = true;
    }
    return !this.isBack;
  },
  onLoad({ id }) {
    this.id = id;
    this.getTheoryExaminationResult();
  },
  methods: {
    setNavBarStyle() {
      this.$nextTick(() => {
        try {
          const query = uni.createSelectorQuery().in(this);
          query
            .select('#scoreCard')
            .boundingClientRect((data) => {
              if (data) {
                if (data.top <= this.StatusBar + 49) {
                  this.navBg = '#fff';
                } else {
                  this.navBg = 'transparent';
                }
              }
            })
            .exec();
        } catch (err) {
          throw Error(err);
        }
      });
    },

    // 获取考试结果
    async getTheoryExaminationResult() {
      const { code, data } = await theoryExam.getTheoryExaminationResult({
        theoryTestConfigId: this.id
      });
      if (code === 0 && data) {
        const {
          singleChoiceQuestionListVO,
          multipleChoiceQuestionListVO,
          judgmentQuestionListVO
        } = data;
        const list = [];
        (singleChoiceQuestionListVO || []).map((item) => {
          list.push({
            questionTypeName: '单选题',
            ...item
          });
        });
        (multipleChoiceQuestionListVO || []).map((item) => {
          list.push({
            questionTypeName: '非固定选题',
            ...item
          });
        });
        (judgmentQuestionListVO || []).map((item) => {
          list.push({
            questionTypeName: '判断题',
            judgment: true,
            ...item
          });
        });
        this.list = list;
        this.result = data;
      }
    },

    // 返回列表页面
    goBack() {
      this.isBack = true;
      uni.navigateBack();
    },

    cancelBack() {
      this.isBack = false;
      // 不允许返回
    }
  },
  onPageScroll() {
    this.setNavBarStyle();
  }
};
</script>

<style lang="scss" scoped>
.detail-container {
  box-sizing: border-box;
  padding-bottom: 64rpx;
  .detail-header {
    height: 460rpx;
    width: 100vw;
    background-image: url(~@/static/img/theoryExam/result-bg.svg);
    background-size: cover;
    background-repeat: no-repeat;
  }
  .score-info-card {
    margin: -110rpx 32rpx 0;
    height: 600rpx;
    box-sizing: border-box;
    padding: 32rpx 32rpx 24rpx;
    background-color: #fff;
    border-radius: 20rpx;
    .count-score {
      text-align: center;
      .score-line {
        text-align: center;
        .score {
          font-size: 80rpx;
          font-weight: bold;
          color: $u-type-primary;
        }
        .label {
          margin-left: 8rpx;
          font-size: 32rpx;
          font-weight: 400;
          color: $u-main-color;
        }
      }
      .title {
        margin-top: 22rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: $u-content-color;
      }
    }
    .score-info-item {
      margin-top: 32rpx;
      .score-item {
        height: 120rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-bottom: 1px solid #ececec;
        .top,
        .bottom {
          justify-content: space-between;
        }
        .bottom {
          margin-top: 4rpx;
          text {
            font-size: 24rpx;
            font-weight: 400;
            color: $u-tips-color;
          }
        }
        .score-type {
          font-size: 28rpx;
          font-weight: 400;
          color: $u-main-color;
        }
        .right {
          text-align: right;
          font-size: 32rpx;
          font-weight: bold;
          .yes {
            color: $u-main-color;
          }
          .count {
            color: $u-tips-color;
          }
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .question-list {
    margin: 32rpx 32rpx 0;
    box-sizing: border-box;
    padding: 32rpx 32rpx 24rpx;
    background-color: #fff;
    border-radius: 20rpx;
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: $u-main-color;
    }
    .question-container {
      .question-item {
        .question-item-title {
          box-sizing: border-box;
          padding: 26rpx 0;
          border-bottom: 1px solid #ececec;
          .code {
            font-size: 28rpx;
            font-weight: 400;
            color: $u-main-color;
          }
          .question-name {
            margin: 0 8rpx;
            box-sizing: border-box;
            padding: 0 8rpx;
            font-size: 22rpx;
            font-weight: 400;
            color: $u-type-primary;
            background-color: rgba(252, 108, 55, 0.1);
            border-radius: 8rpx;
          }
          .name {
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: $u-main-color;
          }
        }
        .question-item-list {
          .item {
            margin-top: 16rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: $u-content-color;
          }
        }
        .question-item-result {
          justify-content: space-between;
          box-sizing: border-box;
          padding: 22rpx 0 30rpx;
          font-size: 28rpx;
          font-weight: bold;
          .yes {
            color: #4aba5d;
          }
          .no {
            color: $u-type-primary;
            background-color: rgba(255, 103, 103, 0.1);
          }
          .ok {
            color: #4aba5d;
            background-color: rgba(74, 186, 93, 0.1);
          }
          .result {
            display: inline-flex;
            align-items: center;
            box-sizing: border-box;
            padding: 6rpx 8rpx;
            border-radius: 8rpx;
            .icon {
              width: 40rpx;
              height: 40rpx;
            }
          }
        }
      }
    }
  }
}
</style>
