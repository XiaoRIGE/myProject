<template>
  <u-modal
    v-model="showModal"
    :show-title="false"
    content=""
    confirm-text="立即更新"
    cancel-text="暂不更新"
    :show-cancel-button="!enforce"
    confirm-color="#FC6C37"
    class="version-modal"
    @confirm="confirmHandle"
    @cancel="cancelHandle"
  >
    <view class="slot-content content">
      <image src="~@/static/img/version-bg.png" class="version-img" />
      <view class="title">
        发现新版本
      </view>
      <view class="version">
        {{ versionLabel }}
      </view>
      <view class="text">
        {{ description }}
      </view>
    </view>
  </u-modal>
</template>

<script>
export default {
  name: 'VersionModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    plat: {
      type: Number,
      default: null
    },
    versionInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      appid: '',
      prg: 0,
      showModal: false
    };
  },
  computed: {
    enforce() {
      if (this.$props.versionInfo) {
        return this.$props.versionInfo.enforce;
      }
      return false;
    },
    versionLabel() {
      if (this.$props.versionInfo) {
        return `V${this.$props.versionInfo.versionLabel}`;
      }
      return undefined;
    },
    description() {
      if (this.$props.versionInfo) {
        return this.$props.versionInfo.description;
      }
      return undefined;
    }
  },
  watch: {
    show: {
      handler(val) {
        this.showModal = val;
      },
      immediate: true
    }
  },
  mounted() {
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
      return (this.appid = wgtinfo.appid); //manifest里配置的版本号
    });
    // #endif
  },
  methods: {
    // 暂不更新
    cancelHandle() {
      this.$emit('versionShow');
    },

    // 立即更新
    confirmHandle() {
      const { packageUrl } = this.$props.versionInfo;
      if (this.$props.plat === 1) {
        // android
        const dtask = plus.downloader.createDownload(
          // 'https://shanks-public-dev.oss-cn-chengdu.aliyuncs.com/app/packages/1/18/University-v1.0.1-202109222319-uni_test_debug.apk', // 开发链接
          packageUrl,
          {},
          (d, status) => {
            uni.showToast({
              title: '下载完成',
              mask: false,
              duration: 1000
            });
            // 下载完成
            if (status === 200) {
              plus.runtime.install(
                plus.io.convertLocalFileSystemURL(d.filename),
                {},
                () => {
                  // 重启当前的应用
                  plus.runtime.restart();
                },
                () => {
                  uni.showToast({
                    title: '安装失败',
                    mask: false,
                    duration: 1500
                  });
                }
              );
            } else {
              uni.showToast({
                title: '更新失败',
                mask: false,
                duration: 1500
              });
              // 清除下载任务
              plus.downloader.clear();
            }
          }
        );
        try {
          dtask.start(); // 开启下载的任务
          const showLoading =
            plus.nativeUI.showWaiting('  正在下载，请稍等...  '); //创建一个showWaiting对象
          dtask.addEventListener('statechanged', task => {
            uni.onNetworkStatusChange(res => {
              if (!res.isConnected) {
                showLoading.setTitle('  请检查网络环境...  ');
                return;
              } else {
                showLoading.setTitle('  正在下载，请稍等...  ');
              }
            });
            // 给下载任务设置一个监听 并根据状态  做操作
            switch (task.state) {
              case 1:
                // 下载任务开始请求
                showLoading.setTitle('  正在下载，请稍等...  ');
                break;
              case 2:
                // 下载任务请求已经接收
                showLoading.setTitle('已连接到服务器');
                break;
              case 3:
                // 下载任务接收数据
                this.prg = parseInt(
                  (parseFloat(task.downloadedSize) /
                    parseFloat(task.totalSize)) *
                    100
                );
                showLoading.setTitle(`  正在下载${this.prg}%  `);
                break;
              case 4:
                // 下载任务已完成
                plus.nativeUI.closeWaiting();
                break;
            }
          });
        } catch (err) {
          plus.nativeUI.closeWaiting();
          uni.showToast({
            title: '更新失败',
            mask: false,
            duration: 1500
          });
        }
      } else if (this.$props.plat === 2) {
        // ios
        plus.runtime.launchApplication(
          {
            action: 'itms-apps://itunes.apple.com/cn/app/id1257733279?mt=8'
          },
          e => {
            throw new Error(e);
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.version-modal {
  ::v-deep .u-mode-center-box {
    overflow: visible !important;
  }
  ::v-deep .u-model {
    overflow: visible !important;
    background-color: transparent !important;
  }
  ::v-deep .uni-scroll-view {
    overflow: visible !important;
  }
}
.content {
  position: relative;
  margin-top: 132rpx;
  padding: 0 48rpx;
  .version-img {
    position: absolute;
    top: -200rpx;
    right: 0;
    width: 414rpx;
    height: 364rpx;
    z-index: 20000;
  }
  .title {
    font-weight: bold;
    color: rgba(129, 47, 17, 1);
    font-size: 48rpx;
    margin-bottom: 14rpx;
  }
  .version {
    color: rgba(129, 47, 17, 1);
    font-size: 36rpx;
    margin-bottom: 56rpx;
  }
  .text {
    font-size: 34rpx;
    color: rgba(102, 102, 102, 1);
    margin-bottom: 56rpx;
  }
}
</style>
