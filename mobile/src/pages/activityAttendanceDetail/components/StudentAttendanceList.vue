<template>
  <view class="table-box">
    <!-- 已开启签到 -->
    <template v-if="isOpenSignIn">
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
      <u-action-sheet
        v-model="editSheetShow"
        :list="stateListArr"
        border-radius="24"
        @click="sheetUpdateState"
      />
    </template>
    <!-- 未开启签到 -->
    <template v-else>
      <view
        v-for="(item, index) in list"
        :key="index"
        class="no-item u-flex u-row-between"
      >
        <view class="no-item-number">
          {{ item.number }}
        </view>
        <view class="no-item-name">
          {{ item.name }}
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { activity } from '@/request/api/teacher';
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
  name: 'StudentAttendanceList',
  props: {
    activityData: {
      type: Object,
      default: null
    },
    number: {
      type: Number,
      default: 0
    },
    isOpenSignIn: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      stateArr: ['未签到', '首次签到', '二次签到', '请假'], // 0:未签到 1:首次签到 2:二次签到 3:请假
      stateColorArr: ['#8B8A99', '#76BF26', '#2DB7B2', '#FFAB02'],
      stateListArr: [],
      selItem: null, //选中学生
      editSheetShow: false //考勤修改操作面板
    };
  },
  methods: {
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
    // 手动修改考勤 ("未到", 0),("已到", 1),("请假", 2),
    updateSignTypeHandle(item, signType) {
      activity
        .updateSignType({
          // id: item.id,
          activityId: this.$props.activityData.id,
          courseUserId: item.courseUserId,
          userId: item.userId,
          signType
        })
        .then(res => {
          if (res.code === 0) {
            const info = { item, signType };
            this.$emit('updateStuSignInHandle', info);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.content-detail {
  background: $u-bg-color;
  width: 100%;
  .no-item {
    width: 100%;
    height: 92rpx;
    padding: 0 40rpx;
    background: #fff;
  }
  .no-item:last-child {
    border-radius: 0 0 20rpx 20rpx;
  }
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
}
</style>
