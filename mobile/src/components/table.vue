<template>
  <view
    id="gTable"
    class="g-table"
    :style="{ height: tableHeight > 0 ? tableHeight + 'px' : 'auto' }"
  >
    <!-- loading -->
    <view v-if="loading" :class="['g-loading', { ztableLoading: tableShow }]">
      <view class="g-loading-animate" />
    </view>
    <view
      class="g-table-main scroll-view"
      @touchstart="handletouchstart"
      @touchend="handletouchend"
    >
      <view class="g-table-main-pack scroll-view">
        <!-- header -->
        <view class="g-table-main-header u-flex u-row-between scroll-view">
          <template v-for="(item, index) in tableHeaderList">
            <view
              v-if="!item.render"
              :id="index === 1 ? 'Left' : index === 0 ? 'leftFirst' : ''"
              :key="item.key"
              class="g-table-col u-flex f24"
              :class="[
                {
                  'u-flex-1': tableHeaderList.length <= flexLength,
                  pl32: index === 0,
                  'g-table-stick-left': stickLeft && index === 0,
                  'g-table-stick-left-border': staticBorder && index === 0,
                  'g-table-main-header-right-border':
                    headerRightBorder &&
                    index !== 0 &&
                    index !== tableHeaderList.length - 1
                },
                ...item.class
              ]"
              :style="{
                width: item.width + 'rpx' || '100%',
                ...item.style,
                'justify-content': align(item.align || 'left'),
                height: headerHeight + 'rpx'
              }"
            >
              <view
                :style="{ maxWidth: item.width + 'rpx' || '100%' }"
                class="g-table-col-txt"
              >
                <text>{{ item.title }}</text>
              </view>
            </view>
            <view
              v-if="item.render"
              :id="index === 1 ? 'Left' : index === 0 ? 'leftFirst' : ''"
              :key="item.key"
              class="g-table-col u-flex f24"
              :class="[
                {
                  'u-flex-1': tableHeaderList.length <= flexLength,
                  pl32: index === 0,
                  'g-table-stick-left': stickLeft && index === 0,
                  'g-table-stick-left-border': staticBorder && index === 0,
                  'g-table-main-header-right-border':
                    headerRightBorder &&
                    index !== 0 &&
                    index !== tableHeaderList.length - 1
                },
                ...item.class
              ]"
              :style="{
                width: item.width + 'rpx' || '100%',
                ...item.style,
                'justify-content': align(item.align || 'left'),
                height: headerHeight + 'rpx'
              }"
              v-html="item.render(item, index)"
            />
          </template>
        </view>
        <!-- body -->
        <view
          v-if="tableData.length && tableData.length > 0"
          class="g-table-main-body scroll-view"
        >
          <template v-for="(item, index) in tableData">
            <view
              :key="index"
              class="g-table-body-row u-flex u-row-between"
              @click.stop="rowClick(item, index, $event)"
            >
              <template v-for="(head, cindex) in tableHeaderList">
                <view
                  v-if="!head.h"
                  :key="cindex"
                  class="g-table-col g-table-body-col u-flex f28"
                  :class="[
                    {
                      'u-flex-1': tableHeaderList.length <= flexLength,
                      pl32: cindex === 0,
                      'g-table-stick-left': stickLeft && cindex === 0,
                      'g-table-stick-left-border': staticBorder && cindex === 0
                    },
                    item.class
                  ]"
                  :style="{
                    width: head.width + 'rpx' || '100%',
                    ...item.style,
                    'justify-content': align(head.align || 'left'),
                    height: rowHeight + 'rpx'
                  }"
                  @click="
                    cellClick(
                      {
                        key: head.key,
                        value: item[head.key],
                        label: head.title
                      },
                      index,
                      cindex,
                      $event
                    )
                  "
                >
                  <text class="f28">
                    {{ item[head.key] }}
                  </text>
                </view>
                <view
                  v-if="head.h"
                  :key="cindex"
                  class="g-table-col u-flex f28"
                  :class="[
                    {
                      'u-flex-1': tableHeaderList.length <= flexLength,
                      pl32: cindex === 0,
                      'g-table-stick-left': stickLeft && cindex === 0,
                      'g-table-stick-left-border': staticBorder && cindex === 0
                    },
                    item.class
                  ]"
                  :style="{
                    width: head.width + 'rpx' || '100%',
                    ...item.style,
                    'justify-content': align(head.align || 'left'),
                    height: rowHeight + 'rpx'
                  }"
                  @click="
                    cellClick(
                      {
                        key: head.key,
                        value: item[head.key],
                        label: head.title
                      },
                      index,
                      cindex,
                      $event
                    )
                  "
                  v-html="head.h(item, index, cindex)"
                />
              </template>
            </view>
          </template>
        </view>
      </view>
    </view>
    <view v-if="!tableData.length || tableData.length === 0">
      <slot name="empty">
        <view class="g-d-empty u-flex u-row-center">
          暂无数据
        </view>
      </slot>
    </view>
  </view>
</template>

<script>
const alignments = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  between: 'space-between',
  around: 'space-around'
};
export default {
  props: {
    tableHeight: {
      // table 高度，如需固定表头则需设置高度
      type: [Number, String],
      default: 0
    },
    rowHeight: {
      // 单元格行高度，超出会隐藏
      type: Number,
      default: 132
    },
    headerHeight: {
      // 表头高度
      type: Number,
      default: 88
    },
    tableData: {
      // 渲染的数据
      // 支持传入自定义 style: Object，class: Array
      // 可在columns中自定义该列的内容
      type: Array,
      default: () => []
    },
    stickLeft: {
      // 是否固定左侧第一栏
      type: Boolean,
      default: true
    },
    headerRightBorder: {
      // 表头是否展示单元格右侧横线
      type: Boolean,
      default: true
    },
    columns: {
      // 表头渲染数据 key 对应body渲染的字段，支持h,render 函数，自定义表头或者body每列
      // 支持传入自定义 style: Object，class: Array
      type: Array, // h: Function body 中列的处理函数 返回参数，当前行的数组对象，行的下标，列的下标 row $rIndex $cIndex，该函数可渲染自定义html
      default: () => [] // render: Function 表头列的处理函数 返回参数，当前行的数组对象，列的下标 该函数可渲染自定义html
    },
    leftOffset: {
      type: Number,
      default: 10
    },
    flexLength: {
      type: Number,
      default: 3
    },
    /**
     * @param columns
     * @returns columns
     * @description filterColumns： 渲染数据前对数据进行自定义的处理
     */
    filterColumns: {
      type: Function,
      default: columns => columns
    }
  },
  /**
   * @description 自定义事件
   *  rowClick 点击行事件, 返回当前行数据，当前行下标，事件 ： row, $rIndex, $event
   *  cellClick 点击列事件, 返回当前列数据，当前行下标， 列下标， 事件 ： cell, $rIndex,$cIndex, $event
   **/
  /**
   * @description 自定义插槽
   *  <slot name="empty"/> 支持自定义空样式
   * */
  data() {
    return {
      staticBorder: false,
      loading: false,
      left: 0,
      leftFirstWidth: 0,
      tableShow: true
    };
  },
  computed: {
    tableHeaderList() {
      if (typeof this.filterColumns === 'function') {
        return this.filterColumns(this.columns);
      }
      return this.columns;
    }
  },
  methods: {
    setLeftBorderBox() {
      if (!this.stickLeft) return;
      const info = uni.createSelectorQuery().select('#Left');
      const leftFirstInfo = uni.createSelectorQuery().select('#leftFirst');
      if (this.leftFirstWidth > 0) {
        info
          .boundingClientRect(LeftData => {
            if (LeftData && LeftData.left) {
              this.left = LeftData.left;
              const borderClass =
                this.left + this.leftFirstWidth / this.leftOffset <
                this.leftFirstWidth;
              // 需要样式 true
              this.staticBorder = borderClass;
            }
          })
          .exec();
      } else {
        info
          .boundingClientRect(LeftData => {
            if (LeftData && LeftData.left) {
              this.left = LeftData.left;
              leftFirstInfo
                .boundingClientRect(data => {
                  if (data && data.width) {
                    this.leftFirstWidth = data.width;
                    const borderClass =
                      this.left + data.width / this.leftOffset < data.width;
                    this.staticBorder = borderClass;
                  }
                })
                .exec();
            }
          })
          .exec();
      }
    },
    handletouchend() {
      this.setLeftBorderBox();
    },
    handletouchstart() {
      this.setLeftBorderBox();
    },
    align(alignment) {
      if (alignment === '') return 'flex-start';
      return alignments[alignment];
    },
    rowClick(row, index, event) {
      this.$emit('row-click', row, index, event);
    },
    cellClick(cell, $rIndex, $cIndex, event) {
      this.$emit('cell-click', cell, $rIndex, $cIndex, event);
    }
  }
};
</script>

<style scoped lang="scss">
.g-table {
  background-color: #fff;
  &-stick-left {
    display: inline-flex;
    position: sticky;
    position: -webkit-sticky;
    left: 0;
    z-index: 10;
    background-color: #fff;
  }
  &-stick-left-border {
    box-shadow: 10rpx 0 15rpx #f7f7f7;
  }
  &-main {
    max-height: 100%;
    overflow: auto;
    &-pack {
      width: fit-content;
      min-height: 100%;
      box-sizing: border-box;
    }
    &-header {
      box-sizing: border-box;
      display: inline-flex;
      width: 100%;
      min-width: 750rpx;
      white-space: nowrap;
      flex-shrink: 0;
      position: sticky;
      position: -webkit-sticky;
      top: 0;
      z-index: 9999;
      background-color: #fff;
      &-right-border {
        position: relative;
        &::after {
          display: inline-block;
          content: '';
          width: 4rpx;
          height: 32rpx;
          position: absolute;
          right: 0;
          background-color: #d6d6d9;
        }
      }
    }
    &-body {
      min-width: 750rpx;
      box-sizing: border-box;
    }
  }
  &-col {
    flex-shrink: 0;
    box-sizing: border-box;

    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
    &-txt {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &-body-col {
    box-sizing: border-box;
    padding: 16rpx 0 16rpx 32rpx;
    overflow: hidden;
  }
  .g-d-empty {
    box-sizing: border-box;
    padding: 32rpx 0 0;
  }
}
.pl32 {
  padding: 0 0 0 32rpx;
}
.f24 {
  font-size: 24rpx;
}
.f28 {
  font-size: 28rpx;
}
.g-loading {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: #fff;
  opacity: 0;
  transition: all 0.3s;
  &.ztableLoading {
    opacity: 1;
  }

  .g-loading-animate {
    position: relative;
    display: inline-block;
    width: 30rpx;
    height: 30rpx;
    margin-right: 20rpx;
    border-radius: 100%;
    border: solid 6rpx #ccc;
    vertical-align: middle;
    animation: rotate 1s ease-in-out infinite;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: -10rpx;
      z-index: 1;
      background: #fff;
      width: 20rpx;
      height: 20rpx;
      border-radius: 10rpx;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
  .t-c {
    text-align: center;
  }
}
</style>
