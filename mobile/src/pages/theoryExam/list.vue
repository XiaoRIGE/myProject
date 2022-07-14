<template>
  <view class="course-list" :class="[list.length === 0 && 'white']">
    <g-navbar :border-bottom="false" title="我的课程" />
    <mescroll-body
      ref="mescrollRef"
      :top="0"
      :height="height"
      bottom="110"
      bg-color="#F5F6FA"
      :safearea="true"
      :native="true"
      :up="{ use: false }"
      :down="{ auto: false }"
      @init="mescrollInit"
      @down="downCallback"
    >
      <!-- 数据列表 -->
      <!-- 有数据 -->
      <template v-if="list.length > 0">
        <view v-for="exam in list" :key="exam.id" class="list-item">
          <courseList-item :data="exam" />
        </view>
      </template>
      <template v-else>
        <view>
          <no-data />
        </view>
      </template>
    </mescroll-body>
  </view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import CourseListItem from './components/CourseListItem';
import NoData from './components/NoData';
import { theoryExam } from '@/request/api/student';
export default {
  name: 'CourseList',
  components: {
    'courseList-item': CourseListItem,
    'no-data': NoData
  },
  mixins: [MescrollMixin],
  data() {
    return {
      top: 0,
      list: []
    };
  },
  computed: {
    height() {
      return `${this.screenHeight - this.StatusBar - 44}px`;
    }
  },
  onShow() {
    this.getTheoryExaminationList();
  },
  methods: {
    async getTheoryExaminationList() {
      try {
        const { code, data } = await theoryExam.getTheoryExaminationList();
        if (code === 0) {
          this.list = data || [];
          this.mescroll.endSuccess(0);
        } else {
          this.list = [];
          this.mescroll.endErr();
        }
        this.$forceUpdate();
      } catch (err) {
        this.list = [];
        this.mescroll.endErr();
      }
    },
    downCallback() {
      // 下拉刷新
      this.getTheoryExaminationList();
    }
  }
};
</script>

<style lang="scss" scoped>
.white {
  background-color: #fff;
}
.course-list {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0;
  .list-item {
    box-sizing: border-box;
    padding: 0 32rpx;
    margin-top: 32rpx;
  }
}
</style>
