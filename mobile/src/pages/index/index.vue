<template>
  <view class="page-content safe-area-inset-bottom">
    <!-- 学生端 -->
    <template v-if="role === 'student'">
      <!-- 首页 -->
      <home
        v-show="currentPage === 0"
        ref="homeRef"
        :current-page="currentPage"
        @refreshSemester="refreshSemester"
        @on-click="homeOnClick"
      />
      <!-- 课程 -->
      <curriculum
        v-show="currentPage === 1"
        ref="curriculumRef"
        :current-page="currentPage"
      />
      <!-- 课外活动 -->
      <student-activitie
        v-show="currentPage === 2"
        ref="activitieRef"
        :current-page="currentPage"
      />
      <!-- 我的 -->
      <mine
        v-show="currentPage === 3"
        ref="mineRef"
        :current-page="currentPage"
      />
    </template>
    <!-- 教师端 -->
    <template v-else-if="role === 'teacher'">
      <!-- 工作台 -->
      <workbench
        v-show="currentPage === 0"
        ref="workbenchRef"
        :current-page="currentPage"
      />
      <!-- 我的 -->
      <mine
        v-show="currentPage === 2"
        ref="mineRef"
        :current-page="currentPage"
      />
    </template>
    <!-- 版本更新 -->
    <g-versionModal
      :version-info="versionInfo"
      :show="show"
      :plat="plat"
      @versionShow="versionShowHandle"
    />
    <!-- 用户存在跑步缓存，提示是否继续跑步 -->
    <u-modal
      v-model="showIsContinueRunModel"
      content="你有一条未完成的跑步数据，是否继续跑步"
      confirm-text="是"
      cancel-text="否"
      :show-cancel-button="true"
      :show-title="false"
      :content-style="{
        color: '#222',
        'font-size': '32rpx',
        'font-weight': 600
      }"
      confirm-color="#FC6C37"
      @confirm="confirmHandle"
      @cancel="cancelHandle"
    />
    <g-tabbar
      v-model="currentPage"
      :list="tabBarlist[role]"
      @on-change="tabMouted"
    />
  </view>
</template>

<script>
const refsMenu = {
  student: {
    0: 'homeRef',
    1: 'curriculumRef',
    2: 'activitieRef',
    3: 'mineRef'
  },
  teacher: {
    0: 'workbenchRef',
    2: 'mineRef'
  }
};

import events from '@/nativeEvent';
import { tabBarlist } from './common';
import { getRole, getUserInfo } from '@/utils/common';
import { getAllSemester, getCurrentSemester } from '@/request/api/semester';
import { getLastVersion } from '@/request/api/authorization';
import backPressMixin from '@/mixins/backPressMixin';
/**
 * @description 学生端页面组件
 * */
import Home from '@/pages/home/index';
import Mine from '@/pages/mine/index';
import Curriculum from '@/pages/curriculum/index';
import StudentActivitie from '@/pages/studentActivitie/list';

const noSemester = 'no-semester';

/**
 * @description 教师端页面组件
 * */
import Workbench from '@/pages/workbench/index';
const moutedTab = {};
export default {
  onShow() {
    this.onTabChange({
      event: 'show',
      query: this.pageQuery
    });
  },
  components: {
    home: Home,
    mine: Mine,
    curriculum: Curriculum,
    'student-activitie': StudentActivitie,
    workbench: Workbench
  },
  onLoad() {
    this.getCurrentSemester();
    // 打开App检查缓存
    events.checkAIRecordCache();
  },
  onReady() {
    this.getPlatform();
  },
  mixins: [backPressMixin],
  data() {
    return {
      currentPage: 0,
      latitude: '',
      longitude: '',
      pageQuery: {
        activitie: {
          refresh: false
        }
      },
      plat: 0, //1安卓  2ios
      versionInfo: null, // 更新信息
      show: false, // 版本更新弹窗状态
      showIsContinueRunModel: false, //是否弹出继续跑步弹窗
      version: 0, //版本号
      checkRunning: true, // 是否检查跑步缓存
      tabBarlist: Object.freeze(tabBarlist)
    };
  },
  computed: {
    schoolId() {
      return getUserInfo().schoolId;
    },
    role() {
      return getRole((getUserInfo() || {}).identity);
    }
  },
  watch: {
    currentPage: {
      handler() {
        this.onTabChange({ event: 'watch' });
      }
    }
  },

  onPageScroll(e) {
    // 监听页面滚动
    uni.$emit('onHomePageScroll', e, this.currentPage);
  },

  methods: {
    // 获取所有学期信息
    async getAllSemester() {
      const res = await getAllSemester();
      if (res.code === 0) {
        this.$store.commit('semester/SET_SEMESTER_LIST', res.data || []);
      }
    },
    refreshSemester() {
      // 刷新学期, 需要判断不在学期中，不在学期中则不请求
      this.getCurrentSemester();
    },
    // 获取当前学期
    async getCurrentSemester() {
      try {
        const res = await getCurrentSemester();
        if (res.code === 0) {
          let store = { semesterId: noSemester };
          if (res.data) {
            store = res.data;
            if (this.$refs.homeRef) {
              if (typeof this.$refs.homeRef.getRunningLimit === 'function') {
                this.$refs.homeRef.getRunningLimit();
              }
              if (typeof this.$refs.homeRef.getAiRule === 'function') {
                this.$refs.homeRef.getAiRule();
              }
            }
          } else if (res.data === null) {
            // 不在学期中
            uni.showToast({
              title: '当前时间不在学期中',
              icon: 'none'
            });
          }
          this.$store.commit('semester/SET_CURRENT_SEMESTER', store);
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    // 获取最新版本号
    async getVersion() {
      try {
        const res = await getLastVersion({ platform: this.plat });
        if (res.data && res.code === 0) {
          // #ifndef H5
          this.version = plus.runtime.versionCode; //当前版本号
          const newVersion = res.data.version; //最新版本号
          if (res.data.schoolId && res.data.schoolId !== 'ALL') {
            if (
              res.data.schoolId === this.schoolId &&
              newVersion > this.version
            ) {
              if (res.data.enforce) {
                // 需要强制跟新
                this.versionInfo = res.data;
                this.show = true;
              }
              // 非强制更新需要检测缓存，弹出对话框
              this.checkRunning = !res.data.enforce;
            }
          } else if (res.data.schoolId && res.data.schoolId === 'ALL') {
            if (newVersion > this.version) {
              // 是否需要强制跟新
              if (res.data.enforce) {
                this.versionInfo = res.data;
                this.show = true;
              }
              // 非强制更新需要检测缓存，弹出对话框
              this.checkRunning = !res.data.enforce;
            }
          }
          // #endif
        }
        if (this.checkRunning) {
          this.checkRunningCacheHandle();
        }
      } catch (err) {
        this.checkRunningCacheHandle();
        throw new Error(err);
      }
    },

    // 监听原生是否有跑步缓存事件
    checkRunningCacheHandle() {
      // if (process.env.NODE_ENV !== 'development') {
      //   uni.showLoading({
      //     title: '加载中...',
      //     mask: true
      //   });
      // }
      // try {
      //   events.checkRunningCache(null, 'parse').then(res => {
      //     this.showIsContinueRunModel = res.hasRunningCache;
      //     uni.hideLoading();
      //   });
      // } catch (err) {
      //   uni.hideLoading();
      //   throw new Error(err);
      // }
    },

    // 不继续跑
    cancelHandle() {
      this.showIsContinueRunModel = false;
      events.IsContinueRunning({
        IsContinueRunning: false
      });
    },

    // 继续跑
    confirmHandle() {
      this.showIsContinueRunModel = false;
      events.IsContinueRunning({
        IsContinueRunning: true
      });
    },

    // 隐藏弹窗
    versionShowHandle() {
      this.show = false;
    },

    // 获取客户端平台
    getPlatform() {
      uni.getSystemInfo({
        success: (res) => {
          if (res.platform === 'android') {
            this.plat = 1;
          } else if (res.platform === 'ios') {
            this.plat = 2;
          }
          this.getVersion();
        }
      });
    },
    // 自定义mouted 函数，在每个tab第一次切换的时候触发,防止在HOM页面请求所有接口
    tabMouted() {
      if (!moutedTab[this.currentPage]) {
        const ref = refsMenu[this.role][this.currentPage];
        if (ref && this.$refs[ref]) {
          if (typeof this.$refs[ref].tabMouted === 'function') {
            this.$refs[ref].tabMouted(this.currentPage);
          }
        }
        moutedTab[this.currentPage] = true;
      }
    },

    onTabChange(data) {
      if (!this.$refs || !this.role) return;
      const ref = refsMenu[this.role][this.currentPage];
      if (ref && this.$refs[ref]) {
        if (typeof this.$refs[ref].onTabChange === 'function') {
          this.$refs[ref].onTabChange(data);
        }
      }
    },
    homeOnClick() {
      this.showIsContinueRunModel = true;
    }
  }
};
</script>
