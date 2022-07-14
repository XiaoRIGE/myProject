<template>
  <a-modal
    v-model:visible="visible"
    :title="'正在' + getNameRef"
    :footer="null"
  >
    <div class="example">
      <a-spin :tip="`成绩正在${getNameRef}中，请稍后！`" />
    </div>
    <!-- <p>该班级成绩正在复核中...</p> -->
    <!-- <a-progress :percent="percent" status="active" />
    <p class="mt-24">
      已{{ getNameRef }}{{ finishedCountRef }}人，等待{{ getNameRef
      }}{{ surplusCountRef }}人
    </p> -->
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch, watchEffect } from 'vue';
export default defineComponent({
  name: 'ProcessLoading',
  props: {
    showVisible: {
      type: Boolean,
      default: false
    },
    // 获取进度接口
    getProcessService: {
      type: Function,
      required: true
    },
    // 接口参数
    getProcessServiceParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 复核，生成文字展示
    getName: {
      type: String,
      default: '复核'
    }
  },
  emits: ['close', 'finish'],
  setup(props, { emit }) {
    const loading = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const getNameRef = ref<string>('');

    const showModal = () => {
      visible.value = true;
    };
    watchEffect(() => {
      visible.value = props.showVisible;
      getNameRef.value = props.getName;
    });

    const percent = ref<number>(0);
    const finishedCountRef = ref<number>(0); //已复核人数
    const surplusCountRef = ref<number>(0); //未复核人数

    const getReViewProgress = async () => {
      setTimeout(async () => {
        try {
          const {
            surplusCount,
            finishedCount,
            process
          } = await props.getProcessService(props.getProcessServiceParams);
          percent.value = process;
          finishedCountRef.value = finishedCount;
          surplusCountRef.value = surplusCount;
        } catch (error) {
          console.log(error);
        }
      }, 1000);
    };

    let timer: any;

    //获取实时进度
    const getPercent = () => {
      getReViewProgress();
      timer = setInterval(() => {
        getReViewProgress();
      }, 5000);
    };

    watch(
      () => visible.value,
      newVal => {
        if (newVal && percent.value < 100) {
          getPercent();
        }
        if (!newVal) {
          // 关闭弹窗，清除定时任务
          emit('close');
          clearInterval(timer);
          percent.value = 0;
        }
      }
    );

    watch(
      () => percent.value,
      newVal => {
        if (newVal >= 100) {
          emit('close');
          emit('finish');
          clearInterval(timer);
          percent.value = 0;
        }
      }
    );

    return {
      loading,
      visible,
      showModal,
      percent,
      finishedCountRef,
      surplusCountRef,
      getNameRef
    };
  }
});
</script>

<style lang="less" scoped>
.example {
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
.mt-24 {
  margin-top: 24px;
}
</style>
