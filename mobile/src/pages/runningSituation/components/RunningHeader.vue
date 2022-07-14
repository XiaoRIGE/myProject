<template>
  <view class="running-header-content">
    <view
      class="running-header-content-curriculum curriculum-info u-flex u-col-top"
    >
      <image
        class="book-icon"
        src="~@/static/img/workbench/book.svg"
        mode="scaleToFill"
      />
      <view class="curriculum-name">
        {{ title }}
      </view>
    </view>
    <view class="running-header-content-search">
      <u-search
        v-model="query"
        height="64"
        bg-color="#F5F6FA"
        shape="square"
        :show-action="false"
        :clearabled="true"
        placeholder="搜索学生姓名、学号"
        @search="searchHandle"
        @input="inputSearch"
      />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      query: ''
    };
  },
  methods: {
    searchHandle() {
      this.$emit('search', this.query);
    },
    inputSearch() {
      this.$emit('input', this.query);
    }
  }
};
</script>
<style lang="scss" scoped>
.running-header-content {
  width: 100%;
  box-sizing: border-box;
  padding: 16rpx 32rpx 12rpx;
  &-curriculum {
    width: 100%;
    border-radius: 20rpx;
    box-sizing: border-box;
    padding: 18rpx;
    margin-bottom: 12rpx;
    border: 1px solid #eaecf0;
    .book-icon {
      width: 48rpx;
      height: 48rpx;
      margin-right: 10rpx;
    }
    .curriculum-name {
      width: calc(100% - 58rpx);
      font-size: 28rpx;
      box-sizing: border-box;
      padding: 8rpx 0 0;
      font-weight: 600;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
      color: $u-main-color;
    }
  }
}
</style>
