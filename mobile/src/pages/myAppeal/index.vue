<template>
  <view class="appeal-container">
    <!-- 自定义导航栏 -->
    <g-navbar
      back-icon-size="48"
      title="我的申诉"
      :border-bottom="false"
      class="navbar"
    >
      <view slot="right" class="statistic" @click="handleClick">我要申诉</view>
    </g-navbar>
    <!-- 吸顶 -->
    <view class="sticky" :style="{ top: top + 'px' }">
      <!-- 选项卡 -->
      <view class="activity-tabs">
        <u-tabs-swiper
          ref="uTabs"
          :list="tabs"
          height="88"
          font-size="32"
          :current="current"
          count="cate_count"
          :is-scroll="false"
          swiper-width="750"
          active-color="#FC6C37"
          inactive-color="#222222"
          :offset="[4, 100]"
          @change="tabsChange"
        />
      </view>
    </view>
    <!-- 申诉列表 -->
    <swiper
      class="swiper-box"
      :current="swiperCurrent"
      :style="{ height: height }"
      @transition="transition"
      @animationfinish="animationfinish"
      @change="swiperChange"
    >
      <swiper-item v-for="(item, i) in tabs" :key="i" class="swiper-item">
        <mescroll-item
          v-if="i === swiperCurrent"
          ref="mescrollItem"
          :state="item.handleState"
        />
      </swiper-item>
    </swiper>
    <g-modal
      v-model="showModal"
      :show-title="false"
      content="申诉已达上限，请稍后再试！"
      confirm-text="我知道了"
      confirm-color="#FC6C37"
    />
  </view>
</template>

<script>
import MescrollItem from './components/MescrollItem';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { mapState, mapActions, mapMutations } from 'vuex';
import running from '@/request/api/student/running';

export default {
  name: 'MyAppeal',
  components: {
    'mescroll-item': MescrollItem
  },
  mixins: [MescrollMixin],
  data() {
    return {
      tabs: [
        {
          name: '处理中',
          handleState: 0
        },
        {
          name: '已处理',
          handleState: 1,
          cate_count: 0
        }
      ],
      current: 0, //0:处理中 1:已处理
      list: [],
      swiperCurrent: 0,
      showModal: false,
      canReset: false //防止列表接口请求两次
    };
  },
  computed: {
    top() {
      return this.StatusBar + 44;
    },
    height() {
      // 需要固定swiper的高度
      return `${this.screenHeight - this.StatusBar - 44 - 45}px`;
    },
    ...mapState({
      UnReadNum: (state) => state.running.UnReadNum, //未读数量
      SemesterId: (state) => state.semester.currentSemester.id //学期id
    })
  },
  watch: {
    UnReadNum() {
      this.updateUnReadNum();
    },
    current(newVal) {
      if (newVal === 1 && this.UnReadNum !== 0) {
        this.set_UnReadNum(0); //切换tab直接手动设置未读数量为0
        // this.get_unReadNum();
      }
    }
  },
  created() {
    this.updateUnReadNum();
  },
  onShow() {
    // 加载页面的时候刷新
    this.$nextTick(() => {
      if (
        this.$refs.mescrollItem &&
        this.$refs.mescrollItem.length &&
        this.canReset
      ) {
        this.$refs.mescrollItem[0].getAppealList();
      }
      this.canReset = true;
    });
  },
  methods: {
    ...mapActions({ get_unReadNum: 'running/get_unReadNum' }),
    ...mapMutations({ set_UnReadNum: 'running/SET_UNREADNUM' }),
    //   将store中数据放到tab中
    updateUnReadNum() {
      this.$set(this.tabs, 1, {
        name: '已处理',
        cate_count: this.UnReadNum,
        handleState: 1
      });
    },
    // 检查当前用户是否可以申诉
    async checkLimit() {
      try {
        const params = {
          semesterId: this.SemesterId
        };
        const { data } = await running.getLimit(params);
        return data;
      } catch (error) {
        throw Error(error);
      }
    },
    async handleClick() {
      const data = await this.checkLimit();
      if (!data) {
        this.showModal = true;
      } else {
        uni.navigateTo({
          url: '/pages/runningAppeal/add'
        });
      }
    },
    tabsChange(index) {
      this.current = index;
      this.swiperCurrent = index;
    },
    swiperChange(e) {
      this.swiperCurrent = e.detail.current;
    },
    // swiper-item左右移动，通知tabs的滑块跟随移动
    transition(e) {
      const dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
    // swiper滑动结束，分别设置tabs和swiper的状态
    animationfinish(e) {
      const current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.swiperCurrent = current;
      this.current = current;
    }
  }
};
</script>

<style scoped lang="scss">
.appeal-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  .navbar {
    .statistic {
      margin-right: 40rpx;
      font-size: 30rpx;
      font-weight: 400;
      color: $uni-color-primary;
    }
  }
  .empty {
    margin: 224rpx auto 0;
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
}
</style>
