<template>
  <view
    class="home-container safe-area-inset-bottom"
    :style="runningRulesShow ? { overflow: 'hidden', height: '100vh' } : {}"
  >
    <view class="header-content">
      <!-- 背景图片 用image组件模拟，防止图片过大不能加载-->
      <image class="bg-img" :src="background.bgImg" />
      <g-navbar
        :is-back="false"
        :border-bottom="false"
        :height="55"
        class="header-content-nav"
        :background="{ backgroundColor: background.background }"
      >
        <view class="slot-wrap title">
          {{ userInfo && userInfo.schoolName }}
        </view>
        <template v-if="false" #right>
          <view class="right-icon-btn">
            <image src="~@/static/img/ai-btn-icon.svg" mode="scaleToFill" />
          </view>
        </template>
      </g-navbar>
    </view>

    <!-- Banner -->
    <view class="banner-nav">
      <g-skeleton :loading="loadingImg" :skeleton="['card{h:220rpx,MB:0}']">
        <u-swiper
          height="220"
          :interval="3000"
          :border-radius="20"
          indicator-pos="bottomRight"
          :list="bannerList"
          @click="handelSwiperClick"
        />
      </g-skeleton>
    </view>
    <!-- 通知导航栏 -->
    <g-noticeNav v-if="noticeList.length > 0" :notice-list="noticeList" />
    <!-- 签到导航栏 -->
    <sign-in-nav
      v-show="currentCourse.courseActivityId"
      :sign-info="currentCourse"
      @handelClick="signInHandelClick"
    />
    <!-- 跑步模块 -->
    <view class="running-nav">
      <!-- 标题-规则 -->
      <view class="rule-btns u-flex u-row-between">
        <text class="title">跑步</text>
        <g-skeleton
          :content-style="{ padding: 0, height: '52rpx' }"
          :skeleton="['card{w:108rpx,h:52rpx,r:16rpx}']"
          :loading="loadingRunningCard"
        >
          <u-button
            v-if="isRule"
            class="btn"
            :hair-line="false"
            :custom-style="{
              border: '1px solid rgba(252, 108, 55, 1)',
              'border-radius': '16rpx',
              'background-color': 'rgba(252, 108, 55, 0.1)'
            }"
            @click="showRuleModal"
          >
            规则
          </u-button>
          <!-- <view v-if="isRule" class="btn u-flex u-row-center">
            规则
          </view> -->
        </g-skeleton>
      </view>
      <!-- 跑步卡片规则 -->
      <view class="running-card-list">
        <scroll-view
          :scroll-with-animation="true"
          :show-scrollbar="false"
          scroll-x="true"
          scroll-right="0"
        >
          <g-skeleton
            :content-style="{ padding: 0 }"
            :class-names="['list u-flex']"
            class="u-flex"
            :loading="loadingRunningCard"
            :skeleton="skeletonCard"
          >
            <view
              v-for="(item, index) in cardList"
              :key="item.type"
              :class="{ padl: index === 0 }"
              @tap.stop="cardHandelClick(item)"
            >
              <running-card :index="index" :running-data="item" />
            </view>
          </g-skeleton>
        </scroll-view>
      </view>
      <!-- 学期里程/累计里程 -->
      <g-skeleton
        :loading="loadingRunningTotal"
        :skeleton="['card{w:686rpx,margin:24rpx 0 0 0, r:20rpx}']"
      >
        <view
          class="mileage-box"
          :class="{
            'mileage-lj': runningTotalInfo.rule ? 0 : 1
          }"
        >
          <mileage-nav
            :data="runningTotalInfo"
            :mileage-state="runningTotalInfo.rule ? 0 : 1"
          />
        </view>
      </g-skeleton>
    </view>
    <!-- AI 运动 入口 -->
    <ai-card
      :rules="aiRules"
      :loading="aiRulesLoading"
      @on-click="hanldeAiCilck"
    />
    <!-- 跑步规则弹窗 -->
    <u-popup
      v-model="runningRulesShow"
      mode="bottom"
      border-radius="24"
      :closeable="true"
      :safe-area-inset-bottom="true"
    >
      <running-rules
        :rule-info="runningRules"
        :face-running-status="faceRunningStatus"
        :routes="routes"
      />
      <!-- 1:段数模式  2:里程模式-->
    </u-popup>
    <!-- Ai运动规则弹窗 -->
    <u-popup
      v-model="showAiRuleModel"
      mode="bottom"
      border-radius="24"
      :closeable="true"
      :safe-area-inset-bottom="true"
    >
      <ai-rules :rule-info="aiRules" />
      <!-- 1:段数模式  2:里程模式-->
    </u-popup>
    <!-- 跑步模式弹窗，点击跑步模式卡片根据状态显示对应文本内容的弹窗 -->
    <u-modal
      v-model="runningModeModal.show"
      :content="runningModeModal.content"
      :title="runningModeModal.title"
      :show-cancel-button="runningModeModal.showCancelButton"
      :confirm-text="runningModeModal.confirmText"
      :cancel-text="runningModeModal.cancelText"
      :show-title="true"
      :title-style="{ color: '#222', fontSize: '36rpx', fontWeight: '600' }"
      :cancel-style="{ borderRight: '0.5px solid rgba(0,0,0,0.1)' }"
      confirm-color="#FC6C37"
      cancel-color="#666"
      :content-style="{ color: '#666', 'font-size': '34rpx' }"
      @confirm="onConfirm"
    />
    <!--未开启签到提示框 -->
    <u-modal
      v-model="signModeModal"
      content="教师未开启签到，无法签到"
      :show-cancel-button="false"
      confirm-text="确定"
      :show-title="false"
      confirm-color="#FC6C37"
      :content-style="{ color: '#666', 'font-size': '34rpx' }"
    />
    <!-- 弹窗不允许去签到，未首次签到显示 -->
    <u-modal
      v-model="showSiginModel"
      confirm-text="我知道了"
      :show-title="false"
      :content-style="{
        color: '#222',
        'font-size': '32rpx',
        'font-weight': 600
      }"
      confirm-color="#FC6C37"
      content="第1次签到未完成，不可进行第2次签到"
    />
    <!-- 签到提示弹窗 -->
    <u-modal
      v-model="timeModel"
      :show-title="false"
      :show-cancel-button="false"
      confirm-text="我知道了"
      :confirm-style="{
        color: '#FC6C37',
        fontSize: '36rpx',
        fontWeight: 600,
        borderLeft: '1px solid rgba(0,0,0,0.1)'
      }"
      :content-style="{
        color: '#353535',
        fontSize: '34rpx',
        fontWeight: 600
      }"
      :content="'距离二次签到还有' + timerval"
    />
    <!-- 点击跑步检测是否开启了开发者模式，安卓需要检测 -->
    <u-modal
      v-model="showDeveloperModeModal"
      confirm-text="我知道了"
      :show-title="false"
      :content-style="{
        color: '#222',
        'font-size': '32rpx',
        'font-weight': 600
      }"
      confirm-color="#FC6C37"
      content="环境安全检测未通过"
    />
  </view>
</template>

<script>
import { cardList, initCardList, skeletonCard } from './common';
import SignInNav from './components/SignInNav';
import RunningCard from './components/RunningCard';
import MileageNav from './components/MileageNav';
import RunningRules from './components/RunningRules';
import AiRules from './components/AiRules';
import AiCard from './components/AiCard';
import { getUserInfo, getLocation, locationManager } from '@/utils/common';
import { motion, course, sports } from '@/request/api/student';
import { checkSignInterval } from '@/request/api/education';
import {
  getImage,
  getMessage,
  getBannerList
} from '@/request/api/authorization';
import events from '@/nativeEvent';
export default {
  components: {
    'sign-in-nav': SignInNav,
    'running-card': RunningCard,
    'mileage-nav': MileageNav,
    'running-rules': RunningRules,
    'ai-card': AiCard,
    'ai-rules': AiRules
  },
  props: {
    currentPage: {
      type: Number,
      default: 0
    }
  },
  data() {
    // 17364852207
    return {
      timeModel: false,
      showDeveloperModeModal: false,
      showSiginModel: false,
      timerval: 0,
      moutedGr: true,
      loadingRunningLimit: false, // 是否正在请求规则
      prevTime: new Date().getTime(),
      signModeModal: false,
      latitude: '', //30.696092 104.056542,
      longitude: '', //104.056542,
      isRule: true, // 判断是否存在规则
      loading: true,
      runningRulesShow: false,
      aiRulesLoading: true, // 正在请求ai规则状态
      skeletonCard,
      loadingImg: true,
      loadingRunningCard: true,
      loadingRunningTotal: true,
      runningTotalInfo: {
        scoringType: -1, // 计分模式
        rule: false,
        totalMileage: 0, // 总里程
        totalPart: 0, // 总段数
        semesterMileage: 0, // 学期目标里程
        semesterParagraph: 0 // 学期目标段数
      },
      runningRules: {
        recordEffectiveMileage: false, // 是否记录有效里程或者段数
        recordEffectiveMileageMsg: '' // 提示
      }, // 跑步规则信息
      background: {
        background: 'transparen',
        bgImg: ''
      },
      bannerList: [],
      cardList,
      noticeList: [],
      todayCourseList: [], // 当天课程列表
      runningModeModal: {
        // 跑步模式弹窗内容状态
        content: '',
        title: '',
        show: false,
        showCancelButton: false,
        confirmText: '确定',
        cancelText: '取消',
        cardType: ''
      },
      showAiRuleModel: false, // ai运动规则弹窗
      aiRules: {}, // ai 运动规则
      faceRunningStatus: false, // 是否显示岗亭打卡规则
      routes: [] // 岗亭打卡规则路线
    };
  },
  computed: {
    userInfo() {
      return getUserInfo();
    },
    semesterId() {
      return this.$store.state.semester.currentSemester.id;
    },
    currentCourse() {
      return this.getCurrentCourse();
    }
  },
  mounted() {
    this.getCourseToday();
    this.getBackgroundImage();
    this.getBannerList();
    this.getMessage();
    // 监听页面滚动
    uni.$on('onHomePageScroll', (data) => {
      this.onScroll(data);
    });
    uni.onNativeEventReceive((event, data) => {
      if (event === 'runPromptEvents') {
        // 跑步提示
        uni.showToast({
          title: data,
          icon: 'none',
          duration: 3000,
          mask: true
        });
      }
      if (event === 'checkDeveloperMode') {
        // 安卓开启了开发者模式，不允许去跑步
        this.showDeveloperModeModal = true;
      }
    });
  },
  methods: {
    // tab 切换触发
    onTabChange() {
      const currentTime = new Date().getTime();
      if (currentTime - this.prevTime > 1000) {
        this.getCourseToday();
        this.getBackgroundImage();
        this.getBannerList();
        this.getMessage();
        this.getRunningLimit();
        this.getAiRule();
        this.prevTime = currentTime;
      }
    },
    // 计算当前需要展示的课程
    getCurrentCourse() {
      // 过期5分钟隐藏
      let result = {};
      // 获取未过期的课程
      const time = new Date().getTime();
      // 最小间隔时间
      let minNumber = Infinity;
      const notExpiredList = this.todayCourseList.filter(
        (item) => item.timeEnd + 5 * 60 * 1000 >= time
      );

      // 查找课程结束时间距离现在时间最近的课程, 倒叙循环，课程优先 20 30 40
      let len = notExpiredList.length - 1;
      let index = -1;
      if (len >= 0) {
        while (len >= 0) {
          if (notExpiredList[len].timeEnd - time < minNumber) {
            minNumber = notExpiredList[len].timeEnd - time;
            index = len;
          }
          --len;
        }
        result = index > -1 ? notExpiredList[index] : {};
      }
      return result;
    },
    // 获取学期目标和跑步里程
    async getTotalRunning(data) {
      try {
        const res = await motion.getTotalRunning({
          hasRule: data.hasRule,
          semesterId: this.semesterId
        });
        if (res.code === 0) {
          if (res.data) {
            const { totalMileage, totalPart } = res.data;
            this.runningTotalInfo.totalMileage = totalMileage;
            this.runningTotalInfo.totalPart = totalPart;
            this.runningTotalInfo.semesterMileage =
              this.runningRules.semesterMileage;
            this.runningTotalInfo.semesterParagraph =
              this.runningRules.semesterParagraph;
          }
        }
        this.loadingRunningTotal = false;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getCourseToday() {
      // 获取当日的课程
      const res = await course.getCourseToday();
      if (res.code === 0 && res.data) {
        this.todayCourseList = res.data;
        this.prevTime = new Date().getTime();
      }
    },

    onConfirm() {
      // 跑步弹窗确定按钮 17364852207
      this.runningRules.recordEffectiveMileage = false;
      this.runningRules.recordEffectiveMileageMsg =
        this.runningModeModal.content;
      if (this.runningModeModal.showCancelButton) {
        this.goSports(this.runningModeModal.cardType, this.runningRules);
      }
    },
    // 去跑步页面
    goSports(type, data) {
      events
        .navigatorNativePage(
          {
            page: 'sports',
            type,
            data
          },
          'parse'
        )
        .then((res) => {
          if (res.hasRunningCache) {
            this.$emit('on-click', true);
          }
        });
    },
    // 获取背景图
    async getBackgroundImage() {
      const res = await getImage({ status: '1' });
      if (res.code === 0 && res.data) {
        if (res.data[0] && res.data[0].url) {
          this.background.bgImg = res.data[0].url;
          this.prevTime = new Date().getTime();
        }
      }
    },
    // 获取banner轮播
    async getBannerList() {
      const res = await getBannerList();
      if (res.code === 0 && res.data) {
        if (res.data && res.data.length) {
          this.bannerList = res.data.map((item) => {
            return {
              ...item,
              image: item.url || '5b1c766f-321c-4de3-bae6-b9474b0233bc'
            };
          });
        }
        this.loadingImg = false;
        this.prevTime = new Date().getTime();
      }
    },

    // 获取通知消息，滚动列表
    async getMessage() {
      const res = await getMessage();
      if (res.code === 0 && res.data) {
        this.noticeList = res.data || [];
        this.prevTime = new Date().getTime();
      }
    },
    // 获取跑步规则
    async getRunningLimit() {
      if (!this.semesterId) {
        // 通知App刷新学期信息
        this.$emit('refreshSemester');
        return;
      }
      try {
        const res = await motion.getRunningLimit({
          semesterId: this.semesterId
        });
        if (res.code === 0) {
          if (res.data) {
            this.runningRules = Object.assign(
              {},
              JSON.parse(JSON.stringify(this.runningRules || {})),
              JSON.parse(JSON.stringify(res.data || {}))
            );
            this.faceRunningStatus = res.data.faceRunningStatus;
            this.routes = res.data.routes;
            // 初始化跑步卡片顺序
            this.cardList = initCardList(
              JSON.parse(JSON.stringify(res.data || {}))
            );
            this.isRule = res.data.hasRule;
            this.runningTotalInfo.rule = res.data.hasRule;
            this.runningTotalInfo.scoringType = res.data.scoringType;
          } else {
            this.isRule = false;
          }
          this.getTotalRunning(res.data);
          this.loadingRunningCard = false;
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async initRunningModeModalInfo(card) {
      // 获取最新规则
      await this.getRunningLimit();
      const invalidRunMode = (name) => {
        // 未开启有效跑步模式
        this.runningModeModal.title = `${name}未开启`;
        this.runningModeModal.content = `学校暂未开启${name}`;
        this.runningModeModal.showCancelButton = false;
        this.runningModeModal.confirmText = '我知道了';
        this.runningModeModal.show = true;
      };
      const notInTime = (type) => {
        // 不在跑步时间内
        this.runningModeModal.title = '未在规定跑步时间内';
        this.runningModeModal.content =
          '当前未在跑步规定时间内，跑步数据将不计入成绩';
        this.runningModeModal.showCancelButton = true;
        this.runningModeModal.confirmText = '继续跑';
        this.runningModeModal.cancelText = '不跑了';
        this.runningModeModal.show = true;
        this.runningModeModal.cardType = type;
      };
      // const mileage = (type, value) => {
      //   const km = Math.max(0, Math.round(value * 100) / 100);
      //   //  E、每周剩余可跑里程小于每日有效里程最小值时，弹窗提示【本周可跑剩余有效里程 X Km，小于每次有效里程最小值，是否继续跑步】,继续跑 | 不跑了；
      //   this.runningModeModal.title = '提示';
      //   const ms = this.runningRules.scoringType;
      //   this.runningModeModal.content = `本周上限剩余${km}${
      //     ms === 2 ? '段' : ms === 1 ? 'km' : ''
      //   }，超出${ms === 2 ? '段数' : ms === 1 ? '里程' : ''}将不计入成绩`;
      //   this.runningModeModal.showCancelButton = true;
      //   this.runningModeModal.confirmText = '继续跑';
      //   this.runningModeModal.cancelText = '不跑了';
      //   this.runningModeModal.show = true;
      //   this.runningModeModal.cardType = type;
      // };
      const actualMileage = (type) => {
        //  实际每周有效里程大于或等于每周里程上限时，弹窗提示【已达到本周上限，继续跑不计入有效里程】，继续跑 | 不跑了；
        this.runningModeModal.title = '提示';
        this.runningModeModal.content =
          '已达到本周上限，本次跑步数据将不计入成绩';
        this.runningModeModal.showCancelButton = true;
        this.runningModeModal.confirmText = '继续跑';
        this.runningModeModal.cancelText = '不跑了';
        this.runningModeModal.show = true;
        this.runningModeModal.cardType = type;
      };
      // const mileageDay = (type, value) => {
      //   const km = Math.max(0, Math.round(value * 100) / 100);
      //   const ms = this.runningRules.scoringType;
      //   // 每日剩余可跑里程小于每日有效里程最小值时，弹窗提示【本日可跑剩余有效里程 X Km，小于每日有效里程最小值，是否继续跑】， 继续跑 | 不跑了；
      //   this.runningModeModal.title = '提示';
      //   this.runningModeModal.content = `今日上限剩余${km}${
      //     ms === 2 ? '段' : ms === 1 ? 'km' : ''
      //   }，超出${ms === 2 ? '段数' : ms === 1 ? '里程' : ''}将不计入成绩`;
      //   this.runningModeModal.showCancelButton = true;
      //   this.runningModeModal.confirmText = '继续跑';
      //   this.runningModeModal.cancelText = '不跑了';
      //   this.runningModeModal.show = true;
      //   this.runningModeModal.cardType = type;
      // };
      const actualMileageDay = (type) => {
        //  实际每周有效里程大于或等于每周里程上限时，弹窗提示【已达到本周上限，继续跑不计入有效里程】，继续跑 | 不跑了；
        this.runningModeModal.title = '提示';
        this.runningModeModal.content =
          '已达到今日上限，本次跑步数据将不计入成绩';
        this.runningModeModal.showCancelButton = true;
        this.runningModeModal.confirmText = '继续跑';
        this.runningModeModal.cancelText = '不跑了';
        this.runningModeModal.show = true;
        this.runningModeModal.cardType = type;
      };
      // 判断是否在跑步时间范围内
      const isCurrentDate = () => {
        const { runningTimeLimit, currentTimeStamp } = this.runningRules;
        if (!runningTimeLimit) return false;
        const { startTime, endTime } = runningTimeLimit;
        // 当前凌晨时间戳
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const today = new Date().getTime(); // 1630143293395
        if (currentDate >= startTime && currentDate <= endTime) {
          let state = true;
          for (let i = 0; i < runningTimeLimit.openTimes.length; i++) {
            const start =
              Number(currentTimeStamp) +
              Number(runningTimeLimit.openTimes[i].dayStartTime);
            const end =
              Number(currentTimeStamp) +
              Number(runningTimeLimit.openTimes[i].dayEndTime);
            if (today >= start && today <= end) {
              state = true;
              break;
            } else {
              state = false;
            }
          }
          return state;
        } else {
          return false;
        }
      };
      // 跑步规则验证
      const runRules = (type) => {
        // 2. 判断是否在规定跑步时间内
        if (!isCurrentDate()) {
          notInTime(type);
          return;
        }

        // 判断是里程模式还是段数模式
        if (this.runningRules.scoringType === 1) {
          // 判断每周剩余可跑里程小于每日有效里程最小值时 E
          // 每周剩余可跑里程 50-0
          // const weekEffective =
          //   this.runningRules.weeklyMileage -
          //   this.runningRules.totalWeekMileage;
          // const toDayEffectiveMin = this.runningRules.effectiveMileageStart;
          // if (weekEffective < toDayEffectiveMin) {
          //   mileage(card.type, weekEffective);
          //   return;
          // }
          // 实际每周有效里程大于或等于每周里程上限时，F
          const kmEffective = // 0 null
            this.runningRules.totalWeekMileage >=
            this.runningRules.weeklyMileage;
          if (kmEffective) {
            actualMileage(type);
            return;
          }

          // 每日剩余可跑里程小于每日有效里程最小值时，G
          // const dayEffective =
          //   this.runningRules.dailyMileage - this.runningRules.totalDayMileage;
          // if (dayEffective < this.runningRules.effectiveMileageStart) {
          //   mileageDay(type, dayEffective);
          //   return;
          // }

          // 实际每日有效里程大于或等于每日里程上限时
          if (
            this.runningRules.totalDayMileage >= this.runningRules.dailyMileage
          ) {
            actualMileageDay(type);
            return;
          }
        }
        // 段数模式
        if (this.runningRules.scoringType === 2) {
          // 每周剩余可跑段数小于每次段数最小值时 E
          // const weekEffective =
          //   this.runningRules.weeklyParagraph - this.runningRules.totalWeekPart;
          // const toDayEffectiveMin = this.runningRules.effectiveParagraphStart;
          // if (weekEffective < toDayEffectiveMin) {
          //   mileage(card.type, weekEffective);
          //   return;
          // }
          // 实际 每周有效段数大于等于每周段数上限 F
          const kmEffective =
            this.runningRules.totalWeekPart >=
            this.runningRules.weeklyParagraph;
          if (kmEffective) {
            actualMileage(type);
            return;
          }
          // 每日剩余可跑段数小于每次段数最小值时 G
          // const dayEffective =
          //   this.runningRules.dailyParagraph - this.runningRules.totalDayPart;
          // if (dayEffective < this.runningRules.effectiveParagraphStart) {
          //   mileageDay(type, dayEffective);
          //   return;
          // }
          // 实际 每日有效段数大于等于每日段数上限 H
          if (
            this.runningRules.totalDayPart >= this.runningRules.dailyParagraph
          ) {
            actualMileageDay(type);
            return;
          }
        }
        // 记录有效里程
        this.runningRules.recordEffectiveMileage = true;
        this.runningRules.recordEffectiveMileageMsg = '';
        this.goSports(type, this.runningRules);
      };
      // 获取点位信息
      const getRunningRange = (type) => {
        const system = uni.getSystemInfoSync();
        locationManager((args) => {
          const { isOpen, open } = args;
          if (!isOpen) {
            open();
            if (system.platform === 'android') {
              return;
            }
            // return;
          }
          uni.showLoading({
            title: '加载中',
            mask: true
          });
          try {
            getLocation(null, 'parse').then((res) => {
              uni.hideLoading();
              const { error = null, latitude, longitude } = res;
              if (error) {
                uni.showToast({
                  title: '获取定位失败',
                  icon: 'none',
                  mask: true
                });
              } else {
                const { limitationsGoalsSexInfoId, patternId, scoringType } =
                  this.runningRules;
                const query = {
                  latitude,
                  longitude,
                  limitationsGoalsSexInfoId,
                  patternId,
                  scoringType,
                  semesterId: this.semesterId
                };
                motion
                  .getRunningRange(query)
                  .then((res) => {
                    if (res.code === 0 && res.data) {
                      this.runningRules = Object.assign(
                        {},
                        this.runningRules,
                        res.data
                      );
                      if (type === 'point') {
                        const dw = res.data.signPoint;
                        if (!Array.isArray(dw)) {
                          // 没有规则
                          invalidRunMode('定点跑');
                          return;
                        }
                      }
                      runRules(card.type);
                    }
                    uni.hideLoading();
                  })
                  .catch((err) => {
                    uni.hideLoading();
                    uni.showToast({
                      title: '获取点位信息失败',
                      icon: 'none',
                      duration: 3000,
                      mask: true
                    });
                    throw new Error(err);
                  });
              }
            });
          } catch (err) {
            uni.showToast({
              title: `发生异常错误：${JSON.stringify(err)}`,
              icon: 'none',
              duration: 3000,
              mask: true
            });
            throw new Error(err);
          }
        });
      };
      //  全局判断一、 判断是否开启签到 enableStatus
      this.runningModeModal.cardType = card.type;
      if (this.runningRules.enableStatus === -1) {
        this.runningModeModal.title = '跑步计划已取消';
        this.runningModeModal.content = this.runningRules.notice;
        this.runningModeModal.showCancelButton = false;
        this.runningModeModal.confirmText = '我知道了';
        this.runningModeModal.show = true;
        return;
      }
      // 学校未开启【自由跑】模式时

      // 点击自由跑 少了范围和点位的判断
      if (card.type === 'free') {
        // 未开启自由跑,或者未开启有效跑步模式
        if (this.runningRules.freePattern !== 1) {
          this.runningModeModal.title = '自由跑未开启';
          this.runningModeModal.content =
            '学校暂未开启自由跑，跑步数据将不计入成绩';
          this.runningModeModal.showCancelButton = true;
          this.runningModeModal.confirmText = '继续跑';
          this.runningModeModal.cancelText = '取消';
          this.runningModeModal.show = true;
          this.runningModeModal.cardType = card.type;
        } else {
          getRunningRange('free');
        }
      }
      // data=null  无规则，只能自由跑
      // 点击范围跑
      if (card.type === 'range') {
        const { scopePattern } = this.runningRules;
        // 学校未开启有效跑步模式时，弹窗提示【学校未开启XX跑步】，我知道了，禁止进入跑步；
        // 判断是否开启范围跑
        if (scopePattern !== 1) {
          invalidRunMode('范围跑');
          return;
        }
        // 获取范围
        getRunningRange('range');
      }

      // 点击定点跑
      if (card.type === 'point') {
        // 判断是否开启跑步
        const { fixedPointPattern } = this.runningRules;
        if (fixedPointPattern !== 1) {
          // 未开启有效跑步模式
          invalidRunMode('定点跑');
          return;
        }
        // 定位
        getRunningRange('point');
      }
    },
    showRuleModal() {
      if (!this.isRule) return;
      if (this.runningRules.scoringType) {
        this.runningRulesShow = true;
      }
    },
    cardHandelClick(card) {
      if (!card) return;
      this.$u.throttle(() => {
        this.initRunningModeModalInfo(card);
      }, 3000);
      // this.initRunningModeModalInfo(card);
    },

    async signInHandelClick(data) {
      // 去签到
      if (!data) return;
      const {
        courseActivityId,
        weekIndex,
        times,
        courseActivityType,
        signType,
        attainabilitySwitch,
        attainabilityType,
        allowSureSign
      } = data;
      // 未开启签到
      if (times === null || times === 0) {
        this.signModeModal = true;
        return;
      }
      if (signType === 1 || signType === 2) {
        // 已签到， 已请假
        return;
      }
      const page = attainabilitySwitch === 1 ? 'gps' : 'qrCode';
      let query = '';

      if (courseActivityType === 1) {
        // 课程
        query =
          attainabilitySwitch === 1
            ? `?courseId=${courseActivityId}&weekNumber=${weekIndex}&startSignNumber=${times}&pageType=course&attainabilityType=${attainabilityType}`
            : '';
        // 如果是第二次签到需要判断第一次是否签到
        if (times > 1 && !allowSureSign) {
          this.showSiginModel = true;
          return;
        }
      }
      if (courseActivityType === 2) {
        // 活动
        const res = await checkSignInterval({
          activityId: courseActivityId
        });
        if (res.code === 0 && res.data) {
          const { signIn, timeInterval } = res.data;
          if (signIn) {
            query =
              attainabilitySwitch === 1
                ? `?activityId=${courseActivityId}&times=${times}&pageType=activity`
                : '';
          } else {
            const restSec = Number(timeInterval);
            const m = parseInt(timeInterval / 1000 / 60);
            const M = parseInt(restSec / 1000);
            this.timerval = m > 0 ? `${m}分钟` : `${M}秒`;
            this.timeModel = true;
            return;
          }
        }
      }

      uni.navigateTo({ url: `/pages/studentSignIn/${page}${query}` });
    },

    // 轮播图点击事件
    handelSwiperClick(index) {
      const bannerItem = this.bannerList[index];
      const { id, tag, linkUrl, linkType, title } = bannerItem;
      if (linkType === 2) {
        uni.navigateTo({
          url: linkUrl
        });
        return;
      }
      if (linkType !== 1) {
        //详情
        uni.navigateTo({
          url: `/pages/bannerDetail/index?id=${id}`
        });
      }
      if (linkType === 1) {
        // 外部链接，判断是否存在内容，存在跳转详情，否则跳转链接
        if (tag) {
          uni.navigateTo({
            url: `/pages/bannerDetail/index?id=${id}`
          });
        } else {
          // 跳转外部链接
          if (linkUrl && linkUrl.length > 5) {
            const linkArr = linkUrl.split('?');
            const url = linkArr[0];
            const query = {};
            if (linkArr[1]) {
              const linkArrItem = linkArr[1].split('&');
              for (let i = 0; i < linkArrItem.length; i++) {
                if (linkArrItem[i]) {
                  const queryItem = linkArrItem[i].split('=');
                  query[queryItem[0]] = queryItem[1];
                }
              }
            }
            this.$store.commit('webview/SET_LINK_QUERY', query);
            uni.navigateTo({
              url: `/pages/webView/index?url=${encodeURIComponent(
                url
              )}&title=${encodeURIComponent(title)}`
            });
          }
        }
      }
    },
    onScroll(e) {
      this.$u.throttle(this.setNavBar(e.scrollTop), 60);
    },
    setNavBar(top) {
      this.background.background = `rgba(255,255,255,${
        top > 10 ? top / 70 : 0
      })`;
    },
    async goAiPage() {
      const ruleId = this.aiRules.ruleId;
      const { code, data } = await sports.getDataStatus({
        semesterId: this.semesterId
      });
      if (code === 0) {
        if (data) {
          events.navigatorNativePage({
            page: 'aiPage',
            ruleId: this.aiRules.ruleId
          });
        } else {
          uni.navigateTo({
            url: `/pages/riskList/index?semesterId=${this.semesterId}&ruleId=${ruleId}`
          });
        }
      }
    },
    // 获取Ai运动规则
    async getAiRule() {
      // 没有学期不请求
      if (!this.semesterId) return;
      try {
        const { code, data } = await sports.getAiRule({
          semesterId: this.semesterId,
          userId: this.userInfo.id,
          campusId: this.userInfo.campusId
        });
        if (code === 0) {
          this.aiRules = data;
        }
      } catch (err) {
        throw new Error(err);
      }
      this.aiRulesLoading = false;
      this.prevTime = new Date().getTime();
    },
    hanldeAiCilck(type) {
      if (type === 'page') {
        // 去原生页面，开始ai运动
        this.goAiPage();
      }
      if (type === 'rule') {
        // 打开规则弹窗
        this.showAiRuleModel = true;
      }
      if (type === 'upload') {
        // 重新上传之前失败的ai运动数据，通知原生
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  box-sizing: border-box;
  padding: 0 0 150rpx 0;
  margin: 0;
  min-height: 100vh;
  background-color: #f5f6fa;
  .header-content {
    position: relative;
    width: 750rpx;
    height: 240px;
    .bg-img {
      width: 100%;
    }
    &-nav {
      width: 100%;
      &::v-deep .u-navbar {
        box-sizing: border-box;
        padding-top: 11px;
      }
      .title {
        box-sizing: border-box;
        padding: 0 32rpx;
        font-size: 44rpx;
        color: $u-main-color;
        font-weight: bold;
      }
      .right-icon-btn {
        box-sizing: border-box;
        padding: 0 32rpx;
        image {
          width: 140rpx;
          height: 48rpx;
        }
      }
    }
  }
  .banner-nav {
    width: 686rpx;
    position: relative;
    left: 32rpx;
    margin-top: -95px;
  }
  .running-nav {
    margin-top: 32rpx;
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 24rpx 24rpx 0 0;
    .rule-btns {
      height: 104rpx;
      padding: 0 32rpx;
      .title {
        font-size: 40rpx;
        font-weight: bold;
        color: $u-main-color;
      }
      .btn {
        width: 108rpx;
        height: 52rpx;
        font-size: 24rpx;
        color: $u-type-primary;
      }
    }
    .running-card-list {
      .padl {
        box-sizing: border-box;
        padding-left: 32rpx;
      }
      .list {
        width: 948rpx;
        height: 150rpx;
      }
    }
    .mileage-lj {
      background: linear-gradient(
        180deg,
        rgba(242, 245, 255, 1) 0%,
        rgba(255, 255, 255, 1) 100%
      );
      border-radius: 20rpx;
    }
    .mileage-box {
      margin: 24rpx 32rpx 0 32rpx;
      width: 686rpx;
    }
  }
  .close-maps {
    box-sizing: border-box;
    padding: 32rpx;
    text-align: center;
    .img {
      width: 152rpx;
      height: 152rpx;
    }
    .tps {
      margin-top: 8rpx;
      font-size: 28rpx;
      color: $u-main-color;
    }
  }
  .webview-content {
    overflow: scroll;
  }
}
</style>
