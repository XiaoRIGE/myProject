<template>
  <view class="appeal-container">
    <g-navbar
      :background="{ backgroundColor: '#fff' }"
      :border-bottom="false"
      title="跑步申诉"
    />
    <!-- 申诉类型 -->
    <view class="appeal-list pad">
      <view class="appeal-list-title">
        <text class="icon">*</text>
        <text class="title">申诉类型</text>
        <text class="tips">（单选）</text>
      </view>
      <view class="appeal-list-content u-flex">
        <view
          v-for="item in typeList"
          :key="item.id"
          :class="['item', appealType === item.id && 'active-type']"
          @click="appealType = item.id"
        >
          <text class="text">
            {{ item.name }}
          </text>
        </view>
      </view>
    </view>

    <!-- 申诉描述 -->
    <view class="appwal-describe pad">
      <view class="appwal-describe-title">
        <text class="icon">*</text>
        <text class="title">申诉描述</text>
      </view>
      <view class="appwal-describe-content">
        <textarea
          v-model="appealReason"
          class="textarea"
          :adjust-position="false"
          placeholder-style="color: '#C3C2CC'"
          maxlength="300"
          placeholder="请详细描述您遇见的问题，以便于我们为您提供更好的帮助"
        />
        <p class="count">{{ appealReason.length }}/300</p>
      </view>
    </view>

    <!-- 图片上传列表 -->
    <view class="upload-pic-list pad">
      <view class="upload-pic-list-title">
        <text class="title">上传凭证</text>
        <text class="tips">（仅支持2M内的图片，最多可上传{{ count }}张）</text>
      </view>
      <!-- 图片列表 -->
      <view class="upload-pic-list-content u-flex">
        <view v-for="(img, index) in picList" :key="index" class="pic-item">
          <image class="bg-img" :src="img.path" mode="aspectFill" />
          <image
            class="delete-icon"
            src="~@/static/img/delete-icon.svg"
            mode="scaleToFill"
            @click="deletePic(img.path, index)"
          />
        </view>
        <g-upload
          v-if="picList.length < count"
          :count="currentCont"
          @on-change="uploadFile"
        />
      </view>
    </view>
    <!-- 提交按钮 -->
    <view class="pad btns u-flex">
      <u-button
        :disabled="disabled"
        :custom-style="{
          borderRadius: '24rpx',
          width: '100%',
          color: '#fff',
          backgroundColor: disabled ? '#FDB59B' : '#FC6C37'
        }"
        @click="sunmit"
      >
        提交
      </u-button>
    </view>
  </view>
</template>

<script>
import { running } from '@/request/api/student';
import { uploadFile } from '@/request/api/common';
export default {
  name: 'AddAppeal',
  data() {
    return {
      againInfo: null, // 再次申诉信息
      typeList: [], // 申诉类型
      count: 4, // 最多可上传图片数量
      runningDetailsId: '', // 跑步记录id
      appealReason: '', // 申诉描述
      appealType: '', // 选择的类型
      url: [], // 上传的图片列表
      picList: [], //  选择的图片列表
      currentCont: 4, // 当前可上传图片的图片
      page: '' // 当前页面来源，轨迹详情页面，我的申诉页面，原生App跑步轨迹详情
    };
  },
  computed: {
    semesterId() {
      // 学期ID
      return this.$store.state.semester.currentSemester.id;
    },
    disabled() {
      return !(
        this.appealType &&
        this.appealReason &&
        this.appealReason.trim().length >= 1
      );
    }
  },
  onLoad(options) {
    if (options.id) {
      this.runningDetailsId = options.id;
    }
    // 获取申诉类型列表
    this.getRunningTypes();
    // 再次申诉
    if (options.appealId) {
      // 再次申诉，获取申诉详情
      this.getAppealInfo(options.appealId);
    }
    if (options.page) {
      this.page = options.page;
    }
  },
  methods: {
    // 图片选择
    uploadFile(files) {
      let flag = false;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const { size, path } = files[i];
          if (this.verificationImgSize(size)) {
            this.picList.push({
              path,
              isUpload: true // 需要上传
            });
          } else {
            flag = true;
          }
        }
      }
      if (flag) {
        uni.showToast({
          title: '请选择小于2M的图片',
          icon: 'none',
          duration: 3000
        });
      }
      this.currentCont = Math.max(0, this.count - this.picList.length);
    },
    // 上传多张图片
    async uploadFiles(files = []) {
      uni.showLoading({
        title: '图片上传...',
        mask: true
      });
      try {
        const uploadRequest = [];
        const targetIms = [];

        if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const { path, isUpload } = files[i];
            if (isUpload) {
              uploadRequest.push(uploadFile(path));
            } else {
              targetIms.push({
                index: i,
                path
              });
            }
          }
        }

        const urls = await Promise.all(uploadRequest);
        this.url = []; // 置空图片列表
        if (urls && urls.length > 0) {
          this.url = urls;
        }

        // 插入原来的图片，重新提交申诉会执行
        if (targetIms.length > 0) {
          for (let i = 0; i < targetIms.length; i++) {
            const { index, path } = targetIms[i];
            this.url.splice(index, 0, path);
          }
        }
      } catch (err) {
        uni.showToast({
          title: '图片上传失败',
          icon: 'none',
          duration: 3000
        });
      }
      uni.hideLoading();
    },
    // 创建新的申诉
    async createRunningAppeal() {
      // 判断是否存在图片，有图片则上传图片
      await this.uploadFiles(this.picList);
      // 创建申诉
      try {
        const { code, data } = await running.createRunningAppeal({
          appealReason: this.appealReason,
          appealType: this.appealType,
          runningDetailsId: this.runningDetailsId,
          semesterId: this.semesterId,
          url: this.url
        });
        if (code === 0 && data.isSuccess) {
          // 创建成功，跳转详情页面, 并关闭当前页面
          uni.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500,
            mask: true
          });
          setTimeout(() => {
            uni.redirectTo({
              url: `/pages/runningAppeal/detail?id=${data.id}&page=${this.page}`
            });
          }, 1200);
        } else {
          // 重置img列表，防止图片重复上传
          this.resetPicList();
        }
      } catch (err) {
        this.resetPicList();
      }
    },
    // 提交按钮
    async sunmit() {
      // 创建申诉
      if (!this.againInfo) {
        this.createRunningAppeal();
      } else {
        // 再次申诉
        this.appealAgain();
      }
    },
    // 获取申诉类型列表
    async getRunningTypes() {
      const { code, data } = await running.getRunningTypes();
      if (code === 0) {
        this.typeList = data || [];
      }
    },
    // 删除图片
    deletePic(img, index) {
      if (index > -1) {
        this.picList.splice(index, 1);
        this.currentCont = Math.max(0, this.count - this.picList.length);
      }
    },
    // 验证图片大小
    verificationImgSize(size) {
      // 小于2M
      return 2 * 1024 * 1024 >= size;
    },
    // 重置图片列表
    resetPicList() {
      this.picList = this.url
        .map((path) => ({ path, isUpload: false }))
        .filter((item) => item.path);
      this.currentCont = Math.max(0, this.count - this.picList.length);
    },
    // 获取申诉详情
    async getAppealInfo(id) {
      // 获取申诉详情
      const { code, data } = await running.getAppealInfo({ id });
      if (code === 0 && data) {
        this.againInfo = data;
        const { appealType, appealReason, url } = data;
        this.appealType = appealType;
        this.appealReason = appealReason;
        this.picList = (url || [])
          .map((path) => ({ path, isUpload: false }))
          .filter((img) => !!img);
      }
    },
    // 再次申诉
    async appealAgain() {
      // 判断是否存在图片，有图片则上传图片
      await this.uploadFiles(this.picList);
      try {
        const { code, data } = await running.appealAgain({
          appealId: this.againInfo.id,
          appealReason: this.appealReason,
          appealType: this.appealType,
          semesterId: this.semesterId,
          url: this.url
        });
        // 待测试
        if (code === 0 && data) {
          // 创建成功，跳转详情页面, 并关闭当前页面
          uni.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500,
            mask: true
          });
          setTimeout(() => {
            uni.redirectTo({
              url: `/pages/runningAppeal/detail?id=${this.againInfo.id}&page=${this.page}`
            });
          }, 1200);
        } else {
          // 重置img列表，防止图片重复上传
          this.resetPicList();
        }
      } catch (err) {
        this.resetPicList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.appeal-container {
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding-bottom: 140rpx;
  .pad {
    box-sizing: border-box;
    padding: 0 32rpx;
  }
  .appeal-list,
  .appwal-describe,
  .upload-pic-list {
    &-title {
      .icon {
        font-size: 32rpx;
        color: #ff555b;
      }
      .title {
        margin: 0 4rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: $u-main-color;
      }
      .tips {
        font-size: 24rpx;
        color: $u-tips-color;
      }
    }
  }
  .appeal-list {
    margin-top: 34rpx;
    &-content {
      box-sizing: border-box;
      padding: 32rpx 0 4rpx;
      flex-wrap: wrap;
      flex-shrink: 1;
      justify-content: space-between;
      .item {
        width: 212rpx;
        height: 76rpx;
        text-align: center;
        line-height: 76rpx;
        font-size: 24rpx;
        margin-bottom: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #38364d;
        background-color: #f5f6fa;
        border-radius: 48rpx;
        border: 1px solid transparent;
      }
      .active-type {
        border: 1px solid $uni-color-primary;
        color: $uni-color-primary;
        background-color: rgba(252, 108, 55, 0.12);
      }
    }
    border-bottom: 1rpx solid #f0f0f0;
  }
  .appwal-describe {
    &-title {
      margin: 32rpx 0 28rpx;
    }
    &-content {
      box-sizing: border-box;
      padding: 14rpx;
      background-color: #f5f6fa;
      border-radius: 16rpx;
      .count {
        text-align: right;
        font-size: 24rpx;
        color: $u-tips-color;
      }
      .textarea {
        width: 100%;
        color: $uni-text-color;
      }
    }
  }
  .upload-pic-list {
    &-title {
      margin: 34rpx 0 28rpx;
    }
    &-content {
      .pic-item {
        position: relative;
        margin-right: 20rpx;
        .bg-img {
          width: 156rpx;
          height: 156rpx;
          border-radius: 16rpx;
        }
        .delete-icon {
          position: absolute;
          top: 0;
          right: 0;
          width: 44rpx;
          height: 44rpx;
        }
      }
    }
  }
  .btns {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #fff;
  }
}
</style>
<style>
/* 安全区域适配 */
.btns {
  height: calc(140rpx + constant(safe-area-inset-bottom));
  height: calc(140rpx + env(safe-area-inset-bottom));
}
</style>
