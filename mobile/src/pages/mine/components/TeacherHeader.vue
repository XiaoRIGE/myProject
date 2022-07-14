<template>
  <view class="teacher-header">
    <g-navbar
      :is-back="false"
      :border-bottom="false"
      :background="{ backgroundColor: 'transparent' }"
    />
    <!-- 头像，编辑，二维码 -->
    <view class="teacher-header-head u-text-center">
      <image :src="userInfo.avatar || avatar" mode="aspectFit" />
      <view class="teacher-header-opt u-flex">
        <!-- 编辑个人信息 -->
        <navigator hover-class="none" url="/pages/personalInfo/index">
          <u-icon name="edit-pen" size="44" color="#38364D" />
        </navigator>
        <!-- 二维码 -->
        <navigator v-if="false" hover-class="none">
          <image src="~@/static/img/qr-code-icon.svg" mode="aspectFit" />
        </navigator>
      </view>
    </view>
    <view class="u-text-center teacher-header-name">
      {{ userInfo.realName }}
    </view>
    <view class="teacher-header-school u-flex u-row-center">
      <image src="~@/static/img/school-icon.svg" mode="aspectFit" />
      <text>{{ userInfo.organizationName }}</text>
    </view>
  </view>
</template>

<script>
import { getUserInfo, getUserDefaultAvatar, getRole } from '@/utils/common';
export default {
  name: 'TeacherHeader',
  computed: {
    userInfo() {
      return getUserInfo();
    },
    role() {
      return getRole(this.userInfo.identity);
    },
    avatar() {
      if (this.userInfo) {
        const { gender } = this.userInfo;
        return getUserDefaultAvatar(this.role, gender);
      }
      return undefined;
    }
  }
};
</script>

<style scoped lang="scss">
.teacher-header {
  width: 750rpx;
  height: 462rpx;
  background-image: url(~@/static/img/mine-teacher-header-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 462rpx;
  &-head {
    position: relative;
    & > image {
      width: 132rpx;
      height: 132rpx;
      border-radius: 50%;
    }
  }
  &-opt {
    position: absolute;
    top: 44rpx;
    right: 52rpx;
    image {
      width: 44rpx;
      height: 44rpx;
      margin-left: 32rpx;
    }
  }
  &-name {
    margin: 22rpx 0 12rpx;
    font-size: 40rpx;
    font-weight: 500;
    color: $u-main-color;
  }
  &-school {
    image {
      width: 36rpx;
      height: 36rpx;
    }
    text {
      font-size: 32rpx;
      margin-left: 8rpx;
      color: $u-main-color;
    }
  }
}
</style>
