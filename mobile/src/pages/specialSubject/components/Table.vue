<template>
  <view class="z-table">
    <view
      class="z-table-main"
      :style="{ height: tableHeight > 0 ? tableHeight + 'px' : 'auto' }"
    >
      <view
        v-if="!tableLoaded && (!tableData || !columns)"
        :class="['z-loading', { ztableLoading: tableShow }]"
      >
        <view class="z-loading-animate" />
      </view>
      <view
        class="z-table-container"
        @touchstart="touchStartHandle"
        @touchend="touchEndHandle"
      >
        <view class="z-table-pack">
          <view class="z-table-title">
            <view
              v-for="(item, index) in columns"
              :id="index === 0 ? 'leftFirst' : index === 1 ? 'left' : ''"
              :key="index"
              class="z-table-title-item"
              :class="{
                'z-table-stick-side': stickSide && index == 0,
                'right-shadow': staticBorder && index == 0
              }"
              @click="sort(item.key, index)"
            >
              <view
                v-if="showSelect && !singleSelect && index === 0"
                class="select-box"
                @click="doSelect(true)"
              >
                <view :class="['select-tip', { selected: selectAll }]" />
              </view>
              <view
                :class="[
                  'z-table-col-text',
                  { 'text-left': index === 0 },
                  { 'text-center': index > 0 }
                ]"
              >
                <view class="title u-line-2">
                  {{ getTitleText(item.title) }}
                </view>
                <view
                  v-if="
                    item.hasOwnProperty('key') &&
                    item.hasOwnProperty('sort') &&
                    tableData.length
                  "
                  class="sort"
                >
                  <view
                    class="up-arrow"
                    :class="{
                      action: nowSortKey == item.key && sortType == 'asc'
                    }"
                  />
                  <view
                    class="down-arrow"
                    :class="{
                      action: nowSortKey == item.key && sortType == 'desc'
                    }"
                  />
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="tableData.length"
            :class="[
              'table-container-box',
              { 'short-table': !longTable && showBottomSum }
            ]"
          >
            <view
              v-for="(row, iIndex) in tableData"
              :key="iIndex"
              class="z-table-container-row"
              :class="{ 'z-table-has-bottom': showBottomSum }"
            >
              <view
                v-for="(col, jIndex) in columns"
                :key="jIndex"
                :class="[
                  'z-table-container-col',
                  { 'z-table-stick-side': stickSide && jIndex == 0 },
                  { 'right-shadow': staticBorder && jIndex == 0 }
                ]"
                @click="itemClick(row, col)"
              >
                <view
                  v-if="showSelect && jIndex === 0"
                  class="select-box"
                  @click="doSelect(false, iIndex)"
                >
                  <view
                    :class="[
                      'select-tip',
                      { selected: selectArr.includes(iIndex) }
                    ]"
                  />
                </view>
                <view
                  :class="[
                    'z-table-col-text',
                    { 'text-left': jIndex === 0 },
                    { 'text-center': jIndex > 0 }
                  ]"
                >
                  <view v-if="jIndex === 0" class="stu-name-box">
                    <view class="u-flex">
                      <view class="stu-name u-line-1">
                        {{ row.name }}
                      </view>
                      <view class="stu-name">
                        {{ row.sex === 1 ? '(男)' : '(女)' }}
                      </view>
                    </view>
                    <view class="stu-number u-line-1">
                      {{ row.studentNum }}
                    </view>
                  </view>
                  <view
                    v-else
                    :class="[
                      'ipt',
                      { 'border-gray': iIndex === rowNum && jIndex === colNum }
                    ]"
                    @click="clickHandle(row, col)"
                  >
                    {{ tableRateData[iIndex][jIndex - 1] }}
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="showBottomSum && tableData.length"
            :class="['z-table-bottom', { 'long-table': longTable }]"
          >
            <view
              v-for="(sumCol, sumIndex) in columns"
              :key="sumIndex"
              class="z-table-bottom-col"
              :class="{ 'z-table-stick-side': stickSide && sumIndex == 0 }"
              :style="{ width: sumCol.width ? sumCol.width + 'rpx' : '200rpx' }"
            >
              <view class="z-table-bottom-text">
                <!-- <view v-if="sumIndex != 0" class="z-table-bottom-text-title">{{ sumCol.title }}</view> -->
                <text :class="{ sum: sumIndex == 0 }">
                  {{ sumIndex == 0 ? '总计' : dosum(sumCol) }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="tableData && tableData.length == 0" class="table-empty">
        <image
          class="table-empty-img"
          src="~@/static/img/empty-course.png"
          mode="scaleToFill"
        />
        <view class="table-empty-text">未找到相关内容</view>
      </view>
    </view>
  </view>
</template>

<script>
/*
 * 表格使用
 * 注意如果需要异步加载，需要把tableData初始值设为false，当没有数据的时候值为空数组
 * props: tableData [Array | Boolean] | 表格数据 如果为false则显示loading
 * 		 columns [Array | Boolean] | 数据映射表 如果为false则显示loading 每列params => title(表头文字可以是html字符串模版), width(每列宽度) [, key(对应tableData的字段名) || format(自定义内容), sort(是否要排序), isLink(是否显示为超链接Object)]
 * 										   format格式: {template: 字符串模版用#key#表示需要被替换的数据,names: 对应template属性内要被替换的内容的key}
 * 										   isLink格式: {url: 链接地址, params: 地址带的参数Array[key|value, key|value, ...]每一项都是key和value以'|'链接,如果不带'|'默认键值同名
 * 										   listenerClick(是否监听点击事件Boolean)}
 * 		 stickSide Boolean | 是否固定右侧首栏 默认不显示
 * 		 showBottomSum Boolean | 是否显示底部统计 默认不显示
 * 		 showLoading Boolean | 是否首次加载首次加载不显示暂无数据内容
 * 		 emptyText String | 空数据显示的文字内容
 *		 tableHeight Number | 设置表格高度会滚动
 *		 sort Boolean | 开启排序
 * 		 showSelect Boolean | 开启选择
 *		 singleSelect Boolean | 在开启选择的状态下是否开起单选
 * 		 textAlign String | 内容对齐方式 left center right
 * 		 titleTextAlign String | 表头对齐方式 left center right
 *
 * event: onSort | 排序事件 返回{key: 被排序列的字段名, type: 正序'asc'/倒序'desc'}
 *		  onSelect | 选中时触发 返回选择的行的下标
 * 		  onClick | 单元格点击事件 返回点击单元格所属行的数据
 *
 * function: resetSort | 调用后重置排序 *注意:不会触发sort事件
 *
 * */
// import Vue from 'vue';
// import tableRender from './table-render'
import { scoresDetails } from '../common';

export default {
  props: {
    tableData: {
      type: [Array, Boolean],
      default() {
        return false;
      }
    },
    columns: {
      /*
       *
       * [{title: xxx, key: 当前列展示对象名, width: 列宽, render: function}]
       *
       * */
      type: [Array, Boolean],
      required: true
    },
    stickSide: {
      type: Boolean,
      default: false
    },
    showBottomSum: {
      type: Boolean,
      default: false
    },
    showLoading: {
      type: Boolean,
      default: true
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    tableHeight: {
      type: [Number, Boolean],
      default: 0
    },
    rowNum: {
      type: Number,
      default: -1
    },
    colNum: {
      type: Number,
      default: -1
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    singleSelect: {
      type: Boolean,
      default: false
    },
    textAlign: {
      type: String,
      default: 'left' // right|center|left
    },
    titleTextAlign: {
      type: String,
      default: 'left' // right|center|left
    },
    courseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      version: '1.1.3',
      nowSortKey: '',
      sortType: 'desc', // asc/desc 升序/降序
      longTable: true,
      lineHeight: uni.upx2px(64),
      tableLoaded: false,
      tableShow: true,
      selectAll: false,
      selectArr: [],
      borderShow: false,
      tableRateData: [],
      staticBorder: false,
      leftOffset: 6,
      left: 0,
      leftFirstWidth: 0
    };
  },
  // mixin: [tableRender],
  computed: {
    compluteHeight() {
      return this.tableHeight
        ? `height: ${uni.upx2px(this.tableHeight)}px`
        : '';
    }
  },
  // components: {
  // 	renderComponents: {
  // 		functional: true,
  // 		props: {
  // 			row: {
  // 				type: Object,
  // 				required: true
  // 			},
  // 			col: {
  // 				type: Object,
  // 				required: true
  // 			}
  // 		},
  // 		render: function(h, ctx) {
  // 			return _this[ctx.props.col.render](h, ctx.props)
  // 		}
  // 	}
  // },
  watch: {
    columns() {
      this.init();
    },
    tableData() {
      this.init();
      this.getTableRateData();
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      this.getTableRateData();
    });
  },
  methods: {
    async init() {
      // 重置选择内容
      this.selectAll = false;
      this.selectArr = [];
      this.tableLoaded = false;
      this.tableShow = true;
      const _this = this;
      const container = await _this.getPageSize('.z-table-container'),
        pack = await _this.getPageSize('.z-table-pack');
      _this.timer && clearTimeout(_this.timer);
      if (container && pack) {
        _this.$nextTick(() => {
          if (_this.tableData && _this.tableData.length) {
            _this.tableShow = false;
            _this.timer = setTimeout(() => {
              _this.tableLoaded = true;
            }, 300);
          }
        });
        if (container.height !== pack.height) {
          _this.longTable = true;
        } else {
          _this.longTable = false;
        }
      } else {
        _this.tableLoaded = false;
        _this.$nextTick(() => {
          _this.tableShow = true;
        });
      }
    },
    getPageSize(selecter) {
      // 获取元素信息
      const query = uni.createSelectorQuery().in(this),
        // eslint-disable-next-line no-unused-vars
        _this = this;
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        query
          .select(selecter)
          .boundingClientRect((res) => {
            resolve(res);
          })
          .exec();
      });
    },
    dosum({ key, noSum = false, formatNum = true }) {
      let sum = '-';
      if (noSum) return sum;
      if (this.tableData) {
        if (
          this.tableData.every((item) => {
            return !Number.isNaN(item[key] - 0);
          })
        ) {
          sum = 0;
          this.tableData.map((item, index) => {
            if (!key && index !== 0) {
              sum = '-';
            } else {
              const val = item[key] - 0;
              if (Number.isNaN(val)) {
                sum += 0;
              } else {
                sum += val;
              }
            }
          });
        }
      }
      // sum = sum == 0 ? "-" : sum
      return formatNum ? this.numTransform(sum) : sum;
    },
    getRowContent(row, col) {
      // 表格值处理函数
      // 如果columns带了key则显示对应的key
      // 如果columns带的format则按规定返回format后的html
      // format规定: params names <Array> 对应tableData的键名,作为匹配template中两个#之间动态内容的名字
      //			   params template <String> html字符串模版
      let tempHTML = '';
      let rowKey = row[col.key];
      if ([null, ''].includes(rowKey)) {
        rowKey = '-';
      }
      const { formatNum = true } = col;
      if (rowKey || rowKey === 0) {
        tempHTML =
          isNaN(rowKey - 0) || !formatNum
            ? rowKey
            : this.numTransform(rowKey - 0);
        // tempHTML = tempHTML == 0 ? "-" : tempHTML
      } else if (col.format) {
        let tempFormat = col.format.template;
        col.format.names.map((item) => {
          // eslint-disable-next-line no-useless-escape
          const regexp = new RegExp(`\#${item}\#`, 'mg');
          tempFormat = tempFormat.replace(regexp, row[item]);
        });
        tempHTML = tempFormat;
      } else if (!col.render) {
        const error = new Error('数据的key或format值至少一个不为空');
        throw error;
      }
      return tempHTML.toString();
    },
    sort(key, index) {
      if (!key || !this.columns[index].sort) {
        return;
      }
      // 排序功能: 如果点击的排序按钮是原先的 那么更改排序类型
      //			如果点击的另一个排序按钮 那么选择当前排序并且排序类型改为降序(desc)
      if (key !== this.nowSortKey) {
        this.nowSortKey = key;
        this.sortType = 'desc';
      } else {
        this.toggleSort();
      }
      this.$emit('onSort', {
        key: this.nowSortKey,
        type: this.sortType
      });
    },
    toggleSort() {
      this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';
    },
    numTransform(n) {
      if (Number.isNaN(n - 0)) {
        return n;
      }
      if (Math.abs(n) >= 100000000) {
        // eslint-disable-next-line no-param-reassign
        n = `${Number((n / 100000000).toFixed(1))}亿`;
      } else if (Math.abs(n) >= 10000) {
        // eslint-disable-next-line no-param-reassign
        n = `${Number((n / 10000).toFixed(1))}万`;
      }
      return n.toString();
    },
    resetSort() {
      // 重置排序状态
      this.nowSortKey = '';
      this.sortType = 'desc';
    },
    setUrl(row, col) {
      if (!col.isLink) {
        return;
      }
      const urlParam = {};
      let {
        // eslint-disable-next-line prefer-const
        isLink: { url, params = [] }
      } = col;
      params.forEach((item) => {
        if (~item.indexOf('|')) {
          const temp = item.split('|');
          urlParam[temp[0]] = row[temp[1]];
        } else {
          urlParam[item] = row[item];
        }
      });
      url = this.setUrlParams(url, urlParam);
      return url;
    },
    setUrlParams(url, params) {
      let tempUrl = url,
        // eslint-disable-next-line prefer-const
        keyArr = Object.keys(params);
      keyArr.forEach((item) => {
        tempUrl += `&${item}=${params[item]}`;
      });
      // eslint-disable-next-line no-useless-escape
      tempUrl = tempUrl.replace(/\&/, '?');
      return tempUrl;
    },
    itemClick(row, col) {
      if (col.listenerClick) {
        this.$emit('onClick', row);
      }
    },
    doSelect(isAll = false, index) {
      const temp = new Set();
      if (isAll) {
        // 全选
        if (!this.selectAll) {
          for (let i = 0; i < this.tableData.length; i++) {
            temp.add(i);
          }
        }
      } else {
        // if (!this.singleSelect) {
        // 	this.selectArr.forEach(item => {
        // 		temp.add(item)
        // 	})
        // }
        this.selectArr.forEach((item) => {
          temp.add(item);
        });
        if (temp.has(index)) {
          temp.delete(index);
        } else {
          if (this.singleSelect) {
            temp.clear();
          }
          temp.add(index);
        }
      }
      this.selectArr = Array.from(temp);
      if (this.selectArr.length === this.tableData.length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }

      this.$emit('onSelect', this.selectArr);
    },
    // 1.1.1
    getTitleText(title) {
      // 自定义表头
      const tempHTML = title;
      return tempHTML.toString();
    },

    // 获取所有成绩集合
    getTableRateData() {
      const tableArr = [];
      if (this.$props.tableData) {
        this.$props.tableData.forEach((item) => {
          const tempArr = [];
          item.subjectAchievementList.forEach((i) => {
            let rate = i.rate;
            if (i.subjectType === 'TIME' && rate) {
              rate = scoresDetails.timeStampToTime(rate).format;
            }
            if (rate === '') {
              tempArr.push(0);
            } else {
              tempArr.push(rate === null ? '-' : rate);
            }
          });
          tableArr.push(tempArr);
        });
      }
      this.tableRateData = tableArr;
    },

    // 点击专项成绩
    clickHandle(row, col) {
      if (row[col.key] === null) {
        this.tableRateData.forEach((item, index) => {
          if (index === row.rowNum) {
            item.splice(col.colNum - 1, 1, '');
          }
        });
        this.$forceUpdate();
      }
      this.$emit('clickHandle', row, col);
    },
    // 按键被点击
    valChange(val) {
      const { rowNum, colNum } = this.$props;
      this.tableRateData.forEach((item, index) => {
        if (index === rowNum) {
          item.splice(colNum - 1, 1, val);
        }
      });
      this.$forceUpdate();
    },
    // 添加阴影样式
    setLeftBorderBox() {
      const info = uni.createSelectorQuery().select('#left');
      const leftFirstInfo = uni.createSelectorQuery().select('#leftFirst');
      if (this.leftFirstWidth > 0) {
        info
          .boundingClientRect((LeftData) => {
            this.left = LeftData.left;
            if (
              this.left + this.leftFirstWidth / this.leftOffset <
              this.leftFirstWidth
            ) {
              // 需要样式
              this.staticBorder = true;
            } else {
              this.staticBorder = false;
            }
          })
          .exec();
      } else {
        info
          .boundingClientRect((LeftData) => {
            this.left = LeftData.left;
            leftFirstInfo
              .boundingClientRect((data) => {
                this.leftFirstWidth = data.width;
                if (this.left + data.width / this.leftOffset < data.width) {
                  // 需要样式
                  this.staticBorder = true;
                } else {
                  this.staticBorder = false;
                }
              })
              .exec();
          })
          .exec();
      }
    },
    // 滚动开始事件
    touchStartHandle() {
      this.setLeftBorderBox();
    },
    // 滚动结束事件
    touchEndHandle() {
      this.setLeftBorderBox();
    }
  }
};
</script>

<style lang="scss" scoped>
.navigator-hover {
  background: transparent;
  opacity: 1;
}

@mixin ellipsis($num: 1) {
  overflow: hidden;
  text-overflow: ellipsis;

  @if $num==1 {
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $num;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
  }
}

// 三角形
%triangle-basic {
  content: '';
  height: 0;
  width: 0;
  overflow: hidden;
}

@mixin triangle($direction, $size, $borderColor) {
  @extend %triangle-basic;

  @if $direction==top {
    border-bottom: $size solid $borderColor;
    border-left: $size dashed transparent;
    border-right: $size dashed transparent;
    border-top: 0;
  } @else if $direction==right {
    border-left: $size solid $borderColor;
    border-top: $size dashed transparent;
    border-bottom: $size dashed transparent;
    border-right: 0;
  } @else if $direction==bottom {
    border-top: $size solid $borderColor;
    border-left: $size dashed transparent;
    border-right: $size dashed transparent;
    border-bottom: 0;
  } @else if $direction==left {
    border-right: $size solid $borderColor;
    border-top: $size dashed transparent;
    border-bottom: $size dashed transparent;
    border-left: 0;
  }
}

a {
  text-decoration: none;
}

.z-table {
  // position: absolute;
  display: inline-block;
  // height: 100%;
  min-height: 130rpx;
  width: 100%;
  background: #fff;
  // padding-top: 88rpx;
  //   border: solid 2rpx #ccc;
  font-size: 28rpx;
  box-sizing: border-box;
  transform: translateZ(0);

  .z-table-main {
    height: 100%;
    box-sizing: border-box;
  }

  .z-table-container {
    height: 100%;
    overflow: scroll;
    box-sizing: border-box;
    .right-shadow {
      box-shadow: 10rpx 0 15rpx #f7f7f7;
    }
  }

  .z-table-pack {
    position: relative;
    min-height: 100%;
    width: fit-content;
  }

  .z-table-title {
    position: sticky;
    top: 0;
    z-index: 9999;
    background: #fff;
    justify-content: space-between;
    // border-bottom: solid 2rpx #e8e8e8;

    .z-table-title-item {
      height: 100%;
      background: #fff;
      font-size: 24rpx;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      text-align: center;
    }
    .z-table-title-item:last-child {
      margin-right: 32rpx;
    }
    .z-table-title-item:first-child {
      width: 250rpx;
      color: rgba(102, 102, 102, 1);
      padding-left: 32rpx;
    }
    .z-table-title-item:not(:first-child):not(:last-child):after {
      content: '';
      width: 3rpx;
      height: 32rpx;
      background-color: #d6d6d9;
    }
    .z-table-title-item:not(:first-child) {
      .z-table-col-text {
        .title {
          padding: 0 26rpx;
          width: 196rpx;
        }
      }
    }

    .z-table-stick-side {
      position: sticky;
      top: 0;
      left: 0;
      box-sizing: border-box;
      background: #fff;
    }
  }

  .table-container-box.short-table {
    padding-bottom: 48rpx;
  }
  .table-container-box {
    .ipt {
      text-align: center;
      line-height: 86rpx;
      width: 172rpx;
      height: 86rpx;
      overflow: hidden;
    }
    .border-gray {
      border-radius: 4px;
      border: 2rpx solid #dcdfe6;
    }
  }

  .z-table-title,
  .z-table-container-row {
    display: flex;
    width: 100%;
    min-width: 750rpx;
    // white-space: nowrap;
    box-sizing: border-box;
    border-bottom: solid 2rpx #e8e8e8;
    justify-content: space-between;
    .z-table-title-item {
      // @include ellipsis();
      display: inline-flex;
      height: 88rpx;
      align-items: center;
      // line-height: 88rpx;
      box-sizing: border-box;
    }
    .z-table-container-col {
      width: 196rpx;
      display: flex;
      height: 132rpx;
      align-items: center;
      // line-height: 132rpx;
      box-sizing: border-box;
      align-items: center;
      ::v-deep uni-input {
        font-size: 28rpx !important;
        height: 100% !important;
        min-height: 100% !important;
        font-size: 30rpx;
        color: rgba(34, 34, 34, 1);
        text-align: center;
      }
    }
    .z-table-container-col:last-child {
      margin-right: 32rpx;
    }
    .z-table-container-col:first-child {
      width: 250rpx;
      padding-left: 32rpx;
      // margin-right: 20rpx;
      color: rgba(34, 34, 34, 1);
      // box-shadow: 10rpx 0 14rpx -2rpx rgba(0, 0, 0, 0.17);
      .stu-name {
        display: inline-block;
        max-width: 138rpx;
      }
      .stu-number {
        width: 218rpx;
        margin-top: 4rpx;
        font-size: 24rpx;
        color: rgba(102, 102, 102, 1);
      }
    }
    // .z-table-container-col:not(:first-child) {
    //   .z-table-col-text {
    //     padding: 0 26rpx;
    //     width: rpx;
    //   }
    // }
  }

  .z-table-container-row {
    z-index: 0;
    // border-bottom: solid 1rpx #f4f4f4;
    box-sizing: border-box;
  }

  .z-table-stick-side {
    position: sticky;
    left: 0;
    background: #fff;
    // border-right: solid 1rpx #dbdbdb;
    box-sizing: border-box;
  }

  .z-table-bottom {
    position: absolute;
    bottom: 0;
    z-index: 9;
    display: flex;
    justify-items: center;
    width: fit-content;
    background: #4298f7 !important;
    color: #fff !important;
    white-space: nowrap;
    box-sizing: border-box;

    &.long-table {
      position: sticky;
    }

    .z-table-stick-side {
      background: #4298f7 !important;
      box-sizing: border-box;
    }

    .z-table-bottom-col {
      display: inline-flex;
      align-items: center;
      text-align: center;
      padding: 16rpx;
      box-sizing: border-box;
    }

    .z-table-bottom-text {
      line-height: 100%;
      box-sizing: border-box;
    }

    .z-table-bottom-text-title {
      margin-bottom: 10rpx;
      font-size: 22rpx;
      color: #aad0ff;
      box-sizing: border-box;
    }

    .sum {
      margin-left: 14rpx;
      font-size: 28rpx;
      box-sizing: border-box;
    }
  }

  .table-empty {
    position: absolute;
    top: 300rpx;
    // height: 64rpx;
    // line-height: 64rpx;
    width: 100%;
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

  .sort {
    display: flex;
    padding: 5rpx;
    flex-direction: column;
    justify-content: center;

    .up-arrow {
      @include triangle(top, 10rpx, #ccc);
      display: block;
      margin-bottom: 5rpx;

      &.action {
        @include triangle(top, 10rpx, #4298f7);
      }
    }

    .down-arrow {
      @include triangle(bottom, 10rpx, #ccc);
      display: block;

      &.action {
        @include triangle(bottom, 10rpx, #4298f7);
      }
    }
  }

  // 1.0.5
  .z-loading {
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

    .z-loading-animate {
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
  }

  // 1.1.0
  .select-box {
    display: inline-block;
    width: 26rpx;
    height: 26rpx;
    line-height: 14rpx;
    margin-right: 15rpx;
    border: solid 2rpx #4298f7;
    border-radius: 4rpx;
    background: #fff;
    text-align: center;
  }

  .select-tip {
    display: inline-block;
    opacity: 0;
    transform: rotate(90deg);
    transition: all 0.3s;

    &.selected {
      position: relative;
      top: 4rpx;
      left: -4rpx;
      height: 4rpx;
      background: #4298f7;
      width: 10rpx;
      opacity: 1;
      transform: rotate(45deg);

      &:before,
      &:after {
        content: '';
        position: absolute;
        display: block;
        height: 4rpx;
        background: #4298f7;
      }

      &:before {
        bottom: -2rpx;
        left: -4rpx;
        width: 8rpx;
        transform: rotate(-90deg);
      }

      &:after {
        bottom: 16rpx;
        right: -16rpx;
        width: 34rpx;
        transform: rotate(-90deg);
      }
    }
  }

  // 1.1.1
  .z-table-col-text {
    display: flex;
    width: 100%;
    flex: 1;
    justify-content: flex-start;
    align-content: center;
    ::v-deep .u-input {
      position: static !important;
      width: 172rpx;
      height: 88rpx;
    }
    ::v-deep .uni-input-wrapper {
      position: static !important;
    }
    ::v-deep .uni-input-input {
      position: static !important;
    }

    &.text-center {
      justify-content: center;
    }

    &.text-right {
      justify-content: flex-end;
    }
  }
}
</style>
