<template>
  <view
    class="ai-sports-record-container"
    :style="recordHistoryShow ? { overflow: 'hidden', height: '100vh' } : {}"
  >
    <g-navbar
      back-icon-size="48"
      title="AI运动记录"
      :border-bottom="false"
      class="navbar"
    />
    <!-- 记录顶部卡片 -->
    <g-recordTopCard
      class="record-top-card"
      background-img="ai"
      :current-value="currentValue"
      :target-value="targetValue"
      unit-value="分"
      :text="text"
      btn-text="学期有效记录"
      :is-rule="ruleFlag"
      @clickBtn="clickHandle"
    />
    <view v-show="conentShow">
      <view id="content" class="content-box">
        <!-- 左边时间线 -->
        <u-line
          class="line"
          :length="height + 'rpx'"
          direction="col"
          :hair-line="false"
          margin="0 0 0 10rpx"
          color="#E4E6EA"
        />
        <!-- 纪录列表 -->
        <view class="list">
          <view v-for="(item, index) in recordData" :key="index">
            <record-details
              :month-item-record="item"
              @clickRecordCardHandle="clickRecordCardHandle"
            />
          </view>
        </view>
      </view>
      <view class="content-bottom u-flex u-row-between">
        <u-line color="#C3C2CC" length="60rpx" />
        <view>没有更多AI运动记录啦</view>
        <u-line color="#C3C2CC" length="60rpx" />
      </view>
    </view>
    <view v-show="!conentShow" class="empty-content">
      <image
        src="~@/static/img/empty-course.png"
        mode="scaleToFill"
        class="empty-img"
      />
      <view class="text">
        本学期暂无AI运动记录
      </view>
    </view>
    <!-- 历史学期有效记录 -->
    <u-popup
      v-model="recordHistoryShow"
      mode="bottom"
      border-radius="24"
      :closeable="true"
      :safe-area-inset-bottom="true"
    >
      <record-history
        title="学期有效记录"
        text-value="总计入有效得分"
        :sorce-value="totalValue"
        unit-value="(分)"
        :semester-item-info="semesterItemInfo"
      />
    </u-popup>
  </view>
</template>

<script>
import { toRpx, getUserInfo, getSemesterId } from '@/utils/common';
import RecordDetails from './components/RecordDetails';
import RecordHistory from './components/RecordHistory';
import { sports } from '@/request/api/student';
import { getaiSportsRecord, getScore } from './common';
import events from '@/nativeEvent';

export default {
  components: {
    'record-details': RecordDetails,
    'record-history': RecordHistory
  },
  data() {
    return {
      height: 0,
      recordData: [],
      recordHistoryShow: false,
      semesterItemInfo: [], // 学期有效记录
      currentValue: 0, //当前分数
      targetValue: 0, //目标分数
      totalValue: 0, //学期总分
      ruleFlag: false // 是否有规则
    };
  },
  computed: {
    userId() {
      return getUserInfo().id;
    },
    semesterId() {
      return getSemesterId();
    },
    text() {
      return this.ruleFlag ? '本学期记录有效的分' : '累计得分';
    },
    // 本学期是否有记录
    conentShow() {
      return this.recordData.length === 0 ? false : true;
    }
  },
  onLoad(options) {
    const data = JSON.parse(options.data);
    this.ruleFlag = data.ruleFlag;
    this.getValidRecord();
  },
  methods: {
    // 点击学期有效记录
    clickHandle() {
      this.recordHistoryShow = true;
    },
    // 获取学期有效分数
    async getValidRecord() {
      const { semesterId, userId } = this;
      const params = {
        semesterId,
        userId
      };
      const res = await sports.getValidRecord(params);
      if (res.code === 0) {
        this.currentValue = getScore(res.data.selfSemesterScore);
        this.targetValue = getScore(res.data.semesterCore);
        this.totalValue = res.data.total;
        this.semesterItemInfo = res.data.recordResponseVOS;
        this.recordData = getaiSportsRecord(res.data.detailResponseVOS || []);
        if (this.recordData.length > 0) {
          this.getHeight();
        }
      }
    },
    // 跳转运动结果页
    async clickRecordCardHandle(recordId) {
      const params = {
        recordId
      };
      const res = await sports.getRecordDetails(params);
      if (res.code === 0) {
        // 进入原生运动结果页
        events.navigatorNativePage({
          page: 'aiSportsResultPage',
          info: res.data
        });
      }
    },
    // 获取时间线高度
    getHeight() {
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .select('#content')
          .boundingClientRect(res => {
            if (res.height) {
              this.height = toRpx(res.height) - 16;
            } else {
              this.getHeight();
            }
          })
          .exec();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ai-sports-record-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(245, 246, 250, 1);
  padding: 32rpx;
  .record-top-card {
    margin-bottom: 64rpx;
  }
  .content-box {
    position: relative;
    .line {
      position: absolute;
      left: 0;
      top: 16rpx;
    }
  }
  .content-bottom {
    width: 382rpx;
    margin: 48rpx auto 66rpx;
    font-size: 24rpx;
    color: rgba(153, 153, 153, 1);
  }
  .empty-content {
    width: 400rpx;
    margin: 88rpx auto;
    text-align: center;
    .empty-img {
      width: 400rpx;
      height: 300rpx;
    }
    .text {
      font-size: 32rpx;
      margin: 40rpx 0rpx;
    }
  }
}
</style>
