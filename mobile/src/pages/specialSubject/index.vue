<template>
  <view class="test-scores">
    <g-navbar
      back-icon-size="48"
      title="专项考试"
      :border-bottom="false"
      class="navbar"
    >
      <view slot="right">
        <view class="nav-right" @click="refresh">刷新</view>
      </view>
    </g-navbar>
    <view id="course" class="current-course u-flex u-col-top">
      <image src="~@/static/img/book-icon.png" mode="aspectFit" />
      <view class="current-course-name">
        {{ courseName }}
      </view>
    </view>
    <!-- 头部 -->
    <view id="search" class="search-content">
      <u-search
        v-model="query"
        height="64"
        bg-color="#F5F6FA"
        shape="square"
        :show-action="false"
        :clearabled="true"
        placeholder="搜索学生姓名、学号"
        @clear="clearHandle"
        @search="searchHandle"
        @change="changeHandle"
      />
    </view>
    <!-- 学生列表 -->
    <z-table
      ref="table"
      :table-data="list"
      :columns="columns"
      :stick-side="true"
      :course-id="courseId"
      :row-num="row.rowNum"
      :col-num="col.colNum"
      :table-height="tableHeight"
      @clickHandle="clickEditHandle"
    />
    <view v-if="total > size" id="pagination" class="pagination">
      <g-pagination
        v-model="page"
        :total="total"
        :page-size="size"
        @on-change="changePage"
      />
    </view>
    <u-mask :show="keyboardShow" @click="clickMask">
      <u-keyboard
        v-model="keyboardShow"
        mode="number"
        :mask="false"
        :tips="scoresValue"
        :show-tips="showTips"
        :mask-close-able="false"
        :safe-area-inset-bottom="true"
        @cancel="cancelHandle"
        @confirm="confirmHandle"
        @change="valChange"
        @backspace="backspace"
      />
    </u-mask>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import zTable from './components/Table';
import { specialSubject } from '@/request/api/teacher';
import {
  getValueStr,
  checkRule,
  getRate,
  getColumns,
  getTableData,
  restoreValueStr
} from './common';
import _ from 'lodash';

export default {
  components: {
    'z-table': zTable
  },
  data() {
    return {
      columns: [], // 表头
      list: [], // 表数据
      tableHeight: 0,
      courseId: '', // 课程id
      courseName: '', //课程名称
      page: 1,
      size: 50,
      query: '', // 搜索值
      total: '',
      subject: [], //该课程科目列表
      keyboardShow: false, // 键盘状态
      row: {
        // 当前行
        rowNum: -1
      },
      col: {
        // 当前列
        colNum: -1
      },
      scoresValue: '', // 当前修改的分数值
      selSubject: '' //当前修改的科目数据
    };
  },
  computed: {
    showTips() {
      return this.scoresValue ? true : false;
    }
  },
  watch: {
    query(val) {
      if (val === '') {
        this.clearHandle();
      }
    }
  },
  onLoad(option) {
    const info = JSON.parse(decodeURIComponent(option.info));
    this.courseId = info.courseId;
    this.courseName = info.name;
    this.subject = info.subject;
    this.getAchievementList();
  },
  methods: {
    // 初始化选中单元格行列
    initSelectCell() {
      this.row = { rowNum: -1 };
      this.col = { colNum: -1 };
    },
    // 点击输入，弹出键盘
    clickEditHandle(row, col) {
      this.$nextTick(() => {
        this.row = row;
        this.col = col;
        this.selSubject = _.find(row.subjectAchievementList, {
          subjectId: col.key
        });
        this.keyboardShow = true;
        this.scoresValue = getValueStr(this.selSubject);
      });
    },
    // 按键被点击
    valChange(val) {
      this.scoresValue += val;
      this.$refs.table.valChange(this.scoresValue);
    },
    // 退格键被点击
    backspace() {
      // 删除value的最后一个字符
      if (this.scoresValue.length)
        this.scoresValue = this.scoresValue.substr(
          0,
          this.scoresValue.length - 1
        );
      this.$refs.table.valChange(this.scoresValue);
    },
    // 取消键点击
    cancelHandle() {
      // 恢复数据
      this.keyboardShow = false;
      const rate = restoreValueStr(this.selSubject);
      this.$refs.table.valChange(rate);
      this.initSelectCell();
    },
    // 完成键点击
    confirmHandle() {
      this.keyboardShow = true;
      const { subjectType } = this.selSubject;
      if (isNaN(Number(this.scoresValue))) {
        uni.showToast({
          title: '请输入正确格式',
          icon: 'none',
          duration: 2000,
          mask: true
        });
      } else {
        if (this.scoresValue !== '') {
          this.scoresValue = `${Number(this.scoresValue)}`;
        }
        const checkState = checkRule(subjectType, this.scoresValue);
        if (checkState) {
          this.getAchievementSave();
        }
      }
    },
    // 点击蒙层
    clickMask() {
      this.$refs.uToast.show({
        title: '请确认或取消'
      });
    },
    // 搜索
    searchHandle() {
      this.page = 1;
      this.list = [];
      this.getAchievementList();
    },
    // 搜索值change事件
    changeHandle(value) {
      this.query = value;
    },
    // 点击搜索清除内容
    clearHandle() {
      this.query = '';
      this.page = 1;
      this.getAchievementList();
    },
    // 获取专项考试列表
    getAchievementList() {
      const { page, size, courseId, query } = this;
      specialSubject
        .getAchievementList({
          courseId,
          page,
          size,
          query
        })
        .then((res) => {
          if (res.code === 0 && res.data) {
            this.total = res.data.total;
            this.columns = getColumns([...this.subject], this.total);
            this.list = getTableData(res.data.items);
          } else {
            this.list = [];
          }
          this.setTableHeight();
        })
        .catch((err) => {
          throw Error(err);
        });
    },
    //保存修改接口
    getAchievementSave() {
      const { courseId, selSubject, row, col } = this;
      const rate = getRate(selSubject.subjectType, this.scoresValue);
      const params = {
        courseId,
        rate,
        subjectId: selSubject.subjectId,
        subjectType: selSubject.subjectType,
        userId: row.id
      };
      specialSubject
        .getAchievementSave(params)
        .then((res) => {
          if (res.code === 0) {
            this.keyboardShow = false;
            this.$refs.uToast.show({
              title: '保存成功'
            });
            this.selSubject.rate = rate;
            this.row.subjectAchievementList[this.col.colNum - 1] =
              this.selSubject;
            this.row[col.key] = rate;
            this.list = this.list.map((item) => {
              return item.id === this.row.id ? this.row : item;
            });
            this.initSelectCell();
          }
        })
        .catch(() => {
          this.keyboardShow = true;
          this.$refs.uToast.show({
            title: '保存失败'
          });
        });
    },
    // 刷新
    refresh() {
      this.getAchievementList();
    },
    // 计算表格高度
    setTableHeight() {
      this.$nextTick(() => {
        const search = uni.createSelectorQuery().select('#search');
        const pagination = uni.createSelectorQuery().select('#pagination');
        const course = uni.createSelectorQuery().select('#course');
        search
          .boundingClientRect((data) => {
            if (data && data.height) {
              course
                .boundingClientRect((res) => {
                  let _h = data.height + this.StatusBar + 50;
                  if (res && res.height) {
                    _h += res.height;
                    pagination
                      .boundingClientRect((pon) => {
                        if (pon && pon.height) _h += pon.height;
                        this.tableHeight = this.screenHeight - _h;
                      })
                      .exec();
                  }
                })
                .exec();
            }
          })
          .exec();
      });
    },
    // 切换页码
    changePage() {
      this.getAchievementList();
    }
  }
};
</script>

<style lang="scss" scoped>
.test-scores {
  background: #fff;
  min-height: 100vh;
  .nav-right {
    height: 44rpx;
    font-size: 30rpx;
    box-sizing: border-box;
    padding-right: 32rpx;
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
  }
  .current-course {
    padding: 16rpx 32rpx 12rpx;
    image {
      width: 48rpx;
      height: 48rpx;
    }
    &-name {
      font-size: 28rpx;
      font-weight: bold;
      color: #222222;
      margin-left: 8rpx;
      margin-top: 6rpx;
    }
  }
  .search-content {
    box-sizing: border-box;
    padding: 12rpx 32rpx;
  }
  ::v-deep .u-mask {
    background-color: rgba(0, 0, 0, 0) !important;
  }
  ::v-deep .u-drawer__scroll-view {
    box-shadow: 0 10rpx 20rpx 5rpx rgba(0, 0, 0, 0.17);
    .u-tooltip {
      .u-tooltip-tips {
        font-weight: bold;
        width: 250rpx;
        overflow: hidden;
      }
    }
  }
  .pagination {
    box-sizing: border-box;
    padding: 0 32rpx;
  }
}
</style>
