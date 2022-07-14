<template>
  <view class="about-container">
    <g-navbar
      back-icon-size="48"
      title="关于我们"
      :border-bottom="false"
      class="navbar"
    />
    <view class="about-content">
      <view class="logo-box">
        <image
          src="~@/static/img/legym-logo.png"
          mode="scaleToFill"
          class="logo"
        />
        <view class="name">
          乐健体育
        </view>
        <view class="vesion">
          {{ appVersion }}
        </view>
      </view>
      <view class="bottom-box">
        <view class="white-box" @click="contactCustomer">
          <view class="label">
            电话咨询
          </view>
          <view>{{ telePhone }}</view>
        </view>
        <view class="white-box">
          <navigator
            style="width: 100%"
            class="u-flex u-row-between"
            url="/pages/webView/index?url=http://47.108.225.20/app/v1/index.html&title=用户服务协议"
            open-type="navigate"
            hover-class="none"
          >
            <view class="label">
              服务协议
            </view>
            <image
              src="~@/static/img/more.png"
              mode="scaleToFill"
              class="more"
            />
          </navigator>
        </view>
        <view class="white-box">
          <navigator
            style="width: 100%"
            class="u-flex u-row-between"
            url="/pages/webView/index?url=https://university.legym.cn/app/v1/privacy.html&title=隐私政策"
            open-type="navigate"
            hover-class="none"
          >
            <view class="label">
              隐私政策
            </view>
            <image
              src="~@/static/img/more.png"
              mode="scaleToFill"
              class="more"
            />
          </navigator>
        </view>
      </view>
      <view class="bottom-text">
        <view>Copyright © 四川乐健梦想家科技有限公司</view>
        <view>All Rights Reserved</view>
      </view>
    </view>
    <!-- 联系客服，拨打电话确定框 -->
    <u-action-sheet
      v-model="showActionSheet"
      :cancel-btn="true"
      :safe-area-inset-bottom="true"
      :list="[{ text: '呼叫 ' + telePhone, fontSize: '32', color: '#333' }]"
      @click="call"
    />

    <!-- 联系客服弹窗，不在服务时间内 -->
    <u-modal
      v-model="showWorkbench"
      title="不在服务时间"
      content="客服工作时间为：工作日10:00-19:00"
      confirm-text="我知道了"
      confirm-color="#FC6C37"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      showWorkbench: false,
      showActionSheet: false
    };
  },
  computed: {
    telePhone() {
      return this.$store.state.app.telePhone;
    },
    // #ifdef APP-PLUS
    appVersion() {
      return `V${plus.runtime.version}`;
    }
    // #endif
  },
  methods: {
    // 联系客服
    contactCustomer() {
      const hours = new Date().getHours();
      // 判断是否在服务时间内
      if (hours >= 10 && hours < 19) {
        this.showActionSheet = true;
      } else {
        this.showWorkbench = true;
      }
    },
    call() {
      // 拨打电话
      uni.makePhoneCall({
        phoneNumber: this.telePhone,
        fail: () => {
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none',
            mask: true
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.about-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(245, 246, 250, 1);
}
.navbar {
  margin-bottom: 60rpx;
}
.about-content {
  .logo-box {
    width: 174rpx;
    text-align: center;
    margin: 64rpx auto;
    font-size: 32rpx;
    .logo {
      width: 174rpx;
      height: 174rpx;
    }
    .name {
      margin: 32rpx 0 8rpx;
      color: rgba(34, 34, 34, 1);
    }
    .vesion {
      color: rgba(102, 102, 102, 1);
    }
  }
  .bottom-box {
    padding: 0 32rpx;
    background: rgba(255, 255, 255, 1);
  }
  .bottom-text {
    width: 556rpx;
    height: 68rpx;
    margin: 652rpx auto 0;
    font-size: 24rpx;
    color: rgba(162, 165, 170, 1);
    text-align: center;
    line-height: 34rpx;
  }
  .white-box {
    width: 100%;
    height: 98rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(34, 34, 34, 1);
    font-size: 32rpx;
    .label {
      font-weight: bold;
    }
    .more {
      width: 36rpx;
      height: 36rpx;
    }
  }
  .white-box:first-child {
    border-bottom: 2rpx solid rgba(240, 240, 240, 1);
  }
}
</style>
