<template>
  <view>
    <view
      v-show="loading"
      :style="{ ...contentStyle }"
      class="skeleton-container"
      v-bind="$attrs"
    >
      <g-navbar
        v-if="showNavbar"
        :height="top"
        :is-back="false"
        :border-bottom="false"
        :title-bold="true"
        :background="{ backgroundColor: 'transparent' }"
      />
      <template v-for="(item, index) in elements">
        <!-- 横向并列布局 -->
        <view v-if="item.type == 'flex'" :key="index" class="ls_skeleton-group">
          <view
            v-for="(inner, index2) in item.children"
            :key="index2"
            :class="[inner.clas, index2 > 0 ? 'ls_ml' : '']"
          >
            <view
              v-for="(el, index3) in inner.eles"
              :key="index3"
              ref="skeleton"
              :style="el.style"
              :class="[
                el.clas,
                el.clas == 'ls_circle' ? '' : style,
                animateClass
              ]"
            />
          </view>
        </view>
        <view
          v-else-if="item.type === 'news'"
          :key="index"
          class="ls_skeleton-group"
        >
          <view
            ref="skeleton"
            class="ls_news_img"
            :class="[style, animateClass]"
          />
          <view class="ls_news">
            <view
              ref="skeleton"
              class="ls_line"
              :class="[style, animateClass]"
            />
            <view
              ref="skeleton"
              class="ls_news_user"
              :class="[style, animateClass]"
            />
            <view
              ref="skeleton"
              class="ls_news_time"
              :class="[style, animateClass]"
            />
          </view>
        </view>
        <!-- 垂直高度站位 -->
        <view
          v-else-if="item.type == 'space'"
          :key="index"
          :style="{ height: item.height + 'rpx' }"
        />
        <!-- 其他基本单位  line  card circle 等 -->
        <view
          v-else
          :key="index"
          ref="skeleton"
          :style="item.style"
          :class="[
            item.clas,
            item.clas == 'ls_circle' ? '' : style,
            animateClass
          ]"
        />
      </template>
    </view>
    <view v-show="!loading" :class="classNames" v-bind="$attrs">
      <slot />
    </view>
  </view>
</template>

<script>
/**
 * skeleton 骨架屏
 * @description 可自定义内容的骨架屏
 * @property {Boolean} loading 是否显示骨架（默认：否）
 * @property {Boolean} round 是否圆角骨架风格（默认：否）
 * @property {Boolean} animate 是否开启动画效果（默认：是）
 * @property {Array} skeleton 骨架内容:
 *            段落：line|line-sm|line-lg|
 *            卡片：card|card-sm|card-lg|
 *            圆：circle|circle-sm|circle-lg
 *            正方形：square|square-sm|square-lg）
 *            个数标识符*
 *            横向并列连接标识符+
 *            自定义样式 {}
 * @example
 */
/**
 * @description 骨架类型 calss
 * [
  'line',
  'line-sm',
  'line-lg',
  'card',
  'card-sm',
  'card-lg',
  'circle',
  'circle-sm',
  'circle-lg',
  'square',
  'square-sm',
  'square-lg'
];
 * */

/**
 * @description 基本样式
 * */
const stylesMen = {
  w: 'width',
  h: 'height',
  c: 'color',
  b: 'border',
  r: 'border-radius',
  BB: 'border-bottom',
  BT: 'border-top',
  BL: 'border-left',
  MR: 'margin-right',
  ML: 'margin-left',
  MB: 'margin-bottom',
  MT: 'margin-top',
  PAD: 'padding',
  PT: 'padding-top',
  PL: 'padding-left',
  BG: 'background-color'
};
export default {
  name: 'Skeleton',
  props: {
    // 是否显示骨架
    loading: {
      type: Boolean,
      default: true
    },
    // 是否圆角骨架风格
    round: {
      type: Boolean,
      default: false
    },
    // 骨架内容 特殊符号说明 [*代表个数 例如：line*3 意思是3个行] [+代表横向并列排列连接  例如：circ+line 意思是左侧一个圆右侧一个行] [纯数字 代表垂直间隔 例如：40 代表40前后的两个元素之间有40rpx高度的间隔]
    skeleton: {
      type: Array,
      default: () => []
    },
    // 是否开启动画效果
    animate: {
      type: Boolean,
      default: true
    },
    // 是否需要navbar占位
    showNavbar: {
      type: Boolean,
      default: false
    },
    // navbar距离顶部top值，注意 string类型 '0' 和 number 类型 0，会有一定差别
    top: {
      type: [Number, String],
      default: 0
    },
    classNames: {
      type: Array,
      default: () => []
    },
    contentStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      elements: []
    };
  },
  computed: {
    animateClass() {
      return this.animate ? 'ls_animation' : 'ls_static';
    },
    style() {
      if (this.round) {
        return 'ls_round';
      }
      return 'ls_radius';
    }
  },
  created() {
    this.init();
  },
  methods: {
    // 创建元素节点
    createElementsEles(node) {
      const new_node = `ls_${node}`;
      const elemtnt = {
        clas: new_node,
        type: 'skeleton',
        style: null
      };
      // 判断是否存在自定义style
      const regStyle = /\{((?!\{).)*\}/;
      if (regStyle.test(new_node)) {
        const { clas, style } = this.getEleStyles(new_node);
        elemtnt.clas = clas;
        elemtnt.style = style;
      }
      return elemtnt;
    },
    getElCountsAndLayout(clas) {
      const elements = {
        // flex左右布局中，给本身没有宽度属性的元素父级添加flex:1
        clas:
          clas.indexOf('circle') > -1 || clas.indexOf('square') > -1
            ? ''
            : 'ls_flex-sub',
        eles: []
      };
      if (clas.indexOf('*') > -1) {
        const group = clas.split('*');
        for (let i = 0, len = Number.parseInt(group[1]); i < len; i++) {
          elements.eles.push(this.createElementsEles(group[0]));
        }
      } else {
        elements.eles.push(this.createElementsEles(clas));
      }
      return elements;
    },

    getElCounts(clas) {
      const elements = [];
      if (clas.indexOf('*') > -1) {
        const group = clas.split('*');
        for (let i = 0, len = Number.parseInt(group[1]); i < len; i++) {
          elements.push(this.createElementsEles(group[0]));
        }
      } else {
        elements.push(this.createElementsEles(clas));
      }
      return elements;
    },
    // 自定义样式，拿来吧 你！
    getEleStyles(clas) {
      const firstIndex = clas.indexOf('{');
      const lastIndex = clas.indexOf('}');
      if (lastIndex <= firstIndex) {
        throw new Error('参数传递有误');
      }
      const styles = {};
      const stylesStr = clas.slice(firstIndex + 1, lastIndex);
      const styleItem = stylesStr.split(',');
      for (let i = 0; i < styleItem.length; i++) {
        const styleKV = styleItem[i].split(':');
        for (let j = 0; j < styleKV.length; j++) {
          const styleKVKey = styleKV[0].trim();
          if (stylesMen[styleKVKey]) {
            styles[stylesMen[styleKVKey]] = styleKV[1];
          } else {
            styles[styleKVKey] = styleKV[1];
          }
        }
      }
      const element = {
        clas: clas.slice(0, firstIndex),
        style: styles
      };
      return element;
    },
    init() {
      let elements = [];
      let elClass;
      this.skeleton.forEach(el => {
        if (typeof el === 'string') {
          // 一行多个布局
          if (el.indexOf('+') > -1) {
            const group = el.split('+');
            const children = [];
            group.forEach(els => {
              children.push(this.getElCountsAndLayout(els));
            });
            elements.push({
              type: 'flex',
              children
            });
          } else {
            elClass = this.getElCounts(el);
            elements = elements.concat(elClass);
          }
          // number 为间距
        } else if (typeof el === 'number') {
          elements.push({
            type: 'space',
            height: el
          });
        } else {
          throw new Error('[skeleton]: 参数格式包含了不符合规范的内容');
        }
      });
      this.elements = [...elements];
    }
  }
};
</script>

<style scoped lang="scss">
.skeleton-container {
  box-sizing: border-box;
  padding: 0 32rpx;
}
.border {
  border-width: 1px;
  border-style: solid;
  border-color: #dd524d;
}

/* 骨架种类 start*/
.ls_line-sm {
  height: 22rpx;
  margin-bottom: 32rpx;
}

.ls_line {
  height: 32rpx;
  margin-bottom: 30rpx;
}

.ls_line-lg {
  height: 48rpx;
  margin-bottom: 30rpx;
}

.ls_card-sm {
  height: 136rpx;
  margin-bottom: 20rpx;
}

.ls_card {
  height: 200rpx;
  margin-bottom: 30rpx;
}

.ls_card-lg {
  height: 200rpx;
  margin-bottom: 30rpx;
}

.ls_circle-sm {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50rpx;
  margin-bottom: 20rpx;
}

.ls_circle {
  width: 132rpx;
  height: 132rpx;
  border-radius: 132rpx;
  margin-bottom: 30rpx;
}

.ls_circle-lg {
  width: 200rpx;
  height: 200rpx;
  border-radius: 200rpx !important;
  margin-bottom: 30rpx;
}

.ls_square-sm {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 20rpx;
}

.ls_square {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 30rpx;
}

.ls_square-lg {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

/* 骨架种类 end*/

/* 辅助样式 under */
.ls_skeleton-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* margin-bottom: 30rpx; */
}

.ls_flex-sub {
  flex: 1;
}

.ls_round {
  border-radius: 48rpx;
}

.ls_radius {
  border-radius: 8rpx;
}

.ls_ml {
  margin-left: 20rpx;
}

.ls_animation {
  background-color: #ebecf2;
  animation-name: twinkle;
  animation-timing-function: inherit;
  animation-duration: 1.8s;
  animation-iteration-count: infinite;
}

.ls_static {
  background-color: #ebecf2;
}

@keyframes twinkle {
  0% {
    background-color: #ebecf2;
  }

  50% {
    background-color: #f5f6fa;
  }

  100% {
    background-color: #ebecf2;
  }
}

/* 扩展模板news样式 */
.ls_news {
  flex: 1;
  margin-left: 20rpx;
}

.ls_news_img {
  width: 240rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.ls_news_user {
  height: 32rpx;
  margin-bottom: 30rpx;
  width: 260rpx;
}

.ls_news_time {
  height: 32rpx;
  margin-bottom: 30rpx;
  width: 130rpx;
}
</style>
