<script>
import Vue from 'vue';
import store from '@/store';
import { routePermission } from '@/utils/common';
const hashToken = (data) => {
  return data && data.accessToken;
};
export default {
  onLaunch() {
    // #ifdef APP-PLUS || APP-PLUS-NVUE
    // 关闭真机app打开时候的启动图
    const platform = uni.getSystemInfoSync().platform;
    switch (platform) {
      case 'android':
        // 运行Android上
        plus.navigator.closeSplashscreen();
        break;
      case 'ios':
        // 运行iOS上
        plus.navigator.closeSplashscreen();
        break;
      default:
        break;
    }
    // 竖屏锁定
    plus.screen.lockOrientation('portrait-primary');
    // 监听原生App事件
    uni.onNativeEventReceive((event, data) => {
      if (event === 'refreshToken') {
        // 刷新token
        if (typeof data === 'string') {
          store.commit('app/REFRESH_TOKEN', JSON.parse(data));
        }
        if (typeof data === 'object') {
          store.commit('app/REFRESH_TOKEN', data);
        }
      }
      // 原生跳转申诉页面
      if (event === 'runningAppeal') {
        const params = typeof data === 'object' ? data : JSON.parse(data);
        const { id, appealId, plat, appealState, runningType } = params;
        // id 跑步id
        // appealId 申诉id
        // plat 平台  android： 1， ios：2
        // appealState，申诉状态
        // runningType
        if (!id) {
          uni.showToast({
            title: '跑步ID不存在',
            icon: 'none'
          });
          return;
        }
        uni.navigateTo({
          url: `/pages/runningResult/index?id=${id}&appealId=${appealId}&appealState=${appealState}&plat=${plat}&type=${runningType}&page=native`
        });
      }
    });
    // #endif
    uni.getSystemInfo({
      success(e) {
        // 设置状态栏高度,获取屏幕高度
        // #ifndef MP
        Vue.prototype.screenHeight = e.screenHeight;
        Vue.prototype.StatusBar = e.statusBarHeight;
        // #endif
      }
    });

    // 监听网络状态
    uni.onNetworkStatusChange((res) => {
      store.commit('app/SET_NETWORK', res.networkType);
    });
  },
  onShow() {
    // 路由鉴权 判断是否存在token，并且不在白名单路由页面中
    if (!hashToken(store.state.app.userInfo) && !routePermission()) {
      uni.reLaunch({ url: '/pages/login/index' });
    }
    // #ifdef APP-PLUS || APP-PLUS-NVUE
    // 强制设置UI模式为浅色，解决IOS暗黑模式下弹窗为白色的问题
    plus.nativeUI.setUIStyle('light');
    // #endif
  }
};
</script>

<style lang="scss">
/* #ifndef APP-PLUS-NVUE || APP-NVUE */
scroll-view ::-webkit-scrollbar {
  display: none;
  -webkit-appearance: none;
  background: transparent;
}
::-webkit-scrollbar {
  display: none;
}
page {
  background: #f5f6fa;
}
/* #endif */
</style>
