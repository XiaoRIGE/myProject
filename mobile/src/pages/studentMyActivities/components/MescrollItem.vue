<template>
  <view>
    <mescroll-uni
      :ref="'mescrollRef' + i"
      :native="true"
      :safearea="true"
      top="0"
      bottom="0"
      :up="upOption"
      :down="downOption"
      @up="upCallback"
      @down="downCallback"
      @init="mescrollInit"
    >
      <view v-show="list.length > 0" class="activity-list">
        <activity-card
          v-for="(items, idx) in list"
          :key="idx"
          :card-info="items"
          :current="index"
          :state="state"
          class="activity-card-item"
        />
      </view>
      <view v-show="list.length === 0" class="empty">
        <image
          src="~@/static/img/empty-course.png"
          class="empty-img"
          mode="scaleToFill"
        />
        <view class="empty-text">
          暂无活动喔
        </view>
      </view>
    </mescroll-uni>
  </view>
</template>

<script>
import { CACHE_DIR } from '@/setting';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import MescrollMoreItemMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js';
import ActivitCard from './ActivitCard';
import { activity } from '@/request/api/student';
import {
  getSemesterId,
  gitFileName,
  downloadFile,
  getSavedFileInfo
} from '@/utils/common';

export default {
  components: {
    'activity-card': ActivitCard
  },
  mixins: [MescrollMixin, MescrollMoreItemMixin],
  props: {
    state: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    i: {
      type: Number,
      default: 0
    },
    timeLimit: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      downOption: {
        auto: false
      },
      upOption: {
        textColor: '#999999',
        bgColor: 'rgba(245,246,250,1)',
        use: true,
        auto: false,
        textNoMore: '—— 没有更多啦 ——',
        noMoreSize: 3,
        page: {
          num: 0,
          size: 10,
          time: null
        },
        empty: {
          use: false
        }
      },
      list: [],
      page: 1,
      size: 10
    };
  },
  computed: {
    cacheImages() {
      return this.$store.state.cacheFile.activitieImages;
    }
  },
  methods: {
    // 上拉加载
    upCallback(page) {
      this.page = page.num;
      this.getActivityList();
    },
    downCallback() {
      // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
      this.mescroll.resetUpScroll();
    },
    // 获取活动列表
    getActivityList() {
      this.$nextTick(() => {
        const { state, index, timeLimit } = this.$props;
        const semesterId = getSemesterId();
        const { page, size } = this;
        const parmas = {
          state,
          page,
          size,
          semesterId
        };
        // state 3未开始 4进行中 5已结束
        // 近7天 || 近30天 day对应天数  本学期||进行中 day不传 传semesterId
        if (index !== 0 && timeLimit.value === 0) {
          parmas.day = 7;
        } else if (index !== 0 && timeLimit.value === 1) {
          parmas.day = 30;
        } else {
          parmas.day = null;
        }
        activity
          .getMyActivityList(parmas)
          .then(res => {
            if (res.code === 0 && res.data) {
              if (this.page === 1) {
                this.list = this.getCacheImages(res.data.items) || [];
              } else {
                this.list = this.list.concat(
                  this.getCacheImages(res.data.items) || []
                );
              }
              if (typeof this.mescroll.endSuccess === 'function') {
                this.mescroll.endSuccess(res.data.items.length);
              }
            } else {
              if (this.page === 1) {
                this.list = [];
              }
              if (typeof this.mescroll.endSuccess === 'function') {
                this.mescroll.endSuccess(0);
              }
            }
          })
          .catch(() => {
            if (typeof this.mescroll.endSuccess === 'function') {
              this.mescroll.endErr();
            }
          });
      });
    },
    getCacheImages(list) {
      // 判断图片资源是否存在本地，有则返回，否则下载
      const result = [];
      // #ifndef H5
      if (list && list.length > 0) {
        let index = 0;
        while (index < list.length) {
          let pic = '';
          const { id, bgUrl } = list[index];
          if (bgUrl && bgUrl.length) {
            const cacheItem = this.cacheImages.find(c => c.id === id);
            // 有则取本地缓存路径
            if (cacheItem && cacheItem.id) {
              if (gitFileName(bgUrl) !== cacheItem.filename) {
                const path = plus.io.convertLocalFileSystemURL(
                  `_doc/${CACHE_DIR['activitie']}${gitFileName(bgUrl)}`
                );
                // 图片更换从新下载
                pic = bgUrl;
                // 删除缓存
                this.$store.commit('cacheFile/DEL_FILE', id);
                // 删除过期图片
                uni.removeSavedFile({
                  filePath: path
                });
                // 下载图片
                // 检查本地是否存在图片
                getSavedFileInfo(path)
                  .then(res => {
                    // 存在本地图片，直接渲染，并存在缓存
                    if (res.size > 0) pic = path;
                    this.$store.commit('cacheFile/SET_FILE', {
                      filePath: path,
                      id,
                      filename: gitFileName(bgUrl)
                    });
                  })
                  .catch(() => {
                    // 不存在图片，下载图片并存在缓存
                    downloadFile({
                      url: bgUrl,
                      id,
                      dir: CACHE_DIR['activitie']
                    }).then(res => {
                      this.$store.commit('cacheFile/SET_FILE', res);
                    });
                  });
              } else {
                // 取缓存图片
                pic = cacheItem.filePath;
              }
            } else {
              // 下载图片
              pic = bgUrl;
              const path = plus.io.convertLocalFileSystemURL(
                `_doc/${CACHE_DIR['activitie']}${gitFileName(bgUrl)}`
              );
              // 检查本地是否存在图片
              getSavedFileInfo(path)
                .then(res => {
                  // 存在本地图片，直接渲染，并存在缓存
                  if (res.size > 0) pic = path;
                  this.$store.commit('cacheFile/SET_FILE', {
                    filePath: path,
                    id,
                    filename: gitFileName(bgUrl)
                  });
                })
                .catch(() => {
                  // 不存在图片，下载图片并存在缓存
                  downloadFile({
                    url: bgUrl,
                    id,
                    dir: CACHE_DIR['activitie']
                  }).then(res => {
                    this.$store.commit('cacheFile/SET_FILE', res);
                  });
                });
            }
          }
          result.push({
            ...list[index],
            bgUrl: pic
          });
          ++index;
        }
      }
      // #endif
      // #ifdef H5
      list.map(item => {
        result.push(item);
      });
      // #endif
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-list {
  padding: 0 24rpx;
  // padding-bottom: 100rpx;
  .activity-card-item {
    width: 702rpx;
    height: 312rpx;
  }
}
.empty {
  margin: 224rpx auto 0;
  text-align: center;
  &-img {
    width: 400rpx;
    height: 300rpx;
  }
  &-text {
    margin-top: 40rpx;
    font-size: 32rpx;
  }
}
</style>
