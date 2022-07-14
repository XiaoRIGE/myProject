<template>
  <view class="project-list safe-area-inset-bottom">
    <g-navbar
      :background="{ backgroundColor: '#fff' }"
      :border-bottom="false"
      back-icon-color="#222"
      back-icon-size="48"
      :title="title"
    >
      <template #right>
        <view class="nav-right" @click="scan">
          <u-icon name="scan" size="48" color="#38364DFF" />
        </view>
      </template>
    </g-navbar>
    <!-- 查询 -->
    <view class="sticky-content" :style="{ height: height + 'rpx' }">
      <view class="search-content">
        <u-search
          v-model="filterQuery.organizationUserNumber"
          :height="60"
          disabled
          action-text="取消"
          :clearabled="true"
          shape="shape"
          placeholder="搜索学生学号"
          @click="focus"
          @custom="close"
        />
      </view>
      <!--  -->
      <template v-if="pageType === 'class'">
        <!-- 筛选 -->
        <screen :type="screenType" @change="changeFilter" />
        <!-- 列表表头 -->
        <list-title :list-type="listType" :num="renderlist.length" />
      </template>
    </view>
    <view class="sticky-w" :style="{ height: height + 'rpx' }" />
    <!-- 列表内容 -->
    <mescroll-body
      v-show="renderlist.length > 0"
      ref="mescrollRef"
      :native="true"
      :safearea="true"
      top="0"
      bottom="0"
      :height="scorllHeight + 'rpx'"
      :up="{ use: false }"
      :down="downOption"
      @down="downCallback"
    >
      <list-item
        v-for="(item, index) in renderlist"
        :key="index"
        :list-type="listType"
        :user-info="item"
        :project-type="projectType"
        class="attendance-sheet-list"
        @click="goDetail"
      />
      <u-divider :margin-top="20" :margin-bottom="60">
        没有更多了
      </u-divider>
      <!-- <view>~~ 没有更多了 ~~</view> -->
    </mescroll-body>
    <view v-show="renderlist.length === 0" class="no-content">
      <image
        class="img"
        src="~@/static/img/empty-student.png"
        mode="scaleToFill"
      />
      <view class="tps">
        未找到相关学生
      </view>
    </view>
    <!-- 键盘 -->
    <u-keyboard
      ref="uKeyboard"
      v-model="showKeyboard"
      :show-tips="false"
      safe-area-inset-bottom
      z-index="1"
      mode="number"
      :cancel-btn="false"
      :tooltip="false"
      @change="keyChange"
      @backspace="backspace"
    >
      <view class="keyboard-btns u-flex">
        <view class="left" @click="cancelInput">
          取消
        </view>
        <view class="right" @click="search">
          确定
        </view>
      </view>
    </u-keyboard>
  </view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { getTitle, projectItemType } from './stamina';
import Screen from './components/Screen';
import ListTitle from './components/ListTitle';
import ListItem from './components/ListItem';
import { test } from '@/request/api/teacher';
import { toRpx } from '@/utils/common';
export default {
  name: 'TeacherStaminaTestList',
  components: {
    screen: Screen,
    'list-title': ListTitle,
    'list-item': ListItem
  },
  mixins: [MescrollMixin],
  onLoad(params) {
    this.initParams(params);
  },
  onShow() {
    if (this.refresh && this.pageType === 'class') {
      this.getClassList();
    }
  },
  data() {
    return {
      showKeyboard: false,
      refresh: false,
      pageType: '', // class:班级体测，school: 全校体测
      projectSex: '', // 项目性别
      projectType: '', // 项目类型
      courseId: '',
      list: [], // 学生列表
      filterQuery: {
        sex: 0,
        test: -1,
        organizationUserNumber: '' // 学号搜索
      },
      renderlist: [], // 需要渲染的列表
      downOption: {
        auto: false, //是否在初始化后,自动执行downCallback; 默认true
        bgColor: '#F5F6FA',
        textColor: '#999'
      }
    };
  },
  computed: {
    // 用于判断项目类型是否存在性别
    listType() {
      // 目前用于判断是否是视力项目
      if (this.projectType === 't6') return 'vision';
      return '';
    },
    screenType() {
      // 通用无性别
      if (this.projectSex === '0') return 'currency';
      // 男生或者女生，有性别
      if (this.projectSex === '1' || this.projectSex === '2') return 'sex';
      else return '';
    },
    showClose() {
      return (
        this.filterQuery.organizationUserNumber &&
        this.filterQuery.organizationUserNumber.toString().length > 0
      );
    },
    height() {
      if (this.pageType === 'class' && this.showKeyboard) return 157;
      if (this.pageType === 'school') return 70;
      else return 245;
    },
    title() {
      return getTitle(this.projectType);
    },
    scorllHeight() {
      return toRpx(this.StatusBar + 44) + this.height;
    }
  },
  methods: {
    // 获取班级体测列表
    async getClassList() {
      const res = await test.classList({
        courseId: this.courseId,
        organizationUserNumber: '',
        type: projectItemType[this.projectType],
        gender: this.projectSex === '0' ? '' : this.projectSex
      });
      if (res.code === 0 && res.data) {
        this.list = res.data;
        this.filterRenderList(this.list);
      }
      this.refresh = false;
      this.mescroll.endSuccess();
    },
    //  获取学校体测列表
    async getSchoolList() {
      if (this.filterQuery.organizationUserNumber === '') {
        this.renderlist = [];
        this.list = [];
        return;
      }
      const res = await test.schoolList({
        organizationUserNumber: this.filterQuery.organizationUserNumber,
        type: projectItemType[this.projectType],
        gender: this.projectSex === '0' ? '' : this.projectSex
      });
      if (res.code === 0 && res.data) {
        this.renderlist = res.data;
        this.list = res.data;
      }
      this.refresh = false;
    },
    // 获取列表
    getList() {
      if (this.pageType === 'school') {
        this.getSchoolList();
      } else if (this.pageType === 'class') {
        this.getClassList();
      }
    },
    // 筛选处理
    filterRenderList(list) {
      if (this.pageType === 'school') {
        this.getSchoolList();
      } else if (this.pageType === 'class') {
        const { test, sex, organizationUserNumber } = this.filterQuery;
        this.renderlist = list
          .filter(item => {
            // 视力筛选，不存在level
            if (this.projectType === 't6') {
              if (test === 0) {
                // 筛选未测试
                return !item.leftEyeVision && !item.rightEyeVision;
              } else if (test === 1) {
                // 已测试
                return item.leftEyeVision || item.rightEyeVision;
              } else {
                return item;
              }
            } else {
              if (test === 0) {
                // 未测
                return item.level === 0 || item.level === null;
              } else if (test === 1) {
                // 已测试
                return item.level > 0;
              } else {
                // 全部
                return item;
              }
            }
          })
          .filter(item => {
            if (sex === 0) return item;
            return item.gender === sex;
          })
          .filter(item => {
            if (organizationUserNumber)
              return item.organizationUserNumber.includes(
                organizationUserNumber
              );
            return item;
          });
      }
    },
    // 筛选
    changeFilter(filter) {
      const { test, sex } = filter;
      this.filterQuery.test = test;
      this.filterQuery.sex = sex;
      this.filterRenderList(this.list);
    },
    // 初始化页面参数
    initParams(options) {
      const { pageType, type, projectSex, id } = options;
      this.pageType = pageType || 'class';
      this.projectSex = projectSex || '0';
      this.courseId = id;
      if (this.pageType === 'school') this.showKeyboard = true;
      // 项目类型
      this.projectType = type;

      // 班级体测列表请求
      if (pageType === 'class') this.getList();
    },
    // 扫一扫
    scan() {
      this.$store.commit('teacherTest/SET_STUDENT_LIST', this.list);
      uni.navigateTo({
        url: `/pages/teacherStaminaTest/scan?pageType=${this.pageType}&projectType=${this.projectType}`
      });
    },
    // 下拉刷新
    downCallback() {
      this.getList();
    },

    // 去学生详情页面
    goDetail(data) {
      uni.navigateTo({
        url: `/pages/teacherStaminaTest/detail?type=${this.projectType}&id=${data.id}`
      });
      this.$store.commit('teacherTest/SET_STUDENT_LIST', this.list);
    },
    focus() {
      this.showKeyboard = true;
    },
    search() {
      this.showKeyboard = false;
      this.filterRenderList(this.list);
    },
    close() {
      this.filterQuery.organizationUserNumber = '';
      this.showKeyboard = false;
      this.filterRenderList(this.list);
    },
    keyChange(value) {
      if (!value && value !== 0) return;
      this.filterQuery.organizationUserNumber += value.toString();
    },
    backspace() {
      if (this.filterQuery.organizationUserNumber.length === 0) return;
      this.filterQuery.organizationUserNumber =
        this.filterQuery.organizationUserNumber.slice(
          0,
          this.filterQuery.organizationUserNumber.length - 1
        );
    },
    cancelInput() {
      this.filterQuery.organizationUserNumber = '';
    }
  }
};
</script>

<style scoped lang="scss">
.project-list {
  background-color: #fff;
  min-height: 100vh;
  .nav-right {
    box-sizing: border-box;
    padding-right: 32rpx;
  }
  .sticky-content {
    height: 176rpx;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: #fff;
  }
  .sticky-w {
    width: 750rpx;
  }
  .search-content {
    position: relative;
    box-sizing: border-box;
    padding: 14rpx 32rpx;
    background-color: #fff;
  }
  .no-content {
    text-align: center;
    margin-top: 180rpx;
    .img {
      width: 400rpx;
      height: 300rpx;
    }
    .tps {
      margin-top: 40rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: $u-main-color;
    }
  }
  .keyboard-btns {
    box-sizing: border-box;
    padding: 24rpx 32rpx;
    justify-content: space-between;
    .left {
      color: #888;
    }
    .right {
      color: $u-type-primary;
    }
  }
}
</style>
