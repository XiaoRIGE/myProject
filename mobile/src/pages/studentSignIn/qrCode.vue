<template>
  <view class="qr-code-container">
    <g-navbar
      :background="background"
      :border-bottom="false"
      back-icon-color="#fff"
      back-icon-size="48"
      back-icon="white"
      title-color="#fff"
      title="我的二维码"
    />
    <!-- 二维码展示图 -->
    <view class="content-box u-relative">
      <image
        class="card-bg"
        src="~@/static/img/work-card-bg.png"
        mode="scaleToFill"
      />
      <view class="qr-code-content u-absolute">
        <!-- 当前时间 -->
        <view class="date u-text-center">
          {{ currentDate }}
        </view>
        <!-- 头像 -->
        <view class="avatar u-text-center">
          <u-avatar size="108" :src="userInfo.avatar || avatar" />
        </view>

        <!-- 姓名 -->
        <view class="name u-text-center">
          {{ userInfo.nickName || userInfo.realName }}
        </view>
        <!-- 学号 -->
        <view class="code u-text-center">
          {{ userInfo.organizationUserNumber }}
        </view>
        <!-- 二维码 -->
        <view class="qrcode-container u-text-center">
          <tki-qrcode
            ref="qrcode"
            :cid="cid"
            :val="qrcodeValue"
            :size="size"
            :unit="unit"
            :background="qrBackground"
            :foreground="foreground"
            :pdground="pdground"
            :icon="icon"
            :icon-size="iconsize"
            :onval="true"
            :load-make="true"
            :using-components="true"
            :show-loading="true"
            loading-text="加载中..."
            @result="result"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import tkiQrcode from 'tki-qrcode';
import { encode } from 'js-base64';
import { getUserInfo, getUserDefaultAvatar } from '@/utils/common';
import { qrCodeAuth } from '@/setting.js';
let timter = null;
export default {
  name: 'QrCode',
  components: {
    'tki-qrcode': tkiQrcode
  },
  data() {
    return {
      currentDate: this.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
      cid: '1234567',
      val: {
        userId: getUserInfo().id,
        auth: qrCodeAuth,
        // realName: getUserInfo().realName,
        schoolId: getUserInfo().schoolId
      },
      size: 400,
      unit: 'upx',
      qrBackground: '#fff',
      foreground: '#000',
      pdground: '#000',
      icon: '',
      iconsize: 40,
      background: {
        backgroundColor: 'transparent'
      }
    };
  },
  computed: {
    userInfo() {
      return getUserInfo();
    },
    qrcodeValue() {
      return encode(JSON.stringify(this.val));
    },
    avatar() {
      if (this.userInfo) {
        const { identity, gender } = this.userInfo;
        return getUserDefaultAvatar(identity, gender);
      }
      return undefined;
    }
  },
  created() {
    this.timer();
  },
  beforeDestroy() {
    clearInterval(timter);
    timter = null;
  },
  methods: {
    result() {},
    timer() {
      timter = setInterval(() => {
        this.currentDate = this.$u.timeFormat(
          new Date(),
          'yyyy-mm-dd hh:MM:ss'
        );
      }, 300);
    }
  }
};
</script>

<style scoped lang="scss">
.qr-code-container {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-color: #ff8640;
  .content-box {
    width: 686rpx;
    height: 1060rpx;
    margin: 120rpx 32rpx 0 32rpx;
    border-radius: 32rpx;
    .card-bg {
      width: 686rpx;
      height: 1120rpx;
    }
    .qr-code-content {
      top: 176rpx;
      margin: 0 40rpx 0;
      box-sizing: border-box;
      padding: 56rpx 0 0;
      width: 606rpx;
      height: 900rpx;
      background-color: #fff;
      border-radius: 24rpx;
      box-shadow: -6rpx 4rpx 36rpx 8rpx rgba(85, 81, 112, 0.04);
      .date {
        font-size: 36rpx;
        font-weight: 500;
        line-height: 50rpx;
        color: #3c55cb;
      }
      .avatar {
        margin: 52rpx 0 24rpx;
      }
      .name {
        font-size: 40rpx;
        color: $u-main-color;
        font-weight: 500;
      }
      .code {
        font-size: 28rpx;
        font-weight: 400;
        box-sizing: border-box;
        padding: 12rpx 0;
        color: $u-content-color;
      }
      .qrcode-container {
        box-sizing: border-box;
        padding-top: 30rpx;
      }
    }
  }
}
</style>
