<template>
  <view class="notice-container">
    <g-navbar back-icon-size="48" :border-bottom="false" class="navbar">
      <image
        class="navbar-img"
        src="~@/static/img/notice.svg"
        mode="aspectFit"
      />
    </g-navbar>
    <view class="notice-content">
      <mescroll-body
        ref="mescrollRef"
        :native="true"
        top="0"
        bottom="0"
        :up="upOption"
        :down="downOption"
        @init="mescrollInit"
        @down="downCallback"
        @up="upCallback"
      >
        <view
          v-for="(item, index) in dataList"
          :key="index"
          class="item"
          @click="onClickDetail(item.id, index)"
        >
          <view class="item-top">
            <view class="top-left">
              <view v-if="item.status && false" class="top-icon">
                置顶
              </view>
              <view class="date">
                {{ $u.timeFormat(item.publishTime, 'yyyy年mm月dd日') }}
                {{ getWeekItemHandle(item.publishTime) }}
              </view>
            </view>
            <view class="top-right">
              <image
                src="~@/static/img/more.png"
                mode="scaleToFill"
                class="more-img"
              />
            </view>
          </view>
          <view class="item-bottom">
            <view class="u-line-1 title">
              {{ item.title }}
            </view>
            <view class="readNumber">
              <image
                class="read-img"
                src="~@/static/img/read.png"
                mode="scaleToFill"
              />
              <text>阅读&nbsp;{{ item.readNumber }}</text>
            </view>
          </view>
        </view>
      </mescroll-body>
    </view>
  </view>
</template>

<script>
import { getMessageList } from '@/request/api/authorization';
import { getWeekItem } from '@/utils/common';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';

export default {
  mixins: [MescrollMixin],
  data() {
    return {
      page: 1,
      size: 10,
      dataList: [],
      downOption: {
        use: true,
        auto: false, //是否在初始化后,自动执行downCallback; 默认true
        offset: 48, //下拉大于60px,松手即可触发下拉刷新的回调
        textColor: '#999999',
        bgColor: 'rgba(245,246,250,1)'
      },
      upOption: {
        textColor: '#999999',
        bgColor: 'rgba(245,246,250,1)',
        use: true,
        auto: false,
        textNoMore: '—— 没有更多啦 ——',
        isBounce: true,
        offset: 48, //下拉大于60px,松手即可触发下拉刷新的回调
        page: {
          num: 0,
          size: 10,
          time: null
        },
        empty: {
          use: false
        }
      }
    };
  },
  mounted() {
    this.downCallback();
  },
  methods: {
    // 下拉刷新
    downCallback() {
      this.mescroll.resetUpScroll();
    },

    // 上拉加载
    upCallback(page) {
      this.page = page.num;
      this.getNoticeList();
    },
    onClickDetail(id, index) {
      // 当前新闻浏览次数加一
      const newListItem = JSON.parse(JSON.stringify(this.dataList[index]));
      newListItem.readNumber = Number(newListItem.readNumber + 1);
      const _this = this;
      uni.navigateTo({
        url: `/pages/noticeDetail/index?id=${id}`,
        success() {
          _this.dataList.splice(index, 1, newListItem);
        }
      });
    },
    getWeekItemHandle(time) {
      return getWeekItem(time);
    },
    getNoticeList() {
      getMessageList({
        page: this.page,
        size: this.size
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            if (this.page === 1) {
              this.dataList = res.data.items || [];
            } else {
              this.dataList = this.dataList.concat(res.data.items || []);
            }
            if (typeof this.mescroll.endSuccess === 'function') {
              this.mescroll.endSuccess(res.data.items.length || 0);
            }
          } else {
            if (typeof this.mescroll.endSuccess === 'function') {
              this.mescroll.endSuccess(0);
            }
          }
        })
        .catch(() => {
          if (typeof this.mescroll.endSuccess === 'function') {
            this.mescroll.endErr();
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.notice-container {
  box-sizing: border-box;
  padding-bottom: 182rpx;
  margin: 0;
  min-height: 100vh;
  background-color: rgba(245, 246, 250, 1);
}
.navbar {
  width: 100%;
  position: relative;
  .navbar-img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 140rpx;
    height: 68rpx;
  }
}

.notice-content {
  padding: 32rpx 32rpx 0rpx;
  .item {
    width: 100%;
    height: 218rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 16rpx;
    margin-bottom: 32rpx;
    .item-top {
      width: 100%;
      height: 76rpx;
      display: flex;
      justify-content: space-between;
      border-bottom: 1rpx solid rgba(240, 240, 240, 1);
      padding: 0rpx 32rpx 0rpx 40rpx;
      line-height: 76rpx;
    }
    .item-bottom {
      width: 100%;
      height: 140rpx;
      padding: 20rpx 36rpx 16rpx 40rpx;
    }
  }
}
.item-top {
  .top-left {
    display: flex;
    align-items: center;
    .top-icon {
      width: 80rpx;
      height: 36rpx;
      background: rgba(252, 108, 55, 0.2);
      border-radius: 4rpx;
      text-align: center;
      line-height: 36rpx;
      margin-right: 20rpx;
      color: rgba(252, 108, 55, 1);
    }
    .date {
      font-size: 24rpx;
      color: rgba(102, 102, 102, 1);
    }
  }
  .more-img {
    width: 28rpx;
    height: 28rpx;
  }
}
.item-bottom {
  .title {
    width: 100%;
    font-weight: bold;
    color: rgba(43, 45, 51, 1);
    font-size: 32rpx;
    margin-bottom: 24rpx;
  }
  .readNumber {
    display: flex;
    font-size: 24rpx;
    color: rgba(153, 153, 153, 1);
    .read-img {
      width: 36rpx;
      height: 36rpx;
      margin-right: 4rpx;
    }
  }
}
</style>
