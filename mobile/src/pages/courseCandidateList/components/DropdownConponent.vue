<template>
  <view class="dropdown-content">
    <g-dropdown :border-radius="24" title-size="32rpx" active-color="#fc6c37">
      <g-dropdown-item
        v-model="weekValue"
        :cell-border-bottom="false"
        :cell-border-top="false"
        :title="weekTitle"
        :options="weekOptions"
        @change="change('weekValue')"
      />
      <g-dropdown-item
        v-model="timeValue"
        class="dropdown-row"
        :cell-border-bottom="false"
        :cell-border-top="false"
        :title="timeTitle"
        :options="timeOptions"
        @change="change('timeValue')"
      />
      <g-dropdown-item
        v-model="projectValue"
        class="dropdown-row"
        :cell-border-bottom="false"
        :cell-border-top="false"
        :title="projectTitle"
        :options="projectOptions"
        @change="change('projectValue')"
      />
      <g-dropdown-item
        v-model="schoolValue"
        class="dropdown-row"
        :cell-border-bottom="false"
        :cell-border-top="false"
        :title="schoolTitle"
        :options="schoolOptions"
        @change="change('schoolValue')"
      />
    </g-dropdown>
  </view>
</template>

<script>
import { getCampusId } from '../common';

export default {
  name: 'DropdownConponent',
  props: {
    timeOptions: {
      type: Array,
      default: () => []
    },
    schoolOptions: {
      type: Array,
      default: () => []
    },
    projectOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showAction: false,
      searchName: '',
      timeValue: '',
      projectValue: '',
      weekValue: '',
      schoolValue: getCampusId() || 0,
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
    timeTitle() {
      if (this.timeValue === 0 || this.timeValue === '') return '时间';
      return this.timeOptions.find(item => item.value === this.timeValue).label;
    },
    projectTitle() {
      if (this.projectValue === 0 || this.projectValue === '') return '项目';
      return this.projectOptions.find(item => item.value === this.projectValue)
        .label;
    },
    weekTitle() {
      if (this.weekValue === 0 || this.weekValue === '') return '星期';
      return this.weekOptions.find(item => item.value === this.weekValue).label;
    },
    schoolTitle() {
      if (
        this.schoolOptions.length === 0 ||
        this.schoolValue === '' ||
        this.schoolValue === 0
      )
        return '校区';
      // return '校区';
      return this.schoolOptions.find(item => item.value === this.schoolValue)
        .label;
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
      const { timeValue, projectValue, schoolValue, weekValue } = this;
      this.$emit('on-change', {
        timeValue: timeValue || '',
        projectValue: projectValue || '',
        schoolValue: schoolValue || '',
        weekValue: weekValue || ''
      });
    }
  }
};
</script>
<style scoped lang="scss">
.dropdown-content {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 6rpx 0;
  background: #fff;
  font-size: 28rpx;
  border-bottom: 2rpx solid #ececec;
  &::v-deep {
    .u-dropdown__menu__item .u-dropdown__menu__item__text {
      text-align: right;
      max-width: 132rpx;
      display: inline-block;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
    .u-dropdown-item__options {
      max-height: 864rpx;
    }
  }
}
</style>
