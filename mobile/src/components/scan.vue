<template>
  <view />
</template>

<script>
let barcode = null;
// import { decode } from 'js-base64';
import { qrCodeAuth } from '@/setting';
export default {
  name: 'Scan',
  props: {
    onSuccess: {
      type: Function,
      default: null
    },
    onError: {
      type: Function,
      default: null
    },
    duration: {
      type: Number,
      default: 900 // ms
    }
  },

  mounted() {
    this.init();
  },
  beforeDestroy() {
    plus.navigator.setFullscreen(false);
    barcode.close();
  },
  methods: {
    init() {
      // 在页面 onLoad中调用
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];

      plus.navigator.setFullscreen(true); //全屏
      const currentWebview = page.$getAppWebview();
      this.createBarcode(currentWebview); //创建二维码窗口
      this.createView(currentWebview); //创建操作按钮及tips界面
    },
    // 扫码成功回调
    onmarked(type, result) {
      // const data = this.isJSON(decode(result));
      const data = this.isJSON(result);

      if (!data || data.qrCodeAuth !== qrCodeAuth) {
        uni.showToast({
          title: '无效二维码',
          icon: 'none',
          mask: true
        });
        this.start();
        return;
      }
      if (typeof this.onSuccess === 'function') {
        this.onSuccess({ type, data });
      } else {
        uni.$emit('scan-success', { type, data });
        uni.navigateBack();
        plus.navigator.setFullscreen(false);
        const results = `${result.match(/WXXH.*/gi)}`;
        this.powerBankStorage(results);
        barcode.close();
      }
    },
    // 创建二维码窗口
    createBarcode(currentWebview) {
      barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        scanbarColor: '#1DA7FF',
        position: 'static',
        frameColor: '#1DA7FF'
      });
      barcode.onmarked = this.onmarked;
      barcode.onerror = (e) => {
        if (typeof onError === 'function') {
          this.onError(e);
        } else {
          uni.$emit('scan-fail', e);
          uni.showToast({
            title: '扫描失败',
            icon: 'none',
            mask: false
          });
          this.start();
        }
      };
      // barcode.setFlash(true); 默认不打开
      currentWebview.append(barcode);
      barcode.start();
    },
    // 创建操作按钮及tips
    createView(currentWebview) {
      // 顶部指引
      const guide = new plus.nativeObj.View('guide', {
        top: '12%',
        left: '20%',
        height: '150px',
        width: '218px'
      });
      // 创建返回原生按钮
      const backVew = new plus.nativeObj.View(
        'backVew',
        {
          top: `${this.StatusBar}px`,
          left: '16px',
          height: '40px',
          align: 'center',
          width: '100%'
        },
        [
          {
            tag: 'img',
            id: 'backBar',
            src: require('@/static/img/back-white.png'),
            position: {
              top: '11px',
              left: '0px',
              width: '24px',
              height: '24px'
            }
          },
          {
            tag: 'font',
            id: 'backBar-font',
            text: '扫一扫',
            position: {
              top: '11px',
              align: 'center',
              width: '100%',
              height: '35px'
            },
            textStyles: {
              size: '20px',
              color: '#ffffff'
            }
          }
        ]
      );
      const scanBarVew = new plus.nativeObj.View(
        'scanBarVew',
        {
          top: '70%',
          left: '0%',
          height: '10%',
          width: '100%'
        },
        [
          {
            tag: 'font',
            id: 'font',
            text: '将二维码放入扫描框内，即自动扫描',
            textStyles: {
              size: '14px',
              color: '#ffffff'
            },
            position: {
              width: '100%',
              left: '0%'
            }
          }
        ]
      );
      backVew.interceptTouchEvent(true);
      scanBarVew.interceptTouchEvent(true);
      currentWebview.append(guide); // 顶部指引
      currentWebview.append(scanBarVew);
      currentWebview.append(backVew);
      backVew.addEventListener(
        'click',
        () => {
          //返回按钮
          uni.navigateBack({
            delta: 1
          });
          barcode.close();
          plus.navigator.setFullscreen(false);
        },
        false
      );
    },
    // 重新打开扫描二维码
    start(duration) {
      if (barcode === null) return;
      setTimeout(() => {
        barcode.start();
      }, duration || this.duration);
    },
    // 手动关闭
    close() {
      barcode.close();
      plus.navigator.setFullscreen(false);
    },
    // 验证扫描内容是否可被解析
    isJSON(str) {
      if (typeof str === 'string') {
        try {
          const obj = JSON.parse(str);
          return typeof obj === 'object' ? obj : false;
        } catch (e) {
          return false;
        }
      } else {
        return str;
      }
    }
  }
};
</script>

<style></style>
