<template>
  <view class="activity-attendance-detail-container">
    <g-navbar
      id="navBar"
      height="44"
      :background="background"
      :border-bottom="false"
      :is-back="background.back"
      back-icon-size="48"
      :title="background.title"
    >
      <view v-if="!background.back" class="slot-wrap navbar-left" @click="back">
        <image
          class="back-icon"
          src="~@/static/img/activite-back-fill.png"
          mode="scaleToFill"
        />
      </view>
    </g-navbar>
    <!-- 模拟背景图 -->
    <image class="bg-img" :src="bgUrl || dfaultImg" mode="scaleToFill" />
    <view :style="{ height: top + 'rpx' }" />
    <!-- 内容 -->
    <view class="activity-attendance-detail-container-content">
      <mescroll-body
        ref="mescrollRef"
        class="content-detail"
        :sticky="true"
        :native="true"
        top="0 "
        bottom="0"
        style="min-height: 1250rpx"
        :up="upOption"
        :down="downOption"
        @init="mescrollInit"
        @down="downCallback"
        @up="upCallback"
      >
        <!-- 活动详情头部 -->
        <activity-title-info
          v-if="activityData"
          :activity-data="activityData"
          :state="state"
          @changeShow="changeShowHandle"
        />
        <!-- 活动考勤详情 -->
        <!-- 活动考勤状态 -->
        <attendance-state
          v-if="canOpenSignInState"
          :is-open-sign-in="isOpenSignIn"
          :number="number"
          :is-gps="isGps"
          :activity-id="activityId"
          :interval="interval"
          :sign-mode-info="signModeInfo"
          @changeLoading="changeLoadingHandle"
          @openSignIn="openSignInHandle"
          @updateSignIn="updateSignInHandle"
          @changeSignMode="changeSignMode"
        />
        <!-- 吸顶组件 -->
        <sticky-component
          :scroll-top="scrollTop"
          :aside-top="top"
          :limit-people-number="limitPeopleNumber"
          :count-info="countInfo"
          :is-open-sign-in="isOpenSignIn"
          :origination-show="originationShow"
          :style="{
            borderRadius: `${
              !canOpenSignInState || state === 5 ? '20rpx' : 0
            } ${!canOpenSignInState || state === 5 ? '20rpx' : 0} ${
              stuList.length === 0 ? '20rpx' : 0
            } ${stuList.length === 0 ? '20rpx' : 0}`
          }"
          @searchStu="searchStuHandle"
        />
        <!-- 学生考勤列表 -->
        <student-attendance-list
          :activity-data="activityData"
          :list="stuList"
          :number="number"
          :is-open-sign-in="isOpenSignIn"
          @updateStuSignInHandle="updateStuSignInHandle"
        />
      </mescroll-body>
      <!-- </view> -->
      <!-- <view v-else class="no-content-detail">
        <statisitics-box :count-info="countInfo" />
      </view> -->
    </view>
    <!-- 确认修改为自动签到弹窗 -->
    <g-modal
      v-model="changeSignModeModal"
      :show-title="false"
      :show-cancel-button="true"
      :content-style="{
        color: '#222',
        'font-size': '34rpx'
      }"
      confirm-text="确定开启"
      content="开启手动签到后，自动签到设置将失效。"
      @confirm="confirmSignMode"
      @cancel="changeSignModeModal = false"
    />
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { toRpx } from '@/utils/common';
import ActivityTitleInfo from './components/ActivityTitleInfo';
import AttendanceState from './components/AttendanceState';
import StudentAttendanceList from './components/StudentAttendanceList';
import StickyComponent from './components/StickyComponent';
// import StatisiticsBox from './components/statisiticsBox';
import { activity } from '@/request/api/teacher';
import { getRegisterState, canOpenSignIn } from './common';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';

const week = new Date().getDay();
// state  3未开始 4进行中 5已结束
// registerState 0:报名未开始 1:报名进行中 2:报名已结束

export default {
  components: {
    'activity-title-info': ActivityTitleInfo,
    'attendance-state': AttendanceState,
    'student-attendance-list': StudentAttendanceList,
    'sticky-component': StickyComponent
    // 'statisitics-box': StatisiticsBox
  },
  mixins: [MescrollMixin],
  data() {
    return {
      background: {
        backgroundColor: 'transparent',
        back: false,
        title: ''
      },
      top: 0, //占位符高度
      stuList: [], //学生列表
      number: 0, // 开启了第几次考勤
      openSignTimer: null, // 防抖时间
      isOpenSignIn: false, // false:未开启考勤 true:已开启考勤
      interval: 0, // 二次签到间隔时间
      limitPeopleNumber: null, //限制人数
      scrollTop: 0, //滚动高度
      countInfo: null, //统计数据
      page: 1,
      query: '',
      size: 20,
      activityId: '',
      activityData: null,
      state: 0,
      isGps: false,
      bgUrl: '',
      signModeInfo: null, // 签到模式，及自动签到数据
      downOption: {
        use: true,
        auto: false, //是否在初始化后,自动执行downCallback; 默认true
        offset: 48, //下拉大于60px,松手即可触发下拉刷新的回调
        textColor: '#999999'
      },
      upOption: {
        textColor: '#999999',
        bgColor: 'rgba(245,246,250,1)',
        use: true,
        auto: false,
        textNoMore: '—— 没有更多啦 ——',
        isBounce: true,
        offset: 48, //下拉大于60px,松手即可触发下拉刷新的回调
        page: {
          num: 0,
          size: 20,
          time: null
        },
        empty: {
          use: false
        }
      },
      loading: false, //原生返回重新加载
      originationShow: false,
      changeSignModeModal: false
    };
  },
  computed: {
    registerState() {
      if (this.activityData) {
        return getRegisterState(this.activityData);
      }
      return 0;
    },
    canOpenSignInState() {
      if (this.activityData) {
        return canOpenSignIn(this.activityData);
      }
      return 0;
    },
    cacheImages() {
      return this.$store.state.cacheFile.activitieImages;
    },
    dfaultImg() {
      return require(`@/static/img/studentActivitie/defaultBg/week_${week}.png`);
    }
  },
  onLoad(option) {
    const { id, state } = JSON.parse(option.info);
    this.activityId = id;
    this.state = state;
    this.getDetails();
  },
  onShow() {
    if (this.loading) {
      this.getDetails();
      this.loading = false;
    }
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select('#navBar')
      .boundingClientRect(({ height }) => {
        this.top = 420 - toRpx(height);
      })
      .exec();
  },
  methods: {
    // 下拉刷新
    downCallback() {
      this.mescroll.resetUpScroll();
    },

    // 上拉加载
    upCallback(page) {
      this.page = page.num;
      this.getStudentList();
      this.getAttainabilityCount();
    },
    setNavBar(height) {
      this.background.backgroundColor = `rgba(255,255,255,${
        height > 40 ? height / 125 : 0
      })`;
      if (height > 125) {
        this.background.back = true;
        this.background.title = '活动考勤';
      } else {
        this.background.back = false;
        this.background.title = '';
      }
    },
    back() {
      uni.navigateBack({ delta: 1 });
    },
    // 获取学生列表
    getStudentList() {
      const { id } = this.activityData;
      const { page, query, size } = this;
      activity
        .getAttainabilityList({
          activityId: id,
          page,
          query,
          size
        })
        .then(res => {
          if (res.code === 0 && res.data) {
            if (this.page === 1) {
              this.stuList = res.data.recordList.items || [];
            } else {
              this.stuList = this.stuList.concat(
                res.data.recordList.items || []
              );
            }
            if (typeof this.mescroll.endSuccess === 'function') {
              this.mescroll.endSuccess(res.data.recordList.items.length || 0);
            }
          } else {
            if (this.page === 1) {
              this.stuList = [];
            }
            if (typeof this.mescroll.endSuccess === 'function') {
              this.mescroll.endSuccess(0);
            }
          }
        })
        .catch(() => {
          if (typeof this.mescroll.endSuccess === 'function') {
            this.mescroll.endErr();
          }
        });
    },

    // 获取学生考勤列表统计
    getAttainabilityCount() {
      const { id } = this.activityData;
      activity
        .getAttainabilityCount({
          activityId: id
        })
        .then(res => {
          if (res.code === 0) {
            this.countInfo = res.data;
          }
        });
    },

    // 修改学生签到状态列表
    updateStuSignInHandle(info) {
      this.getAttainabilityCount();
      const { item, signType } = { ...info };
      const newItem = { ...item };
      // signType 1:签到 2:请假 0:取消签到/请假
      if (signType === 1) {
        newItem.signType = 1;
        newItem.signTypeStr = this.number === 1 ? '首次签到' : '二次签到';
      } else if (signType === 2) {
        newItem.signType = 2;
        newItem.signTypeStr = '请假';
      } else {
        newItem.signType = 0;
        newItem.signTypeStr = '未签到';
      }

      this.stuList = this.stuList.map(i => {
        return item.userId === i.userId ? newItem : i;
      });
    },

    // 获取活动详情
    getDetails(state) {
      activity
        .getActivityTeacherDetail({
          activityId: this.activityId
        })
        .then(res => {
          this.activityData = res.data;
          this.isGps = this.activityData.isGps;
          this.isOpenSignIn = this.activityData.signTime > 0;
          this.number = this.activityData.signTime;
          this.limitPeopleNumber = this.activityData.limitPeopleNumber;
          this.interval = this.activityData.interval;
          const {
            attainabilityModeSwitch, // 签到模式 1手动2自动
            autoStartEffect, // 签到是否生效
            autoStartTime, // 自动签到时间
            interval, // 间隔时间，分钟
            locationLongitude, // 经度
            locationLatitude, // 纬度
            radius, // 半径
            signAddress // 签到半径
          } = res.data;
          // 处理签到模式
          this.signModeInfo = {
            attainabilityModeSwitch,
            autoStartEffect,
            autoStartTime: autoStartTime
              ? this.$u.timeFormat(Number(autoStartTime), 'yyyy/mm/dd hh:MM')
              : '',
            interval,
            locationLongitude,
            locationLatitude,
            radius,
            signAddress
          };
          if (res.data.bgUrl && res.data.bgUrl.length) {
            if (this.cacheImages && this.cacheImages.length > 0) {
              // 查找本地缓存图片
              const cacheItem = this.cacheImages.find(
                c => c.id === res.data.id
              );
              if (cacheItem && cacheItem.filePath) {
                this.bgUrl = cacheItem.filePath;
              } else {
                this.bgUrl = res.data.bgUrl;
              }
            } else {
              this.bgUrl = res.data.bgUrl;
            }
          }
          if (typeof this.mescroll.endSuccess === 'function') {
            this.downCallback();
          } else {
            this.getStudentList();
            this.getAttainabilityCount();
          }
          if (state === 'update') {
            this.$forceUpdate();
          }
        });
    },
    // 开启签到回调
    openSignInHandle(info) {
      const { num, interval } = info;
      const { id } = this.activityData;
      clearTimeout(this.openSignTimer);
      this.openSignTimer = setTimeout(() => {
        activity
          .start({
            interval,
            simpleActivityId: id,
            times: num
          })
          .then(res => {
            if (res.code === 0 && res.data) {
              this.getDetails();
              this.$refs.uToast.show({
                title: '开启签到成功'
              });
            } else {
              this.$refs.uToast.show({
                title: '开启签到失败'
              });
            }
          });
      }, 1000);
    },
    // 修改活动间隔时间
    updateSignInHandle(interval) {
      const { id } = this.activityData;
      activity
        .changeInterval({
          interval,
          simpleActivityId: id
        })
        .then(res => {
          if (res.code === 0 && res.data) {
            this.getDetails();
            this.$refs.uToast.show({
              title: '修改成功'
            });
          } else {
            this.$refs.uToast.show({
              title: '修改失败'
            });
          }
        });
    },
    // 搜索
    searchStuHandle(query) {
      this.query = query;
      this.downCallback();
    },
    //修改更新状态
    changeLoadingHandle() {
      this.loading = true;
    },
    // 修改校区展示方式
    changeShowHandle() {
      this.originationShow = !this.originationShow;
    },
    // 将自动签到改为手动签到确认弹窗
    changeSignMode() {
      this.changeSignModeModal = true;
    },
    // 将自动签到改为手动签到
    async confirmSignMode() {
      const { id } = this.activityData;
      const { code, data } = await activity.updateActivityToManually({ id });
      if (code === 0 && data) {
        this.getDetails('update');
      }
    }
  },
  // 监听页面滚动
  onPageScroll(e) {
    this.$u.throttle(this.setNavBar(e.scrollTop), 100);
    this.scrollTop = e.scrollTop;
  }
};
</script>

<style lang="scss" scoped>
.activity-attendance-detail-container {
  position: relative;
  min-height: 100vh;
  .navbar-left {
    box-sizing: border-box;
    padding: 32rpx;
    .back-icon {
      width: 60rpx;
      height: 60rpx;
    }
  }
  .bg-img {
    position: absolute;
    height: 420rpx;
    width: 750rpx;
    z-index: -1;
    top: 0;
  }
  &-content {
    z-index: 99999;
    box-sizing: border-box;
    padding: 32rpx 24rpx;
    margin-top: -32rpx;
    background-color: #f5f6fa;
    border-radius: 20rpx 20rpx 0 0;
    ::v-deep .mescroll-downwarp {
      background: transparent !important;
      z-index: -2;
    }
  }
  .content-detail {
    background: $u-bg-color;
    width: 100%;
  }
  .no-content-detail {
    width: 100%;
    padding: 40rpx;
    height: 860rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 20rpx;
  }
}
</style>
