<template>
  <view class="sticky-content">
    <!-- 搜索 -->
    <view class="search-content">
      <u-search
        v-model="searchName"
        height="64"
        bg-color="#F5F6FA"
        shape="square"
        :show-action="showAction"
        :clearabled="true"
        action-text="取消"
        placeholder="搜索活动名称"
        @search="change"
        @clear="searchName = ''"
        @custom="custom"
        @focus="showAction = true"
      />
    </view>
    <view class="dropdown-content">
      <g-dropdown :border-radius="24" title-size="32rpx" active-color="#fc6c37">
        <g-dropdown-item
          v-model="specialValue"
          class="dropdown-row"
          :cell-border-bottom="false"
          :cell-border-top="false"
          :title="specialTitle"
          :options="topics"
          @change="change('specialValue')"
        />
        <g-dropdown-item
          v-model="stateValue"
          :cell-border-bottom="false"
          :cell-border-top="false"
          :title="stateTitle"
          :options="stateOptions"
          @change="change('stateValue')"
        />
        <g-dropdown-item
          v-model="weekValue"
          :cell-border-bottom="false"
          :cell-border-top="false"
          :title="weekTitle"
          :options="weekOptions"
          @change="change('weekValue')"
        />
        <g-dropdown-item
          v-model="schoolValue"
          :cell-border-bottom="false"
          :cell-border-top="false"
          :title="schoolTitle"
          :options="school"
          @change="change('schoolValue')"
        />
      </g-dropdown>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StickyHeader',
  props: {
    topics: {
      type: Array,
      default: () => []
    },
    school: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showAction: false,
      searchName: '',
      specialValue: '',
      stateValue: -1,
      weekValue: '',
      schoolValue: '',
      stateOptions: [
        {
          value: -1,
          label: '不限'
        },
        {
          value: 0,
          label: '报名未开始'
        },
        {
          value: 1,
          label: '报名中'
        },
        {
          value: 2,
          label: '报名结束'
        },
        // {
        //   value: 3,
        //   label: '活动未开始'
        // },
        {
          value: 4,
          label: '进行中'
        }
      ],
      weekOptions: [
        {
          value: 0,
          label: '不限'
        },
        {
          value: 1,
          label: '周一'
        },
        {
          value: 2,
          label: '周二'
        },
        {
          value: 3,
          label: '周三'
        },
        {
          value: 4,
          label: '周四'
        },
        {
          value: 5,
          label: '周五'
        },
        {
          value: 6,
          label: '周六'
        },
        {
          value: 7,
          label: '周日'
        }
      ]
    };
  },
  computed: {
    specialTitle() {
      if (this.specialValue === 0 || this.specialValue === '') return '专题';
      return this.topics.find(item => item.value === this.specialValue).label;
    },
    stateTitle() {
      if (this.stateValue === -1) return '状态';
      return this.stateOptions.find(item => item.value === this.stateValue)
        .label;
    },
    weekTitle() {
      if (this.weekValue === '' || this.weekValue === 0) return '星期';
      return this.weekOptions.find(item => item.value === this.weekValue).label;
    },
    schoolTitle() {
      if (
        this.school.length === 0 ||
        this.schoolValue === '' ||
        this.schoolValue === 0
      )
        return '校区';
      return this.school.find(item => item.value === this.schoolValue).label;
    }
  },
  methods: {
    custom() {
      // 取消
      this.searchName = '';
      this.showAction = false;
      this.change();
    },
    change() {
      const { specialValue, stateValue, schoolValue, weekValue, searchName } =
        this;
      this.$emit('on-change', {
        specialValue: specialValue || '',
        stateValue: stateValue === -1 ? '' : stateValue,
        schoolValue: schoolValue || '',
        weekValue: weekValue || '',
        searchName
      });
    }
  }
};
</script>
<style scoped lang="scss">
.sticky-content {
  position: relative;
  .search-content,
  .dropdown-content {
    position: absolute;
    width: 750rpx;
    box-sizing: border-box;
    background-color: #fff;
  }
  .search-content {
    z-index: 99;
    padding: 12rpx 32rpx;
  }
  .dropdown-content {
    top: 64rpx;
    z-index: 2;
    padding: 22rpx 0;
    &::v-deep {
      .u-dropdown__menu__item .u-dropdown__menu__item__text {
        text-align: right;
        max-width: 132rpx;
        display: inline-block;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
      }
    }
  }
}
</style>
