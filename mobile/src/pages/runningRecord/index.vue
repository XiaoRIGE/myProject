<template>
  <view
    class="running-container"
    :style="recordHistoryShow ? { overflow: 'hidden', height: '100vh' } : {}"
  >
    <g-navbar
      back-icon-size="48"
      title="跑步记录"
      :border-bottom="false"
      class="navbar"
    >
      <view
        slot="right"
        class="history-record"
        @click="recordHistoryShow = true"
      >
        历史记录
      </view>
    </g-navbar>
    <view class="running-content">
      <!-- <view class="running-all">
        <view v-if="data.rule" class="running-count">
          <text class="current-pro">
            {{ data.scoringType === 1 ? data.totalMileage : data.totalPart }}
          </text>
          <text class="count-pro">
            /{{
              data.scoringType === 1
                ? data.semesterMileage || 0
                : data.semesterParagraph || 0
            }}
          </text>
          <text class="unit">
            {{ data.scoringType === 1 ? 'km' : '段' }}
          </text>
        </view>
        <view v-else class="running-count">
          <text class="count-pro">
            {{ data.totalMileage }}
          </text>
          <text class="unit">
            km
          </text>
        </view>
        <view class="all-bottom">
          <view v-if="data.rule">
            {{
              data.scoringType === 1
                ? '本学期计入有效里程（km）'
                : '本学期计入有效段数（段）'
            }}
          </view>
          <view v-else>
            累计里程
          </view>
          <view class="history" @click="recordHistoryShow = true">
            历史记录
          </view>
        </view>
      </view> -->
      <g-recordTopCard
        class="record-top-card"
        background-img="run"
        :current-value="currentValue"
        :target-value="targetValue"
        :unit-value="unitValue"
        :text="text"
        btn-text="历史记录"
        :is-rule="data.rule"
        @clickBtn="recordHistoryShow = true"
        @clickFaceRunningHandle="clickFaceRunningHandle"
      />
      <template v-if="conentShow">
        <view
          v-for="(item, index) in currentYearRecord"
          :key="index"
          class="content-box"
        >
          <record-details
            :record-item="item"
            :index="index"
            @runningResult="runningResultHandle"
          />
        </view>
        <view class="content-bottom u-flex u-row-between">
          <u-line color="#C3C2CC" length="60rpx" />
          <view>没有更多跑步记录啦</view>
          <u-line color="#C3C2CC" length="60rpx" />
        </view>
      </template>
      <view v-else class="empty-content">
        <image
          src="~@/static/img/running-record.png"
          mode="scaleToFill"
          class="empty-img"
        />
        <view class="text">还没有记录，快去跑步吧~</view>
      </view>
    </view>
    <u-popup
      v-model="recordHistoryShow"
      mode="bottom"
      border-radius="24"
      :closeable="true"
      :safe-area-inset-bottom="true"
    >
      <record-history :scoring-type="data.scoringType" :rule="data.rule" />
    </u-popup>
  </view>
</template>
<script>
import RecordDetails from './components/RecordDetails';
import RecordHistory from './components/RecordHistory';
import { running } from '@/request/api/student';
import { getSemesterId } from '@/utils/common';
import { getRunningRecord } from './common';

export default {
  components: {
    'record-details': RecordDetails,
    'record-history': RecordHistory
  },
  data() {
    return {
      conentShow: true,
      recordHistoryShow: false,
      currentYearRecord: [],
      page: 1,
      size: 10,
      data: null,
      plat: 0
    };
  },
  computed: {
    semesterId() {
      return getSemesterId();
    },
    currentValue() {
      if (this.data.rule) {
        return this.data.scoringType === 1
          ? this.data.totalMileage || 0
          : this.data.totalPart || 0;
      } else {
        return this.data.totalMileage;
      }
    },
    targetValue() {
      if (this.data.rule) {
        return this.data.scoringType === 1
          ? this.data.semesterMileage || 0
          : this.data.semesterParagraph || 0;
      } else {
        return this.data.semesterMileage;
      }
    },
    unitValue() {
      if (this.data.rule) {
        return this.data.scoringType === 1 ? 'km' : '段';
      } else {
        return 'km';
      }
    },
    text() {
      if (this.data.rule) {
        return this.data.scoringType === 1
          ? '本学期计入有效里程（km）'
          : '本学期计入有效段数（段）';
      } else {
        return '累计里程';
      }
    }
  },
  onShow() {
    this.getDetails();
  },
  onLoad(option) {
    this.data = JSON.parse(option.data);
    this.getDetails();
    uni.getSystemInfo({
      success: (res) => {
        if (res.platform === 'android') {
          this.plat = 1;
        } else if (res.platform === 'ios') {
          this.plat = 2;
        }
      }
    });
    // this.currentYearRecord = getRunningRecord(arr);
  },
  methods: {
    runningResultHandle(data) {
      const { runningType, id, appealId, runningTypeName, startTime } = data;
      if (runningTypeName === '岗亭打卡') {
        uni.navigateTo({
          url: `/pages/faceRunningResult/index?startTime=${startTime}`
        });
      } else {
        uni.navigateTo({
          url: `/pages/runningResult/index?id=${id}&type=${runningType}&appealId=${appealId}&plat=${this.plat}`
        });
      }
    },
    clickFaceRunningHandle() {
      uni.navigateTo({
        url: `/pages/faceRunningResultAll/index`
      });
    },
    getDetails() {
      running
        .getDetails({
          page: this.page,
          semesterId: this.semesterId,
          size: this.size
        })
        .then((res) => {
          if (res.code === 0 && res.data.gradeDetails.length) {
            this.conentShow = true;
            this.currentYearRecord = getRunningRecord(res.data.gradeDetails);
          } else {
            this.conentShow = false;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.running-container {
  box-sizing: border-box;
  padding-bottom: 182rpx;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
}
.navbar {
  margin-bottom: 46rpx;
  .history-record {
    font-size: 30rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #545266;
    margin-right: 32rpx;
  }
}
.running-content {
  padding: 0 32rpx;
  .running-all {
    width: 100%;
    height: 286rpx;
    border-radius: 16rpx;
    background-image: url('~@/static/img/record-run-bg.png');
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 24rpx 40rpx 40rpx 48rpx;
    .running-count {
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 144rpx;
      transform: scale(1, 1.15);
      .current-pro {
        font-size: 92rpx;
      }
      .count-pro {
        font-size: 64rpx;
      }
      .unit {
        margin-left: 4rpx;
        font-size: 32rpx;
      }
    }
  }
  .all-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 1);
    .history {
      width: 148rpx;
      height: 52rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 16rpx;
      color: rgba(252, 108, 55, 1);
      text-align: center;
      line-height: 52rpx;
    }
  }
  .content-box {
    margin-top: 64rpx;
  }
  .content-bottom {
    width: 360rpx;
    margin: 48rpx auto 66rpx;
    font-size: 24rpx;
    color: rgba(153, 153, 153, 1);
  }
}
.empty-content {
  width: 400rpx;
  margin: 224rpx auto;
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
</style>
