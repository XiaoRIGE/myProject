<template>
  <view class="curriculum-container safe-area-inset-bottom">
    <!-- 标题信息，课程信息 -->
    <curriculum-header
      id="header"
      :course="currentCourse"
      :course-number="curriculumList.length"
      @switch-curriculum="switchCurriculum"
    />
    <!-- 本学期有课程展示 -->
    <!-- 考勤表 -->
    <template v-if="showContent">
      <g-skeleton :loading="loading" :skeleton="curriculumSkeleton">
        <mescroll-body
          ref="mescrollRef"
          style="min-height: 0"
          class="mt-24"
          :native="true"
          :top="0"
          bottom="0"
          :up="{ use: false }"
          :down="downOption"
          @down="downCallback"
        >
          <view id="sheet" class="attendance-sheet">
            <view class="content">
              <!-- 标题信息 -->
              <view class="attendance-sheet-title-nav u-flex u-row-between">
                <view class="attendance-sheet-title-nav-left u-flex">
                  <image
                    src="~@/static/img/calendar-icon.svg"
                    mode="aspectFit"
                  />
                  <text>考勤表</text>
                </view>
                <view class="attendance-sheet-title-nav-right">
                  <view class="num u-text-center">
                    {{ yetNumber || 0 }}/{{ attainabilityNumber || 0 }}
                  </view>
                  <view class="text u-text-center">
                    已签到/已考勤
                  </view>
                </view>
              </view>
              <!-- 考勤周次 -->
              <view class="attendance-sheet-list">
                <attendance-sheet-item
                  v-for="(item, index) in attendanceList"
                  :key="index"
                  :attendance="item"
                  @sigin="sigin"
                />
              </view>
              <!-- 提示信息 -->
              <view class="attendance-sheet-tps">
                <text class="attendance-sheet-tps-title">
                  未签到
                </text>
                <text class="attendance-sheet-tps-sub-title">
                  1.教师开启上课签到后未签到；
                </text>
                <text class="attendance-sheet-tps-sub-title">
                  2.教师开启2次签到后，第2次未签到即为未签到。
                </text>
              </view>
              <view class="attendance-sheet-tps">
                <text class="attendance-sheet-tps-title">
                  未开启
                </text>
                <text class="attendance-sheet-tps-sub-title">
                  教师未开启过签到的上课周。
                </text>
              </view>
            </view>
          </view>
        </mescroll-body>
      </g-skeleton>
    </template>
    <!-- 本学期无课程展示 -->
    <template v-else>
      <view class="no-curriculum mt-24">
        <image src="~@/static/img/no-curriculum-bg.png" mode="aspectFit" />
        <text>本学期暂无课程</text>
      </view>
      <!-- 是否可以去选课 -->
      <view v-if="false" class="select-curriculum">
        去选课
      </view>
    </template>
    <!-- 课程切换弹窗 -->
    <u-select
      v-model="curriculumModel"
      :safe-area-inset-bottom="true"
      :default-value="defaultValue"
      cancel-color="#222"
      confirm-color="#FC6C37"
      title="选择课程"
      :list="curriculumList"
      @confirm="confirm"
    />
    <!-- 弹窗不允许去签到，未首次签到显示 -->
    <u-modal
      v-model="showSiginModel"
      confirm-text="我知道了"
      :show-title="false"
      :content-style="{
        color: '#222',
        'font-size': '32rpx',
        'font-weight': 600
      }"
      confirm-color="#FC6C37"
      content="第1次签到未完成，不可进行第2次签到"
    />
  </view>
</template>

<script>
import CurriculumHeader from './components/CurriculumHeader';
import AttendanceSheetItem from './components/AttendanceSheetItem';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { course } from '@/request/api/student';
export default {
  name: 'Curriculum',
  components: {
    'curriculum-header': CurriculumHeader,
    'attendance-sheet-item': AttendanceSheetItem
  },
  mixins: [MescrollMixin],
  data() {
    return {
      prevTime: new Date().getTime(),
      showContent: true, // 是否展示有数据页面
      showSiginModel: false, // 不允许签到弹窗
      isRequest: false, // 接口是否在加载中状态
      loading: true,
      defaultValue: [0],
      currentCourse: {}, // 当前课程
      downOption: {
        use: true,
        isLock: false,
        auto: false //是否在初始化后,自动执行downCallback; 默认true
      },
      curriculumSkeleton: [
        40,
        'line{height:48rpx,r:0}',
        'card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}',
        10,
        'card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}',
        'card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}+card{width:140rpx,r:16rpx}',
        'line{width:84rpx,height:40rpx,MB:6rpx,r:0}',
        'line{width:386rpx,height:40rpx,MB:6rpx,r:0}',
        'line{width:618rpx,height:40rpx,MB:6rpx,r:0}',
        'line{width:84rpx,height:40rpx,MB:6rpx,r:0}',
        'line{width:364rpx,height:40rpx,MB:6rpx,r:0}'
      ],
      curriculumModel: false,
      attainabilityNumber: 0, // 已考勤
      yetNumber: 0, //已签到
      headerHeight: 0,
      curriculumList: [], // 课程列表
      attendanceList: [] // 签到列表
    };
  },
  computed: {
    // 获取上一次选择课的状态
    courseId() {
      return this.$store.state.course.studentCourseId;
    }
  },
  mounted() {
    // 监听页面滚动, 滚动到顶部才能执行下拉加载
    uni.$on('onHomePageScroll', (data, value) => {
      if (value === 1) {
        this.lockDownScroll(data.scrollTop);
      }
    });
  },
  methods: {
    tabMouted() {
      this.getStudentCourseList();
    },
    onTabChange() {
      // 监听tab切换
      if (!this.isRequest) {
        const currentTime = new Date().getTime();
        if (currentTime - this.prevTime > 1000) {
          this.getStudentCourseList();
        }
      }
    },
    lockDownScroll(scrollTop) {
      this.$u.debounce(() => {
        if (scrollTop < 3) {
          // 解锁
          this.mescroll.lockDownScroll(false);
        } else {
          // 加锁
          this.mescroll.lockDownScroll(true);
        }
      }, 200);
    },
    /*下拉刷新的回调 */
    downCallback() {
      //下拉加载数据
      this.getStudentAttainabilityInfo();
      // this.mescroll.endSuccess();
      //联网失败的回调,隐藏下拉刷新的状态
      // this.mescroll.endErr();
    },
    switchCurriculum() {
      // 切换课程
      this.curriculumModel = true;
    },
    // 课程切换回调
    confirm(data) {
      const value = data[0] ? data[0].value : undefined;
      if (!value || this.currentCourse.id === value) return;
      const newCourse = this.curriculumList.find(item => item.id === value);
      if (newCourse && newCourse.id) {
        this.currentCourse = JSON.parse(JSON.stringify(newCourse));
        this.getStudentAttainabilityInfo();
        // 存储当前的课程id，方便下次进来获取
        this.$store.commit('course/SET_STUDENT_COURSE_ID', value);
        const index = this.curriculumList.findIndex(item => item.id === value);
        this.defaultValue = [index];
      }
    },
    // 获取考勤列表
    async getStudentAttainabilityInfo() {
      try {
        const res = await course.getStudentAttainabilityInfo({
          courseId: this.currentCourse.id
        });
        if (this.loading) this.loading = false;
        if (res.code === 0 && res.data) {
          const { attainabilityNumber, yetNumber, attainabilityList } =
            res.data;
          this.attainabilityNumber = attainabilityNumber;
          this.yetNumber = yetNumber;
          if (attainabilityList && attainabilityList.length > 0) {
            this.attendanceList = res.data.attainabilityList;
          } else {
            this.attendanceList = [];
          }
          this.mescroll.endSuccess();
        }
        this.isRequest = false;
      } catch (err) {
        this.attendanceList = [];
        this.loading = false;
        this.isRequest = false;
      }
    },
    // 获取学生课程列表
    async getStudentCourseList() {
      try {
        if (this.isRequest === true) return;
        this.isRequest = true;
        const res = await course.getStudentCourseList();
        if (res.code === 0 && res.data) {
          if (res.data.length > 0) {
            this.curriculumList = res.data.map(item => ({
              label: item.name,
              value: item.id,
              ...item
            }));
            if (this.courseId) {
              const curriculumItem = this.curriculumList.find(
                item => item.id === this.courseId
              );
              if (curriculumItem && curriculumItem.id) {
                this.currentCourse = curriculumItem;
                // 设置默认选项
                const index = this.curriculumList.findIndex(
                  item => item.id === this.courseId
                );
                this.defaultValue = [index];
              } else {
                this.currentCourse = this.curriculumList[0];
              }
            } else {
              this.currentCourse = this.curriculumList[0];
            }
            this.getStudentAttainabilityInfo();
          } else {
            this.isRequest = false;
          }
        } else {
          // 无数据状态
          this.isRequest = false;
          this.showContent = false;
        }
      } catch (err) {
        this.isRequest = false;
        throw new Error(err);
      }
    },
    // 去签到
    sigin(data) {
      const {
        courseId,
        allowSureSign,
        attainabilityType,
        weekNumber,
        startSignNumber
      } = data;
      if (allowSureSign) {
        uni.navigateTo({
          url: `/pages/studentSignIn/gps?pageType=course&attainabilityType=${attainabilityType}&courseId=${courseId}&weekNumber=${weekNumber}&startSignNumber=${startSignNumber}`
        });
        return;
      }
      this.showSiginModel = true;
    }
  }
};
</script>

<style scoped lang="scss">
.curriculum-container {
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0 0 106rpx 0;
  background-color: #f5f6fa;
  .mt-24 {
    margin-top: 24rpx;
  }
  .attendance-sheet {
    box-sizing: border-box;
    padding: 0 32rpx 150rpx;
    position: relative;
    top: 12px;
    .content {
      box-sizing: border-box;
      padding: 12rpx 24rpx 20rpx;
      border-radius: 20rpx;
      background-color: #fff;
    }
    &-title-nav-left {
      image {
        width: 48rpx;
        height: 48rpx;
      }
      text {
        margin-left: 8rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: $u-main-color;
      }
    }
    &-title-nav-right {
      .num {
        font-size: 36rpx;
        font-weight: bold;
        color: $u-main-color;
      }
      .text {
        font-size: 22rpx;
        color: $u-content-color;
      }
    }
    &-tps:not(:last-child) {
      margin-bottom: 16rpx;
    }
    &-tps {
      box-sizing: border-box;
      padding-top: 16rpx;
      text {
        display: block;
      }
      &-title {
        font-size: 28rpx;
        font-weight: bold;
        color: $u-main-color;
      }
      &-sub-title {
        line-height: 42rpx;
        font-size: 28rpx;
        color: $u-content-color;
      }
    }
    &-list {
      width: 100%;
      box-sizing: border-box;
      padding: 32rpx 0 16rpx;
      display: grid;
      grid-template-columns: repeat(4, 25%);
      grid-row-gap: 24rpx;
      justify-items: center;
    }
  }
  .no-curriculum {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 60rpx 0 0;
    image {
      width: 400rpx;
      height: 300rpx;
    }
    text {
      box-sizing: border-box;
      padding: 40rpx 0;
      font-size: 32rpx;
      color: $u-main-color;
    }
  }
  .select-curriculum {
    width: 232rpx;
    text-align: center;
    line-height: 80rpx;
    background-color: $u-type-primary;
    border-radius: 20rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #fff;
    margin: 0 auto;
  }
  &::v-deep {
    .u-select__header__title {
      font-size: 36rpx;
      font-weight: bold;
    }
    .u-select__header__cancel {
      font-size: 32rpx;
    }
    .u-select__header__confirm {
      font-size: 32rpx;
    }
  }
}
</style>
