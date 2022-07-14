import events from '@/nativeEvent';
// 用户在uin界面点击2次返回则退出App，需要通知原生销毁App，否则会出现白屏
export default {
  data() {
    return {
      backButtonPress: 0
    };
  },
  onBackPress() {
    this.backButtonPress++;
    if (this.backButtonPress > 1) {
      events.quitApp();
      plus.runtime.quit();
    }
    return true;
  }
};
