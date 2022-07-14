<template>
  <a-modal
    v-model:visible="visibled"
    title="新增"
    @ok="handleOk"
    @cancel="cancel"
  >
    <a-form :model="formState">
      <a-row>
        <a-col :span="8">
          <a-form-item style="margin:0 20px">
            <a-select v-model:value="formState.region">
              <a-select-option :value="1">
                增加
              </a-select-option>
              <a-select-option :value="2">
                减少
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item v-if="props.dialogData.data.type === 1">
            <span>
              里程：
            </span>
            <a-input-number v-model:value="formState.mileage" :min="1" />
            KM
          </a-form-item>
          <a-form-item v-else>
            <span>
              段数：
            </span>
            <a-input-number v-model:value="formState.part" :min="1" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { RunningConditionPresenter } from '@/request/api/presenter/runSettings';
import { message } from 'ant-design-vue';

export default defineComponent({
  props: {
    dialogData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    visible: {
      type: Boolean
    }
  },
  emits: ['handle-sure', 'handle-close'],
  setup(props, { emit }) {
    const store = useStore();

    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息
    const visibled = ref<boolean>(false);
    const formState = reactive({
      mileage: 1,
      part: 1,
      region: 1
    });

    watch(
      () => props.visible,
      () => {
        visibled.value = props.visible;
      }
    );

    const emitString = ref<string>('');

    const handleOk = async () => {
      const data = {
        mileage: formState.mileage,
        part: formState.part,
        semesterId: currentSemester.value.id,
        type: props.dialogData.data.type,
        userId: props.dialogData.data.id
      };
      if (props.dialogData.data.type === 1) {
        //里程模式
        data.part = 0;
      } else {
        data.mileage = 0;
      }
      if (formState.region === 2) {
        //减少
        data.mileage = data.mileage - data.mileage * 2;
        data.part = data.part - data.part * 2;
      }
      try {
        await RunningConditionPresenter.addRunningDetails(data);
        if (formState.region === 2) {
          //减少
          if (data.type === 1) {
            //里程
            emitString.value = `减少里程${Math.abs(data.mileage)}km`;
          } else {
            //段数
            emitString.value = `减少段数${Math.abs(data.part)}段`;
          }
        } else {
          //增加
          if (data.type === 1) {
            //里程
            emitString.value = `增加里程${Math.abs(data.mileage)}km`;
          } else {
            //段数
            emitString.value = `增加段数${Math.abs(data.part)}段`;
          }
        }
        emit('handle-sure', emitString.value);
        message.success('处理成功');
        visibled.value = false;
      } catch (error) {
        message.error(error.message);
      }
    };
    const cancel = () => {
      emit('handle-close');
    };
    return { props, handleOk, cancel, visibled, formState };
  }
});
</script>
<style lang="less" scoped></style>
