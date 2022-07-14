<template>
  <view
    class="course-Candidate-List-container"
    :style="!isContent ? 'background: #fff;' : ''"
  >
    <g-navbar
      back-icon-size="48"
      :title="navTitle"
      :border-bottom="false"
      class="navbar"
    />

    <!-- 筛选列表 -->
    <dropdown-conponent
      id="dropdownConponent"
      :school-options="schoolOptions"
      :time-options="timeOptions"
      :project-options="projectOptions"
      @on-change="filterHandle"
    />
    <!-- 候选列表 -->
    <mescroll-uni
      ref="mescrollRef"
      class="content"
      :native="true"
      :top="0"
      :height="height"
      bottom="0"
      :up="{ use: false }"
      :safearea="true"
      :down="downOption"
      @init="mescrollInit"
      @down="downCallback"
    >
      <view v-if="loading">
        <view v-if="isContent">
          <course-card-item
            v-for="(item, index) in courseList"
            :key="index"
            class="course-card-item"
            :item-data="item"
            @selectCourseHandle="selectCourseHandle"
            @confirmHandle="confirmHandle"
          />
          <view class="content-bottom u-flex u-row-between">
            <u-line color="#C3C2CC" length="60rpx" />
            <view>没有更多啦</view>
            <u-line color="#C3C2CC" length="60rpx" />
          </view>
        </view>
        <view v-else class="empty">
          <image
            src="~@/static/img/empty-course.png"
            class="empty-img"
            mode="scaleToFill"
          />
          <view class="empty-text">
            很抱歉，无可选课程
          </view>
        </view>
      </view>
    </mescroll-uni>

    <!-- 二次确认选课/修改课程弹窗 -->
    <g-modal
      v-if="selectCourseShow"
      v-model="selectCourseShow"
      :show-title="true"
      :title="type === 'add' ? '确认课程' : '修改课程'"
      :show-cancel-button="true"
      :confirm-text="type === 'add' ? '确认选课' : '确认修改课程'"
      @cancel="selectCourseShow = false"
      @confirm="confirmHandle"
    >
      <view
        class="modal-content"
        :class="type === 'add' ? 'u-font-17' : 'u-font-14'"
      >
        <view class="gray-text">
          {{ type === 'add' ? '你选的课程是:' : '原选的课程是:' }}
        </view>
        <view class="black-text">
          {{
            type === 'add' ? selectItem.courseName : oldCourseInfo.courseName
          }}
        </view>
        <view class="gray-text">
          上课周次:
          {{ type === 'add' ? selectItem.weekRange : oldCourseInfo.weekRange }}
        </view>
        <view v-if="type === 'update'" class="u-margin-top-48">
          <view class="gray-text">
            修改的课程是:
          </view>
          <view class="black-text">
            {{ selectItem.courseName }}
          </view>
          <view class="gray-text">
            上课周次: {{ selectItem.weekRange }}
          </view>
        </view>
      </view>
    </g-modal>

    <!-- 选课失败弹窗 -->
    <g-modal
      v-model="selectFailShow"
      :show-title="false"
      :show-cancel-button="true"
      content="很抱歉!当前课程已满,请重新选课"
      :content-style="{ fontSize: '34rpx', fontWeight: 600, color: '#353535' }"
      cancel-text="重新选课"
      :cancel-style="{ fontWeight: 600, color: '#FC6C37', fontSize: '36rpx' }"
      :show-confirm-button="false"
      @cancel="selectFailShow = false"
    />
  </view>
</template>

<script>
import CourseCardItem from './components/CourseCardItem';
import DropdownConponent from './components/DropdownConponent';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { toRpx, getSemesterId, getUserInfo } from '@/utils/common';
import { getSchoolList } from '@/request/api/education';
import { courseSelection } from '@/request/api/student';
import { getCampusId, getSchoolId, filterCourseList } from './common';

export default {
  components: {
    'course-card-item': CourseCardItem,
    'dropdown-conponent': DropdownConponent
  },
  mixins: [MescrollMixin],
  data() {
    return {
      downOption: {
        auto: false //是否在初始化后,自动执行downCallback; 默认true
      },
      timer: null,
      courseList: [], // 渲染列表
      queryCourseList: [], // 提供查询列表
      schoolOptions: [],
      timeOptions: [],
      projectOptions: [],
      top: 44,
      isContent: true,
      selectCourseShow: false,
      selectFailShow: false,
      selectItem: null,
      type: '', // add:选课 update:修改课程
      loading: false,
      year: '',
      grade: '',
      oldCourseInfo: null
    };
  },
  computed: {
    height() {
      return `${this.screenHeight - this.top}px`;
    },
    semesterId() {
      return getSemesterId();
    },
    schoolId() {
      return getSchoolId();
    },
    navTitle() {
      return `${this.grade} (${this.year})`;
    },
    userId() {
      return getUserInfo().id;
    },
    courseParams() {
      return {
        // campusId: getCampusId(),
        campusId: null,
        endTime: null,
        projectId: null,
        semesterId: this.semesterId,
        startTime: null,
        userId: this.userId,
        weekLabel: null,
        year: null
      };
    },
    queryParams() {
      return {
        campusId: getCampusId() || null,
        projectId: null,
        weekLabelType: null,
        endTime: null,
        startTime: null
      };
    }
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select('#dropdownConponent')
      .boundingClientRect(data => {
        this.top = toRpx(data.height + this.StatusBar);
      })
      .exec();
  },
  onLoad(option) {
    this.type = option.type;
    this.year = Number(option.year) || null;
    this.grade = option.grade;
    this.courseParams.year = Number(option.year) || null;
    this.oldCourseInfo = this.$store.state.courseSelection.course;
    this.getSchoolOption();
    this.getTimeOption();
    this.getProjectOption();
    this.getCourseList();
  },
  methods: {
    /*下拉刷新的回调 */
    downCallback() {
      if (!this.timer) {
        this.getCourseList();
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.timer = null;
          this.mescroll.optDown.textLoading = '加载中...';
        }, 5000);
      } else {
        this.mescroll.optDown.textLoading = '刷新过于频繁，请5秒后重试！';
        setTimeout(() => {
          this.mescroll.endErr();
        }, 500);
      }
    },

    // 获取校区列表
    async getSchoolOption() {
      const res = await getSchoolList();
      if (res.code === 0 && res.data) {
        this.schoolOptions = res.data.map(item => {
          return {
            label: item.name,
            value: item.id,
            ...item
          };
        });
      }
      this.schoolOptions.unshift({
        label: '不限',
        value: 0
      });
    },
    // 获取选课时间列表
    async getTimeOption() {
      const params = {
        semesterId: this.semesterId,
        userId: this.userId,
        year: this.year
      };
      const res = await courseSelection.getCourseAllTime(params);
      if (res.code === 0 && res.data) {
        this.timeOptions = res.data.map((item, index) => {
          const startTime = this.$u.timeFormat(item.startTime, 'hh:MM');
          const endTime = this.$u.timeFormat(item.endTime, 'hh:MM');
          return {
            label: `${startTime}-${endTime}`,
            value: index + 1,
            ...item
          };
        });
      }
      this.timeOptions.unshift({
        label: '不限',
        value: 0
      });
    },
    // 获取选课项目列表
    async getProjectOption() {
      const params = {
        semesterId: this.semesterId
      };
      const res = await courseSelection.getCourseAllProject(params);
      if (res.code === 0 && res.data) {
        this.projectOptions = res.data.map(item => {
          return {
            label: item.name,
            value: item.id,
            ...item
          };
        });
      }
      this.projectOptions.unshift({
        label: '不限',
        value: 0
      });
    },
    // 获取课程候选列表
    async getCourseList() {
      const res = await courseSelection.getCourseSelectionNewList(
        this.courseParams
      );
      if (res.code === 0) {
        this.loading = true;
        if (res.data && res.data.length) {
          this.queryCourseList = res.data;
          // 刷新筛选
          this.courseList = filterCourseList(
            this.queryParams,
            this.queryCourseList
          );
          this.isContent = this.courseList.length > 0 ? true : false;
        } else {
          this.queryCourseList = [];
          this.isContent = false;
        }
        this.mescroll.endSuccess();
      } else {
        this.mescroll.endErr();
      }
    },

    // 下拉筛选触发事件
    filterHandle(data) {
      const { projectValue, schoolValue, timeValue, weekValue } = data;
      const time = this.timeOptions.find(item => item.value === timeValue);
      this.queryParams.campusId = schoolValue || null;
      this.queryParams.projectId = projectValue || null;
      this.queryParams.weekLabelType = weekValue || null;
      this.queryParams.endTime = timeValue ? time.endTime : null;
      this.queryParams.startTime = timeValue ? time.startTime : null;
      this.courseList = filterCourseList(
        this.queryParams,
        this.queryCourseList
      );
      this.isContent = this.courseList.length > 0 ? true : false;
    },

    // 选课/修改课程 二次确认弹窗显示回调
    selectCourseHandle(item) {
      this.selectItem = item;
      this.selectCourseShow = true;
    },

    // 刷新上一个页面
    refreshPrevPage() {
      // 返回上个页面
      // 通知上个页面刷新
      const pages = getCurrentPages(); //获取所有页面栈实例列表
      const prevPage = pages[pages.length - 2]; //上一页页面实例
      prevPage.$vm.refresh = true; //修改上一页data里面的refresh
    },

    // 确认选课
    async confirmHandle() {
      uni.showLoading({
        title: '正在选课',
        mask: true
      });
      let res = null;
      if (this.type === 'add') {
        const params = {
          courseId: this.selectItem.id,
          schoolId: this.schoolId
        };
        res = await courseSelection.signUpCourse(params);
      } else {
        const params = {
          newCourse: this.selectItem.id,
          oldCourse: this.oldCourseInfo.id
        };
        res = await courseSelection.changeCourse(params);
      }
      uni.hideLoading();
      if (res.code === 0) {
        if (res.data.state === 0 || res.data.state === 13) {
          //选课成功
          this.selectCourseShow = false;
          uni.showToast({
            title: '选课成功',
            duration: 3000,
            mask: true,
            icon: 'none'
          });
          setTimeout(() => {
            this.refreshPrevPage();
            uni.navigateBack({ delta: 1 });
          }, 3000);
        } else if (res.data.state === 1) {
          // 正在选课
          uni.showLoading({
            title: '正在选课',
            mask: true
          });
          setTimeout(() => {
            uni.hideLoading();
          }, 1500);
        } else if (res.data.state === 2) {
          // 人数已满
          this.selectFailShow = true;
        } else {
          uni.showToast({
            title: `${res.data.reason},请下拉刷新重试`,
            duration: 2000,
            mask: true,
            icon: 'none'
          });
        }
      } else if (res.code === 50001) {
        uni.showToast({
          title: '当前选课功能使用人数过多，请下拉刷新重试',
          duration: 2000,
          mask: true,
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.course-Candidate-List-container {
  box-sizing: border-box;
  margin: 0;
  .content {
    padding: 32rpx;
    .course-card-item:not(:last-child) {
      margin-bottom: 32rpx;
    }
    .content-bottom {
      width: 360rpx;
      margin: 48rpx auto 66rpx;
      font-size: 24rpx;
      color: rgba(153, 153, 153, 1);
    }
  }
  .empty {
    margin: 136rpx auto 0;
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
  ::v-deep .u-border-bottom::after {
    border: none;
  }
}
.modal-content {
  padding: 24rpx 48rpx 56rpx;
  .black-text {
    color: #222222;
    margin: 8rpx 0 8rpx;
    font-weight: bold;
  }
  .gray-text {
    color: #666666;
  }
}
</style>
