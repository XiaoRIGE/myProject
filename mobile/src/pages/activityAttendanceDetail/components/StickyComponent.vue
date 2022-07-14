<template>
  <view
    id="sticky"
    class="student-attendance-list"
    :style="{ top: `${top}px` }"
  >
    <view class="search u-flex" @click="click">
      <image
        class="search-img"
        src="~@/static/img/search.png"
        mode="scaleToFill"
      />
      <view class="ipt-text">
        <text>
          {{ value ? value : '搜索学生学号' }}
        </text>
      </view>
      <image
        :style="value ? {} : { visibility: 'hidden' }"
        class="close-img"
        src="~@/static/img/close.png"
        mode="scaleToFill"
        @click.stop="clearHandle"
      />
    </view>
    <view class="line" />
    <statisitics-box
      :count-info="countInfo"
      :limit-people-number="limitPeopleNumber"
    />
    <!-- 键盘 -->
    <u-mask
      v-show="show"
      :show="show"
      :custom-style="{ marginTop: `0px` }"
      @click="clickMaskHandle"
    >
      <g-navbar
        id="navBar"
        height="44"
        :border-bottom="false"
        :is-back="false"
        back-icon-size="48"
        title="活动考勤"
      />
      <view class="modal-content-search" @tap.stop>
        <view class="search u-flex">
          <g-search
            v-model="value"
            height="64"
            type="number"
            bg-color="#F5F6FA"
            shape="square"
            :show-action="false"
            :clearabled="true"
            :focus="show"
            placeholder="搜索学生学号"
            @clear="clearHandle"
            @search="confirmSearchHandle"
          />
        </view>
      </view>
      <!-- <u-keyboard
        v-model="show"
        mode="number"
        :mask="false"
        class="keyboard"
        :mask-close-able="false"
        @change="valChange"
        @backspace="backspace"
        @cancel="cancelSearchHandle"
        @confirm="confirmSearchHandle"
      /> -->
    </u-mask>
  </view>
</template>

//
<script>
// import { toRpx } from '@/utils/common';
import StatisiticsBox from './StatisiticsBox';

export default {
  name: 'StickyComponent',
  components: {
    'statisitics-box': StatisiticsBox
  },
  props: {
    scrollTop: {
      type: Number,
      default: null
    },
    asideTop: {
      type: Number,
      default: null
    },
    limitPeopleNumber: {
      type: Number,
      default: null
    },
    isOpenSignIn: {
      type: Boolean,
      default: false
    },
    originationShow: {
      type: Boolean,
      default: false
    },
    countInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      value: '', //搜索内容
      tabInitTop: 0, //搜索框初始化距顶部的距离
      tabTop: 0, //适应学院展示效果影响搜索框距顶部的距离
      isFixedTop: false, //是否固定顶部
      top: 0, //设置吸顶时距顶部的距离
      show: false
      // countInfo: null
    };
  },
  watch: {
    scrollTop(val) {
      if (this.originationShow) {
        this.isFixedTop =
          val >= this.tabTop + this.StatusBar + 44 - 15 ? true : false;
      } else {
        this.isFixedTop =
          val >= this.tabTop + this.StatusBar + 44 - 200 ? true : false;
      }
    },
    originationShow() {
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .select('#sticky')
          .boundingClientRect(res => {
            if (res && res.top > 0) {
              this.tabTop = res.top;
            }
          })
          .exec();
      });
    },
    value(val) {
      if (val === '') {
        this.$emit('searchStu', this.value);
      }
    }
  },
  mounted() {
    this.top = this.StatusBar + 44;
    if (this.tabInitTop === 0) {
      //获取节点距离顶部的距离
      uni
        .createSelectorQuery()
        .select('#sticky')
        .boundingClientRect(res => {
          if (res && res.top > 0) {
            this.tabInitTop = res.top;
            this.tabTop = res.top;
          }
        })
        .exec();
    }
  },
  methods: {
    // 点击搜索吸顶操作
    click() {
      this.show = true;
    },

    // 点击搜索控制蒙层
    clickMaskHandle() {
      this.show = false;
      // this.value ='';
    },

    // 键盘搜索键
    confirmSearchHandle() {
      this.show = false;
      this.$emit('searchStu', this.value);
    },
    // 点击搜索清除内容
    clearHandle() {
      this.value = '';
      if (!this.show) {
        this.$emit('searchStu', this.value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.student-attendance-list {
  z-index: 990;
  position: sticky;
  width: 100%;
  padding: 32rpx 40rpx 24rpx;
  background: rgba(255, 255, 255, 1);
  .line {
    margin-top: 24rpx;
    width: 100%;
    height: 2rpx;
    background: rgba(240, 240, 240, 1);
  }
  .search {
    width: 100%;
    height: 64rpx;
    background: rgba(245, 246, 250, 1);
    border-radius: 16rpx;
    padding: 8rpx 24rpx;
    line-height: 64rpx;
    .ipt-text {
      text-align: left;
      width: 480rpx;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      font-size: 28rpx;
    }
    .search-img,
    .close-img {
      width: 48rpx;
      height: 48rpx;
    }
  }
}
.modal-content-search {
  z-index: 10075;
  width: 750rpx;
  padding: 24rpx 56rpx;
  background: rgba(255, 255, 255, 1);
  .search {
    width: 100%;
    height: 64rpx;
    background: rgba(245, 246, 250, 1);
    border-radius: 16rpx;
    padding: 8rpx 24rpx;
    line-height: 64rpx;
    .ipt-text {
      text-align: left;
      width: 480rpx;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      font-size: 28rpx;
    }
    .search-img,
    .close-img {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .line {
    margin-top: 24rpx;
    width: 100%;
    height: 2rpx;
    background: rgba(240, 240, 240, 1);
  }
}
.fixed {
  position: sticky;
  z-index: 2000;
  background: #fff;
}
</style>
