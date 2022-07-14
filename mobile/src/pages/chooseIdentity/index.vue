<template>
  <view class="choose-container">
    <g-activateHeader title="请选择身份" :is-right-show="false" />
    <view class="content">
      <view>
        <view
          :class="selIndex === 0 ? 'img-item sel-item' : 'img-item'"
          @click="selectStudentHandle"
        >
          <image :src="stuImg[selStuImg]" class="img" mode="scaleToFill" />
          <image
            v-if="selIndex === 0"
            class="choose-img"
            src="~@/static/img/choose.png"
            mode="scaleToFill"
          />
        </view>
        <view class="text">
          我是学生
        </view>
      </view>
      <view>
        <view
          :class="selIndex === 1 ? 'img-item sel-item' : 'img-item'"
          @click="selectTeacherHandle"
        >
          <image :src="teacherImg[selTeaImg]" class="img" mode="scaleToFill" />
          <image
            v-if="selIndex === 1"
            class="choose-img"
            src="~@/static/img/choose.png"
            mode="scaleToFill"
          />
        </view>
        <view class="text">
          我是教师
        </view>
      </view>
    </view>
    <view class="btn" @click="nextStep">
      下一步
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stuImg: [
        './../../static/img/nor-stu.png',
        './../../static/img/sel-stu.png'
      ],
      teacherImg: [
        './../../static/img/nor-teacher.png',
        './../../static/img/sel-teacher.png'
      ],
      selIndex: 0, //0:学生  1:教师
      selStuImg: 1, //0:未选中   1：选中  学生图片
      selTeaImg: 0 //0:未选中   1：选中  教师图片
    };
  },
  methods: {
    selectStudentHandle() {
      this.selIndex = 0;
      this.selStuImg = 1;
      this.selTeaImg = 0;
    },
    selectTeacherHandle() {
      this.selIndex = 1;
      this.selStuImg = 0;
      this.selTeaImg = 1;
    },
    nextStep() {
      if (this.selIndex === 0) {
        uni.navigateTo({
          url: '/pages/activateStudent/index'
        });
      } else {
        uni.navigateTo({
          url: '/pages/activateTeacher/index'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.choose-container {
  box-sizing: border-box;
  margin: 0;
  min-height: 100vh;
  background: rgba(255, 255, 255, 1);
  .content {
    padding: 36rpx 48rpx 0 48rpx;
    display: flex;
    justify-content: space-between;
    text-align: center;
    .img-item {
      position: relative;
      width: 304rpx;
      height: 320rpx;
      border-radius: 16rpx;
      border: 4rpx solid rgba(255, 255, 255, 1);
      .img {
        width: 100%;
        height: 100%;
      }
      .choose-img {
        width: 74rpx;
        height: 74rpx;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .text {
      margin-top: 24rpx;
      font-weight: bold;
      color: rgba(84, 82, 102, 1);
    }
    .sel-item {
      width: 304rpx;
      height: 320rpx;
      border-radius: 16rpx;
      border: 4rpx solid rgba(255, 192, 169, 1);
    }
  }
  .btn {
    width: 200rpx;
    height: 100rpx;
    margin: 88rpx auto;
    background: rgba(252, 108, 55, 1);
    border-radius: 24rpx;
    text-align: center;
    line-height: 100rpx;
    color: rgba(255, 255, 255, 1);
    font-size: 32rpx;
  }
}
</style>
