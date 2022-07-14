<template>
  <div class="ruleBox" :class="ruleType === 'TIME' ? 'max-w-330' : 'max-w-240'">
    <div class="ruleItem">
      <div class="left">
        <div v-if="ruleType === 'ENUM'">
          <span>成绩</span>
          <!-- 数值 -->
          <div v-for="(item, index) in ruleListRef" :key="index">
            <a-input-number
              v-model:value="item.enumValue"
              :min="0"
              :step="1"
              class="margin-6"
            />
          </div>
        </div>
        <div v-if="ruleType === 'TIME'">
          <span>成绩</span>
          <div v-for="(item, index) in ruleListRef" :key="index">
            <a-input-number
              v-model:value="item.minutesValue"
              :min="0"
              :max="999"
              :step="1"
              class="margin-6"
              :formatter="value => `${value}分`"
              :parser="value => value.replace('分', '')"
            />
            <a-input-number
              v-model:value="item.secondValue"
              :min="0"
              :max="59.99"
              :step="1"
              class="margin-6"
              :formatter="value => `${value}秒`"
              :parser="value => value.replace('秒', '')"
              @change="secondChange(item.secondValue, index)"
            />
          </div>
        </div>
      </div>
      <div class="right">
        <span>得分</span>
        <div v-for="(item, index) in ruleListRef" :key="index">
          <a-input-number
            v-model:value="item.grade"
            :min="0"
            :max="100"
            :step="1"
            class="margin-6"
          />
          <svg
            v-if="ruleListRef.length !== 1"
            class="icon cursor"
            aria-hidden="true"
            @click="hanldeDeleteItem(index)"
          >
            <use xlink:href="#icondelete" />
          </svg>
        </div>
      </div>
    </div>
    <p class="color-blue cursor" @click="hanldeAdd">+ 添加规则</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
interface RuleItem {
  grade: number;
  enumValue: string;
  minutesValue: number;
  secondValue: number;
}
export default defineComponent({
  props: {
    // 规则类型:   ENUM:数值  TIME:时间
    ruleType: {
      type: String,
      default: 'TIME'
    },
    // 默认数据
    defaultData: {
      type: Array,
      default: (): RuleItem[] => [
        // { grade: 10, enumValue: '10', minutesValue: 10, secondValue: 10 },
        // { grade: 20, enumValue: '20', minutesValue: 20, secondValue: 20 }
      ]
    }
  },
  setup(props) {
    // 规则
    const ruleListRef = ref<RuleItem[]>([
      {
        enumValue: '0',
        minutesValue: 0,
        secondValue: 0,
        grade: 0
      }
    ]);
    // 编辑时回显
    watchEffect(() => {
      ruleListRef.value = props.defaultData as RuleItem[];
    });

    const hanldeDeleteItem = (index: number) => {
      ruleListRef.value.splice(index, 1);
    };

    const hanldeAdd = () => {
      ruleListRef.value.push({
        grade: 0,
        enumValue: '0',
        minutesValue: 0,
        secondValue: 0
      });
    };
    const secondChange = (value: number, index: number) => {
      ruleListRef.value[index].secondValue = Number(value.toFixed(2));
    };

    return { ruleListRef, hanldeAdd, hanldeDeleteItem, secondChange };
  }
});
</script>

<style lang="less" scoped>
.ruleBox {
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.02);
  // border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 0 8px 4px;
}
.ruleItem {
  display: flex;
  align-items: center;
}
.margin-6 {
  margin-right: 6px;
}
.icon {
  font-size: 16px;
  width: 16px;
  height: 16px;
}
.max-w-330 {
  width: 330px;
}
.max-w-240 {
  width: 240px;
}
</style>
