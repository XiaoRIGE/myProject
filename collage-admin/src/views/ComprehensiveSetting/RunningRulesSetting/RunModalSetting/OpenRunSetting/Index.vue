<template>
  <a-modal
    v-model:visible="showVisible"
    centered
    :mask-closable="false"
    @ok="saveAppDialog"
    @cancel="closeAppDialog"
  >
    <div class="run_function">
      <div>
        <p class="close_run_function">
          开启有效跑步模式
        </p>
        <p class="close_run_message">
          <a-checkbox-group
            v-model:value="formState.checked"
          >
            <div>
              <a-checkbox value="freePattern">
                自由跑
              </a-checkbox>
              <p>
                如果开启自由跑模式，所有自由跑跑步数据均可计入有效里程
              </p>
            </div>
            <div>
              <a-checkbox value="scopePattern">
                范围跑
              </a-checkbox>
              <p>
                有效范围外的跑步里程不超过总里程的
                <a-input-number
                  v-model:value="formState.scopePercentage"
                  :disabled="!areaDisable"
                  :min="0"
                  :max="100"
                />
                %，否则将此次记录看作无效。
                （例如设置为50%的情况下，学生跑了10公里，4公里在学校范围内跑的，6公里在学校范围外跑的，那么本次记录会被看作无效数据）
              </p>
            </div>
            <div>
              <a-checkbox value="fixedPointPattern">
                定点跑
              </a-checkbox>
              <p>
                定点跑需
                <a-select
                  v-model:value="formState.fixedPointOrder"
                  :disabled="!pointDisable"
                  style="width:100px"
                >
                  <a-select-option :value="0">
                    不按顺序
                  </a-select-option>
                  <a-select-option :value="1">
                    按顺序
                  </a-select-option>
                </a-select>
                经过第
                <a-input-number
                  v-model:value="formState.fixedPointNumber"
                  :disabled="!pointDisable"
                  :min="3"
                  :max="6"
                />
                个点，且完成最小有效里程 才能完成有效数据计入。 不按顺序
                有效范围外的跑步里程不超过总里程的
                <a-input-number
                  v-model:value="formState.fixedPointPercentage"
                  :disabled="!pointDisable"
                  :min="0"
                  :max="100"
                />
                %，否则将此次记录看作无效。
              </p>
            </div>
          </a-checkbox-group>
        </p>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive ,watch} from 'vue';
interface formState {
  checked: string | string[];
  fixedPointOrder: number;
  scopePercentage: number;
  fixedPointPercentage: number;
  fixedPointNumber: number;
}

export default defineComponent({
  props: {
    closeAppVisible: {
      type: Boolean
    },
    initData:{
      type:Object,
      default:() => {
        return {};
      }
    }
  },
  emits: ['change-visible','handle-save'],

  setup(props, { emit }) {
    const showVisible = computed(() => {
      return props.closeAppVisible;
    });


    const closeAppDialog = () => {
      emit('change-visible', false);
    };

    const formState: formState = reactive({
      checked: [],
      fixedPointOrder: 0,
      scopePercentage: 15,
      fixedPointPercentage: 15,
      fixedPointNumber: 3,
    });


    watch(
      () => props.initData,
      () => {
        formState.checked= [];
        if(props.initData.freePattern === 1) {
          formState.checked.push('freePattern');
        }
        if(props.initData.scopePattern === 1) {
          formState.checked.push('scopePattern');
        }
        if(props.initData.fixedPointPattern === 1) {
          formState.checked.push('fixedPointPattern');
        }
        formState.fixedPointOrder = props.initData.fixedPointOrder;
        formState.scopePercentage = props.initData.scopePercentage;
        formState.fixedPointPercentage = props.initData.fixedPointPercentage;
        formState.fixedPointNumber = props.initData.fixedPointNumber;
      },
      {
        deep:true
      }
    );

    const areaDisable = computed(() => {
      return formState.checked.includes('scopePattern');
    });

    const pointDisable = computed(() => {
      return formState.checked.includes('fixedPointPattern');
    });

    const saveAppDialog = () => {
      const currentCheck = formState.checked;
      const data = {
        freePattern:currentCheck.includes('freePattern')?1:0,
        scopePattern:currentCheck.includes('scopePattern')?1:0,
        scopePercentage:formState.scopePercentage,
        fixedPointPattern:currentCheck.includes('fixedPointPattern')?1:0,
        fixedPointPercentage:formState.fixedPointPercentage,
        fixedPointOrder:formState.fixedPointOrder,
        fixedPointNumber:formState.fixedPointNumber
      };
      emit('handle-save',data);
    };

    return {
      showVisible,
      saveAppDialog,
      formState,
      areaDisable,
      pointDisable,
      closeAppDialog
    };
  }
});
</script>
<style lang="less" scoped>
.run_function {
  .close_run_function {
    font-weight: 600;
  }
  .close_run_function_height {
    margin-bottom: 40px;
  }
  .close_run_message {
    color: grey;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 20px;
  }
}

.log_content {
  display: flex;

  .log_span {
    width: 100px;
  }

  .log_text {
    width: 100%;
    position: relative;

    span {
      position: absolute;
      right: 20px;
      bottom: 10px;
      color: #d9d9d9;
    }
  }
}
</style>
