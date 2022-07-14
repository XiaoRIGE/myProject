<template>
  <view class="setting-page">
    <g-navbar
      class="navbar"
      title="设置"
      back-icon-size="48"
      :border-bottom="false"
    />
    <view class="setting-page__content">
      <view class="setting-page__content__group">
        <g-cell
          v-if="false"
          title="修改绑定手机"
          :value="desMobile"
          @click="onClickchangeBoundPhone"
        />
        <navigator
          url="/pages/accountSecurity/index"
          open-type="navigate"
          hover-class="none"
        >
          <g-cell title="账号安全" :divided="false" />
        </navigator>
      </view>
      <view class="setting-page__content__group">
        <g-cell title="关于我们" @click="onClickAboutUs" />
        <g-cell
          title="清除缓存"
          :value="appCacheSizeString"
          @click="clearCacheShowHandle"
        />
        <g-cell title="当前版本" :value="appVersion" :divided="false" />
      </view>
    </view>
    <view class="setting-page__exit-button" @tap="onClickExit">退出登录</view>
    <!-- 二次确认弹窗 -->
    <u-modal
      v-model="actionModalShow"
      :show-title="false"
      :content="text"
      confirm-text="确定"
      :show-cancel-button="true"
      confirm-color="#FC6C37"
      @confirm="onClickClearCache"
      @cancel="clearCacheShow = false"
    />
    <u-toast ref="uToast" />
    <g-versionModal
      v-if="show"
      :version-info="versionInfo"
      :show="show"
      :plat="plat"
      @versionShow="versionShowHandle"
    />
  </view>
</template>

<script>
import {
  getAppCacheSizeString,
  clearAppCache,
  getDesMobile,
  logOut,
  getUserInfo
} from '@/utils/common.js';
import { getLastVersion } from '@/request/api/authorization';

export default {
  data() {
    return {
      appCacheSizeString: '',
      actionModalShow: false,
      text: '',
      modalType: 0, //0:清除缓存 1:退出登录
      version: 0,
      show: false,
      versionInfo: null,
      plat: 0
    };
  },
  computed: {
    desMobile() {
      return getDesMobile();
    },
    schoolId() {
      return getUserInfo().schoolId;
    },
    // #ifdef APP-PLUS
    appVersion() {
      return `V${plus.runtime.version}`;
    }
    // #endif
  },
  created() {
    this.getAppCacheSize();
  },
  onReady() {
    this.getPlatform();
  },
  methods: {
    /**
     * @description 获取当前 APP 缓存大小。
     */
    async getAppCacheSize() {
      this.appCacheSizeString = await getAppCacheSizeString();
    },

    /**
     * @description 点击清除缓存
     */
    clearCacheShowHandle() {
      if (this.appCacheSizeString === '0B') {
        uni.showToast({
          title: '已清除缓存',
          icon: 'none'
        });
      } else {
        this.actionModalShow = true;
        this.text = '确定要清除缓存吗？';
        this.modalType = 0;
      }
    },

    /**
     * @description 点击弹窗确认。
     */
    async onClickClearCache() {
      if (this.modalType) {
        await logOut();
      } else {
        await clearAppCache();
        await this.getAppCacheSize();
      }
    },

    /**
     * @description 点击退出登录事件。
     */
    onClickExit() {
      this.actionModalShow = true;
      this.text = '确定退出登录？';
      this.modalType = 1;
    },

    /**
     * @description 点击修改绑定手机事件。
     */
    onClickchangeBoundPhone() {
      uni.navigateTo({
        url: '/pages/changeBoundPhone/index'
      });
    },

    /**
     * @description 点击关于我们事件。
     */
    onClickAboutUs() {
      uni.navigateTo({
        url: '/pages/about/index'
      });
    },

    // 获取客户端平台
    getPlatform() {
      uni.getSystemInfo({
        success: (res) => {
          if (res.platform === 'android') {
            this.plat = 1;
          } else if (res.platform === 'ios') {
            this.plat = 2;
          }
          this.getVersion();
        }
      });
    },
    // 获取最新版本号
    getVersion() {
      getLastVersion({
        platform: this.plat
      }).then((res) => {
        if (res.data) {
          // #ifdef APP-PLUS
          this.version = plus.runtime.versionCode; //当前版本号
          const newVersion = res.data.version; //最新版本号
          if (res.data.schoolId && res.data.schoolId !== 'ALL') {
            if (
              res.data.schoolId === this.schoolId &&
              newVersion > this.version
            ) {
              this.versionInfo = res.data;
              this.show = true;
            }
          } else if (res.data.schoolId && res.data.schoolId === 'ALL') {
            if (newVersion > this.version) {
              this.versionInfo = res.data;
              this.show = true;
            }
          }
          // #endif
        }
      });
    },
    // 隐藏弹窗
    versionShowHandle() {
      this.show = false;
    }
  }
};
</script>

<style lang="scss">
page {
  background: #f5f6fa;
}
</style>

<style lang="scss" scoped>
.setting-page {
  &__content {
    &__group {
      margin-top: 32rpx;
    }
  }
  &__exit-button {
    margin-top: 24rpx;
    width: 100%;
    background: white;
    padding: 32rpx 0;
    text-align: center;
    font-size: 32rpx;
    color: #222;
  }
}
</style>
