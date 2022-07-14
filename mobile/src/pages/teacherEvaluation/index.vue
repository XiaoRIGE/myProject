<template>
  <view
    class="evaluation-content"
    :class="[noDataTitle !== 'hidden' && 'bg-white']"
  >
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
      <!-- 开启教师评价功能并且有数据 -->
      <template v-if="noDataTitle === 'hidden'">
        <view
          v-for="(course, index) in list"
          :key="index"
          style="margin-top: 20rpx"
          class="course-item"
        >
          <course-item :course="course" />
        </view>
      </template>
      <!-- 开启教师评价未配置课程 -->
      <!-- 未开启教师评价 -->
      <no-data v-else :text="noDataTitle" />
    </mescroll-body>
  </view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { teacherEvaluation } from '@/request/api/student';
import CourseItem from './components/CourseItem';
import NoData from './components/NoData';
export default {
  components: {
    'course-item': CourseItem,
    'no-data': NoData
  },
  mixins: [MescrollMixin],
  data() {
    return {
      switch: true, // 是否配置教师评价
      list: []
    };
  },

  computed: {
    height() {
      return `${this.screenHeight - this.StatusBar - 44}px`;
    },
    noDataTitle() {
      if (!this.switch) {
        return '本学期暂未配置教师评价';
      } else {
        if (this.list.length === 0) return '本学期暂无课程';
        return 'hidden';
      }
    }
  },

  onShow() {
    this.getTeacherEvaluationList();
  },
  methods: {
    downCallback() {
      // 下拉刷新
      this.getTeacherEvaluationList();
    },
    async getTeacherEvaluationList() {
      try {
        const { code, data } =
          await teacherEvaluation.getTeacherEvaluationList();
        if (code === 0) {
          this.switch = true;
          this.list = data || [];
          this.mescroll.endSuccess(0);
        } else {
          this.list = [];
          this.mescroll.endErr();
        }
      } catch (err) {
        this.list = [];
        this.mescroll.endErr();
        if (err.code === 100000) {
          // 本学期未打开教师评价开关
          this.switch = false;
        } else {
          this.list = [];
          this.switch = true;
          // 90003 -> 本学期暂无课程
          if (err.code !== 90003) {
            uni.showToast({
              title: err.message,
              icon: 'none'
            });
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.evaluation-content {
  box-sizing: border-box;
  .course-item {
    margin-top: 32rpx;
    box-sizing: border-box;
    padding: 0 32rpx;
  }
}
</style>
