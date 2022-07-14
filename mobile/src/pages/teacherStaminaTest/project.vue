<template>
  <view class="project-content safe-area-inset-bottom">
    <!-- navBar -->
    <g-navbar
      :background="{ backgroundColor: navBarBgColor }"
      :border-bottom="false"
      title="选择项目"
    />
    <!-- 课程信息 -->
    <view v-if="pageType === 'class'" class="curriculum-info">
      <view class="u-flex">
        <image
          class="curriculum-info-img"
          src="~@/static/img/book-icon.png"
          mode="scaleToFill"
        />
        <text class="curriculum-info-title">
          当前课程
        </text>
      </view>
      <view class="curriculum-info-name curriculum-info-row">
        {{ projectInfo.name || '' }}
      </view>
    </view>
    <!-- list -->
    <view v-for="(item, index) in listObj" :key="index" class="project-list">
      <view class="project-list-title">
        {{ item.title }}
      </view>
      <view class="project-list-container">
        <navigator
          v-for="projectItem in item.list"
          :key="projectItem.id"
          :url="
            '/pages/teacherStaminaTest/list?pageType=' +
              pageType +
              '&type=' +
              projectItem.type +
              '&projectSex=' +
              projectItem.projectSex +
              '&id=' +
              projectInfo.id
          "
          open-type="navigate"
          hover-class="none"
        >
          <view class="project-list-container-item u-flex u-row-center">
            <image
              class="project-list-container-item-img"
              :src="projectItem.img"
              mode="scaleToFill"
            />
            <text>{{ projectItem.title }}</text>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
import { listObj } from './stamina';
export default {
  name: 'TeacherStaminaTestProject',
  onLoad(params) {
    const { pageType, data } = params;
    this.pageType = pageType;
    if (pageType === 'class') {
      this.projectInfo = JSON.parse(data);
    }
  },
  data() {
    return {
      navBarBgColor: 'transparent',
      pageType: '', // 来源，班级体测，学校体测
      listObj: Object.freeze(listObj),
      projectInfo: {}
    };
  },
  methods: {
    setNavBarBgColor(top) {
      this.navBarBgColor = top <= 20 ? 'transparent' : '#fff';
    }
  },
  onPageScroll(e) {
    this.setNavBarBgColor(e.scrollTop);
  }
};
</script>

<style scoped lang="scss">
.project-content {
  box-sizing: border-box;
  padding: 24rpx 32rpx;
  .curriculum-info {
    &-img {
      width: 48rpx;
      height: 48rpx;
    }
    &-title {
      font-size: 36rpx;
      font-weight: bold;
      margin-left: 8rpx;
      color: $u-main-color;
    }
    &-row {
      margin-top: 24rpx;
    }
    &-name {
      font-size: 28rpx;
      color: $u-main-color;
    }
  }
  .project-list {
    width: 100%;
    min-height: 10px;
    margin-top: 28rpx;
    box-sizing: border-box;
    padding: 32rpx;
    background-color: #fff;
    border-radius: 20rpx;
    &-title {
      font-weight: bold;
      font-size: 36rpx;
      color: $u-main-color;
    }
    &-container {
      margin-top: 40rpx;
      display: grid;
      grid-template-columns: repeat(3, 180rpx);
      grid-row-gap: 48rpx;
      grid-column-gap: 50rpx;
      &-item {
        flex-direction: column;
        &-img {
          width: 96rpx;
          height: 96rpx;
        }
        text {
          margin-top: 8rpx;
          font-size: 28rpx;
          color: $u-main-color;
        }
      }
    }
  }
}
//  grid-template-columns: repeat(4, auto);
//       grid-row-gap: 24rpx;
//       grid-column-gap: 23rpx;
//       justify-items: center;
</style>
