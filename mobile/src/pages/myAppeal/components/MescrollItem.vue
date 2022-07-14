<template>
  <mescroll-uni
    :ref="'mescrollRef' + i"
    :native="true"
    :safearea="true"
    :top="0"
    :bottom="0"
    :up="upOption"
    :down="downOption"
    @up="upCallback"
    @down="downCallback"
    @init="mescrollInit"
  >
    <view v-show="list.length > 0" class="appeal-list">
      <appeal-item
        v-for="(items, idx) in list"
        :key="idx"
        :card-info="items"
        @click.native="handleClick(items.id)"
      />
    </view>
    <g-noData v-show="list.length === 0" />
  </mescroll-uni>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import MescrollMoreItemMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js';
import AppealItem from './AppealItem.vue';
import running from '@/request/api/student/running';

export default {
  components: {
    'appeal-item': AppealItem
  },
  mixins: [MescrollMixin, MescrollMoreItemMixin],
  props: {
    state: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      downOption: {
        auto: false
      },
      upOption: {
        textColor: '#999999',
        bgColor: 'rgba(245,246,250,1)',
        use: true,
        auto: true, // 是否在初始化完毕之后自动执行一次上拉加载的回调
        textNoMore: '—— 没有更多啦 ——',
        noMoreSize: 4,
        page: {
          num: 0,
          size: 20,
          time: null
        },
        empty: {
          use: false
        }
      },
      list: [],
      page: 1,
      size: 20
    };
  },

  methods: {
    // 上拉加载
    upCallback(page) {
      this.page = page.num;
      this.getAppealList();
    },
    downCallback() {
      // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
      this.mescroll.resetUpScroll();
    },
    // 将接口数据处理为界面可以直接使用的形式
    processData(dataSource) {
      if (!dataSource) return [];
      return dataSource.map((item) => {
        return {
          ...item,
          appealTime: this.$u.timeFormat(item.appealTime, 'yyyy-mm-dd hh:MM'),
          handleStateStr:
            item.handleState === 0
              ? '待处理'
              : item.handleState === 1
              ? '申诉成功'
              : '申诉失败'
        };
      });
    },
    // 获取申诉列表
    async getAppealList() {
      const { state } = this.$props;
      const params = {
        handleState: state,
        page: this.page,
        size: this.size
      };

      try {
        const { data } = await running.getAppealList(params);
        if (this.page === 1) {
          this.list = this.processData(data.items);
        } else {
          this.list = [...this.list, ...this.processData(data.items)];
        }
        const curDataSize = data.items ? data.items.length : 0;
        // 判断还有无下一页
        this.mescroll.endSuccess(curDataSize, data.total > this.list.length);
      } catch (error) {
        this.mescroll.endErr();
        throw Error(error);
      }
    },
    handleClick(id) {
      uni.navigateTo({
        url: `/pages/runningAppeal/detail?id=${id}&page=list`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.appeal-list {
  padding: 0 24rpx;
  // padding-bottom: 100rpx;
  // .activity-card-item {
  //   width: 702rpx;
  //   height: 312rpx;
  // }
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
</style>
