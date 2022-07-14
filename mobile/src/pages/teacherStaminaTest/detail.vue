<template>
  <view class="detail-container safe-area-inset-bottom">
    <g-navbar
      :custom-back="back"
      :background="{ backgroundColor: '#fff' }"
      :border-bottom="false"
      back-icon-color="#222"
      :title="title"
    />
    <!-- 用户信息 -->
    <user-card :user-info="userInfo" />
    <!-- 用户输入信息组件 -->
    <component
      :is="component"
      ref="childrenComponent"
      :comp-info="userInfo"
      :type="projectType"
      @on-change="enterChange"
    />
    <!-- 用户等级 -->
    <!-- 视力录入不展示 -->
    <user-level v-if="projectType !== 't6'" :level-info="levelInfo" />

    <!-- 底部保存按钮 -->
    <detail-footer
      :disabled="disabled"
      class="footer-content"
      :last-student="lastStudent"
      :next-student="nextStudent"
      @on-save="save"
    />
    <u-modal
      v-model="backModal.show"
      content="当前录入体测数据未保存，确认退出当前页面吗"
      :show-cancel-button="true"
      confirm-text="保存并退出"
      cancel-text="直接退出"
      :show-title="false"
      :cancel-style="{ borderRight: '0.5px solid rgba(0,0,0,0.1)' }"
      confirm-color="#FC6C37"
      cancel-color="#666"
      :content-style="{ color: '#353535', 'font-size': '34rpx' }"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </view>
</template>

<script>
import { test } from '../../request/api/teacher';
import { getTitle, componentsMenu, projectItemType } from './stamina';
import UserCard from './components/UserCard';
import DetailFooter from './components/DetailFooter';
import UserLevel from './components/UserLevel';
// 体重录入组件
import HeightWeight from './components/enterResult/HeightWeight';
// 立定跳远
import LongJump from './components/enterResult/LongJump';
// 肺活量
import VitalCapacity from './components/enterResult/VitalCapacity';
// 仰卧起坐
import Abdomina from './components/enterResult/Abdomina';
// 50米
import FiftyMeter from './components/enterResult/FiftyMeter';
// 800米、1000米
import ThousandMeter from './components/enterResult/ThousandMeter';
// 坐位体前屈 Sitting body flexion
import SittingFlexion from './components/enterResult/SittingFlexion';
// 视力
import Vision from './components/enterResult/Vision';

export default {
  name: 'TeacherStaminaTestDetail',
  components: {
    'user-card': UserCard,
    'detail-footer': DetailFooter,
    'user-level': UserLevel,
    'height-weight': HeightWeight,
    'long-jump': LongJump,
    'vital-capacity': VitalCapacity,
    abdomina: Abdomina,
    'fifty-meter': FiftyMeter,
    'thousand-meter': ThousandMeter,
    'sitting-flexion': SittingFlexion,
    vision: Vision
  },
  onLoad(options) {
    this.initParams(options);
  },
  data() {
    return {
      backModal: {
        show: false
      },
      compInfo: {},
      levelInfo: {
        // 等级数据, 录入成功后显示分数与等级
        // 整数秒如3\' 00\'\'请输入：300
        message: '',
        score: 0,
        bmi: 0,
        level: -1,
        isLevel: false
      },
      isBack: true, // 是否可以返回
      userId: '',
      projectType: '',
      disabled: true // 按钮状态
    };
  },
  computed: {
    component() {
      return componentsMenu[this.projectType];
    },
    title() {
      return getTitle(this.projectType);
    },
    userList() {
      return this.$store.state.teacherTest.studentList;
    },
    userInfo() {
      return (
        this.userList.find(user => {
          if (user && user.id) {
            return user.id === this.userId;
          }
        }) || {}
      );
    },
    // 是不是最后一个学生，或者是全校体测
    lastStudent() {
      return (this.userList[this.userList.length - 1] || {}).id === this.userId;
    },
    // 下一个学生
    nextStudent() {
      if (this.lastStudent) return {};

      const index = this.userList.findIndex(user => user.id === this.userId);
      return this.userList[index + 1] || {};
    }
  },
  watch: {
    userInfo: {
      deep: true,
      immediate: true,
      handler(newval) {
        if (newval) {
          this.levelInfo.level = newval.level;
          this.levelInfo.score = newval.totalScore;
          this.levelInfo.isLevel = true;
        }
      }
    }
  },

  beforeDestroy() {
    this.$store.commit('teacherTest/SET_STUDENT_LIST', []);
  },
  methods: {
    async saveSend(query, next) {
      const baseQuery = {
        sex: this.userInfo.gender,
        year: this.userInfo.year,
        userId: this.userId,
        type: projectItemType[this.projectType]
      };
      const res = await test.update(Object.assign({}, baseQuery, query));
      if (res.code === 0) {
        this.isBack = true;
        this.refreshPrevPage();
        uni.showToast({
          title: '录入成功',
          icon: 'success',
          duration: 1500,
          mask: true
        });
        if (next) {
          // 继续录入下一个
          this.getNext();
        } else {
          setTimeout(() => {
            uni.navigateBack({ delta: 1 });
          }, 1500);
        }
      }
    },
    initParams(options) {
      const { type, id } = options;
      this.projectType = type;
      if (type === 't10' || type === 't8') {
        this.levelInfo.message = '整数秒如3\' 00\'\'请输入：300';
      } else {
        this.levelInfo.message = '录入成功后显示分数与等级';
      }
      this.userId = id;
    },
    initLevelInfo() {
      this.levelInfo.message = '录入成功后显示分数与等级';
      this.levelInfo.score = 0;
      this.levelInfo.bmi = 0;
      this.levelInfo.level = -1;
      this.levelInfo.isLevel = false;
      this.disabled = true;
    },
    enterChange(data) {
      this.levelInfo = data;
      this.disabled = data.disabled;
      if (!data.disabled) {
        this.isBack = false;
      }
    },
    getNext() {
      // 获取下一个
      const currentIndex = this.userList.findIndex(
        user => user.id === this.userId
      );
      if (currentIndex > -1) {
        this.userId = this.userList[currentIndex + 1].id;
        // 清空原来的数据
        this.$refs.childrenComponent.clear();
        this.initLevelInfo();
      }
    },
    save(isNext) {
      // 保存，录入下一个
      this.$refs.childrenComponent.validate(query => {
        const { valid, message, data } = query;
        if (valid) {
          // 验证通过
          this.saveSend(data, isNext);
        } else {
          uni.showToast({
            title: message,
            icon: 'none',
            mask: true
          });
        }
      });
    },
    back() {
      if (this.isBack) {
        uni.navigateBack({ delta: 1 });
        return;
      }
      this.backModal.show = true;
    },
    // 保存并退出
    onConfirm() {
      this.save(false);
    },
    onCancel() {
      // 直接退出
      uni.navigateBack({ delta: 1 });
    },
    refreshPrevPage() {
      // 返回上个页面
      // 通知上个页面刷新
      const pages = getCurrentPages(); //获取所有页面栈实例列表
      const prevPage = pages[pages.length - 2]; //上一页页面实例
      prevPage.$vm.refresh = true; //修改上一页data里面的searchVal参数值为1211
    }
  }
};
</script>
<style scoped>
.footer-content {
  /* 安全区域适配 */
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
<style scoped lang="scss">
.detail-container {
  position: relative;
  background-color: #fff;
  min-height: 100vh;
  .footer-content {
    position: fixed;
    bottom: 24rpx;
  }
}
</style>
