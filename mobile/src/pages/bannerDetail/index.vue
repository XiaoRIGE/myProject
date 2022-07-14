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
        {{ detail.title }}
      </text>
      <view class="detail-hint">
        <text class="date">
          {{ $u.timeFormat(detail.createdDate, 'yyyy-mm-dd hh:MM') }}
        </text>
        <text class="read-number">
          阅读&nbsp;{{ detail.readNumber }}
        </text>
      </view>
      <view class="image-list">
        <image
          v-if="bannerImg"
          class="img"
          :src="bannerImg"
          mode="widthFix"
          @click="previewImg(bannerImg)"
        />
        <view
          v-if="detail.linkType === 1 && detail.linkUrl"
          class="link-content u-flex u-row-between"
          @click="linkCilck"
        >
          <image class="icon" src="~@/static/img/link.svg" mode="scaleToFill" />
          <view class="link-url">
            {{ linkUrl }}
          </view>
          <image
            class="arrow"
            src="~@/static/img/cell/right-arrow.svg"
            mode="scaleToFill"
          />
        </view>
        <image
          v-for="item in bannerList"
          :key="item"
          class="img"
          :src="item"
          mode="widthFix"
          @click="previewImg(item)"
        />
      </view>
      <view class="u-content">
        <u-parse
          :use-anchor="true"
          :html="detail.article"
          :selectable="true"
          @linkpress="navigate"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { getBannerDetail } from '@/request/api/authorization';
export default {
  data() {
    return {
      bannerImg: '',
      bannerList: [],
      query: {},
      detail: {},
      id: ''
    };
  },
  onLoad(e) {
    this.id = e.id;
    this.getBannerDetail();
  },
  computed: {
    linkUrl() {
      const url = this.detail.linkUrl;
      if (url) {
        return url.split('?')[0];
      }
      return '';
    }
  },
  methods: {
    navigate(e) {
      if (e.href) {
        uni.navigateTo({
          url: `/pages/webView/index?url=${encodeURIComponent(e.href)}`
        });
      }
    },
    async getBannerDetail() {
      const res = await getBannerDetail({ id: this.id });
      if (res.code === 0 && res.data) {
        this.detail = res.data;
        if (res.data.urls && res.data.urls.length > 0) {
          this.bannerImg = res.data.urls[0];
          if (res.data.urls.length > 1) {
            this.bannerList = res.data.urls.slice(1);
          }
        }
      }
    },
    linkCilck() {
      // 跳转外部链接
      const link = this.detail.linkUrl;
      if (link && link.length > 5) {
        const linkArr = link.split('?');
        const url = linkArr[0];
        const query = {};
        if (linkArr[1]) {
          const linkArrItem = linkArr[1].split('&');
          if (linkArrItem && Array.isArray(linkArrItem)) {
            for (let i = 0; i < linkArrItem.length; i++) {
              if (linkArrItem[i]) {
                const queryItem = linkArrItem[i].split('=');
                query[queryItem[0]] = queryItem[1];
              }
            }
          }
        }
        this.$store.commit('webview/SET_LINK_QUERY', query);
        uni.navigateTo({
          url: `/pages/webView/index?url=${encodeURIComponent(url)}&title=${
            this.detail.title
          }`
        });
      }
    },
    // 图片预览
    previewImg(img) {
      const urls = [img];
      uni.previewImage({
        current: 0,
        urls
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

.detail-content {
  padding: 32rpx 32rpx 0;
  .detail-title {
    font-size: 36rpx;
    font-weight: 500;
  }
  .detail-hint {
    margin-top: 32rpx;
    margin-bottom: 28rpx;
    color: rgba(153, 153, 153, 1);
    font-size: 24rpx;
    .read-number {
      margin-left: 40rpx;
    }
  }
  .u-content {
    margin-top: 30rpx;
  }
  .image-list {
    .img {
      width: 100%;
      margin-top: 20rpx;
    }
    .link-content {
      height: 104rpx;
      margin: 22rpx 0 38rpx;
      box-sizing: border-box;
      padding: 28rpx;
      background-color: #f7f7f7;
      border-radius: 8rpx;
      color: #576b95;
      .icon,
      .arrow {
        width: 48rpx;
        height: 48rpx;
      }
      .link-url {
        width: 534rpx;
        font-size: 24rpx;
        box-sizing: border-box;
        padding: 0 20rpx;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
      }
    }
  }
}
</style>
