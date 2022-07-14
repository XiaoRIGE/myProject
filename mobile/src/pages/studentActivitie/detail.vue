<template>
  <view class="active-detail safe-area-inset-bottom">
    <!-- nav-bar -->
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
      <template #right>
        <view
          v-if="showQrcode"
          class="navbar-right-content"
          @click="signOrcode"
        >
          <image
            v-if="!background.back"
            class="qrcode-icon"
            src="~@/static/img/activite-qrcode-fill.png"
            mode="scaleToFill"
          />
          <image
            v-if="background.back"
            class="qrcode-icon"
            src="~@/static/img/activite-qrcode.png"
            mode="scaleToFill"
          />
        </view>
      </template>
    </g-navbar>
    <!-- 模拟背景图 -->
    <image class="bg-img" :src="bgUrl || dfaultImg" mode="scaleToFill" />
    <view :style="{ height: top + 'rpx' }" />
    <!-- 内容 -->
    <view class="active-detail-content">
      <view class="content-title">
        <view class="tag-content" :class="[tagClass]">
          <view class="tag-name">
            {{ tagName }}
          </view>
        </view>
        <text>{{ detailData.name || '' }}</text>
      </view>
      <!-- card1 -->
      <view class="content-info">
        <!-- 签到结束背景图，已签到，未签到-->
        <image
          v-if="detailData.state === 5"
          class="sign-state-bg"
          :src="signImg"
          mode="aspectFit"
        />
        <view class="sign-date row">
          <view class="label">报名时间</view>
          <view class="value">
            {{
              $u.timeFormat(
                Number(detailData.registerStartTime),
                'yy/mm/dd hh:MM'
              )
            }}
            -
            {{
              $u.timeFormat(
                Number(detailData.registerEndTime),
                'yy/mm/dd hh:MM'
              )
            }}
          </view>
        </view>
        <view class="activitie-date row">
          <view class="label">活动时间</view>
          <view class="value">
            {{ $u.timeFormat(Number(detailData.startTime), 'yy/mm/dd hh:MM') }}
            -
            {{ $u.timeFormat(Number(detailData.endTime), 'hh:MM') }}
          </view>
        </view>
        <view class="activitie-date row">
          <view class="label">活动地点</view>
          <view class="value">
            {{ detailData.address || '--' }}
          </view>
        </view>
        <view class="activitie-date row">
          <view class="label">报名人数</view>
          <view class="value">{{ detailData.registerPeople || 0 }}人报名</view>
        </view>
      </view>
      <!-- 活动介绍 -->
      <view v-if="detailData.brief" class="introduce">
        <view class="title">活动介绍</view>
        <view class="content">
          {{ detailData.brief }}
        </view>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view v-if="showBtn" class="footer-content">
      <u-button
        :disabled="disabled"
        :ripple="true"
        :hair-line="false"
        class="custom-style"
        :custom-style="{ ...baseBtnStyle, ...btnStyle }"
        type=""
        @tap.stop="handelClick"
      >
        <view class="name" :class="{ h44: showTps }">
          {{ btnName }}
        </view>
        <view v-if="showTps" class="tps">
          {{ btnTps }}
        </view>
      </u-button>
    </view>
    <!-- 弹窗 -->
    <u-modal
      v-model="showModal"
      :show-title="false"
      :show-cancel-button="true"
      confirm-text="继续"
      :cancel-style="{
        color: '#666',
        fontSize: '36rpx',
        fontWeight: 600
      }"
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
      content="当前活动时间与已选活动或课程相冲突，是否继续？"
      @confirm="modelOk"
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
  </view>
</template>

<script>
import { toRpx } from '@/utils/common';
import { activity } from '@/request/api/student';
import { checkSignInterval } from '@/request/api/education';
const week = new Date().getDay();
const tagStatus = {
  0: '报名未开始',
  1: '报名中',
  2: '报名结束',
  // 3: '活动未开始',
  4: '活动进行中',
  5: '活动结束'
};
const btnStatus = {
  1: '马上报名',
  2: '取消报名',
  3: '去签到'
};
const signImgs = {
  2: require('@/static/img/studentActivitie/leave-bg.png'),
  1: require('@/static/img/studentActivitie/signed-in-bg.png'),
  0: require('@/static/img/studentActivitie/no-sign-bg.png')
};
export default {
  name: 'StudentActivitieDetail',
  onLoad(options) {
    const { id } = options;
    this.activityId = id;
    this.getStudentActivityDetail();
    this.refreshList(false);
  },
  data() {
    return {
      showModal: false,
      timeModel: false,
      bgUrl: '',
      timerval: 0,
      disabled: false,
      btnState: -10,
      activityId: '',
      detailData: {},
      top: 0,
      btnName: '',
      btnTps: '',
      background: {
        backgroundColor: 'transparent',
        back: false,
        title: ''
      },
      baseBtnStyle: {
        // 按钮公共样式
        height: '100rpx',
        fontSize: '32rpx',
        borderRadius: '24rpx',
        fontWeight: 600
      },
      btnStyle: {
        backgroundColor: 'rgba(252,108,55,1)',
        color: '#fff'
      }
    };
  },
  computed: {
    tagName() {
      return tagStatus[this.detailData.state];
    },
    tagClass() {
      return `tag__${this.detailData.state}__bg`;
    },
    signImg() {
      const { signType } = this.detailData;
      return signImgs[signType];
    },
    showBtn() {
      const { state, isRegister, isSign, signType, registerEndTime } =
        this.detailData;
      // 报名未开始，报名中
      if (state === 0 || state === 1) return true;
      if (state === 2) {
        // 报名已结束 || 活动未开始
        // 判断是否报名
        // 判断当前是否在报名结束时间内
        if (isRegister) {
          return true;
        }
        if (!isRegister && new Date().getTime() > registerEndTime) {
          return false;
        }
        return false;
      }
      if (state === 4) {
        // 活动进行中
        if (!isRegister) {
          // 没有报名，判断当前时间是否超出报名结束时间
          if (new Date().getTime() > registerEndTime) {
            return false;
          }
          return true;
        }
        if (isSign || signType === 1) {
          return true;
        }
        if (!isSign) return true;
        return false;
      }
      return false;
    },
    showTps() {
      const { state, isSign, isRegister, signType } = this.detailData;
      if (state === 2) {
        if (!isSign && isRegister && signType !== 1) {
          return true;
        }
      }
      return false;
    },
    showQrcode() {
      const { performSignType, signType } = this.detailData;
      return (
        (performSignType === 1 || performSignType === 2) &&
        signType !== 1 && // 已签到
        signType !== 2 // 已请假
      );
    },
    cacheImages() {
      return this.$store.state.cacheFile.activitieImages;
    },
    dfaultImg() {
      return require(`@/static/img/studentActivitie/defaultBg/week_${week}.png`);
    }
  },
  watch: {
    detailData: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (nval && nval.id) {
          this.initBtn(nval);
          this.btnStyleFn();
        }
      }
    },
    'detailData.state': {
      handler() {
        this.initBtn(this.detailData);
        this.btnStyleFn();
      }
    },
    'detailData.signType': {
      handler() {
        this.initBtn(this.detailData);
        this.btnStyleFn();
      }
    },
    disabled: {
      handler() {
        this.btnStyleFn();
      }
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
    back() {
      uni.navigateBack({ delta: 1 });
    },
    modelOk() {
      this.signUp();
    },
    setNavBar(height) {
      this.background.backgroundColor = `rgba(255,255,255,${
        height > 40 ? height / 125 : 0
      })`;
      if (height > 125) {
        this.background.back = true;
        this.background.title = '活动详情';
      } else {
        this.background.back = false;
        this.background.title = '';
      }
    },
    async getStudentActivityDetail() {
      const res = await activity.getStudentActivityDetail({
        activityId: this.activityId
      });
      if (res.code === 0 && res.data) {
        this.detailData = res.data;
        if (res.data.bgUrl && res.data.bgUrl.length) {
          if (this.cacheImages && this.cacheImages.length > 0) {
            // 查找本地缓存图片
            const cacheItem = this.cacheImages.find(
              (c) => c.id === res.data.id
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

        this.initBtn(res.data);
      }
    },
    async handelClick() {
      if (this.btnState === 1) {
        this.checkConflict();
      }
      if (this.btnState === 2) {
        this.cancelSignUp();
      }
      if (this.btnState === 3) {
        // 去签到
        // 判断时间是否可以去签到
        const { id, performTime, performSignType } = this.detailData;
        const res = await checkSignInterval({ activityId: id });
        if (res.code === 0 && res.data) {
          const { signIn, timeInterval } = res.data;
          if (signIn) {
            if (performSignType === 2) {
              uni.navigateTo({
                url: '/pages/studentSignIn/qrCode'
              });
              this.refreshList(true);
            }
            if (performSignType === 1) {
              uni.navigateTo({
                url: `/pages/studentSignIn/gps?pageType=activity&activityId=${id}&times=${performTime}`
              });
              this.refreshList(true);
            }
          } else {
            const restSec = Number(timeInterval);
            const m = parseInt(timeInterval / 1000 / 60);
            const M = parseInt(restSec / 1000);
            this.timerval = m > 0 ? `${m}分钟` : `${M}秒`;
            this.timeModel = true;
          }
        }
      }
    },
    initBtn(data) {
      // 初始化按钮，根据不同状态展示不同按钮
      const {
        state,
        isRegister,
        limitPeopleNumber,
        registerPeople,
        isSign,
        signType,
        registerEndTime
      } = data;
      if (state === 0) {
        // 报名未开始, 展示距离报名时间倒计时
        this.disabled = true;
        const { day, h, m } = this.countDownTime(data.registerStartTime);
        this.btnName = `距离报名：${day}天${h}小时${m}分钟`;
        return;
      }
      if (state === 1) {
        // 报名中
        // 是否已经报名
        if (isRegister) {
          // 判断是否可以去签到，不能签到展示取消报名
          // 判断是否请假
          if (signType === 2) {
            this.btnName = '已请假';
            this.disabled = true;
            this.btnState = -10;
            return;
          }
          if (signType === 1) {
            // 已经完全签到
            this.btnName = '已签到';
            this.disabled = true;
            this.btnState = -10;
            return;
          }
          if (isSign) {
            // 去签到
            this.btnName = btnStatus[3];
            this.btnState = 3;
            this.disabled = false;
            return;
          }
          if (!isSign && signType !== 1) {
            // 展示取消报名
            this.btnName = btnStatus[2];
            this.btnState = 2;
            this.disabled = false;
            return;
          }
        }
        if (!isRegister) {
          // 没有报名就去报名
          // 判断是否满员
          if (limitPeopleNumber !== null && limitPeopleNumber >= 0) {
            if (registerPeople >= limitPeopleNumber) {
              this.btnName = '已满员';
              this.disabled = true;
              this.btnState = -10;
              return;
            }
          }
          this.btnName = btnStatus[1];
          this.btnState = 1;
          this.disabled = false;
          return;
        }
      }
      if (state === 2) {
        // 报名已结束
        if (isRegister) {
          // 是否已经报过名-》是
          // 判断是否可签到
          if (signType === 2) {
            // 请假
            this.btnName = '已请假';
            this.disabled = true;
            return;
          }
          if (signType === 1) {
            // 已签到
            this.btnName = '已签到';
            this.disabled = true;
            return;
          }
          if (isSign) {
            // 可签到
            this.btnName = btnStatus[3];
            this.btnState = 3;
            this.disabled = false;
            return;
          }
          if (!isSign && signType !== 1) {
            // 未开启签到，且未签到
            this.btnName = btnStatus[2];
            this.btnState = 2;
            this.disabled = false;
            const { day, h, m } = this.countDownTime(data.startTime);
            this.btnTps = `距离活动开始：${day}天${h}小时${m}分钟`;
          }
        }
        if (!isRegister) {
          // 没有报名就去报名
          if (new Date().getTime() > registerEndTime) {
            return;
          }
          // 判断是否满员
          if (limitPeopleNumber !== null && limitPeopleNumber >= 0) {
            if (registerPeople >= limitPeopleNumber) {
              this.btnName = '已满员';
              this.disabled = true;
              this.btnState = -10;
              return;
            }
          }
          this.btnName = btnStatus[1];
          this.btnState = 1;
          this.disabled = false;
          return;
        }
      }
      if (state === 4) {
        // 活动进行中
        if (!isRegister) {
          if (new Date().getTime() > registerEndTime) {
            return;
          }
          if (limitPeopleNumber !== null && limitPeopleNumber >= 0) {
            // 有人数限制
            if (registerPeople >= limitPeopleNumber) {
              // 是否满员
              this.btnName = '已满员';
              this.disabled = true;
              this.btnState = -10;
              return;
            } else {
              this.btnName = btnStatus[1];
              this.btnState = 1;
              this.disabled = false;
            }
          } else {
            // 没有人数限制
            this.btnName = btnStatus[1];
            this.btnState = 1;
            this.disabled = false;
          }
        }
        if (isRegister) {
          // 判断是否签到
          if (signType === 1) {
            // 已签到
            this.btnName = '已签到';
            this.disabled = true;
            return;
          }
          if (signType === 2) {
            // 请假
            this.btnName = '已请假';
            this.disabled = true;
            return;
          }
          if (isSign) {
            // 表示未签到，但是可以去签到
            this.btnName = btnStatus[3];
            this.btnState = 3;
            this.disabled = false;
          }
          if (!isSign) {
            this.btnName = '已报名';
            this.disabled = true;
            this.btnState = -10;
            return;
          }
        }
      }
    },
    // 倒计时
    countDownTime(time) {
      const result = {
        day: 0,
        h: 0,
        m: 0
      };
      const currentTimestamp = new Date().getTime();
      const start = time;
      if (start && start > currentTimestamp) {
        const nowStartTime = Number(start);
        const restSec = nowStartTime - currentTimestamp;
        result.day = parseInt(restSec / (60 * 60 * 1000 * 24));
        result.h = parseInt((restSec / (60 * 60 * 1000)) % 24);
        result.m = parseInt((restSec / (60 * 1000)) % 60);
      }
      return result;
    },
    async signUp() {
      // 报名
      this.loading = true;
      const res = await activity.signUp({
        activityId: this.detailData.id
      });
      if (res.code === 0) {
        if (res.data.success) {
          this.getStudentActivityDetail();
          uni.showToast({
            title: '报名成功',
            icon: 'success',
            mask: true
          });
          this.refreshList(true);
        } else {
          uni.showToast({
            title: res.data.reason || '报名失败',
            icon: 'none',
            mask: true
          });
        }
      }
      this.loading = false;
    },
    async signOrcode() {
      // 二维码签到
      // 判断时间是否可以去签到
      const res = await checkSignInterval({ activityId: this.detailData.id });
      if (res.code === 0 && res.data) {
        const { signIn, timeInterval } = res.data;
        if (signIn) {
          uni.navigateTo({ url: '/pages/studentSignIn/qrCode' });
        } else {
          const restSec = Number(timeInterval);
          const m = parseInt(timeInterval / 1000 / 60);
          const M = parseInt(restSec / 1000);
          this.timerval = m > 0 ? `${m}分钟` : `${M}秒`;
          this.timeModel = true;
        }
      }
    },
    async cancelSignUp() {
      this.loading = true;
      const res = await activity.cancelSignUp({
        activityId: this.detailData.id
      });
      if (res.code === 0 && res.data) {
        this.getStudentActivityDetail();
        uni.showToast({
          title: '取消成功',
          icon: 'success',
          mask: true
        });
      }
      this.refreshList(true);
      this.loading = false;
    },
    async checkConflict() {
      this.loading = true;
      try {
        const res = await activity.checkConflict({
          activityId: this.detailData.id
        });
        if (res.code === 0) {
          this.loading = false;
          if (res.data) {
            this.showModal = true;
          } else {
            // 没有冲突
            this.signUp();
          }
        }
      } catch (err) {
        this.loading = false;
      }
    },
    // 刷新列表
    refreshList(state) {
      const pages = getCurrentPages(); //获取所有页面栈实例列表
      const prevPage = pages[pages.length - 2]; //上一页页面实例
      if (prevPage && prevPage.$vm.pageQuery)
        prevPage.$vm.pageQuery.activitie.refresh = state;
    },
    btnStyleFn() {
      if (this.disabled) {
        this.btnStyle.backgroundColor = 'rgba(252,108,55,.5)';
        this.btnStyle.color = '#fff';
      } else {
        this.btnStyle.backgroundColor = 'rgba(252,108,55,1)';
        this.btnStyle.color = '#fff';
      }
      if (
        (this.detailData.state === 1 &&
          this.detailData.isRegister &&
          !this.detailData.isSign) ||
        (this.detailData.state === 2 &&
          this.detailData.isRegister &&
          !this.detailData.isSign &&
          this.detailData.signType !== 1)
      ) {
        this.btnStyle.backgroundColor = '#F5F6FA';
        this.btnStyle.color = '#222';
      }
    }
  },

  onPageScroll(e) {
    this.$u.throttle(this.setNavBar(e.scrollTop), 100);
  }
};
</script>

<style scoped lang="scss">
.active-detail {
  position: relative;
  min-height: 100vh;
  .navbar-right-content {
    box-sizing: border-box;
    padding: 32rpx;
    .qrcode-icon {
      width: 60rpx;
      height: 60rpx;
    }
  }
  .navbar-left {
    box-sizing: border-box;
    padding: 32rpx;
    .back-icon {
      width: 60rpx;
      height: 60rpx;
    }
  }
  &-content {
    z-index: 99999;
    box-sizing: border-box;
    padding: 32rpx 24rpx 160rpx;
    margin-top: -32rpx;
    background-color: #f5f6fa;
    border-radius: 20rpx 20rpx 0 0;
    .content-title {
      box-sizing: border-box;
      padding: 0 8rpx;
      margin-bottom: 24rpx;
      text {
        margin-left: 24rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: $u-main-color;
      }
    }
    .tag-content {
      display: inline-block;
      font-size: 28rpx;
      color: #fff;
      box-sizing: border-box;
      padding: 3rpx 16rpx;
      line-height: 44rpx;
      transform: skew(-10deg);
      border-radius: 12rpx;
      .tag-name {
        transform: skew(10deg);
        text-align: center;
      }
    }
    .content-info {
      position: relative;
      box-sizing: border-box;
      padding: 24rpx;
      border-radius: 20rpx;
      background-color: #fff;
      .sign-state-bg {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 212rpx;
        height: 212rpx;
      }
      .row {
        margin-bottom: 16rpx;
        .label {
          font-size: 28rpx;
          margin-bottom: 4rpx;
          color: $u-content-color;
        }
        .value {
          position: relative;
          box-sizing: border-box;
          padding-left: 26rpx;
          line-height: 40rpx;
          font-size: 28rpx;
          font-weight: bold;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
          color: $u-main-color;
          &::before {
            position: absolute;
            display: inline-block;
            content: '';
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 12rpx;
            height: 12rpx;
            border-radius: 50%;
            background-color: $u-main-color;
          }
        }
      }
    }
    .introduce {
      box-sizing: border-box;
      padding: 24rpx;
      margin-top: 24rpx;
      background-color: #fff;
      border-radius: 20rpx;
      word-wrap: break-word;
      .title {
        position: relative;
        line-height: 50rpx;
        font-size: 36rpx;
        box-sizing: border-box;
        padding-left: 20rpx;
        font-weight: bold;
        color: $u-main-color;
        &::before {
          display: inline-block;
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 6rpx;
          height: 28rpx;
          border-radius: 0px 2rpx 2rpx 0px;
          background-color: $u-type-primary;
        }
      }
      .content {
        margin-top: 16rpx;
        font-size: 28rpx;
        color: $u-main-color;
      }
    }
  }
  .h44 {
    line-height: 44rpx;
  }
  .footer-content {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    padding: 10rpx 32rpx;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 1) 100%
    );
    .custom-style {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name {
        padding: 0;
        margin: 0;
        line-height: auto;
      }
      .tps {
        line-height: 34rpx;
        font-size: 12px;
        color: $u-main-color;
      }
    }
  }
  .bg-img {
    position: absolute;
    height: 420rpx;
    width: 750rpx;
    z-index: -1;
    top: 0;
  }

  .tag__0__bg,
  .tag__3__bg {
    background-color: #fdb59b;
  }
  .tag__1__bg {
    background: linear-gradient(
      270deg,
      rgba(255, 78, 2, 1) 0%,
      rgba(255, 32, 90, 1) 100%
    );
  }
  .tag__4__bg {
    background: linear-gradient(
      90deg,
      rgba(50, 184, 73, 1) 0%,
      rgba(46, 209, 49, 1) 100%
    );
  }
  .tag__5__bg,
  .tag__2__bg {
    background-color: #b3b3b3;
  }
}
</style>
<style scoped>
.footer-content {
  /* 安全区域适配 */
  height: calc(140rpx + constant(safe-area-inset-bottom));
  height: calc(140rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
