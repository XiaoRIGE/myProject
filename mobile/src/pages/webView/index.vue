<template>
  <view class="container">
    <g-navbar
      :border-bottom="false"
      back-icon-size="48"
      :title-bold="true"
      :title="title || '详情'"
    />
    <web-view :webview-styles="webviewStyles" :src="url" />
  </view>
</template>

<script>
import { handelLinkUrlQuery } from '@/utils/common';
export default {
  onLoad(options) {
    this.src = options.url;
    this.title = options.title;
  },
  onReady() {
    let wv;
    // #ifdef APP-PLUS
    const currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
    setTimeout(() => {
      wv = currentWebview.children()[0];
      wv.setStyle({ top: this.StatusBar + 44, bottom: 10 });
    }, 0); //如果是页面初始化调用时，需要延时一下
    // #endif
  },
  data() {
    return {
      title: '',
      src: '',
      webviewStyles: {
        top: 100,
        progress: {
          color: '#FC6C37'
        }
      }
    };
  },
  computed: {
    query() {
      return this.$store.state.webview.query || {};
    },
    url() {
      return `${this.src}${handelLinkUrlQuery(this.query)}`;
    }
  }
};
</script>
<style scoped>
.container {
  height: 100vh;
  background-color: #fff;
}
</style>
