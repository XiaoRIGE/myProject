<template>
  <view class="detail-pages-container">
    <!-- nav-bar -->
    <g-navbar title="成绩详情" :border-bottom="false" />
    <!-- headers -->
    <view id="card" :class="[{ 'card-bottom-shadow': shadow }]">
      <view v-if="pageState === 'show'" class="tips-content">
        <text>成绩已复核，无法进行修改</text>
      </view>
      <view class="header-card">
        <detail-card :target="detail" />
      </view>
    </view>

    <!-- 滚动列表，成绩项目列表 -->
    <scroll-view
      class="scroll-container"
      scroll-y
      :style="{ height: scrollHeight + 'px' }"
      @scroll="scroll"
    >
      <view>
        <!-- 计分模式 -->
        <view v-if="scoringModel" class="scoring-model u-flex u-row-left">
          <image
            class="tips-icon"
            src="~@/static/img/examinationResults/tips.svg"
            mode="scaleToFill"
          />
          <text class="text">单项成绩展示方式：{{ scoringModel }}</text>
        </view>
        <template v-for="(item, index) in list">
          <view v-if="item.type === 'line'" :key="index" class="h16" />
          <form-item
            v-else
            ref="formItemRef"
            :key="index"
            :disabled="item.disabled"
            :hidden-proportion="item.hiddenProportion || false"
            :rules="item.rules || []"
            :input-type="item.inputType"
            :show-score="item.showScore"
            :target="item"
            :type="item.type"
            @blur="blur"
          />
        </template>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view v-if="showFooterBtn" id="footerBtn" class="footer-btn">
      <u-button
        :hair-line="false"
        :custom-style="{ ...customStyle }"
        :ripple="true"
        :disabled="disabled"
        @click="submit"
      >
        保存
      </u-button>
    </view>

    <!-- 修改未保存，返回上一页，弹窗提示 -->
    <g-modal
      v-model="backModel"
      content="数据未保存，是否返回"
      :show-cancel-button="true"
      confirm-text="继续录入"
      cancel-text="返回"
      @confirm="backModel = false"
      @cancel="cancel"
    />
  </view>
</template>

<script>
import DetailCard from './components/DetailCard';
import FormItem from './components/FormItem';
import { achievement } from '@/request/api/teacher';
import { getScoreProjectList, setOriginalVs, verificationBtn } from './common';
const disabledStyle = {
  backgroundColor: '#FDB59B'
};
const submitStyle = {
  backgroundColor: '#FC6C37'
};

const scoringModelTypes = {
  0: '小分制',
  1: '百分制'
};

export default {
  components: {
    'detail-card': DetailCard,
    'form-item': FormItem
  },
  onLoad(options) {
    const { uid, cid, n, state } = options;
    this.query.courseId = cid;
    this.query.userId = uid;
    this.number = n;
    this.pageState = state === '1' ? 'edit' : 'show';
    if (this.pageState === 'show') {
      this.showFooterBtn = false;
    }
    this.getUserDetail();
    this.getSingleShowType();
  },
  data() {
    return {
      scoringModel: '', // 计分模式
      disabledvalue: [], //是否修改值的标识,用于保存未修改之前的数据
      pageState: 'edit', // 是否已经复核，查看和编辑show edit
      backModel: false,
      isBack: true, // 是否可以返回
      showFooterBtn: true,
      shadow: false,
      disabled: false, // 是否存在数据的修改，每次修改之后验证
      scrollHeight: 500,
      scrollTop: 80,
      query: {
        courseId: '',
        userId: ''
      },
      detail: {},
      list: []
    };
  },
  computed: {
    customStyle() {
      const commonStyle = {
        fontSize: '32rpx',
        fontWeight: 600,
        height: '92rpx',
        borderRadius: '24rpx',
        border: 'none',
        color: '#fff'
      };
      if (this.disabled) {
        return Object.assign({}, commonStyle, disabledStyle);
      } else {
        return Object.assign({}, commonStyle, submitStyle);
      }
    },
    headerData() {
      return this.$store.state.examination.tableHeader;
    }
  },
  methods: {
    submit() {
      // 验证
      let validateState = true;
      let errMessage = '';
      this.$nextTick(() => {
        const formList = this.$refs.formItemRef;
        const setValue = (val) => {
          if (String(val).trim() === '') return null;
          if (val === '0') return 0;
          return val;
        };
        if (Array.isArray(formList) && formList.length > 0) {
          let _index = 0;
          while (_index < formList.length) {
            if (typeof formList[_index].validate === 'function') {
              // eslint-disable-next-line no-loop-func
              formList[_index].validate((val, target, err) => {
                if (!val) {
                  validateState = val;
                  errMessage = err;
                }
              });
            }
            ++_index;
          }
          if (validateState) {
            // 处理参数
            const {
              id,
              activity,
              sign,
              running,
              fitness,
              theoryExamination,
              additionalPoints,
              coursePerformance,
              content
            } = this.detail;
            const { courseId, userId } = this.query;
            const result = {
              id,
              courseId,
              userId,
              sign, // 考勤
              running, // 跑步
              activity, // 活动
              fitness, // 体质健康
              theoryExamination, // 理论考试
              coursePerformance, // 课堂表现
              additionalPoints, // 附加分
              content, // 备注
              subjectSettingListVO: []
            };
            this.disabledvalue.map(({ rule, key, newval, oldval, special }) => {
              if (rule) {
                if (!special && newval !== oldval) {
                  // 非专项成绩
                  result[key] = setValue(newval);
                } else {
                  // 考勤未修改传null
                  if (key === 'sign') {
                    result.sign = null;
                  }
                  // 理论考试未修改传null
                  if (key === 'theoryExamination') {
                    result.theoryExamination = null;
                  }
                }
                if (special) {
                  // 专项成绩
                  result.subjectSettingListVO.push({
                    id: key,
                    value: setValue(newval)
                  });
                }
              }
            });
            // 提交成绩
            // 提交成功后，返回上一页
            this.update(result);
          } else {
            uni.showToast({
              title: errMessage,
              icon: 'none',
              mask: true
            });
          }
        }
      });
    },
    getHeight() {
      const card = uni.createSelectorQuery().select('#card');
      const footerBtn = uni.createSelectorQuery().select('#footerBtn');
      card
        .boundingClientRect((card) => {
          if (card && card.height) {
            const topHeight = card.height + this.StatusBar + 44;
            this.scrollTop = topHeight;
            footerBtn
              .boundingClientRect((footerBtnData) => {
                let cuHeight = topHeight;
                if (footerBtnData && footerBtnData.height) {
                  cuHeight += footerBtnData.height;
                }
                this.scrollHeight = this.screenHeight - cuHeight;
              })
              .exec();
          }
        })
        .exec();
    },
    scroll({ target }) {
      if (target.scrollTop > 20) {
        if (!this.shadow) this.shadow = true;
      } else {
        if (this.shadow) this.shadow = false;
      }
    },
    blur({ data, rule, value }) {
      const { id } = data;
      const currentD = {
        value,
        id
      };
      // 计算分数
      // 判断验证是否通过
      const index = this.disabledvalue.findIndex((item) => item.key === id);
      if (rule) {
        if (index > -1 && !this.disabledvalue[index].rule) {
          this.disabledvalue[index].rule = true;
        }
        // 赋新值
        this.disabledvalue[index].newval = value;
        //  计算分数
      } else {
        if (index > -1 && this.disabledvalue[index].rule) {
          this.disabledvalue[index].rule = false;
        }
      }
      // 验证是否可以提交（重置保存按钮状态）
      const state = !verificationBtn(this.disabledvalue, currentD);
      // this.disabled = state;
      // 修改了数据未提交不能返回
      this.isBack = state;
    },
    async getUserDetail() {
      const res = await achievement.getUserScore(this.query);
      if (res.code === 0 && res.data) {
        this.detail = res.data;
        this.detail.number = this.number; // 合并学号
        const { detail, pageState, headerData } = this;
        this.list = getScoreProjectList(headerData, detail, pageState);
        this.disabledvalue = setOriginalVs(
          res.data,
          headerData.subjectSettingListVO
        );
      }
      this.getHeight();
    },
    // 获取专项成绩的计分模式
    async getSingleShowType() {
      const res = await achievement.getSingleShowType();
      if (res.code === 0) {
        this.scoringModel = scoringModelTypes[res.data];
      }
    },
    cancel() {
      this.isBack = true;
      // 强制返回
      uni.navigateBack({ delta: 1 });
    },
    async update(query) {
      const res = await achievement.update(query);
      if (res.code === 0) {
        this.isBack = true;
        // 通知列表页面刷新
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        prevPage.$vm.isRefresh = true;
        prevPage.$vm.refreshInfo = res.data;
        uni.showToast({
          title: '修改成功',
          icon: 'success',
          mask: true
        });
        setTimeout(() => {
          uni.navigateBack({ delta: 1 });
        }, 1000);
      }
    }
  },
  onReady() {
    if (this.pageState === 'edit') {
      uni.onKeyboardHeightChange((res) => {
        if (res.height > 0) {
          this.showFooterBtn = false;
        } else {
          this.showFooterBtn = true;
        }
      });
    }
  },
  onBackPress() {
    // 未提交不能返回
    if (!this.isBack) {
      this.backModel = true;
      return true;
    }
  }
};
</script>
<style scoped>
.footer-btn {
  /* 安全区域适配 */
  height: calc(140rpx + constant(safe-area-inset-bottom));
  height: calc(140rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
<style lang="scss" scoped>
.detail-pages-container {
  position: relative;
  min-height: 100vh;
  background-color: #fff;
  .header-card {
    width: 750rpx;
    box-sizing: border-box;
    padding: 32rpx;
  }
  .tips-content {
    width: 750rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    box-sizing: border-box;
    padding: 0 32rpx;
    background-color: #fff9ec;
    color: #fc6c37;
  }
  .scroll-container {
    position: relative;
    .h16 {
      width: 100%;
      height: 16rpx;
      background-color: #f5f6fa;
    }
    .scoring-model {
      height: 50rpx;
      box-sizing: border-box;
      padding: 0 32rpx;
      .tips-icon {
        width: 28rpx;
        height: 28rpx;
      }
      .text {
        font-size: 24rpx;
        color: $u-content-color;
      }
    }
  }
  .card-bottom-shadow {
    box-shadow: -6rpx 4rpx 30rpx 2rpx rgba(137, 135, 158, 0.08);
  }
  .footer-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    padding: 24rpx 32rpx;
    background-color: #fff;
  }
}
</style>
