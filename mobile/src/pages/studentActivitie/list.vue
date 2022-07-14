<template>
  <view class="active-content">
    <g-navbar
      height="44"
      :background="background"
      :border-bottom="false"
      :is-back="false"
      back-icon-size="48"
      title="课外活动"
    >
      <template #right>
        <navigator url="/pages/studentMyActivities/index" hover-class="none">
          <view class="navbar-right-content">
            <image
              class="mine-icon"
              src="~@/static/img/student-activity-mine.svg"
              mode="scaleToFill"
            />
          </view>
        </navigator>
      </template>
    </g-navbar>
    <sticky-header
      id="stickyHeader"
      :topics="activitieTopicsList"
      :school="schoolList"
      @on-change="filter"
    />
    <mescroll-uni
      ref="mescrollRef"
      :top="top"
      :height="height"
      bottom="110"
      bg-color="#F5F6FA"
      :safearea="true"
      :native="true"
      :up="upOption"
      :down="{ auto: false }"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      @emptyclick="emptyClick"
    >
      <!-- 数据列表 -->
      <view id="activitieContent" />
      <view v-if="listData.list.length > 0">
        <view v-for="item in listData.list" :key="item.id" class="list-item">
          <list-item :activitie-item="item" @refresh="refresh" />
        </view>
      </view>
      <view v-else class="empty-content">
        <image
          class="empt-img"
          src="~@/static/img/empty-course.png"
          mode="scaleToFill"
        />
        <view class="tps">
          <text>暂无活动喔</text>
        </view>
      </view>
    </mescroll-uni>
    <!-- 键盘遮罩层 -->
    <u-mask :show="showMask" :z-index="98" />
  </view>
</template>

<script>
import { CACHE_DIR } from '@/setting';
import {
  toRpx,
  gitFileName,
  downloadFile,
  getSavedFileInfo
} from '@/utils/common';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import StickyHeader from './components/StickyHeader';
import ListItem from './components/ListItem';
import { activity } from '@/request/api/student';
import { getSchoolList } from '@/request/api/education';
export default {
  name: 'StudentActivitieList',
  components: {
    'sticky-header': StickyHeader,
    'list-item': ListItem
  },
  mixins: [MescrollMixin],
  data() {
    return {
      showMask: false,
      loading: false,
      top: 44,
      listData: {
        list: [],
        pageNum: 0,
        total: 0
      },
      activitieTopicsList: [], // 活动专题列表
      schoolList: [], // 校区列表
      upOption: {
        noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          use: false
        },
        auto: false,
        textNoMore: '暂无更多数据...'
      },
      background: {
        backgroundColor: '#fff'
      },
      listQuery: {
        name: '',
        campus: '',
        page: 0,
        size: 10,
        state: '',
        topicId: '',
        week: ''
      }
    };
  },
  computed: {
    height() {
      return `${this.screenHeight - this.StatusBar - 44}px`;
    },
    cacheImages() {
      return this.$store.state.cacheFile.activitieImages;
    }
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select('#stickyHeader')
      .boundingClientRect((data) => {
        this.top = toRpx(data.height + this.StatusBar + 62);
      })
      .exec();

    // 监听键盘弹出，展示遮罩层
    uni.onKeyboardHeightChange((res) => {
      this.showMaskFn(res.height);
    });
  },
  beforeDestroy() {
    // 取消键盘监听事件
    uni.offKeyboardHeightChange(() => {
      this.showMaskFn(0);
    });
  },
  methods: {
    tabMouted() {
      // 监听第一次打开该页面
      this.mescroll.triggerUpScroll();
      this.getActivitieTopicsList();
      this.getSchoolList();
    },
    onTabChange(ret) {
      if (ret.event === 'show') {
        this.mescroll.scrollTo(0, 10);
        this.mescroll.resetUpScroll(true);
      } else {
        if (!this.loading) {
          if (this.listData.list.length === 0) {
            this.mescroll.resetUpScroll(true);
          }
          this.getActivitieTopicsList();
          this.getSchoolList();
        }
      }
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      const { num } = page;
      this.listQuery.page = num;
      this.getActivityList();
    },
    downCallback() {
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 0);
    },
    triggerDownScroll() {
      this.mescroll.scrollTo(0, 0);
      this.mescroll.triggerDownScroll();
    },
    //点击空布局按钮的回调
    emptyClick() {
      uni.showToast({
        title: '点击了按钮,具体逻辑自行实现'
      });
    },
    // 获取活动专题筛选列表
    async getActivitieTopicsList() {
      const res = await activity.getActivitieTopicsList();
      if (res.code === 0 && res.data) {
        this.activitieTopicsList = res.data.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.id
          };
        });
      }
      this.activitieTopicsList.unshift({
        label: '不限',
        value: 0
      });
    },
    // 获取校区列表
    async getSchoolList() {
      const res = await getSchoolList();
      if (res.code === 0 && res.data) {
        this.schoolList = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            ...item
          };
        });
      }
      this.schoolList.unshift({
        label: '不限',
        value: 0
      });
    },
    // 获取活动列表
    async getActivityList() {
      this.loading = true;
      try {
        const res = await activity.getActivityList(this.listQuery);
        if (res.code === 0 && res.data) {
          if (this.listQuery.page === 1) {
            this.listData.list = this.getCacheImages(res.data.items || []);
          } else {
            this.listData.list.push(
              ...this.getCacheImages(res.data.items || [])
            );
          }
          if (typeof this.mescroll.endSuccess === 'function') {
            this.mescroll.endSuccess(res.data.items.length || 0);
          }
          this.$forceUpdate();
          this.loading = false;
        } else {
          if (this.listQuery.page === 1) {
            this.listData.list = [];
          }
          this.mescroll.endErr();
          uni.showToast({
            title: res.data.message || '返回数据错误',
            icon: 'none',
            mask: true
          });
          this.loading = false;
        }
        this.$forceUpdate();
      } catch (err) {
        this.loading = false;
        if (typeof this.mescroll.endSuccess === 'function') {
          this.mescroll.endErr();
        }
      }
    },
    // 筛选搜索
    filter(data) {
      const { schoolValue, specialValue, stateValue, weekValue, searchName } =
        data;
      const { week, campus, topicId, state, name } = this.listQuery;
      if (
        weekValue === week &&
        specialValue === topicId &&
        schoolValue === campus &&
        stateValue === state &&
        name === searchName
      )
        return;
      this.listQuery.week = weekValue;
      this.listQuery.campus = schoolValue;
      this.listQuery.topicId = specialValue;
      this.listQuery.state = stateValue;
      this.listQuery.name = searchName;
      this.listQuery.page = 1;
      // 刷新列表
      this.mescroll.scrollTo(0, 300);
      this.mescroll.resetUpScroll(true);
    },
    refresh() {
      this.downCallback();
    },
    showMaskFn(height) {
      this.showMask = height > 0 ? true : false;
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
            const cacheItem = this.cacheImages.find((c) => c.id === id);
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
                  .then((res) => {
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
                    }).then((res) => {
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
                .then((res) => {
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
                  }).then((res) => {
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
      list.map((item) => {
        result.push(item);
      });
      // #endif
      return result;
    }
  }
};
</script>

<style scoped lang="scss">
.active-content {
  .navbar-right-content {
    box-sizing: border-box;
    padding: 0 32rpx;
    .mine-icon {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .seat {
    width: 750rpx;
    height: 176rpx;
  }
  .list-item {
    margin-top: 24rpx;
    box-sizing: border-box;
    padding: 0 32rpx;
  }
  .empty-content {
    text-align: center;
    margin-top: 140rpx;
    .empt-img {
      width: 400rpx;
      height: 300rpx;
      margin-bottom: 40rpx;
    }
    .tps text {
      font-size: 32rpx;
      color: $u-main-color;
    }
  }
}
</style>
