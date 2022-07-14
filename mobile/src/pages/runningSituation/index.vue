<template>
  <view class="running-situation-page">
    <!-- nav-bar -->
    <g-navbar title="跑步情况" :border-bottom="false" class="navbar" />
    <view v-show="!firstRequest">
      <!-- 头部-header -->
      <view v-show="!empty">
        <running-header
          id="runningHeader"
          :title="curriculumName"
          @input="input"
          @search="search"
        />
        <view class="running-situation-page-content">
          <scroll-header :count="studentNum" :scoring-type="scoringType" />
          <mescroll-uni
            ref="mescrollRef"
            class="mt-24"
            :top="top"
            bottom="0"
            :up="upOption"
            :down="downOption"
            @init="mescrollInit"
            @up="upCallback"
            @down="downCallback"
          >
            <template v-if="runningList.length > 0">
              <list-item
                v-for="(item, index) in runningList"
                :key="item.userId"
                :target="item"
                :scoring-type="scoringType"
                :background-color="!(index % 2) ? '#fff' : '#F5F6FA'"
              />
            </template>
            <template v-else>
              <view class="empty-running-content empty u-text-center">
                <image
                  class="img"
                  src="~@/static/img/empty-course.png"
                  mode="scaleToFill"
                />
                <view class="tps">暂无数据哦～</view>
              </view>
            </template>
          </mescroll-uni>
        </view>
      </view>
      <view v-show="empty" class="empty-content empty u-text-center">
        <image
          class="img"
          src="~@/static/img/workbench/empty-1.png"
          mode="scaleToFill"
        />
        <view class="tps">跑步情况暂无数据</view>
      </view>
    </view>
    <u-mask :show="mask" :zoom="true" :z-index="1" />
  </view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { toRpx } from '@/utils/common';
import { running } from '../../request/api/teacher';
import RunningHeader from './components/RunningHeader';
import ScrollHeader from './components/scrollHeader';
import ListItem from './components/ListItem';
export default {
  components: {
    'running-header': RunningHeader,
    'scroll-header': ScrollHeader,
    'list-item': ListItem
  },
  mixins: [MescrollMixin],
  data() {
    return {
      firstRequest: true, // 第一次进来展示加载页面
      empty: true, // 该班级是否没有数据
      scoringType: -1, // 计分模式1：里程模式，2：段数模式
      studentNum: 0, // 总人数
      mask: false, // 键盘弹出展示蒙层
      query: {
        courseId: '',
        page: 1,
        size: 15,
        queryParam: ''
      },
      top: 0,
      year: '', // 年级
      id: '',
      runningList: [], // 学生跑步情况列表
      curriculumName: '',
      downOption: {
        use: true,
        isLock: false,
        auto: false //是否在初始化后,自动执行downCallback; 默认true
      },
      upOption: {
        auto: false,
        page: {
          size: 15 // 每页数据的数量,默认10
        },
        noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
        textNoMore: '--我也是有底线的--',
        empty: {
          tip: '暂无相关数据'
        }
      }
    };
  },
  computed: {
    semesterId() {
      return this.$store.state.semester.currentSemester.id;
    }
  },
  onLoad({ name, id, year }) {
    this.curriculumName = name;
    this.query.courseId = id;
    this.year = year;
    this.getRunningRule();
  },
  methods: {
    async getRunningRule() {
      uni.showLoading({
        title: '加载中'
      });
      try {
        const { code, data } = await running.getRunningRule({
          semesterId: this.semesterId,
          year: this.year
        });
        if (code === 0 && data) {
          const [ruleData] = data;
          const { scoringType } = ruleData;
          this.scoringType = scoringType;
          this.getStudentsGrade('first');
        }
      } catch (err) {
        uni.hideLoading();
        throw Error(err);
      }
    },
    async getStudentsGrade(state) {
      try {
        const { code, data } = await running.getStudentsGrade(this.query);
        if (code === 0) {
          const { grades, total } = data;
          this.studentNum = total || 0;
          if (state === 'first') {
            this.firstRequest = false;
            this.empty = !(grades && grades.length > 0);
            this.$nextTick(() => {
              this.getTop();
            });
            uni.hideLoading();
          }
          // 下拉刷新
          if (state === 'dow') {
            this.runningList = [];
          }
          this.runningList.push(...(grades || []));
          if (typeof this.mescroll.endSuccess === 'function') {
            this.mescroll.endSuccess(grades || []);
          }
        } else {
          this.mescroll.endErr();
        }
      } catch (err) {
        this.mescroll.endErr(err);
      }
    },
    /*下拉刷新的回调 */
    async downCallback() {
      this.mescroll.setPageNum(1); // 重置分页
      this.query.page = 1;
      await this.getStudentsGrade('dow');
    },
    // 筛选
    search(query) {
      this.query.queryParam = query;
      this.mescroll.setPageNum(1); // 重置分页
      this.query.page = 1;
      this.runningList = [];
      this.getStudentsGrade();
    },
    input(query) {
      if (String(query).trim() === '') {
        this.search(query);
      }
    },
    upCallback(page) {
      const { num } = page;
      this.query.page = num + 1;
      this.getStudentsGrade();
    },
    getTop() {
      const runningHeader = uni.createSelectorQuery().select('#runningHeader');
      runningHeader
        .boundingClientRect((runningHeaderDom) => {
          this.top = 88 + toRpx(runningHeaderDom.height + this.StatusBar + 44);
        })
        .exec();
    }
  }
};
</script>

<style lang="scss" scoped>
.running-situation-page {
  position: relative;
  height: 100vh;
  box-sizing: border-box;
  padding: 0;
  background-color: #fff;
  .empty {
    .tps {
      font-size: 32rpx;
      color: $u-main-color;
    }
    .img {
      width: 400rpx;
      height: 300rpx;
    }
  }
  .empty-content .img {
    margin: 324rpx 0 40rpx;
  }
  .empty-running-content .img {
    margin: 108rpx 0 40rpx;
  }
  ::v-deep .mescroll-upwarp {
    box-sizing: border-box;
    min-height: 55px;
    padding: 15px 0;
    text-align: center;
    clear: both;
  }
}
</style>
