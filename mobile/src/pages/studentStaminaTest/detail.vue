<template>
  <view class="detail-container">
    <g-navbar
      :border-bottom="false"
      back-icon-size="48"
      title="个人中心"
      :background="{ backgroundColor: 'rgba(255,255,255)' }"
    />
    <!-- 项目描述 -->
    <view class="project-describe-box">
      <view class="project-describe-box-content">
        {{ titleDesc }}
      </view>
      <view class="project-describe-box-sub-content u-flex">
        <image
          class="img"
          src="~@/static/img/school-logo.svg"
          mode="aspectFit"
        />
        <text>由成都体育学院-运动医学与健康研究所提供</text>
      </view>
    </view>
    <template v-if="showNorm">
      <view class="project-rule-content">
        <view class="project-rule-content-title">成绩规则</view>
        <view class="project-rule-content-sub-title">
          <text class="grad">
            {{ gradeTitle }}
          </text>
          <text class="grad mlr">/</text>
          <text class="name">
            {{ projectTitle }}
          </text>
        </view>
      </view>
      <!-- 体重指标 -->
      <view>
        <quota :project-type="projectType" />
      </view>
      <!-- 引体向上 -->
      <view v-if="projectType === '6'" class="points-tps">
        引体向上为高优指标，成绩超过单项评分100分后，每多做1次加1分，最高可加10分
      </view>

      <!-- 仰卧起坐 -->
      <view v-if="projectType === '7'" class="points-tps">
        一分钟仰卧起坐为高优指标，学生成绩超过单项评分100分后，多做6次及以内每多做2次多1分，超过6次（达到103分）后每多做1次多1分，最高可为110分
      </view>

      <!-- 1000米 -->
      <view v-if="projectType === '9'" class="points-tps">
        1000米跑为低优指标，学生成绩低于单项评分100分后，减少20秒及以内每减少4秒多1分，减少20秒以上（达到105分）后每减少3秒多1分，最高可为110分
      </view>
      <!-- 800米 -->
      <view v-if="projectType === '8'" class="points-tps">
        1000米跑为低优指标，学生成绩低于单项评分100分后，每减少5秒加1分，最高可为110分
      </view>
    </template>
  </view>
</template>

<script>
import Quota from './components/Quota';
import { projectMenu, projectDetail } from './stamina';

export default {
  name: 'Detail',
  onLoad(options) {
    this.projectType = options.type;
    this.year = Number(options.year);
  },
  components: {
    quota: Quota
  },
  data() {
    return {
      projectType: '',
      year: 0
    };
  },
  computed: {
    showNorm() {
      return this.year && this.year > 0 && this.year <= 4;
    },
    projectTitle() {
      return projectMenu[this.projectType];
    },
    grade() {
      if (this.year === 1 || this.year === 2) return 1;
      if (this.year === 3 || this.year === 4) return 2;
      return '';
    },
    gradeTitle() {
      if (this.projectType === '1') return '大学';
      return this.grade === 1 ? '大一大二' : this.grade === 2 ? '大三大四' : '';
    },
    titleDesc() {
      return projectDetail[this.projectType].desc;
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0 40rpx;
  background-color: #fff;
  .project-describe-box {
    box-sizing: border-box;
    padding: 24rpx 0 0;
    &-content {
      font-size: 28rpx;
      color: $u-main-color;
    }
    &-sub-content {
      margin: 34rpx 0 80rpx;
      .img {
        width: 36rpx;
        height: 36rpx;
        margin-right: 6rpx;
      }
      text {
        font-size: 24rpx;
        color: $u-content-color;
      }
    }
  }
  .project-rule-content {
    &-title {
      font-size: 40rpx;
      font-weight: 600;
      color: $u-main-color;
    }
    &-sub-title {
      box-sizing: border-box;
      padding: 48rpx 0 32rpx;
      .grad {
        font-size: 32rpx;
        color: #38364d;
        font-weight: 500;
      }
      .mlr {
        margin: 0 16rpx 0 8rpx;
      }
      .name {
        font-size: 24rpx;
        color: $u-main-color;
      }
    }
  }
  .points-tps {
    margin-top: 24rpx;
    box-sizing: border-box;
    padding: 24rpx;
    font-size: 24rpx;
    color: $u-main-color;
    background-color: #f5f5fa;
    border-radius: 16rpx;
  }
}
</style>
