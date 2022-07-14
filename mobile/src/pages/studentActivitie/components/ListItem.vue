<template>
  <navigator
    :url="'/pages/studentActivitie/detail?id=' + activitieItem.id"
    open-type="navigate"
    hover-class="none"
  >
    <view class="item-content u-flex u-row-between">
      <view class="item-content-left">
        <tag :tag="activitieItem.state" />
        <image
          :lazy-load="true"
          class="activitie-img"
          :src="activitieItem.bgUrl || dfaultImg"
          mode="aspectFill"
        />
      </view>
      <view class="item-content-right u-flex u-row-between">
        <view class="activitie-title ellipsis-2">
          {{ activitieItem.name || '' }}
        </view>
        <view class="activitie-center">
          <view class="activitie-date">活动时间：{{ timeFormat }}</view>
          <view class="activitie-address">
            活动地点：{{ activitieItem.address }}
          </view>
        </view>
        <!-- 按钮部分 -->
        <view class="activitie-content u-flex u-row-between">
          <view class="activitie-content-left">
            <view v-if="activitieItem.state === 0" class="dowm-date u-flex">
              <u-icon size="28" name="clock-fill" color="#FC6C37" />
              <text class="f6">距报名</text>
              <view class="f6 box">
                {{ countDownTime.day }}
              </view>
              天
              <view class="f6 box">
                {{ countDownTime.h }}
              </view>
              时
              <view class="f6 box">
                {{ countDownTime.m }}
              </view>
              分
            </view>
            <view class="bm">
              {{ activitieItem.registerPeople || 0 }}
              <text
                v-if="
                  activitieItem.limitPeopleNumber !== null &&
                  activitieItem.limitPeopleNumber >= 0
                "
              >
                /{{ activitieItem.limitPeopleNumber }}
              </text>
              人报名
            </view>
          </view>
          <view
            v-if="activitieItem.state !== 0"
            class="activitie-content-right"
          >
            <view v-show="showBtn">
              <u-button
                v-if="!isSign"
                :loading="loading"
                :hair-line="false"
                :ripple="true"
                type=""
                :custom-style="{
                  ...baseBtnStyle,
                  backgroundColor: bgColor,
                  color: color
                }"
                :disabled="disabled"
                @tap.stop="handelClick"
              >
                {{ btnName }}
              </u-button>
              <text v-else class="text">
                {{ rightText }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--报名提示 弹窗 -->
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
  </navigator>
</template>

<script>
import Tag from './Tag';
const week = new Date().getDay();
import { activity } from '@/request/api/student';
import { checkSignInterval } from '@/request/api/education';
const weeks = ['日', '一', '二', '三', '四', '五', '六'];
const btnStatus = {
  1: '去报名',
  2: '取消报名',
  3: '去签到'
};
export default {
  name: 'ListItem',
  components: {
    tag: Tag
  },
  props: {
    activitieItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      timeModel: false, // 是否可以二次签到
      showModal: false,
      timerval: 0,
      disabled: false, // 是否需要禁用按钮
      isSign: false, //是否签到
      showBtn: true,
      btnName: '', // 按钮名称
      rightText: '',
      bgColor: '',
      color: '',
      baseBtnStyle: {
        // 按钮公共样式
        width: '156rpx',
        height: '64rpx',
        fontSize: '28rpx',
        borderRadius: '16rpx',
        fontWeight: 600
      },
      btnState: -10
    };
  },
  computed: {
    dfaultImg() {
      return require(`@/static/img/studentActivitie/defaultBg/week_${week}.png`);
    },
    timeFormat() {
      const { startTime, endTime } = this.activitieItem;
      if (!startTime || !endTime) return '';
      const startDate = new Date(Number(startTime));
      const week = startDate.getDay();
      return `周${weeks[week]}(${
        startDate.getMonth() + 1
      }月${startDate.getDate()}日) ${this.$u.timeFormat(
        Number(startTime),
        'hh:MM'
      )}~${this.$u.timeFormat(Number(endTime), 'hh:MM')}`;
    },
    countDownTime() {
      const result = {
        day: 0,
        h: 0,
        m: 0
      };
      const currentTimestamp = new Date().getTime();
      const start = this.activitieItem.startRegisterTime;
      if (start && start > currentTimestamp) {
        const nowStartTime = Number(start);
        const restSec = nowStartTime - currentTimestamp;
        result.day = parseInt(restSec / (60 * 60 * 1000 * 24));
        result.h = parseInt((restSec / (60 * 60 * 1000)) % 24);
        result.m = parseInt((restSec / (60 * 1000)) % 60);
      }
      return result;
    }
  },
  watch: {
    activitieItem: {
      deep: true,
      immediate: true,
      handler() {
        this.initBtns();
        this.setBtnStyle();
        this.$forceUpdate();
      }
    },
    'activitieItem.state': {
      handler() {
        this.initBtns();
        this.setBtnStyle();
      }
    },
    'activitieItem.isSign': {
      handler() {
        this.initBtns();
        this.setBtnStyle();
      }
    },
    'activitieItem.signType': {
      handler() {
        this.initBtns();
        this.setBtnStyle();
      }
    }
  },
  methods: {
    async handelClick() {
      if (this.btnState === 1) {
        // 去报名
        // 校验冲突
        this.checkConflict();
      }
      if (this.btnState === 2) {
        // 取消报名
        this.cancelSignUp();
      }
      if (this.btnState === 3) {
        // 去签到
        const { id, performSignType, performTime } = this.activitieItem;
        const res = await checkSignInterval({ activityId: id });
        if (res.code === 0 && res.data) {
          const { signIn, timeInterval } = res.data;

          if (signIn) {
            if (performSignType === 1) {
              uni.navigateTo({
                url: `/pages/studentSignIn/gps?pageType=activity&activityId=${id}&times=${performTime}`
              });
            }
            if (performSignType === 2) {
              uni.navigateTo({
                url: '/pages/studentSignIn/qrCode'
              });
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
    setBtnStyle() {
      this.bgColor = this.disabled
        ? 'rgba(252,108,55,.5)'
        : this.btnState === 2
        ? '#F5F6FA'
        : 'rgba(252,108,55,1)';
      this.color = this.btnState === 2 ? '#222' : '#fff';
    },
    initBtns() {
      // 设置按钮状态前，先初始化按钮状态
      this.showBtn = true;
      const {
        limitPeopleNumber,
        registerPeople,
        isRegister,
        isSign,
        signType,
        state,
        endRegisterTime
      } = this.activitieItem;
      if (state === 1) {
        // 活动开始报名时 state:1
        // 判断自己是否报名
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
          // 可签到
          if (isSign) {
            this.btnName = btnStatus[3];
            this.btnState = 3;
            this.disabled = false;
            return;
          }
          if (!isSign && signType !== 1 && signType !== 2) {
            // 展示取消报名
            this.btnName = btnStatus[2];
            this.btnState = 2;
            this.disabled = false;
            return;
          }
        }
        if (!isRegister) {
          // 未曾报名
          // 判断是否有人数限制
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
      }
      if (state === 2) {
        // 活动报名已结束，但活动未开始
        // 是否报名
        if (isRegister) {
          if (signType === 2) {
            // 请假
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
          // 去签到
          if (isSign) {
            this.btnName = btnStatus[3];
            this.btnState = 3;
            this.disabled = false;
            return;
          }
          if (!isSign) {
            this.btnName = btnStatus[2];
            this.btnState = 2;
            this.disabled = false;
          }
        } else {
          // 未报名
          // 判断当前是否在报名结束时间内
          if (new Date().getTime() > endRegisterTime) {
            this.showBtn = false;
            return;
          }
          // 判断是否有人数限制
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
      }
      if (state === 4) {
        // 活动进行中时
        // 判断是否报名
        if (isRegister) {
          // 是否开启签到并且可以去签到
          if (signType === 1) {
            // 已签到
            this.btnName = '已签到';
            this.disabled = true;
            this.btnState = -10;
            return;
          }
          if (signType === 2) {
            // 请假
            this.btnName = '已请假';
            this.disabled = true;
            this.btnState = -10;
            return;
          }
          if (isSign) {
            // 可以签到并且未签到
            this.btnName = btnStatus[3];
            this.btnState = 3;
            this.disabled = false;
            return;
          }
          if (!isSign) {
            this.btnName = '已报名';
            this.disabled = true;
            this.btnState = -10;
            return;
          }
        } else {
          // 判断当前是否在报名结束时间内
          if (new Date().getTime() > endRegisterTime) {
            this.showBtn = false;
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
      }
      if (state === 5) {
        // 活动结束
        if (signType === 2) {
          // 请假
          this.btnName = '已请假';
          this.disabled = true;
          this.btnState = -10;
          return;
        }
        this.isSign = false;
        this.rightText = '活动已结束';
        return;
      }
    },
    async signUp() {
      // 报名
      try {
        this.loading = true;
        const res = await activity.signUp({
          activityId: this.activitieItem.id
        });
        if (res.code === 0) {
          if (res.data.success) {
            this.$emit('refresh');
            uni.showToast({
              title: '报名成功',
              icon: 'success',
              mask: true
            });
          } else {
            uni.showToast({
              title: res.data.reason || '报名失败',
              icon: 'none',
              mask: true
            });
          }
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    },
    async cancelSignUp() {
      try {
        this.loading = true;
        const res = await activity.cancelSignUp({
          activityId: this.activitieItem.id
        });
        if (res.code === 0 && res.data) {
          this.$emit('refresh');
          uni.showToast({
            title: '取消成功',
            icon: 'success',
            mask: true
          });
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    },
    async checkConflict() {
      this.loading = true;
      try {
        const res = await activity.checkConflict({
          activityId: this.activitieItem.id
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
    modelOk() {
      this.signUp();
    }
  }
};
</script>

<style scoped lang="scss">
.item-content {
  width: 100%;
  height: 312rpx;
  align-items: stretch;
  box-sizing: border-box;
  padding: 24rpx;
  background-color: #fff;
  border-radius: 20rpx;
  &-left {
    position: relative;
    width: 200rpx;
    height: 264rpx;
    .activitie-img {
      width: 200rpx;
      height: 264rpx;
      border-radius: 12rpx;
    }
  }
  &-right {
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    padding-left: 24rpx;
    .activitie-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $u-main-color;
    }
    .activitie-center {
      width: 440rpx;
    }
    .activitie-date,
    .activitie-address {
      width: 100%;
      font-size: 12px;
      box-sizing: border-box;
      padding: 6rpx 24rpx 6rpx 0;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
      color: $u-content-color;
    }
    .activitie-content {
      width: 100%;
      box-sizing: border-box;
      padding: 0 24rpx 0 0;
      &-left {
        .dowm-date {
          font-size: 12px;
          box-sizing: border-box;
          padding: 4rpx 8rpx;
          height: 36rpx;
          margin-bottom: 6rpx;
          color: $u-type-primary;
          background: linear-gradient(
            270deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(254, 241, 236, 1) 100%
          );
          border-radius: 20rpx 0px 0px 20rpx;
          .f6 {
            font-weight: bold;
          }
          .box {
            box-sizing: border-box;
            padding: 0 5rpx;
            line-height: 28rpx;
            margin: 0 5rpx;
            text-align: center;
            border-radius: 4rpx;
            border: 0.5rpx solid #c3c2cc;
          }
        }
        .bm {
          font-size: 12px;
          color: $u-content-color;
        }
      }
      &-right {
        line-height: 64rpx;
      }
    }
  }
  .ellipsis-2 {
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .u-btn--bold-border {
    border: none;
  }
  .text {
    font-size: 28rpx;
    font-weight: bold;
    color: #4aba5d;
  }
}
</style>
