<template>
  <view class="course-attendance-container">
    <g-navbar
      back-icon-size="48"
      title="课程考勤"
      :border-bottom="false"
      class="navbar"
    >
      <view slot="right" class="more" @click="moreSheetHandle">更多</view>
    </g-navbar>
    <mescroll-uni
      ref="mescrollRef"
      class="course-attendance-content"
      :native="true"
      :top="top"
      bottom="0"
      :up="upOption"
      :down="downOption"
      @init="mescrollInit"
      @down="downCallback(value)"
      @up="upCallback"
    >
      <!-- 当前课程 -->
      <current-course class="current-course" :current-course="currentCourse" />
      <!-- 签到状态及签到按钮 -->
      <!-- 未开启签到 -->
      <view v-if="!isOpenSignIn" class="not-open">
        <sign-in-title v-if="week !== null" :week="week" />
        <view v-if="week !== null" class="not-open-content">
          <view class="not-open-content-text">当前未开启签到</view>
          <view class="not-open-content-btn" @click="openFirstHandle">
            开启首次签到
          </view>
        </view>
      </view>
      <!-- 开启签到 -->
      <open-sign-in
        v-else
        :week="week"
        :list="list"
        :count-info-vo="countInfoVo"
        :user-count="userCount"
        :number="number"
        :scroll-top="scrollTop"
        :show-keyboard="showKeyboard"
        @openSecondHandle="openSecondHandle"
        @changeLoading="changeLoadingHandle"
        @editShowKeyboard="editShowKeyboard"
        @downCallback="downCallback"
        @changelist="changelist"
      />
    </mescroll-uni>
    <!-- </view> -->
    <!-- 切换周次popup -->
    <u-popup
      v-model="cutWeekShow"
      mode="bottom"
      border-radius="24"
      :safe-area-inset-bottom="true"
    >
      <cut-week
        :week="week"
        :effective-date-list="effectiveDateList"
        @submitCutWeekHandle="submitCutWeekHandle"
        @cancelCutWeekHandle="cancelCutWeekHandle"
      />
    </u-popup>

    <!-- 签到作废模态框 -->
    <u-modal
      v-model="cancelledShow"
      title="作废签到"
      :title-style="{ fontSize: '36rpx', fontWeight: 600 }"
      content="作废全部签到，本次考勤将不会计入成绩"
      :content-style="{ fontSize: '34rpx', color: '#666666' }"
      :show-cancel-button="true"
      confirm-text="确认作废"
      :confirm-style="{ fontWeight: 600, color: '#FC6C37', fontSize: '36rpx' }"
      :cancel-style="{ fontWeight: 600, color: '##666666', fontSize: '36rpx' }"
      @cancel="cancelledShow = false"
      @confirm="confirmCancelledHandle"
    />

    <!-- 签到已作废消息提示 -->
    <u-toast ref="uToast" />

    <!-- 点击更多的操作菜单 -->
    <u-action-sheet
      v-model="moreSheetShow"
      :list="moreShowList"
      border-radius="24"
      @click="selectSheetHandle"
    />
  </view>
</template>

<script>
import CurrentCourse from './components/CurrentCourse';
import SignInTitle from './components/SignInTitle';
import OpenSignIn from './components/OpenSignIn';
import CutWeek from './components/CutWeek';
import { course, attainability } from '@/request/api/teacher';
import { getCountInfo } from '@/utils/common';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// import MescrollCompMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-comp.js';

const moreShowArr = [
  [{ text: '切换周次' }],
  [
    { text: '切换周次' },
    {
      text: '作废签到'
    }
  ]
];
export default {
  name: 'CourseAttendance',
  components: {
    'current-course': CurrentCourse,
    'sign-in-title': SignInTitle,
    'open-sign-in': OpenSignIn,
    'cut-week': CutWeek
  },
  mixins: [MescrollMixin],
  data() {
    return {
      list: [],
      page: 1,
      size: 20,
      countInfoVo: [],
      userCount: 0,
      currentCourse: null, //当前课程
      effectiveDateList: [], //效率周列表
      week: null, //选中周
      isOpenSignIn: false, // false:未考勤 true:已考勤
      number: 0, //签到次数
      scrollTop: 0,
      cutWeekShow: false, //切换周次popup状态
      moreSheetShow: false, //更多操作菜单状态
      moreShowList: [], //更多操作菜单list
      cancelledShow: false, //签到作废模态框状态
      showKeyboard: true, //键盘显隐状态
      loading: false, //原生返回重新加载
      openSignTimer: null, // 防抖时间
      downOption: {
        auto: false, //是否在初始化后,自动执行downCallback; 默认true
        offset: 48, //下拉大于60px,松手即可触发下拉刷新的回调
        textColor: '#999999',
        bgColor: 'rgba(245,246,250,1)'
      },
      upOption: {
        textColor: '#999999',
        bgColor: 'rgba(245,246,250,1)',
        use: true,
        auto: false,
        offset: 48,
        textNoMore: '—— 没有更多啦 ——',
        isBounce: true,
        page: {
          num: 0,
          size: 20,
          time: null
        },
        empty: {
          use: false
        }
      },
      top: 0,
      timer: null,
      value: ''
    };
  },
  onLoad(option) {
    this.top =
      uni.getSystemInfoSync().platform === 'ios'
        ? (this.StatusBar + 44 - 8) * 2
        : (this.StatusBar + 44) * 2;
    const item = JSON.parse(decodeURIComponent(option.item));
    this.currentCourse = item;
    this.getEffectiveDateList(item);
  },
  onShow() {
    if (this.loading) {
      this.getEffectiveDateList(this.currentCourse);
      this.loading = false;
    }
  },
  onHide() {
    clearTimeout(this.timer);
  },
  // 监听页面滚动
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {
    // 下拉刷新
    downCallback(value = '') {
      this.value = value;
      this.mescroll.resetUpScroll();
    },

    // 上拉加载
    upCallback(page) {
      this.page = page.num;
      this.getAttainabilityCount(this.week);
      this.getAttainabilityList(this.week);
    },

    // 修改学生签到状态后前端自行修改列表和统计
    changelist(item, newItem) {
      this.getAttainabilityCount(this.week);
      this.list = this.list.map((i) => {
        return item.userId === i.userId ? newItem : i;
      });
    },

    // 获取学生考勤列表统计
    getAttainabilityCount(week) {
      course
        .getAttainabilityCount({
          courseId: week.courseId,
          weekNumber: week.weekNumber
        })
        .then((res) => {
          if (res.code === 0) {
            this.userCount = res.data.userCount || 0;
            this.countInfoVo = getCountInfo(res.data);
          }
        });
    },

    // 获取学生考勤列表
    getAttainabilityList(week) {
      course
        .getAttainabilityList({
          courseId: week.courseId,
          page: this.page,
          size: this.size,
          query: this.value,
          weekNumber: week.weekNumber
        })
        .then((res) => {
          if (res.code === 0 && res.data) {
            // 轮询
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.downCallback(this.value);
            }, 60000);
            if (this.page === 1) {
              this.list = res.data.recordList.items || [];
            } else {
              this.list = this.list.concat(res.data.recordList.items || []);
            }
            if (typeof this.mescroll.endSuccess === 'function') {
              this.mescroll.endSuccess(res.data.recordList.items.length || 0);
            }
          } else {
            if (this.page === 1) {
              this.list = [];
            }
            if (typeof this.mescroll.endSuccess === 'function') {
              this.mescroll.endSuccess(0);
            }
          }
        })
        .catch((err) => {
          if (typeof this.mescroll.endSuccess === 'function') {
            this.mescroll.endErr();
          }
          throw Error(err);
        });
    },
    clickHandle(y) {
      this.mescroll.scrollTo(y, 0); // 无过渡动画llTo(y, 0) // 无过渡动画
    },
    // 开启首次签到
    openFirstHandle() {
      this.startAttainability(1);
    },
    // 开启二次签到
    openSecondHandle() {
      this.startAttainability(2);
    },

    // 开启签到回调
    startAttainability(times) {
      const { courseId, weekNumber } = this.week;
      clearTimeout(this.openSignTimer);
      this.openSignTimer = setTimeout(() => {
        attainability
          .start({
            courseId,
            times,
            weekIndex: weekNumber
          })
          .then((res) => {
            if (res.code === 0 && res.data) {
              this.isOpenSignIn = true;
              this.number = times;
              this.getEffectiveDateList(this.currentCourse);
            } else {
              this.$refs.uToast.show({
                title: '开启签到失败'
              });
            }
          });
      }, 1000);
    },

    // 点击更多触发事件
    moreSheetHandle() {
      this.moreSheetShow = true;
      this.showKeyboard = false;
      if (!this.isOpenSignIn) {
        this.moreShowList = moreShowArr[0];
      } else {
        this.moreShowList = moreShowArr[1];
      }
    },
    // 修改键盘显隐事件
    editShowKeyboard() {
      this.showKeyboard = true;
    },
    // 触发更多操作菜单事件
    selectSheetHandle(index) {
      if (index === 0) {
        this.cutWeekShow = true;
      } else {
        this.cancelledShow = true;
      }
    },
    // 确认切换周次
    submitCutWeekHandle(selectWeek) {
      this.cutWeekShow = false;
      this.week = selectWeek;
      this.isOpenSignIn = selectWeek.startSignDataStatus;
      this.number = selectWeek.startSignNumber;
    },
    // 取消切换周次
    cancelCutWeekHandle() {
      this.cutWeekShow = false;
    },
    // 确认签到作废
    confirmCancelledHandle() {
      this.cancelledShow = false;
      course
        .attainabilityCancel({
          courseId: this.week.courseId,
          weekNumber: this.week.weekNumber
        })
        .then((res) => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '签到已作废'
            });
            this.getEffectiveDateList(this.currentCourse);
          }
        });
    },
    //修改更新状态
    changeLoadingHandle() {
      this.loading = true;
    },
    // 获取效率周列表
    getEffectiveDateList(item) {
      course
        .getEffectiveDateList({
          courseId: item.id
        })
        .then((res) => {
          if (res.code === 0) {
            this.effectiveDateList = res.data;
            res.data.forEach((item) => {
              // 手动选中，无需默认选中
              if (this.week && item.weekNumber === this.week.weekNumber) {
                this.week = item;
                this.isOpenSignIn = item.startSignDataStatus;
                this.number = item.startSignNumber;
              }
              // currentWeek:true  默认选中周
              else if (item.currentWeek && !this.week) {
                this.week = item;
                this.isOpenSignIn = item.startSignDataStatus;
                this.number = item.startSignNumber;
              }
            });
            this.downCallback(this.value);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.course-attendance-container {
  box-sizing: border-box;
  margin: 0;
  .navbar {
    .more {
      margin-right: 32rpx;
      color: $u-main-color;
    }
  }
  .course-attendance-content {
    margin-top: 32rpx;
    padding: 0 32rpx;
    // ::v-deep .mescroll-uni {
    //   padding: 0 32rpx;
    // }
    .current-course {
      margin-top: 32rpx;
      margin-left: 32rpx;
    }
    .not-open {
      width: 686rpx;
      height: 340rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 20rpx;
      margin-left: 32rpx;
      margin-top: 32rpx;
      padding: 32rpx;
      &-content {
        width: 280rpx;
        margin: 30rpx auto 0;
        text-align: center;
        &-text {
          font-size: 40rpx;
          font-weight: bold;
          margin-bottom: 24rpx;
        }
        &-btn {
          width: 256rpx;
          height: 92rpx;
          font-size: 32rpx;
          background: linear-gradient(
            360deg,
            rgba(106, 175, 30, 1) 0%,
            rgba(132, 209, 48, 1) 100%
          );
          margin: 0 auto;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          line-height: 92rpx;
          box-shadow: 0rpx 4rpx 24rpx -2rpx rgba(107, 176, 31, 0.4);
          border-radius: 24rpx;
        }
      }
    }
  }
}
</style>
