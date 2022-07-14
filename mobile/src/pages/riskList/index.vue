<template>
  <view class="risk-list-content">
    <g-navbar
      :background="{ backgroundColor: '#fff' }"
      :border-bottom="false"
      back-icon-color="#222"
      back-icon-size="48"
      title="运动风险自查"
    />
    <web-view :src="url" />
    <view id="footer" class="footer-content">
      <view
        class="footer-btn"
        :class="[disabled ? 'disabled' : 'available']"
        @click="goAiPage"
      >
        我已阅读并完成运动风险自查清单
        <text v-if="countDown && second > 0">
          （{{ second }}s）
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { sports } from '@/request/api/student';
import events from '@/nativeEvent';
export default {
  onLoad(options) {
    const { semesterId, ruleId } = options;
    this.semesterId = semesterId;
    this.ruleId = ruleId;
    uni.showLoading({
      title: '加载中'
    });
  },
  data() {
    return {
      countDown: false,
      disabled: true,
      second: 5,
      semesterId: '',
      ruleId: '',
      timer: null,
      baseUrl: 'https://university.legym.cn/app/v1/risklist.html'
    };
  },
  onReady() {
    this.setWebViewHeight();
    this.countDownFn();
  },
  computed: {
    token() {
      return this.$store.state.app.userInfo.accessToken;
    },
    url() {
      return `${this.baseUrl}?token=${encodeURIComponent(this.token)}`;
    }
  },
  methods: {
    async getDangerText() {
      const { code, data } = await sports.getDangerText();
      if (code === 0) {
        const { text } = data;
        this.text = text.replace(/\r|\n/g, '<br/>');
      }
    },
    countDownFn() {
      setTimeout(() => {
        uni.hideLoading();
        this.countDown = true;
        this.timer = setInterval(() => {
          --this.second;
          if (this.second === 0) {
            this.countDown = false;
            this.disabled = false;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }, 1500);
    },
    async goAiPage() {
      if (this.disabled) return;
      const { code } = await sports.dangerAccessText({
        semesterId: this.semesterId
      });
      if (code === 0) {
        uni.redirectTo({
          url: '/pages/index/index',
          success() {
            events.navigatorNativePage({
              page: 'aiPage',
              ruleId: this.ruleId
            });
          },
          fail(err) {
            throw Error(err);
          }
        });
      }
    },
    setWebViewHeight() {
      // #ifdef APP-PLUS
      let wv;
      setTimeout(() => {
        const info = uni.createSelectorQuery().select('#footer');
        const currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
        const top = this.StatusBar + 44;
        wv = currentWebview.children()[0];
        info
          .boundingClientRect(footerDom => {
            if (footerDom && footerDom.height) {
              const height = this.screenHeight - footerDom.height - top;
              wv.setStyle({ top, height });
            }
          })
          .exec();
        // webview加载成功
        wv.addEventListener(
          'loaded',
          () => {
            // uni.hideLoading();
            // this.countDown = true;
          },
          false
        );
      }, 600);
      // #endif
    }
  }
};
</script>

<style lang="scss" scoped>
.risk-list-content {
  .footer-content {
    height: 140rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    padding: 20rpx 32rpx;
    background-color: #fff;
    .footer-btn {
      width: 100%;
      text-align: center;
      line-height: 100rpx;
      border-radius: 24rpx;
      color: #fff;
      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
    }
  }
  .disabled {
    background-color: #fdb59b;
  }
  .available {
    background-color: #fc6c37;
  }
}
</style>
