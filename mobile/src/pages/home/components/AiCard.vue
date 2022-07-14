<template>
  <view class="ap-page">
    <view class="ai-content">
      <view class="ai-content-nav u-flex">
        <text class="ai-content-nav-title">
          AI运动
        </text>
        <g-skeleton
          :content-style="{ padding: 0, height: '52rpx' }"
          :skeleton="['card{w:108rpx,h:52rpx,r:16rpx}']"
          :loading="loading"
        >
          <view
            v-if="rules.ruleFlag"
            class="ai-content-nav-rule"
            @click="handleClick('rule')"
          >
            <text class="title">
              规则
            </text>
          </view>
        </g-skeleton>
      </view>
      <g-skeleton
        :loading="loading"
        :content-style="{ padding: 0 }"
        :skeleton="['card{h:220rpx,r:20rpx,MB:0,MT:14rpx}']"
      >
        <view class="ai-content-bg" @click="handleClick('page')">
          <image class="img" src="~@/static/img/ai-bg.png" mode="scaleToFill" />
        </view>
      </g-skeleton>
    </view>
    <view class="ai-content-semester">
      <g-skeleton
        :loading="loading"
        :content-style="{ padding: 0 }"
        :skeleton="['card{h:220rpx,r:20rpx,MB:0}']"
      >
        <view
          class="content"
          :class="{ white: rules.ruleFlag, rule: !rules.ruleFlag }"
        >
          <view class="ai-content-semester-common u-relative">
            <!-- 导航 -->
            <view class="nav u-flex u-row-between">
              <text class="title">
                {{ rules.ruleFlag ? '本学期得分' : '累计得分' }}
              </text>
              <view class="ai-record" @click="handleClick('record')">
                <text>AI运动记录</text>
              </view>
            </view>
            <!-- AI记录缓存数据 -->
            <view v-if="rules.cache" class="cache-ai-content u-flex">
              <image
                class="icon"
                src="~@/static/img/warning-icon-ai.svg"
                mode="scaleToFill"
              />
              <text class="text">
                你有3条运动记录待上传
              </text>
              <view class="re-upload-btn" @click="handleClick('upload')">
                重新上传
              </view>
            </view>
            <view class="semester-left">
              <view class="score">
                <text>
                  {{ setThousandMark(rules.selfSemesterGoals || 0) }}
                </text>
              </view>
              <text v-if="rules.ruleFlag" class="target-score">
                目标得分 {{ setThousandMark(rules.semesterGoals || 0) }}
              </text>
            </view>
            <view class="semester-right">
              <image
                class="ai-record-img"
                :class="{ 'p-b0': rules.ruleFlag, 'p-b30': !rules.ruleFlag }"
                src="~@/static/img/ai-record.png"
                mode="scaleToFill"
              />
            </view>
          </view>
          <view v-if="rules.ruleFlag" class="ai-content-statistical u-flex">
            <view class="ai-content-statistical-left">
              <text class="title">
                今日得分/上限
              </text>
              <view class="progress-content">
                <view class="progress-num">
                  <text class="score">
                    {{ setThousandMark(rules.selfDayGoals || 0) }}
                  </text>
                  <text class="target">
                    /{{ setThousandMark(rules.dayGoals || 0) }}
                  </text>
                </view>
                <u-line-progress
                  :height="12"
                  :show-percent="false"
                  inactive-color="#EEEEEE"
                  active-color="#FC6C37"
                  :percent="percent(rules.dayGoals, rules.selfDayGoals)"
                />
              </view>
            </view>
            <view class="ai-content-statistical-right">
              <text class="title">
                本周得分/上限
              </text>
              <view class="progress-content">
                <view class="progress-num">
                  <text class="score">
                    {{ setThousandMark(rules.selfWeekGoals || 0) }}
                  </text>
                  <text class="target">
                    /{{ setThousandMark(rules.weekGoals || 0) }}
                  </text>
                </view>
                <u-line-progress
                  :height="12"
                  :show-percent="false"
                  inactive-color="#EEEEEE"
                  active-color="#FC6C37"
                  :percent="percent(rules.weekGoals, rules.selfWeekGoals)"
                />
              </view>
            </view>
          </view>
        </view>
      </g-skeleton>
    </view>
  </view>
</template>

<script>
import { setThousandMark } from '@/utils/common';
export default {
  props: {
    rules: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    percent(total = 0, current = 0) {
      if (total === 0 && current > 0) return 100;
      if (total === 0 && current === 0) return 0;
      return (current / total) * 100;
    },
    handleClick(type) {
      // 跳转运动记录页面
      if (type === 'record') {
        uni.navigateTo({
          url: `/pages/aiSportsRecord/index?data=${JSON.stringify(this.rules)}`
        });
        return;
      }
      this.$emit('on-click', type, this.rules);
    },
    setThousandMark(num) {
      return setThousandMark(num);
    }
  }
};
</script>

<style lang="scss" scoped>
.ap-page {
  .p-b0 {
    bottom: 0;
  }
  .p-b30 {
    bottom: -30rpx;
  }
  .ai-content {
    margin-top: 32rpx;
    box-sizing: border-box;
    padding: 24rpx 32rpx 0;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 24rpx 24rpx 0 0;
    &-nav {
      height: 56rpx;
      justify-content: space-between;
      &-title {
        font-size: 40rpx;
        color: $u-main-color;
        font-weight: bold;
      }
      &-rule {
        font-size: 24rpx;
        width: 108rpx;
        height: 52rpx;
        text-align: center;
        line-height: 52rpx;
        color: #fc6c37;
        background: rgba(252, 108, 55, 0.1);
        border-radius: 16rpx;
        border: 1px solid #fc6c37;
      }
    }
    &-bg {
      width: 100%;
      box-sizing: border-box;
      padding-top: 14rpx;
      .img {
        width: 100%;
        height: 220rpx;
      }
    }
  }
  .ai-content-semester {
    width: 100%;
    box-sizing: border-box;
    padding: 24rpx 32rpx;
    .content {
      border-radius: 20rpx;
    }
    .rule {
      background: linear-gradient(333deg, #fcf1ed 0%, #ffffff 100%);
    }
    .white {
      background-color: #fff;
    }
    &-common {
      align-items: flex-start;
      justify-content: space-between;
      box-sizing: border-box;
      min-height: 256rpx;
      padding: 32rpx;
      overflow: hidden;
      .nav {
        .title {
          font-size: 36rpx;
          color: $u-main-color;
          font-weight: bold;
        }
        .ai-record {
          width: 150rpx;
          height: 52rpx;
          text-align: center;
          line-height: 52rpx;
          border-radius: 16rpx;
          border: 1px solid #c3c2cc;
          text {
            position: relative;
            top: -2rpx;
            font-size: 24rpx;
            color: $u-main-color;
          }
        }
      }
      .semester-left {
        .score {
          margin: 34rpx 0 8rpx;
          font-size: 64rpx;
          color: #2b2d33;
          font-weight: bold;
        }
        .target-score {
          font-size: 28rpx;
          font-weight: 400;
          color: $u-content-color;
        }
      }
      .semester-right {
        overflow: hidden;
        .ai-record-img {
          position: absolute;
          width: 248rpx;
          height: 176rpx;
          right: 0;
          border-bottom-right-radius: 20rpx;
        }
      }
      .cache-ai-content {
        margin: 32rpx 0;
        height: 80rpx;
        box-sizing: border-box;
        padding: 0 0 0 24rpx;
        background-color: #fef9f9;
        border-radius: 16rpx;
        .icon {
          width: 28rpx;
          height: 28rpx;
        }
        .text {
          margin: 0 146rpx 0 4rpx;
          font-size: 24rpx;
          font-weight: bold;
          color: #fc6c37;
        }
        .re-upload-btn {
          width: 144rpx;
          line-height: 52rpx;
          text-align: center;
          font-size: 24rpx;
          font-weight: bold;
          color: #fff;
          background-color: #fc6c37;
          border-radius: 26rpx;
        }
      }
    }
  }
  .ai-content-statistical {
    width: 100%;
    box-sizing: border-box;
    padding: 24rpx 32rpx;
    justify-content: space-between;
    border-top: 0.5px solid #ececec;
    &-right {
      box-sizing: border-box;
      padding-left: 16rpx;
    }
    &-left {
      box-sizing: border-box;
      padding-right: 16rpx;
    }
    &-left,
    &-right {
      width: 50%;
      .title {
        font-size: 24rpx;
        font-weight: bold;
        color: $u-content-color;
      }
      .progress-num {
        position: relative;
        bottom: -12rpx;
        box-sizing: border-box;
        padding: 12rpx 0 0rpx;
        .score {
          font-size: 36rpx;
          font-weight: bold;
          color: #2b2d33;
        }
        .target {
          font-size: 28rpx;
          font-weight: bold;
          color: $u-tips-color;
        }
      }
    }
  }
}
</style>
