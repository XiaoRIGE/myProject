<template>
  <view class="appeal-content">
    <g-navbar
      :background="{ backgroundColor: '#fff' }"
      :border-bottom="false"
      title="申诉详情"
    />
    <view class="speed-content u-flex">
      <view class="u-flex">
        <image class="icon" :src="speedIcon" mode="scaleToFill" />
        <text class="name">{{ statusName }}</text>
      </view>
      <!-- 有关联数据，申诉成功或者失败时候展示 -->
      <view v-if="showAppealAgainbtn" class="appeal-again" @click="appealAgain">
        再次申诉
      </view>
    </view>
    <progress-template
      :appeal-status="appealStatus"
      :appeal-info="appealInfo"
      :page="page"
    />
    <appeal-information :page="page" :appeal-info="appealInfo" />

    <!-- 底部按钮 -->
    <!-- 申诉处理中 取消申诉按钮 -->
    <view v-if="status === 'processing'" class="footer-btn u-flex">
      <u-button
        type="primary"
        :custom-style="{
          borderRadius: '24rpx',
          width: '100%'
        }"
        @click="cancelAppealModal = true"
      >
        取消申诉
      </u-button>
    </view>

    <!-- 取消申诉弹窗 -->
    <g-modal
      v-model="cancelAppealModal"
      :show-cancel-button="true"
      confirm-text="确定"
      cancel-text="返回"
      content="申诉正在处理中，是否要取消当前的申诉"
      @confirm="cancelAppeal"
    />
    <!-- 再次申诉时候超过申诉上限弹窗 -->
    <g-modal
      v-model="appealAgainModal"
      confirm-text="我知道了"
      content="申诉已达上限，请稍后再试"
      @confirm="appealAgainModal = false"
    />

    <!-- 后台已经取消申诉弹窗 -->
    <g-modal
      v-model="cancelAgainModal"
      confirm-text="我知道了"
      content="申诉已被处理，请刷新后再次查看"
      @confirm="cancelAgainHandle"
    />
  </view>
</template>

<script>
import { getStatus, getStatusName } from './common';
import ProgressTemplate from './components/ProgressTemplate';
import AppealInformation from './components/AppealInformation';
import { running } from '../../request/api/student';
export default {
  name: 'AppealDetail',
  components: {
    'progress-template': ProgressTemplate,
    'appeal-information': AppealInformation
  },
  data() {
    return {
      id: '', // 申诉id
      appealInfo: null,
      cancelAppealModal: false, // 取消申诉弹窗
      appealAgainModal: false,
      cancelAgainModal: false,
      page: '' // 详情页面跳转过来不需要继续跳转查看轨迹
    };
  },

  onLoad(options) {
    this.id = options.id;
    if (options.page) {
      this.page = options.page;
    }
    this.getAppealInfo();
  },
  computed: {
    appealStatus() {
      // 申诉状态
      if (this.appealInfo) {
        return this.appealInfo.appealState;
      }
      return 100;
    },
    status() {
      return getStatus(this.appealStatus);
    },
    statusName() {
      return getStatusName(this.status);
    },
    speedIcon() {
      if (!this.status) return '';
      return require(`@/static/img/appeal/${this.status}.svg`);
    },
    showAppealAgainbtn() {
      // 有关联数据，申诉成功或者失败时候展示 再次申诉按钮
      if (!this.appealInfo) return false;
      return (
        this.appealInfo.runningDetailsId &&
        (this.status === 'success' || this.status === 'fail')
      );
    }
  },
  methods: {
    async cancelAppeal() {
      // 取消申诉
      this.cancelAppealModal = false;
      const { code, data } = await running.cancelAppeal({
        id: this.appealInfo.id
      });
      if (code === 0 && data) {
        uni.showToast({
          title: '取消成功',
          duration: 2000,
          icon: 'success'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 2000);
      }
      if (code === 0 && !data) {
        // 已处理
        this.cancelAgainModal = true;
      }
    },
    cancelAgainHandle() {
      // 关闭弹窗，并返回
      this.cancelAgainModal = false;
      setTimeout(() => {
        uni.navigateBack();
      }, 800);
    },
    async appealAgain() {
      // 判断当前是否可以继续申诉
      // 需要验证创建申诉极限，达到上限不能创建申诉
      const { code, data } = await running.getLimit({
        semesterId: this.$store.state.semester.currentSemester.id
      });
      if (code === 0 && data) {
        // 可以去申诉, 销毁当前页面
        uni.redirectTo({
          url: `/pages/runningAppeal/add?appealId=${this.appealInfo.id}&page=${this.page}`
        });
      } else {
        // 不能申诉
        this.appealAgainModal = true;
      }
    },
    async getAppealInfo() {
      // 获取申诉详情
      const { code, data } = await running.getAppealInfo({ id: this.id });
      if (code === 0 && data) {
        this.appealInfo = data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.appeal-content {
  box-sizing: border-box;
  padding: 0 24rpx 180rpx;
  .speed-content {
    justify-content: space-between;
    box-sizing: border-box;
    padding-left: 12rpx;
    margin: 48rpx 0 44rpx;
    .appeal-again {
      width: 148rpx;
      text-align: center;
      height: 52rpx;
      line-height: 52rpx;
      border-radius: 16rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $uni-color-primary;
      border: 1px solid $uni-color-primary;
    }
    .icon {
      width: 48rpx;
      height: 48rpx;
    }
    .name {
      margin-left: 20rpx;
      font-size: 40rpx;
      font-weight: bold;
      color: $u-main-color;
    }
  }
  .footer-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 32rpx;
    background-color: #fff;
  }
}
</style>
<style>
/* 安全区域适配 */
.footer-btn {
  height: calc(140rpx + constant(safe-area-inset-bottom));
  height: calc(140rpx + env(safe-area-inset-bottom));
}
</style>
