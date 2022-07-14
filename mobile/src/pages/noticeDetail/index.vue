<template>
  <view class="detail-container">
    <g-navbar
      back-icon-size="48"
      title=""
      :border-bottom="false"
      class="navbar"
    />
    <view class="detail-content">
      <text class="detail-title">
        {{ title }}
      </text>
      <view class="detail-hint">
        <text class="date">
          <text class="date">
            {{ $u.timeFormat(publishTime, 'yyyy-mm-dd hh:MM') }}
          </text>
        </text>
        <text class="read-number">阅读&nbsp;{{ readNumber }}</text>
      </view>
      <view class="u-content">
        <!-- 图片 -->
        <view v-if="images.length > 0" class="imgs">
          <image
            v-for="(src, index) in images"
            :key="index"
            class="img"
            :src="src"
            mode="widthFix"
          />
        </view>
        <view class="text">
          <u-parse
            :use-anchor="true"
            :html="article"
            :selectable="true"
            @linkpress="link"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getMessageDetail } from '@/request/api/authorization';
export default {
  data() {
    return {
      id: '',
      title: '',
      publishTime: '',
      readNumber: 0,
      article: '',
      images: []
    };
  },
  onLoad(e) {
    this.id = e.id;
    this.getMessageDetailhandle();
  },
  methods: {
    link(e) {
      if (e.href) {
        uni.navigateTo({
          url: `/pages/webView/index?url=${encodeURIComponent(e.href)}&title=${
            this.title
          }`
        });
      }
    },
    getMessageDetailhandle() {
      getMessageDetail({
        id: this.id
      }).then((res) => {
        if (res.code === 0 && res.data) {
          const { title, publishTime, readNumber, article, urls } = res.data;
          this.title = title;
          this.publishTime = publishTime;
          this.readNumber = readNumber;
          this.article = article;
          this.images = urls || [];
        }
      });
    }
  }
};
</script>

<style lang="scss">
.detail-container {
  box-sizing: border-box;
  padding-bottom: 182rpx;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
}
.navbar {
  margin-bottom: 42rpx;
}
.detail-content {
  padding: 0 32rpx;
  .detail-title {
    font-size: 36rpx;
    font-weight: 500;
  }
  .imgs {
    margin-top: 48rpx;
    .img {
      width: 100%;
      margin-top: 20rpx;
    }
  }
  .text {
    margin-top: 48rpx;
  }
  .detail-hint {
    margin-top: 32rpx;
    color: rgba(153, 153, 153, 1);
    font-size: 24rpx;
    .read-number {
      margin-left: 40rpx;
    }
  }
}
</style>
