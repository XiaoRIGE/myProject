<template>
  <view class="teacher-activity-container">
    <g-navbar
      id="navBar"
      back-icon-size="48"
      title="课外活动"
      :border-bottom="false"
    />
    <view v-show="!empty">
      <!-- 课外活动固定头 -->
      <view id="header" class="teacher-activity-container-header">
        <!-- 当前课程 -->
        <course-header :current-course="currentCourse" />
        <!-- 搜索 -->
        <view class="activity-search">
          <u-search
            v-model="query"
            height="64"
            bg-color="#F5F6FA"
            shape="square"
            :show-action="false"
            :clearabled="true"
            placeholder="搜索学生姓名、学号"
            @search="searchHandle"
          />
        </view>
        <!-- 表头 -->
        <scroll-header :count="total" />
      </view>
      <!-- 课外活动学生列表 -->
      <mescroll-uni
        ref="mescrollRef"
        class="teacher-activity-container-list"
        :native="true"
        :top="top"
        bottom="0"
        :up="upOption"
        :down="downOption"
        @init="mescrollInit"
        @down="downCallback"
        @up="upCallback"
      >
        <view v-if="!searchEmpty">
          <list-item
            v-for="(item, index) in list"
            :key="index"
            :stu-info="item"
            :background-color="index % 2 !== 0 ? '#F5F6FA' : '#fff'"
          />
        </view>
        <view v-else class="search-empty">
          <image
            src="~@/static/img/empty-course.png"
            class="search-empty-img"
            mode="scaleToFill"
          />
          <view class="search-empty-text">
            暂无数据哦~
          </view>
        </view>
      </mescroll-uni>
    </view>
    <view v-show="empty" class="empty">
      <image
        class="empty-img"
        src="~@/static/img/empty-sport.png"
        mode="scaleToFill"
      />
      <view class="empty-text">
        课外活动暂无数据
      </view>
    </view>
  </view>
</template>

<script>
import CourseHeader from './components/CourseHeader';
import ScrollHeader from './components/ScrollHeader';
import ListItem from './components/ListItem';
import { activity } from '@/request/api/teacher';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { toRpx } from '@/utils/common';

export default {
  components: {
    'course-header': CourseHeader,
    'scroll-header': ScrollHeader,
    'list-item': ListItem
  },
  mixins: [MescrollMixin],
  data() {
    return {
      query: '',
      currentCourse: null,
      page: 1,
      size: 10,
      list: [],
      total: 0,
      downOption: {
        use: true,
        auto: false, //是否在初始化后,自动执行downCallback; 默认true
        offset: 48, //下拉大于60px,松手即可触发下拉刷新的回调
        textColor: '#999999'
      },
      upOption: {
        textColor: '#999999',
        bgColor: '#fff',
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
      },
      top: 0,
      type: -1, // 搜索类型 0：姓名 1:学号
      searchEmpty: false,
      empty: false
    };
  },
  watch: {
    query(val) {
      if (val === '') {
        this.downCallback();
      }
    }
  },
  onLoad(option) {
    const item = JSON.parse(decodeURIComponent(option.item));
    this.currentCourse = item;
    this.getActivityStatistics();
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select('#navBar')
      .boundingClientRect(({ height }) => {
        this.top = toRpx(height);
      })
      .exec();
    query
      .select('#header')
      .boundingClientRect(({ height }) => {
        this.top = this.top + toRpx(height);
      })
      .exec();
  },
  methods: {
    // 下拉刷新
    downCallback() {
      this.mescroll.resetUpScroll();
    },
    // 上拉加载
    upCallback(page) {
      this.page = page.num;
      if (this.query === '') {
        this.getActivityStatistics();
      } else {
        this.queryActivityStatistics();
      }
    },
    // 获取活动列表
    async getActivityStatistics() {
      this.searchEmpty = false;
      const { currentCourse, page, size } = this;
      const params = {
        courseId: currentCourse.id,
        page,
        size
      };
      const res = await activity.getActivityStatistics(params);
      if (res.code === 0 && res.data) {
        this.total = res.data.total;
        this.empty = res.data.length !== 0 ? false : true;
        if (this.page === 1) {
          this.list = res.data.items || [];
        } else {
          this.list = this.list.concat(res.data.items || []);
        }
        if (typeof this.mescroll.endSuccess === 'function') {
          this.mescroll.endSuccess(res.data.items.length || 0);
        }
      } else {
        if (this.page === 1) {
          this.list = [];
        }
        if (typeof this.mescroll.endSuccess === 'function') {
          this.mescroll.endSuccess(0);
        }
      }
    },
    // 搜索学生活动信息
    async queryActivityStatistics() {
      const { page, size, query, type } = this;
      const params = {
        page,
        size,
        param: query,
        type
      };
      const res = await activity.queryActivityStatistics(params);
      if (res.code === 0 && res.data.items.length) {
        this.list = res.data.items;
        this.total = res.data.total;
        this.searchEmpty = false;
        if (typeof this.mescroll.endSuccess === 'function') {
          this.mescroll.endSuccess(res.data.items.length || 0);
        }
      } else {
        this.list = [];
        this.total = 0;
        this.searchEmpty = true;
        if (typeof this.mescroll.endSuccess === 'function') {
          this.mescroll.endSuccess(0);
        }
      }
    },
    // 点击搜索
    searchHandle() {
      const reg = /^\d+$/;
      if (this.query) {
        // 有搜索值调用查询接口
        if (reg.test(this.query)) {
          // 全是数字，查学号
          this.type = 1;
        } else {
          // 查姓名
          this.type = 0;
        }
      }
      this.downCallback();
    }
  }
};
</script>

<style lang="scss" scoped>
.teacher-activity-container {
  box-sizing: border-box;
  background: #fff;
  min-height: 100vh;
  .activity-search {
    padding: 0 32rpx 12rpx;
  }
  .search-empty {
    margin: 108rpx auto 0;
    text-align: center;
    &-img {
      width: 400rpx;
      height: 300rpx;
    }
    &-text {
      margin-top: 40rpx;
      font-size: 32rpx;
    }
  }
  .empty {
    margin: 324rpx auto 0;
    text-align: center;
    &-img {
      width: 400rpx;
      height: 300rpx;
    }
    &-text {
      margin-top: 40rpx;
      font-size: 32rpx;
    }
  }
}
</style>
