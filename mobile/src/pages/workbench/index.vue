<template>
  <view class="workbench-container">
    <view class="header-content">
      <!-- 背景图片 用image组件模拟，防止图片过大不能加载-->
      <image class="bg-img" :src="background.bgImg" />
      <!-- 内容 -->
      <g-navbar
        :is-back="false"
        :border-bottom="false"
        :height="55"
        class="header-content-nav"
        :background="{ backgroundColor: background.background }"
      >
        <view class="slot-wrap title">
          第{{ currentWeekIndex }}周 | {{ greeting }}，{{
            userInfo && userInfo.realName
          }}
        </view>
      </g-navbar>
    </view>
    <!-- Banner -->
    <view class="banner-nav">
      <g-skeleton :loading="loadingImg" :skeleton="['card{h:220rpx,MB:0}']">
        <u-swiper
          height="220"
          :interval="3000"
          :border-radius="20"
          indicator-pos="bottomRight"
          :list="bannerList"
          @click="handelSwiperClick"
        />
      </g-skeleton>
    </view>
    <!-- 通知导航栏 -->
    <g-noticeNav v-show="noticeList.length > 0" :notice-list="noticeList" />
    <!-- 菜单 -->
    <view class="menu">
      <template v-for="(item, index) in menu">
        <view :key="index" class="sub-menu-item">
          <view class="menu-title">
            {{ item.title }}
          </view>
          <template v-for="(items, idx) in item.children">
            <view
              :key="idx"
              class="menu-item u-flex"
              @click="clickMenuHandle(items)"
            >
              <view class="u-flex u-flex-1">
                <image :src="items.icon" mode="scaleToFill" class="menu-img" />
                <view>{{ items.title }}</view>
              </view>
              <image
                src="~@/static/img/more.png"
                mode="scaleToFill"
                class="more-img"
              />
            </view>
          </template>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from '@/utils/common';
import { getCurrentWeek, getGreeting } from './common';
import {
  getImage,
  getMessage,
  getBannerList
} from '@/request/api/authorization';
const menu = [
  {
    title: '课程',
    children: [
      {
        icon: './../../static/img/workbench/course-attainability.png',
        title: '课程考勤',
        path: '/pages/chooseClass/index?flag=0'
      },
      {
        icon: './../../static/img/workbench/class-test.png',
        title: '班级体测',
        path: '/pages/chooseClass/index?flag=1'
      },
      {
        icon: './../../static/img/workbench/special-subject.png',
        title: '专项考试',
        path: '/pages/chooseClass/index?flag=2'
      },
      {
        icon: './../../static/img/workbench/score.png',
        title: '班级成绩',
        path: '/pages/chooseClass/index?flag=3'
      },
      {
        icon: './../../static/img/workbench/running.png',
        title: '跑步情况',
        path: '/pages/chooseClass/index?flag=4'
      },
      {
        icon: './../../static/img/workbench/activity.png',
        title: '课外活动',
        path: '/pages/chooseClass/index?flag=5'
      }
    ]
  },
  {
    title: '其他',
    children: [
      {
        icon: './../../static/img/workbench/active-attainability.png',
        title: '活动考勤',
        path: '/pages/activityAttendanceList/index'
      },
      {
        icon: './../../static/img/workbench/school-test.png',
        title: '全校体测',
        path: '/pages/teacherStaminaTest/project?pageType=school'
      }
    ]
  }
];

export default {
  name: 'Workbench',
  data() {
    return {
      loadingImg: true,
      prevTime: new Date().getTime(),
      background: {
        background: 'transparen',
        bgImg: './../../static/img/workbench/workbenchBg.png'
      },
      bannerList: [],
      noticeList: [],
      menu
    };
  },
  computed: {
    userInfo() {
      return getUserInfo();
    },
    greeting() {
      return getGreeting();
    },
    currentWeekIndex() {
      return getCurrentWeek();
    }
  },
  mounted() {
    this.getBackgroundImage();
    this.getBannerList();
    this.getMessage();
    // 监听页面滚动
    uni.$on('onHomePageScroll', data => {
      this.onScroll(data);
    });
  },
  methods: {
    onTabChange() {
      const currentTime = new Date().getTime();
      if (currentTime - this.prevTime > 1000) {
        this.getBackgroundImage();
        this.getBannerList();
        this.getMessage();
      }
    },
    goToChooseClass() {
      uni.navigateTo({ url: '/pages/chooseClass/index' });
    },
    // 轮播图点击事件
    handelSwiperClick(index) {
      const bannerItem = this.bannerList[index];
      const { id, tag, linkUrl, linkType, title } = bannerItem;
      if (linkType !== 1) {
        // 内部链接
        uni.navigateTo({
          url: `/pages/bannerDetail/index?id=${id}`
        });
      }
      if (linkType === 1) {
        // 外部链接，判断是否存在内容，存在跳转详情，否则跳转链接
        if (tag) {
          uni.navigateTo({
            url: `/pages/bannerDetail/index?id=${id}`
          });
        } else {
          // 跳转外部链接
          if (linkUrl && linkUrl.length > 5) {
            const linkArr = linkUrl.split('?');
            const url = linkArr[0];
            const query = {};
            if (linkArr[1]) {
              const linkArrItem = linkArr[1].split('&');
              for (let i = 0; i < linkArrItem.length; i++) {
                if (linkArrItem[i]) {
                  const queryItem = linkArrItem[i].split('=');
                  query[queryItem[0]] = queryItem[1];
                }
              }
            }
            this.$store.commit('webview/SET_LINK_QUERY', query);
            uni.navigateTo({
              url: `/pages/webView/index?url=${encodeURIComponent(
                url
              )}&title=${encodeURIComponent(title)}`
            });
          }
        }
      }
    },
    // 点击菜单回调
    clickMenuHandle(items) {
      uni.navigateTo({
        url: items.path
      });
    },
    // 获取背景图
    async getBackgroundImage() {
      const res = await getImage({ status: '1' });
      if (res.code === 0 && res.data) {
        this.background.bgImg = (res.data[0] || {}).url;
        this.prevTime = new Date().getTime();
      }
    },
    // 获取banner轮播
    async getBannerList() {
      const res = await getBannerList();
      if (res.code === 0 && res.data) {
        if (res.data && res.data.length) {
          this.bannerList = res.data.map(item => {
            return {
              ...item,
              image: item.url
            };
          });
        }
        this.loadingImg = false;
        this.prevTime = new Date().getTime();
      }
    },
    // 获取通知消息，滚动列表
    async getMessage() {
      const res = await getMessage();
      if (res.code === 0 && res.data) {
        this.noticeList = res.data;
        this.prevTime = new Date().getTime();
      }
    },
    onScroll(e) {
      this.$u.throttle(this.setNavBar(e.scrollTop), 60);
    },
    setNavBar(top) {
      this.background.background = `rgba(255,255,255,${
        top > 10 ? top / 70 : 0
      })`;
    }
  }
};
</script>

<style lang="scss" scoped>
.workbench-container {
  box-sizing: border-box;
  padding: 0 0 150rpx 0;
  min-height: 100vh;
  background-color: #f5f6fa;
  .header-content {
    position: relative;
    width: 750rpx;
    height: 240px;
    .bg-img {
      width: 100%;
    }
    &-nav {
      &::v-deep .u-navbar {
        box-sizing: border-box;
        padding-top: 11px;
      }
      .title {
        box-sizing: border-box;
        padding: 0 32rpx;
        font-size: 44rpx;
        color: $u-main-color;
        font-weight: bold;
      }
    }
  }
  .banner-nav {
    width: 686rpx;
    position: relative;
    left: 32rpx;
    margin-top: -178rpx;
  }
  .menu {
    padding: 0 32rpx;
    .sub-menu-item {
      width: 686rpx;
      // height: 328rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 20rpx;
      padding: 32rpx 32rpx 0;
      margin-bottom: 32rpx;
      .menu-title {
        font-size: 40rpx;
        font-weight: bold;
        line-height: 28rpx;
        margin-bottom: 34rpx;
      }
      .menu-item {
        align-items: center;
        justify-content: space-between;
        height: 108rpx;
        border-radius: 2rpx;
        padding: 26rpx 0;
        font-size: 32rpx;
        font-weight: bold;
        .menu-img {
          width: 56rpx;
          height: 56rpx;
          margin-right: 16rpx;
        }
        .more-img {
          width: 28rpx;
          height: 28rpx;
        }
      }
    }
  }
}
</style>
