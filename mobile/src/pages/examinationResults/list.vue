<template>
  <view class="examination-results-container">
    <!-- header -->
    <g-navbar title="班级成绩" :border-bottom="false" class="navbar">
      <view slot="right">
        <view
          v-if="checkState && isContent"
          class="nav-right u-flex"
          :class="[{ 'under-review-color': checkState === 'underReview' }]"
          @click.stop="checkAchievementModal"
        >
          {{ reviewedName }}
        </view>
      </view>
    </g-navbar>
    <!-- 课程名称信息 -->
    <view
      id="Curriculum"
      class="curriculum-info u-flex"
      :class="[{ 'u-col-top': alignment === 'top' }]"
    >
      <image
        id="Img"
        class="curriculum-info-icon"
        src="~@/static/img/book-icon.svg"
        mode="scaleToFill"
      />
      <view id="Content" class="curriculum-info-name">
        {{ curriculumName }}
      </view>
    </view>
    <g-top-tips ref="uTips" :z-index="zIndex" :navbar-height="StatusBar + 44">
      {{ tps }}
    </g-top-tips>
    <!-- 有内容 -->
    <!-- 搜索 -->
    <template v-if="isContent">
      <view id="search" class="search-content">
        <u-search
          v-model="tableInfo.query.query"
          height="64"
          bg-color="#F5F6FA"
          shape="square"
          :show-action="false"
          :clearabled="true"
          placeholder="搜索学生姓名、学号"
          @search="searchHandle"
        />
      </view>
      <g-table
        :table-height="tableHeight"
        :columns="columns"
        :table-data="tableData"
        :filter-columns="filterColumns"
        @row-click="rowClick"
      >
        <template #empty>
          <view class="empty-content" style="padding: 232rpx 0 0">
            <image
              class="img"
              src="~@/static/img/empty-sport.png"
              mode="scaleToFill"
            />
            <view class="tps">暂无成绩数据</view>
          </view>
        </template>
      </g-table>
      <view
        v-if="tableInfo.total > tableInfo.query.size"
        id="pagination"
        class="pagination"
      >
        <g-pagination
          v-model="tableInfo.query.page"
          :total="tableInfo.total"
          :page-size="tableInfo.query.size"
          @on-change="changePage"
        />
      </view>
    </template>
    <template v-if="!isContent">
      <view class="empty-content">
        <image
          class="img"
          src="~@/static/img/empty-sport.png"
          mode="scaleToFill"
        >
          <view class="tps">暂无成绩数据</view>
        </image>
      </view>
    </template>
    <!-- 复核弹窗 -->
    <g-modal
      v-model="achievementModal"
      :content="achievementModalContent"
      :show-cancel-button="true"
      :confirm-text="checkState ? '确定' : '复核'"
      cancel-text="取消"
      @confirm="checkAchievement"
    />
  </view>
</template>

<script>
// 总分 附加分 考勤 活动 专项1 专项2 专项3 专项4 专项5
import { getTableHeader, getTableBody } from './common';
import { achievement } from '@/request/api/teacher';
const reviewedStr = {
  reviewed: '取消复核',
  underReview: '复核中',
  notReviewed: '复核成绩' // 未复核
};
export default {
  name: 'ExaminationResults',
  data() {
    return {
      timer: null,
      alignment: 'center',
      isRefresh: false, //详情页面编辑后刷新
      refreshInfo: null, // 需要更新的数据
      isContent: true,
      checkoutReviewTimer: null, //轮询复核状态
      tps: '',
      curriculumName: '', // 当前班级课程名称
      zIndex: 999,
      tableInfo: {
        query: {
          query: '',
          courseId: '',
          page: 1,
          size: 30
        },
        total: 0
      },
      header: null,
      list: [],
      tableHeight: 0,
      checkState: '', //reviewed:已复核， notReviewed:未复核，underReview: 复核中
      achievementModal: false,
      columns: [],
      tableData: []
    };
  },
  computed: {
    reviewedName() {
      return reviewedStr[this.checkState];
    },
    achievementModalContent() {
      if (this.checkState === 'reviewed') {
        return '取消复核后，当前成绩将从学生App撤回';
      }
      if (this.checkState === 'notReviewed') {
        return '复核后的成绩将发布至学生App，不可对成绩进行修改';
      }
      return '';
    }
  },
  onLoad({ id, name }) {
    this.tableInfo.query.courseId = id;
    this.curriculumName = name;
    this.getReviewStatus();
    this.getTableInfo();
  },
  onUnload() {
    // 清出定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  onShow() {
    if (this.isRefresh) {
      if (this.refreshInfo) {
        const { id } = this.refreshInfo;
        const idx = this.tableData.findIndex((item) => item.id === id);
        const newValue = getTableBody([this.$u.deepClone(this.refreshInfo)]);
        if (idx > -1) {
          this.tableData.splice(idx, 1, ...newValue);
          this.refreshInfo = null;
        }
      }
      this.isRefresh = false;
    }
  },
  onReady() {
    this.setCurriculumClass();
  },
  watch: {
    checkState: {
      immediate: true,
      handler(nval) {
        if (nval === 'underReview') {
          // 轮询复核状态
          this.zIndex = 999;
          if (!this.timer) {
            this.timer = setInterval(() => {
              this.progress();
            }, 5000);
          }
          if (this.$refs.uTips) {
            this.$refs.uTips.show({
              title: '成绩复核中，请稍后编辑或录入学生成绩',
              type: 'warning'
            });
          }
        } else {
          if (
            this.$refs.uTips &&
            typeof this.$refs.uTips.hidden === 'function'
          ) {
            this.$refs.uTips.hidden();
          }

          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
          this.zIndex = 0;
        }
      }
    }
  },
  methods: {
    async getTableList(state) {
      if (state === 'first') {
        return achievement.getTableBody(this.tableInfo.query);
      } else {
        uni.showLoading({
          title: '加载中',
          mask: true
        });
        const res = await achievement.getTableBody(this.tableInfo.query);
        // 设置 total
        if (res.code === 0 && res.data) {
          const { total, items } = res.data;
          this.tableInfo.total = total;
          this.tableData = getTableBody(items || []);
        }
        uni.hideLoading();
      }
    },
    async getTableHeader() {
      return achievement.getTableHeaders({
        courseId: this.tableInfo.query.courseId
      });
    },
    async getTableInfo() {
      uni.showLoading({
        title: '加载中',
        mask: true
      });
      try {
        const result = await Promise.all([
          this.getTableHeader(),
          this.getTableList('first')
        ]);
        if (result && Array.isArray(result)) {
          const [header, body] = result;
          if (body && body.code === 0) {
            if (body.data) {
              const { items, total } = body.data;
              this.tableInfo.total = total;
              if (total < 1 || !items) {
                this.isContent = false;
              } else if (total > 0) {
                this.isContent = true;
              }
              this.tableData = getTableBody(items || []);
            }
          }
          if (header && header.code === 0 && header.data) {
            this.header = header.data;
            this.columns = getTableHeader(header.data, this.tableInfo.total);
          }
        }
        // 设置表格高度
        this.setTableHeight();
      } catch (err) {
        this.isContent = false;
        throw Error(err);
      }
      uni.hideLoading();
    },
    setTableHeight() {
      this.$nextTick(() => {
        const search = uni.createSelectorQuery().select('#search');
        const pagination = uni.createSelectorQuery().select('#pagination');
        const Curriculum = uni.createSelectorQuery().select('#Curriculum');
        search
          .boundingClientRect((data) => {
            if (data && data.height) {
              Curriculum.boundingClientRect((cu) => {
                if (cu && cu.height) {
                  pagination
                    .boundingClientRect((pon) => {
                      let _h = data.height + this.StatusBar + 44 + cu.height;
                      if (pon && pon.height) _h += pon.height;
                      this.tableHeight = this.screenHeight - _h;
                    })
                    .exec();
                }
              }).exec();
            }
          })
          .exec();
      });
    },
    async checkAchievement() {
      // 复核成绩
      if (this.checkState === 'notReviewed') {
        // 复核成绩
        this.course();
      }
      if (this.checkState === 'reviewed') {
        // 取消复核
        this.cancel();
      }
    },
    searchHandle() {
      // 搜索用户
      // 改变页码
      this.tableInfo.query.page = 1;
      // 清空之前数据
      this.tableData = [];
      // 请求接口
      this.getTableList();
    },
    changePage() {
      this.getTableList();
    },
    rowClick({ userId, number }) {
      const cid = this.tableInfo.query.courseId;
      // 需要存表头数据 vuex
      if (!this.header) return;
      const state = this.checkState === 'notReviewed' ? 1 : 2;
      this.$store.commit('examination/SET_EXAMINATION_RULES', this.header);
      uni.navigateTo({
        url: `/pages/examinationResults/detail?uid=${userId}&cid=${cid}&n=${number}&state=${state}`
      });
    },
    checkAchievementModal() {
      // 判断是否在复核中，复核中不能取消复核
      if (this.checkState === 'underReview' || !this.checkState) return;
      this.achievementModal = true;
    },
    async course() {
      const { courseId } = this.tableInfo.query;
      const res = await achievement.course({ courseId });
      if (res.code === 0) {
        this.checkState = 'underReview';
        this.progress();
      }
      this.achievementModal = false;
    },
    async cancel() {
      const { courseId } = this.tableInfo.query;
      const res = await achievement.cancel({ courseId });
      if (res.code === 0) {
        this.checkState = 'notReviewed';
        uni.showToast({
          title: '取消复核成功',
          icon: 'success',
          mask: true
        });
      }
    },
    async progress() {
      const { courseId } = this.tableInfo.query;
      const res = await achievement.progress({ courseId });
      if (res.code === 0) {
        const { totalCount, surplusCount } = res.data;
        this.setTps(totalCount, surplusCount);
        if (surplusCount === 0) {
          // 检查复核状态
          const status = await achievement.getReviewStatus({ courseId });
          if (status.code === 0) {
            // 复核失败
            if (status.data === 0) {
              this.checkState = 'notReviewed';
              uni.showToast({
                title: '复核失败',
                icon: 'none',
                mask: true
              });
            }
            // 复核成功
            if (status.data === 1) {
              this.checkState = 'reviewed';
              uni.showToast({
                title: '复核成功',
                icon: 'success',
                mask: true
              });
            }
            // 继续复核
            if (status.data === 2) {
              this.checkState = 'underReview';
            }
          }
        }
      }
    },
    async getReviewStatus() {
      const { courseId } = this.tableInfo.query;
      const res = await achievement.getReviewStatus({ courseId });
      if (res.code === 0) {
        const data = res.data;
        if (data === 0) {
          this.checkState = 'notReviewed';
        }
        if (data === 1) {
          this.checkState = 'reviewed';
        }
        if (data === 2) {
          this.checkState = 'underReview';
        }
      }
    },
    filterColumns(columns) {
      // 过滤掉占比为0的项目
      return columns.filter(({ proportionValue, proportion }) => {
        if (!proportion) return true;
        if (proportion && proportionValue > 0) return true;
        return false;
      });
    },
    setTps(count, current) {
      this.tps = `已复核${count - current}人，待复核${current}人`;
    },
    setCurriculumClass() {
      // 动态设置课程标题的样式类，超出1行顶部对齐，一行居中对齐
      const Content = uni.createSelectorQuery().select('#Content');
      const Img = uni.createSelectorQuery().select('#Img');
      Content.boundingClientRect((c) => {
        if (c && c.height) {
          Img.boundingClientRect((i) => {
            if (i && i.height) {
              this.alignment = c.height > i.height ? 'top' : 'center';
            }
          }).exec();
        }
      }).exec();
    }
  }
};
</script>

<style lang="scss" scoped>
.examination-results-container {
  background-color: #fff;
  min-height: 100vh;
  .nav-right {
    height: 44rpx;
    box-sizing: border-box;
    font-size: 30rpx;
    padding-right: 40rpx;
    color: #fc6c37;
    z-index: 999;
  }
  .under-review-color {
    color: $u-tips-color;
  }
  .curriculum-info {
    box-sizing: border-box;
    padding: 16rpx 32rpx 12rpx;
    &-icon {
      width: 48rpx;
      height: 48rpx;
      margin-right: 8rpx;
    }
    &-name {
      width: calc(100% - 56rpx);
      font-size: 28rpx;
      font-weight: 600;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
      color: $u-main-color;
    }
  }
  .search-content {
    box-sizing: border-box;
    padding: 12rpx 32rpx;
  }
  .pagination {
    box-sizing: border-box;
    padding: 0 32rpx;
  }
  ::v-deep .colun-flex {
    width: 100%;
    display: flex;
    flex-direction: column;
    .title {
      color: $u-main-color;
      font-weight: 600;
    }
    .label {
      color: $u-content-color;
      font-weight: 400;
    }
    .title,
    .label {
      text-align: center;
    }
    .name {
      line-height: 48rpx;
      color: $u-main-color;
    }
    .name,
    .code {
      width: 100%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .code {
      margin-top: 4rpx;
      line-height: 32rpx;
      color: $u-content-color;
    }
  }
  .empty-content {
    text-align: center;
    box-sizing: border-box;
    padding: 320rpx 0 0;
    .img {
      width: 400rpx;
      height: 414rpx;
    }
    .tps {
      margin-top: 40rpx;
      font-size: 32rpx;
      font-weight: 400;
      color: $u-main-color;
    }
  }
}
</style>
