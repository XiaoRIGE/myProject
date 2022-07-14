<template>
  <view class="student-header-container">
    <view class="student-header">
      <g-navbar
        :is-back="false"
        :border-bottom="false"
        height="26"
        :background="{ backgroundColor: 'transparent' }"
      />
      <view class="user-info-right">
        <!-- 编辑个人信息 -->
        <navigator url="/pages/personalInfo/index" hover-class="none">
          <u-icon name="edit-pen" size="44" color="#38364D" />
        </navigator>

        <!-- 二维码 -->
        <!-- <navigator hover-class="none" url="/pages/studentSignIn/qrCode"> -->
        <image
          src="~@/static/img/qr-code-icon.svg"
          mode="scaleToFill"
          @click="goPage"
        />
        <!-- </navigator> -->
      </view>
      <view class="user-info u-flex">
        <view class="user-info-left u-flex">
          <!-- 用户头像 -->
          <image
            class="user-info-left-head"
            :src="userInfo.avatar || avatar"
            mode="scaleToFill"
          />
          <view>
            <view class="user-info-name">
              {{ userInfo.realName }}
            </view>
            <view class="user-info-school-name">
              {{ userInfo.organizationName }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 健康档案 -->
    <view class="archives">
      <navigator
        :url="'/pages/studentStaminaTest/index?year=' + userInfo.year"
        hover-class="none"
      >
        <view class="archives-box u-flex u-row-between">
          <view class="archives-box-left u-flex">
            <image src="~@/static/img/archives-icon.svg" mode="aspectFit" />
            <view>
              <view class="archives-box-left-title">健康档案</view>
              <view class="archives-box-left-sub-title">
                大学全年级的体测数据
              </view>
            </view>
          </view>
          <view>
            <image
              class="right-back"
              src="~@/static/img/right-back.svg"
              mode="aspectFit"
            />
          </view>
          <!-- <u-icon size="36" color="#9EA7BA" name="arrow-right" /> -->
        </view>
      </navigator>
    </view>
  </view>
</template>

<script>
import { getUserInfo, getUserDefaultAvatar } from '@/utils/common';
import events from '@/nativeEvent';

export default {
  name: 'StudentHeader',
  computed: {
    userInfo() {
      return getUserInfo() || {};
    },
    avatar() {
      if (this.userInfo) {
        const { identity, gender } = this.userInfo;
        return getUserDefaultAvatar(identity, gender);
      }
      return undefined;
    }
  },
  methods: {
    goPage() {
      events.navigatorNativePage({
        page: 'QRcode'
      });
    }
  }
};
</script>
<style scoped lang="scss">
.student-header-container {
  .student-header {
    width: 100%;
    height: 450rpx;
    background-image: url(~@/static/img/mine-student-header-bg.png);
    background-repeat: no-repeat;
    background-size: 100% 450rpx;
    .user-info {
      width: 100%;
      box-sizing: border-box;
      padding: 0 52rpx;
      &-left {
        &-head {
          width: 132rpx;
          height: 132rpx;
          margin-right: 28rpx;
          border-radius: 50%;
        }
      }
      &-name {
        font-size: 40rpx;
        font-weight: 500;
        margin-bottom: 12rpx;
        color: $u-main-color;
      }
      &-school-name {
        font-size: 32rpx;
        color: $u-main-color;
      }
      &-right {
        display: flex;
        box-sizing: border-box;
        padding-right: 32rpx;
        justify-content: flex-end;
        image {
          width: 44rpx;
          height: 44rpx;
          margin-left: 30rpx;
        }
      }
    }
  }
  .archives {
    margin-top: -92rpx;
    box-sizing: border-box;
    padding: 0 32rpx;
    &-box {
      width: 100%;
      height: 136rpx;
      box-sizing: border-box;
      padding: 20rpx 48rpx;
      background-color: #fff;
      box-shadow: 0px 14rpx 30rpx 0 rgba(244, 193, 151, 0.3);
      border-radius: 24rpx;
      &-left {
        image {
          width: 96rpx;
          height: 96rpx;
          margin-right: 32rpx;
        }
        &-title {
          margin-bottom: 10rpx;
          font-size: 32rpx;
          font-weight: bold;
          color: #562d15;
        }
        &-sub-title {
          font-size: 24rpx;
          color: #5e3218;
        }
      }
      .right-back {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
}
</style>
