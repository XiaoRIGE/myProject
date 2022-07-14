<template>
  <view class="select-school-container">
    <scroll-view scroll-y="true" style="height: 100%">
      <view class="header">
        <view class="title">
          选择学校
        </view>
        <u-search
          v-model="searchValue"
          placeholder="搜索学校名称"
          shape="square"
          bg-color="#F5F5FA"
          :show-action="false"
          placeholder-color="#999999"
          class="search"
          @change="changeValueHandle"
        />
      </view>
      <view class="school-list">
        <template v-for="(item, index) in showSchool">
          <view :key="index" class="item" @click="selectSchool(item)">
            {{ item.name }}
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { searchSchool } from '../common';
import { querySchool } from '@/request/api/authorization';

export default {
  props: {
    clickFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchValue: '',
      allSchool: [],
      showSchool: []
    };
  },
  mounted() {
    this.getQuerySchool();
  },
  methods: {
    // 获取所有学校
    getQuerySchool() {
      querySchool().then(res => {
        if (res.code === 0) {
          this.allSchool = res.data;
          this.showSchool = res.data;
        }
      });
    },
    // 选择学校回调事件
    selectSchool(item) {
      this.$emit('selectSchoolHandle', item);
    },
    // 模糊搜索
    changeValueHandle(value) {
      this.showSchool = searchSchool(this.allSchool, value);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-school-container {
  color: rgba(43, 45, 51, 1);
  padding-top: 216rpx;
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 216rpx;
    margin-bottom: 32rpx;
    background: rgba(255, 255, 255, 255);
    .title {
      width: 100%;
      height: 100rpx;
      font-weight: bold;
      font-size: 36rpx;
      text-align: center;
      line-height: 100rpx;
      margin-bottom: 20rpx;
    }
    .search {
      width: 100%;
      padding: 0 32rpx;
    }
  }
  .school-list {
    padding: 0 32rpx;
    .item {
      width: 100%;
      padding: 24rpx 0;
      text-align: left;
      font-size: 30rpx;
      color: rgba(34, 34, 34, 1);
      border-bottom: 2rpx solid rgba(240, 240, 240, 1);
    }
  }
}
</style>
