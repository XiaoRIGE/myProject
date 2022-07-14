<template>
  <view class="open-container">
    <!-- <view class="open-container-content"> -->
    <view class="content-top">
      <sign-in-title v-if="week !== null" :week="week" />
      <view class="content-title">
        {{ number === 1 ? '首次签到已开启' : '二次签到已开启' }}
      </view>
      <view v-if="number === 1" class="content-hint">
        需要开启二次签到?
        <text class="open-second" @click="clickOpenHandle">
          去开启
        </text>
      </view>
      <view v-else class="content-hint">
        首次签到已关闭，如需补签，请手动进行签到
      </view>
      <view class="content-btn u-flex u-row-between">
        <!-- week.attainabilityType === 'GPS' && week.attainabilitySwitch -->
        <view
          class="btn-item u-flex"
          :style="{
            background: week.attainabilitySwitch ? 'rgba(255,171,2,1)' : ''
          }"
          @click="clickGspHandle"
        >
          <image
            class="btn-img gps"
            mode="scaleToFill"
            src="~@/static/img/gps.png"
          />
          <view>{{ week.attainabilitySwitch ? '关闭' : '开启' }}GPS签到</view>
        </view>
        <view class="btn-item u-flex" @click="clickScanHandle">
          <image
            class="btn-img scan"
            mode="scaleToFill"
            src="~@/static/img/scan.png"
          />
          <view>二维码签到</view>
        </view>
      </view>
    </view>
    <view id="sticky" class="content-search">
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
      <view class="data-box u-flex">
        <view class="all-stu">
          <view class="all-stu-num">
            {{ userCount }}
          </view>
          <view class="all-stu-text">
            总人数
          </view>
        </view>
        <view class="u-flex u-row-between u-flex-wrap">
          <view
            v-for="(item, index) in countInfoVo"
            :key="index"
            class="data-item u-flex u-row-between"
          >
            <view>
              <view
                class="diamonds"
                :style="{ background: stateColorArr[item.index] }"
              />
              {{ stateArr[item.index] }}
            </view>
            <view class="item-count">
              {{ item.count }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- </view> -->
    <view class="table-box">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="item u-flex u-row-between"
      >
        <view class="item-left u-flex" @click="clickUpdateSignType(item)">
          <view class="item-number">
            {{ item.number }}
          </view>
          <view class="item-name">
            {{ item.name }}
          </view>
          <view
            class="item-state"
            :style="{
              color: stateColorArr[stateArr.indexOf(item.signTypeStr)]
            }"
          >
            {{ item.signTypeStr }}
          </view>
        </view>
        <image
          class="edit-img"
          src="~@/static/img/edit.png"
          mode="scaleToFill"
          @click="editStateHandle(item)"
        />
      </view>
    </view>
    <u-mask
      v-show="show"
      :show="show"
      :custom-style="{ marginTop: `${top}px` }"
      @click="clickMaskHandle"
    >
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
    </u-mask>
    <u-modal
      v-model="openSecondShow"
      title="开启二次签到"
      :title-style="{ fontSize: '36rpx', fontWeight: 600 }"
      content="开启二次签到后，首次签到将被关闭，考勤成绩以二次签到为准"
      :content-style="{ fontSize: '34rpx', color: '#666666' }"
      :show-cancel-button="true"
      confirm-text="确认开启"
      :confirm-style="{ fontWeight: 600, color: '#FC6C37', fontSize: '36rpx' }"
      :cancel-style="{ fontWeight: 600, color: '##666666', fontSize: '36rpx' }"
      @cancel="openSecondShow = false"
      @confirm="confirmOpenHandle"
    />
    <u-action-sheet
      v-model="editSheetShow"
      :list="stateListArr"
      border-radius="24"
      @click="sheetUpdateState"
    />
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import SignInTitle from './SignInTitle';
import { attainability } from '@/request/api/teacher';
// import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import events from '@/nativeEvent';
// import MescrollBodyDiy from '@/uni_modules/mescroll-uni/components/mescroll-diy/beibei/mescroll-body.vue';

const stateList = [
  [
    {
      text: '取消签到'
    },
    {
      text: '请假'
    }
  ],
  [
    {
      text: '请假'
    }
  ],
  [
    {
      text: '取消请假'
    }
  ]
];
export default {
  name: 'OpenSignIn',
  components: {
    'sign-in-title': SignInTitle
  },
  props: {
    week: {
      type: Object,
      default: null
    },
    countInfoVo: {
      type: Array,
      default: null
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    number: {
      type: Number,
      default: 0
    },
    userCount: {
      type: Number,
      default: 0
    },
    showKeyboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      openSecondShow: false,
      editSheetShow: false,
      tabInitTop: 0, //搜索框初始化距顶部的距离
      isFixedTop: false, //是否固定顶部
      top: 0, //设置吸顶时距顶部的距离
      value: '', //搜索学号
      stateArr: ['未签到', '首次签到', '二次签到', '请假'], // 0:未签到 1:首次签到 2:二次签到 3:请假
      stateColorArr: ['#8B8A99', '#76BF26', '#2DB7B2', '#FFAB02'],
      stateListArr: [],
      selItem: null //选中的学生
    };
  },
  watch: {
    showKeyboard(val) {
      if (val === false) {
        this.show = val;
        this.$emit('editShowKeyboard');
      }
    },
    week(val) {
      if (val.startSignDataStatus) {
        this.$emit('downCallback');
      }
    },
    value(val) {
      if (val === '') {
        this.$emit('downCallback', this.value);
      }
    }
  },
  mounted() {
    this.top = this.StatusBar + 44;
  },
  methods: {
    // 点击去开启-控制开启二次签到弹窗
    clickOpenHandle() {
      this.openSecondShow = true;
    },

    // 确认开启二次签到
    confirmOpenHandle() {
      this.$emit('openSecondHandle');
      this.openSecondShow = false;
    },

    // GPS签到
    clickGspHandle() {
      const { courseId, weekNumber } = this.$props.week;
      attainability
        .getGpsInfo({
          courseId,
          times: this.$props.number,
          weekIndex: weekNumber
        })
        .then(res => {
          if (res.code === 0) {
            this.$emit('changeLoading');
            // 进入原生GPS签到页面
            events.navigatorNativePage({
              page: 'gpsSignIn',
              info: res.data
            });
          }
        })
        .catch(res => {
          this.$refs.uToast.show({
            title: res.message
          });
        });
    },

    // 二维码签到
    clickScanHandle() {
      const { courseId, weekNumber } = this.$props.week;
      this.$store.commit('attainability/SET_CURRENTATTAINABILITYINFO', {
        courseId,
        weekNumber
      });
      this.$emit('changeLoading');
      uni.navigateTo({ url: '/pages/courseAttendance/scan' });
    },

    // 手动修改考勤
    updateSignTypeHandle(item, signType) {
      attainability
        .updateSignType({
          id: item.id,
          signType
        })
        .then(res => {
          if (res.code === 0) {
            this.updateStuSignInHandle(item, signType);
          }
        });
    },

    // 修改学生签到状态列表
    updateStuSignInHandle(item, signType) {
      const newItem = { ...item };
      // signType 1:签到 2:请假 0:取消签到/请假
      if (signType === 1) {
        newItem.signType = 1;
        newItem.signTypeStr =
          newItem.signNumber === 1 ? '首次签到' : '二次签到';
      } else if (signType === 2) {
        newItem.signType = 2;
        newItem.signTypeStr = '请假';
      } else {
        newItem.signType = 0;
        newItem.signTypeStr = '未签到';
      }
      this.$emit('changelist', item, newItem);
    },

    // 点击列表-手动修改考勤
    clickUpdateSignType(item) {
      // 未签到状态 | 开启了二次签到，为首次签到状态
      if (
        item.signType === 0 ||
        (this.$props.number === 2 && item.signNumber === 1)
      ) {
        this.updateSignTypeHandle(item, 1);
      }
    },

    // 操作面板-手动修改考勤
    sheetUpdateState(index) {
      const flag = this.stateListArr[index].text;
      let signType;
      if (flag === '请假') {
        signType = 2;
      } else {
        signType = 0;
      }
      this.updateSignTypeHandle(this.selItem, signType);
    },

    // 点击搜索吸顶操作
    click() {
      this.show = true;
    },

    // 键盘搜索键
    confirmSearchHandle() {
      this.show = false;
      this.$emit('downCallback', this.value);
    },

    // 设置操作面板列表变化
    editStateHandle(item) {
      this.selItem = item;
      this.editSheetShow = true;
      if (item.signTypeStr === '首次签到' || item.signTypeStr === '二次签到') {
        this.stateListArr = stateList[0];
      } else if (item.signTypeStr === '未签到') {
        this.stateListArr = stateList[1];
      } else {
        this.stateListArr = stateList[2];
      }
    },

    // 点击搜索控制蒙层
    clickMaskHandle() {
      this.show = false;
      // this.value ='';
    },

    // 点击搜索清除内容
    clearHandle() {
      this.value = '';
      if (!this.show) {
        this.$emit('downCallback');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.open-container {
  width: 686rpx;
  font-size: 28rpx;
  padding: 32rpx 0 0;
  margin-left: 32rpx;
  border-radius: 20rpx;
  text-align: center;
  // background: rgba(255, 255, 255, 1);
  // .open-container-content {
  //   text-align: center;
  .content-top {
    padding: 32rpx 32rpx 0;
    border-radius: 20rpx 20rpx 0 0;
    background: rgba(255, 255, 255, 1);
  }
  .content-title {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 16rpx;
    margin-top: 30rpx;
  }
  .open-second {
    color: #2db7b2;
    margin-left: 6rpx;
    text-decoration: underline;
  }
  .content-btn {
    margin-top: 60rpx;
    .btn-item {
      width: 300rpx;
      height: 92rpx;
      background: rgba(252, 108, 55, 1);
      border-radius: 24rpx;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      .btn-img {
        width: 36rpx;
        height: 36rpx;
      }
      .gps {
        margin-left: 38rpx;
        margin-right: 16rpx;
      }
      .scan {
        margin-left: 54rpx;
        margin-right: 16rpx;
      }
    }
  }
  .data-box {
    width: 622rpx;
    height: 136rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 20rpx;
    border: 2rpx solid rgba(219, 218, 230, 1);
    margin-top: 24rpx;
    padding: 20rpx 32rpx;
    color: $u-content-color;
    .all-stu {
      margin-right: 40rpx;
      text-align: center;
      &-text {
        width: 95rpx;
      }
      &-num {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 48rpx;
        color: $u-main-color;
      }
    }
    .data-item {
      width: 49%;
      .diamonds {
        display: inline-block;
        width: 12rpx;
        height: 12rpx;
        margin-bottom: 4rpx;
        margin-right: 8rpx;
      }
      .item-count {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 48rpx;
        color: $u-main-color;
      }
    }
    .data-item:nth-child(2n) {
      width: 43%;
    }
  }
  // }
  .content-search {
    z-index: 990;
    position: sticky;
    top: 0;
    width: 100%;
    padding: 24rpx 32rpx;
    background: rgba(255, 255, 255, 1);
    .search {
      width: 622rpx;
      height: 64rpx;
      background: rgba(245, 246, 250, 1);
      border-radius: 16rpx;
      padding: 8rpx 24rpx;
      line-height: 64rpx;
      z-index: 20000;
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

  // .table {
  //   background: $u-bg-color;
  //   width: 100%;
  //   ::v-deep .mescroll-uni {
  //     padding: 0 32rpx 0;
  //   }
  .item {
    width: 100%;
    height: 92rpx;
    padding: 0 32rpx;
    background: #fff;
    .item-name {
      text-align: left;
      width: 140rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 94rpx;
    }
    .item-number {
      width: 204rpx;
      text-align: left;
      word-wrap: break-word;
      margin-right: 16rpx;
    }
    .item-state {
      width: 112rpx;
      text-align: center;
    }
    .item-left {
      margin-right: 8rpx;
    }
    .edit-img {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .item:last-child {
    border-radius: 0 0 20rpx 20rpx;
  }
  // }
}
.fixed {
  position: sticky;
  z-index: 2000;
  background: #fff;
}
.keyboard ::v-deep .u-mask {
  margin-top: 260rpx;
}
</style>
