<template>
  <a-modal
    :visible="showVisible"
    width="1000px"
    title="详情"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="content">
      <div class="header-text">
        <p>
          <span class="bit-of-span">
            跑步方式：{{ detailArray.detailsRoutineVO.type }}
          </span>
          <span class="bit-of-span">
            学校规定：{{
              detailArray.detailsRoutineVO.fixedPointPercentage
            }}%、{{ detailArray.detailsRoutineVO.fixedPointOrder }}、{{
              detailArray.detailsRoutineVO.fixedPointNumber
            }}
          </span>
          <span class="bit-of-span">
            平均配速(min/km)
            <span
              v-if="
                compareSpeed(
                  averagePace,
                  detailArray.averageSpeedStart,
                  detailArray.averageSpeedEnd
                )
              "
            >
              {{ averagePace }} /KM
            </span>
            <span v-else class="redColor">
              <a-popover>
                <template #content>
                  <p>
                    {{ detailArray.averageSpeedStart }}~{{
                      detailArray.averageSpeedEnd
                    }}
                    /KM
                  </p>
                </template>
                <span>{{ averagePace }} /KM</span>
              </a-popover>
            </span>
          </span>
          <span class="bit-of-span">
            平均步频：
            <!-- 平均步频不在范围内标红 -->
            <span
              v-if="
                compareStride(
                  stepFrequency,
                  detailArray.averageCadenceStart,
                  detailArray.averageCadenceEnd
                )
              "
            >
              {{ stepFrequency }} SPM
            </span>
            <span v-else class="redColor">
              <a-popover>
                <template #content>
                  <p>
                    {{ detailArray.averageCadenceStart }}~{{
                      detailArray.averageCadenceEnd
                    }}
                    SPM
                  </p>
                </template>
                <span>{{ stepFrequency }} SPM</span>
              </a-popover>
            </span>
          </span>
          <span v-if="detailArray.scoryType === 1" class="bit-of-span">
            跑步总里程：
            <span
              v-if="
                compareStride(
                  detailArray.totalMileage,
                  detailArray.effectiveMileageStart,
                  detailArray.effectiveMileageEnd
                )
              "
            >
              {{ detailArray.totalMileage }} KM
            </span>
            <span v-else class="redColor">
              <a-popover>
                <template #content>
                  <p>
                    每次有效里程：{{ detailArray.effectiveMileageStart }}~{{
                      detailArray.effectiveMileageEnd
                    }}KM
                  </p>
                </template>
                <span>{{ detailArray.totalMileage }} KM</span>
              </a-popover>
            </span>
          </span>
          <span v-if="detailArray.scoryType === 2" class="bit-of-span">
            跑步总段数：
            <span
              v-if="
                compareStride(
                  detailArray.effectivePart,
                  detailArray.effectiveParagraphStart,
                  detailArray.effectiveParagraphEnd
                )
              "
            >
              {{ detailArray.effectivePart }} 段
            </span>
            <span v-else class="redColor">
              <a-popover>
                <template #content>
                  <p>
                    每次有效段数：{{ detailArray.effectiveParagraphStart }}~{{
                      detailArray.effectiveParagraphEnd
                    }}段
                  </p>
                </template>
                <span>{{ detailArray.effectivePart }} 段</span>
              </a-popover>
            </span>
          </span>
        </p>
        <p>
          <span class="bit-of-span">
            暂停时长：--
            <!-- 50'59'' -->
          </span>
          <span class="bit-of-span">
            运动时长：{{ detailArray.runDuration }}
          </span>
          <span class="bit-of-span">
            跑步时间：
            {{ detailArray.startTime }}~{{ detailArray.endTime }}
          </span>
        </p>
      </div>
      <div class="map">
        <base-map
          :run-path-info="runPathInfo"
          :map-data="mapData"
          map-style="width:calc(1000px - 48px);height:500px;min-height:500px"
        />
      </div>
      <div class="form">
        <a-form :model="formState" layout="inline">
          <a-form-item v-if="detailArray.scoryType === 1" label="有效里程">
            <a-input-number v-model:value="formState.mileage" />
            KM
          </a-form-item>
          <a-form-item v-if="detailArray.scoryType === 2" label="有效段数">
            <a-input-number v-model:value="formState.mileage" />
            段
          </a-form-item>
          <!-- todo  确认是否需要展示无效原因 -->
          <!-- <a-form-item v-else label="无效原因">
            <a-input
              v-model:value="formState.cause"
              placeholder="跑步路线未在有效范围内"
            />
          </a-form-item> -->
        </a-form>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import BaseMap from '@/components/global/BaseMap.vue';
import { Modal, message } from 'ant-design-vue';
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { RunningConditionPresenter } from '@/request/api/presenter/runSettings';

export default defineComponent({
  components: { BaseMap },
  props: {
    visible: {
      type: Boolean
    },
    propData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['change-visible', 'refresh'],
  setup(props, { emit }) {
    const runPathInfo = ref<any[]>([]);
    const mapData: any = reactive({
      pointData: [],
      lineData: [],
      areaData: [],
      areaInvalidData: []
    });
    const formState = reactive({
      mileage: 0,
      cause: ''
    });

    const detailArray = ref({
      detailsRoutineVO: {
        avePace: 0,
        calorie: 0,
        effictiveRegion: null,
        fixedPointNumber: 0,
        fixedPointOrder: 0,
        fixedPointPattern: 0,
        fixedPointPercentage: 0,
        freePattern: 0,
        gpsMileage: 0,
        paceNumber: 0,
        paceRange: 0,
        routineLine: [],
        scopePattern: 0,
        scopePercentage: 0,
        signPoint: null,
        type: '',
        uneffictiveRegion: null
      },
      effectiveMileage: 0,
      effectivePart: 0,
      endTime: '',
      keepTime: '',
      operationMileage: 0,
      operationPart: 0,
      startTime: '',
      totalPart: 0,
      uneffectiveReason: '',
      scoryType: 0
    });

    // 平均配速 - 跑一km需要的分钟数
    const averagePace = computed(() => {
      const { avePace } = detailArray.value.detailsRoutineVO; //毫秒数
      const totalMinutes = avePace / 1000; //总的秒数
      const minutes = totalMinutes / 60; //分钟 18.5
      const showMinutes = Math.floor(minutes); //分钟整数位 最终返回
      const second = Math.ceil((minutes - showMinutes) * 60); //秒数 返回使用
      return `${showMinutes}:${second}`;
    });

    const upKeepTime = ref();
    // 平均步频 总步数/总时长(min)
    const stepFrequency = computed(() => {
      const min = Number(detailArray.value.keepTime) / 60 || 0; //跑步时间
      const { paceNumber } = detailArray.value.detailsRoutineVO; //总步数
      const val = paceNumber / min || 0;
      return val.toFixed();
    });

    /**
     * @description: 平均配速对比
     * @return {true}范围内
     * @return {false}范围外
     */
    const compareSpeed = computed(() => {
      return (nowTime: string, startTime: string, endTime: string) => {
        const now = Number(nowTime.replace(/:/g, ''));
        const start = Number(startTime ? startTime.replace(/:/g, '') : 0);
        const end = Number(endTime ? endTime.replace(/:/g, '') : 0);
        return now >= start && now <= end;
      };
    });

    /**
     * @description: 平均步频，总段数，总里程对比
     * @return {true}范围内
     * @return {false}范围外
     */
    const compareStride = computed(() => {
      return (value: string, startValue: string, endValue: string) => {
        return (
          Number(value) >= Number(startValue) &&
          Number(value) <= Number(endValue)
        );
      };
    });

    const getDetailData = async () => {
      const data = {
        id: props.propData.id, //'402880f77b0b1ee3017b0b221d9a0090',
        type: props.propData.runningType, // 1范围跑 2定点跑
        userId: props.propData.userId //'402881f77a522684017a5670e8170003'
      };
      try {
        const res = await RunningConditionPresenter.getRunningDetailsRoutine(
          data
        );
        detailArray.value = res;
        // 地图回显数据
        runPathInfo.value = res.routineLine;
        mapData.pointData = res.signPoint;
        mapData.areaData = res.effictiveRegion;
        mapData.areaInvalidData = res.uneffictiveRegion;

        if (detailArray.value.scoryType === 1) {
          formState.mileage = detailArray.value.operationMileage
            ? detailArray.value.operationMileage
            : detailArray.value.effectiveMileage;
        } else if (detailArray.value.scoryType === 2) {
          formState.mileage = detailArray.value.operationPart
            ? detailArray.value.operationPart
            : detailArray.value.effectivePart;
        }
      } catch (error) {
        console.log(error);
        runPathInfo.value = [];
        mapData.pointData = [];
        mapData.areaData = [];
        mapData.areaInvalidData = [];
      }
    };

    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          getDetailData();
        }
      }
    );

    const showVisible = computed(() => {
      return props.visible;
    });

    const isError = ref(false);

    // 修改有效里程 段数
    const editEffectiveVal = async () => {
      const params: any = {
        id: props.propData.id,
        mileage: 0,
        part: 0,
        type: detailArray.value.scoryType //模式类型1里程 2段落
      };

      if (detailArray.value.scoryType === 1) {
        params.mileage = formState.mileage; //里程模式填写
        delete params.part;
      } else {
        params.part = formState.mileage; //段落模式填写
        delete params.mileage;
      }

      try {
        await RunningConditionPresenter.modifyRunningDetailsRoutine(params);
        message.success('修改成功');
        emit('refresh');
      } catch (error) {
        Modal.error({
          title: '修改失败',
          content: error?.message
        });
      }
    };

    // 点击确定
    const handleOk = () => {
      editEffectiveVal();
    };

    const handleCancel = () => {
      emit('change-visible', false);
    };
    return {
      formState,
      showVisible,
      handleCancel,
      isError,
      runPathInfo,
      mapData,
      handleOk,
      averagePace,
      stepFrequency,
      compareSpeed,
      compareStride,
      detailArray,
      upKeepTime
    };
  }
});
</script>
<style lang="less" scoped>
.content {
  .header-text {
    .bit-of-span {
      margin-right: 20px;
    }
    .redColor {
      color: #ff4d4f;
      cursor: pointer;
    }
  }
  .map {
    width: 100%;
    height: 500px;
    background: gray;
  }
  .form {
    margin-top: 20px;
  }
}
</style>
