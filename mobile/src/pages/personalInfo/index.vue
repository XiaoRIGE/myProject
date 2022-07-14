<template>
  <view class="personal-info-container">
    <g-navbar
      back-icon-size="48"
      back-icon-color="#222222"
      title="个人信息"
      :border-bottom="false"
      class="navbar"
    />
    <view class="info-content">
      <view
        v-for="(item, index) in isStudent ? studentInfoLabel : teacherInfoLabel"
        :key="index"
        class="infos"
      >
        <view v-for="(items, idx) in item" :key="idx" class="info-detail">
          <view class="info-label">
            {{ items.label }}
          </view>
          <view v-if="items.value === 'avatar'">
            <!-- 用户头像 -->
            <image
              class="avatar-img"
              :src="userInfo.avatar || avatar"
              mode="scaleToFill"
            />
          </view>
          <view v-else-if="items.value === 'gender'">
            <!-- 性别 -->
            {{ userInfo[items.value] === 1 ? '男' : '女' }}
          </view>
          <view v-else class="info-value">
            {{ userInfo[items.value] ? userInfo[items.value] : '' }}
          </view>
        </view>
      </view>
      <!-- <view class="hint">
        <image
          src="~@/static/img/personal-hint.png"
          mode="scaleToFill"
          class="hint-img"
        />
        <view class="hint-text">
          首次跑步需选择身高体重，使跑步数据更加准确
        </view>
      </view>
      <view class="select-weight-height" @click="show = true">
        <view class="info-label">
          身高体重
        </view>
        <view class="info-value">
          <view v-if="isSelectWh">
            {{ userInfo.height }}/{{ userInfo.weight }}
          </view>
          <view v-else>
            请选择你的身高体重
          </view>
          <image class="more-img" src="~@/static/img/more.png" />
        </view>
      </view>
      <u-select
        v-model="show"
        mode="mutil-column"
        :list="list"
        title="请选择身高体重"
        :safe-area-inset-bottom="true"
        confirm-text="保存"
        confirm-color="#FC6C37"
        cancel-color="#222222"
        :default-value="defaultValue"
        @confirm="confirm"
      /> -->
    </view>
  </view>
</template>

<script>
// import { heightAndWeightRang } from './common';
import { getUserInfo, getUserDefaultAvatar } from '@/utils/common';
export default {
  data() {
    return {
      show: false,
      teacherInfoLabel: [
        [
          {
            label: '头像',
            value: 'avatar'
          },
          {
            label: '姓名',
            value: 'realName'
          },
          {
            label: '性别',
            value: 'gender'
          }
        ],
        [
          {
            label: '学校',
            value: 'schoolName'
          }
        ]
      ],
      studentInfoLabel: [
        [
          {
            label: '头像',
            value: 'avatar'
          },
          {
            label: '姓名',
            value: 'realName'
          },
          {
            label: '学号',
            value: 'organizationUserNumber'
          },
          {
            label: '性别',
            value: 'gender'
          }
        ],
        [
          {
            label: '学校',
            value: 'schoolName'
          },
          {
            label: '学院',
            value: 'organizationName'
          },
          {
            label: '年级',
            value: 'year'
          }
          // {
          //   label: '班级',
          //   value: 'class'
          // }
        ]
      ],
      infoData: null,
      // isSelectWh: false, //是否选择了身高体重
      defaultValue: []
      // isStudent: true // true:学生  false:教师
    };
  },
  computed: {
    userInfo() {
      return getUserInfo();
    },
    isStudent() {
      if (this.userInfo) {
        return this.userInfo.identity === 'STUDENT';
      }
      return undefined;
    },
    isSelectWh() {
      if (this.userInfo) {
        return this.userInfo.weight !== null || this.userInfo.height !== null;
      }
      return undefined;
    },
    avatar() {
      if (this.userInfo) {
        const { identity, gender } = this.userInfo;
        return getUserDefaultAvatar(identity, gender);
      }
      return undefined;
    }
  },
  onLoad() {
    // this.list = heightAndWeightRang();
    // this.defaultValue = this.userInfo.gender === 1 ? [55, 40] : [45, 25];
  },
  methods: {
    // confirm(e) {
    //   this.userInfo.height = e[0].label;
    //   this.userInfo.weight = e[1].label;
    //   this.defaultValue = [e[0].value, e[1].value];
    //   this.isSelectWh = true;
    // }
  }
};
</script>

<style lang="scss">
.personal-info-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(245, 246, 250, 1);
}
.navbar {
  margin-bottom: 32rpx;
}
.info-content {
  .infos {
    background: rgba(255, 255, 255, 1);
    margin-bottom: 24rpx;
    padding: 0 32rpx;
    .info-detail {
      width: 100%;
      height: 108rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .avatar-img {
        width: 72rpx;
        height: 72rpx;
      }

      .info-value {
        font-size: 32rpx;
        color: rgba(102, 102, 102, 1);
      }
    }
    .info-detail:not(:last-child) {
      border-bottom: 2rpx solid rgba(240, 240, 240, 1);
    }
  }
  .info-label {
    font-size: 32rpx;
    font-weight: bold;
  }
  .hint {
    margin-bottom: 24rpx;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    .hint-img {
      width: 36rpx;
      height: 36rpx;
    }
    .hint-text {
      font-size: 24rpx;
      color: rgba(153, 153, 153, 1);
      margin-left: 10rpx;
    }
  }
  .select-weight-height {
    width: 100%;
    height: 108rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 1);
    padding: 0 32rpx;
    .info-value {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      color: rgba(153, 153, 153, 1);
      .more-img {
        display: block;
        margin-top: 2rpx;
        width: 36rpx;
        height: 36rpx;
      }
    }
  }
}
</style>
