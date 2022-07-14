<template>
  <view class="pagination-container u-flex u-row-between">
    <!-- left btn -->
    <view class="pagination-container-left u-flex">
      <u-button
        :hair-line="false"
        :custom-style="{ ...customStyle }"
        :ripple="true"
        :disabled="page <= 1 || total === 0"
        :style="page > 1 && total !== 0 ? btnStyle : disabledBtnStyle"
        @click="changePage('first')"
      >
        首页
      </u-button>
      <u-button
        class="ml16"
        :hair-line="false"
        :custom-style="{ ...customStyle }"
        :disabled="page <= 1 || total === 0"
        :style="page > 1 && total !== 0 ? btnStyle : disabledBtnStyle"
        :ripple="true"
        @click="changePage('prev')"
      >
        上一页
      </u-button>
    </view>
    {{ page }} / {{ pageCount }}
    <!-- right btn -->
    <view class="pagination-container-right u-flex">
      <u-button
        :disabled="page >= pageCount || total === 0"
        :style="page < pageCount && total !== 0 ? btnStyle : disabledBtnStyle"
        :hair-line="false"
        :custom-style="customStyle"
        :ripple="true"
        @click="changePage('next')"
      >
        下一页
      </u-button>
      <u-button
        :disabled="page >= pageCount || total === 0"
        :style="page < pageCount && total !== 0 ? btnStyle : disabledBtnStyle"
        class="ml16"
        :hair-line="false"
        :custom-style="customStyle"
        :ripple="true"
        @click="changePage('end')"
      >
        尾页
      </u-button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Pagination',
  model: {
    prop: 'page',
    event: 'input'
  },
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      customStyle: {
        height: '64rpx',
        fontSize: '28rpx',
        borderRadius: '6rpx',
        padding: '0 20rpx',
        border: '1px solid #DCDEE0'
      },
      disabledBtnStyle: {
        color: '#999'
      },
      btnStyle: {
        color: '#222',
        backgroundColor: '#F7F8F9'
      }
    };
  },
  computed: {
    pageCount() {
      if (this.total === 0) return 0;
      return Math.ceil(this.total / this.pageSize);
    }
  },
  methods: {
    changePage(pageStr) {
      let currentPaeg = this.page;
      switch (pageStr) {
        case 'first': // 首页
          currentPaeg = 1;
          break;
        case 'prev': // 上一页
          currentPaeg -= 1;
          break;
        case 'next': // 下一页
          currentPaeg += 1;
          break;
        case 'end': // 最后一页
          currentPaeg = this.pageCount;
          break;
      }
      this.$emit('input', currentPaeg);
      this.$nextTick(() => {
        this.$emit('on-change', {
          page: currentPaeg,
          pageCount: this.pageCount
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination-container {
  width: 100%;
  .ml16 {
    margin-left: 16rpx;
  }
}
</style>
<style scoped>
.pagination-container {
  /* 安全区域适配 */
  height: calc(140rpx + constant(safe-area-inset-bottom));
  height: calc(140rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
