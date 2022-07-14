<template>
  <view class="mine-page-container safe-area-inset-bottom">
    <!-- Header -->
    <student-header v-if="role === 'student'" />
    <teacher-header v-if="role === 'teacher'" />
    <!-- 工作台 学生权限 -->
    <workbench v-if="role === 'student' && manager === '1'" />
    <!-- 设置、联系客服 菜单列表 legym lz123@officel2tpvpn~-->
    <view v-if="menuList && Array.isArray(menuList)" class="mine-list">
      <template v-for="item in menuList">
        <view
          :key="item.id"
          class="menu-item-container"
          @click="contactCustomer(item)"
        >
          <view class="mine-list-item u-flex u-row-between">
            <view class="mine-list-item-left u-flex">
              <image :src="item.icon" mode="aspectFit" />
              <text>{{ item.label || 'label' }}</text>
            </view>
            <view class="right-box u-flex .u-row-center">
              <text v-if="UnReadNum && item.id === 5" class="message-num">
                {{ UnReadNum }}
              </text>
              <image
                class="arrow-img"
                src="~@/static/img/cell/right-arrow.svg"
                mode="aspectFit"
              />
            </view>
          </view>
        </view>

        <menu-item
          v-if="false"
          :key="item.id"
          :menu-item="item"
          @menu-click="contactCustomer"
        />
      </template>
    </view>
    <!-- 联系客服，拨打电话确定框 -->
    <u-action-sheet
      v-model="showActionSheet"
      :cancel-btn="true"
      :safe-area-inset-bottom="true"
      :list="telePhoneList"
      @click="call"
    />
    <!-- 联系客服弹窗，不在服务时间内 -->
    <u-modal
      v-model="showWorkbench"
      title="不在服务时间"
      content="客服工作时间为：工作日10:00-19:00"
      confirm-text="我知道了"
      confirm-color="#FC6C37"
    />

    <g-tabbar :current="3" />
  </view>
</template>

<script>
import { getRole, getUserInfo } from '@/utils/common';
import { course, grade } from '../../request/api/student';
import StudentHeader from './components/StudentHeader';
import TeacherHeader from './components/TeacherHeader';
import Workbench from './components/Workbench';
import MenuItem from './components/MenuItem';
import _ from 'lodash';
import { mapState, mapActions } from 'vuex';

const student = [
  // {
  //   label: '我的AI运动',
  //   id: 3,
  //   path: '/pages/studentMyAI/index',
  //   icon: require('@/static/img/ai-icon.svg')
  // },
  {
    id: 3,
    icon: require('@/static/img/activity-icon.svg'),
    label: '我的活动',
    path: '/pages/studentMyActivities/index'
  },
  {
    id: 5,
    path: '/pages/myAppeal/index',
    icon: require('@/static/img/appeal.svg'),
    label: '我的申诉',
    messageNum: 0
  },
  {
    id: 6,
    path: '/pages/teacherEvaluation/index',
    icon: require('@/static/img/evaluate.svg'),
    label: '教师评价'
  },
  {
    id: 1,
    path: '/pages/setting/index',
    icon: require('@/static/img/setting-icon.svg'),
    color: '#38364D',
    label: '设置'
  },
  {
    id: 2,
    icon: require('@/static/img/customer-icon.svg'),
    label: '联系客服'
  }
];
const teacher = [
  {
    id: 1,
    path: '/pages/setting/index',
    icon: require('@/static/img/setting-icon.svg'),
    color: '#38364D',
    label: '设置'
  },
  {
    id: 2,
    icon: require('@/static/img/customer-icon.svg'),
    label: '联系客服'
  }
];

export default {
  name: 'Mine',
  components: {
    'student-header': StudentHeader,
    'teacher-header': TeacherHeader,
    workbench: Workbench,
    'menu-item': MenuItem
  },
  props: {
    currentPage: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      showActionSheet: false,
      prevTime: new Date().getTime(),
      showWorkbench: false,
      manager: 0, // 没有权限
      isOnlyShowAll: false, // 只展示总分
      menuList: [],
      student,
      teacher
    };
  },
  computed: {
    userInfo() {
      return getUserInfo();
    },
    role() {
      return getRole((this.userInfo || {}).identity);
    },
    telePhoneList() {
      return this.$store.state.app.telePhoneList.map((phone) => {
        return { text: `呼叫 ${phone}`, phone, fontSize: '32', color: '#333' };
      });
    },
    ...mapState({
      UnReadNum: (state) => state.running.UnReadNum //未读数量
    })
  },

  methods: {
    ...mapActions({ get_unReadNum: 'running/get_unReadNum' }),
    // 监听第一次打开该页面
    // tabMouted() {
    //   this.getManager();
    //   this.menuList = this.role === 'student' ? this.student : this.teacher;
    // },
    onTabChange() {
      const currentTime = new Date().getTime();
      if (currentTime - this.prevTime > 1000) {
        this.getManager();
        this.menuList = this.role === 'student' ? this.student : this.teacher;
        if (this.role === 'student') {
          this.getShowGradeState();
          this.get_unReadNum();
        }
        this.prevTime = currentTime;
      }
    },
    // 联系客服
    contactCustomer({ id, path }) {
      if (path) {
        return uni.navigateTo({ url: path });
      }
      if (id === 2) {
        // 联系客服
        const hours = new Date().getHours();
        // 判断是否在服务时间内
        if (hours >= 10 && hours < 19) {
          this.showActionSheet = true;
        } else {
          this.showWorkbench = true;
        }
      }
    },
    call(index) {
      // 拨打电话
      uni.makePhoneCall({
        phoneNumber: this.telePhoneList[index].phone,
        fail: () => {
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none',
            mask: true
          });
        }
      });
    },
    async getManager() {
      // 获取该学生是否为管理员
      if (this.role === 'student') {
        const res = await course.manager();
        if (res.code === 0 && res.data) {
          this.manager = res.data;
        }
      }
    },
    async getShowGradeState() {
      const isExist = _.some(this.menuList, ['id', 4]);
      try {
        const res = await grade.isShowGrade();
        // res.data = 2;
        if (res.code === 0) {
          // app成绩显示：0不展示分数、1仅展示总分、2展示所有分数
          /**
           * @todo 需要删除该下代码
           * */
          // res.data = 2;
          if (res.data) {
            if (res.data === 1) {
              this.isOnlyShowAll = true;
            } else if (res.data === 2) {
              this.isOnlyShowAll = false;
            }
            const gradeItem = {
              label: '我的成绩',
              id: 4,
              path: `/pages/studentMyGrade/index?isOnlyShowAll=${this.isOnlyShowAll}`,
              icon: require('@/static/img/grade-icon.svg')
            };
            if (!isExist) {
              this.menuList.splice(0, 0, gradeItem);
            } else {
              this.menuList.splice(0, 1, gradeItem);
            }
          } else {
            if (isExist) {
              this.menuList.splice(0, 1);
            }
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.mine-page-container {
  min-height: 100vh;
  background-color: #fff;
  .mine-list {
    box-sizing: border-box;
    padding-top: 32rpx;
  }
  ::v-deep {
    .u-gab {
      background-color: #f0f0f0;
      height: 18rpx;
    }
    .u-actionsheet-cancel {
      height: 108rpx;
    }
    .u-drawer-content {
      border-radius: 24rpx 24rpx 0 0;
    }
  }

  .menu-item-container {
    .mine-list-item {
      box-sizing: border-box;
      padding: 32rpx 64rpx;
      &-left {
        image {
          width: 44rpx;
          height: 44rpx;
        }
        text {
          font-size: 32rpx;
          margin-left: 16rpx;
          color: $u-main-color;
        }
      }
      .arrow-img {
        width: 36rpx;
        height: 36rpx;
      }
    }
    .message-num {
      display: inline-block;
      padding: 0 8rpx;
      border-radius: 15rpx;
      min-width: 30rpx;
      height: 30rpx;
      box-sizing: border-box;
      background: #f74c31;
      font-size: 20rpx;
      font-weight: 500;
      text-align: center;
      color: $uni-text-color-inverse;
      line-height: 30rpx;
    }
  }
}
</style>
