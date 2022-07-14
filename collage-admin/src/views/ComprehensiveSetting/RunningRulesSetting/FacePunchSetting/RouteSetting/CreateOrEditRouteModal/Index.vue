<template>
  <a-modal
    v-model:visible="visibleProps"
    class="modal"
    title="新建打卡线路"
    :width="600"
    @ok="savePoint"
  >
    <div class="modal__content">
      <div class="modal__content__point">
        <div class="modal__content__point__title">
          <div class="modal__content__point__title__point">
            依次选择需要经过的跑步点位：
          </div>
          <div
            v-if="routeMap.length >= 2"
            class="modal__content__point__title__time"
          >
            <div class="modal__content__point__title__time__main-title">
              学生需在此时间范围内过点：
            </div>
            <div class="modal__content__point__title__time__sub-title">
              <span>最快时间（分钟）</span>
              <span>最慢时间（分钟）</span>
            </div>
          </div>
        </div>
        <div class="modal__content__point__form">
          <div class="modal__content__point__form__point">
            <div
              v-for="(item, index) in routeMap"
              :key="index"
              class="modal__content__point__form__point__item"
            >
              <a-select
                ref="select"
                v-model:value="item.pointId"
                style="width: 95%"
              >
                <a-select-option
                  v-for="pointInfo in pointList"
                  :key="pointInfo.pointId"
                  :value="pointInfo.pointId"
                >
                  {{ pointInfo.pointName }}
                </a-select-option>
              </a-select>
              <DeleteOutlined
                v-if="routeMap.length >= 2"
                class="modal__content__point__form__point__item__delete"
                @click="() => deleteDevice(index)"
              />
            </div>

            <div
              class="modal__content__point__form__point__action"
              @click="addPoint"
            >
              <PlusOutlined color="#1966fe" />
              添加点位
            </div>
          </div>
          <div class="modal__content__point__form__time">
            <div v-for="(item, index) in routeMap" :key="index">
              <div
                v-if="index !== 0"
                class="modal__content__point__form__time__item"
              >
                <img
                  :src="require('@/assets/link-line.png')"
                  class="modal__content__point__form__time__item__link-image"
                />
                <a-input
                  v-model:value="item.minTime"
                  placeholder="请输入"
                  class="modal__content__point__form__time__item__min-time"
                />
                <span class="modal__content__point__form__time__item__linker">
                  -
                </span>
                <a-input
                  v-model:value="item.maxTime"
                  placeholder="请输入"
                  class="modal__content__point__form__time__item__max-time"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-divider />
      <div class="modal__content__count-in">
        <div class="modal__content__count-in__title">整条线路计入：</div>
        <div class="modal__content__count-in__form">
          <span>里程</span>
          <a-input
            v-model:value="mileage"
            class="modal__content__count-in__form__input"
          />
          <span>km（里程模式下），或段数</span>
          <a-input
            v-model:value="segment"
            class="modal__content__count-in__form__input"
          />
          <span>段（段数模式下）</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, reactive, ref, watch } from 'vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import request from '@/request-v2/api';
import {
  FacePunchPointBasicInfo,
  FacePunchRouteInfo,
  FaceRunchRouteMapItem
} from '@/@types/facePunch';

export default defineComponent({
  name: 'CreateOrEditRouteModal',
  components: {
    DeleteOutlined,
    PlusOutlined
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String as PropType<'create' | 'edit'>,
      default: 'create'
    },
    pointList: {
      type: Array as PropType<FacePunchPointBasicInfo[]>,
      default: () => [],
      required: true
    },

    /**
     * 校区ID
     */
    campusId: {
      type: String,
      default: '',
      required: true
    },

    /**
     * 路线ID
     */
    routeId: {
      type: String,
      default: '',
      required: true
    },

    /**
     * 表单信息
     */
    value: {
      type: Object as PropType<Omit<FacePunchRouteInfo, 'routeId'>>,
      default: () => ({
        routeMap: [],
        mileage: 0,
        segment: 0
      }),
      required: true
    }
  },
  emits: ['update:visible', 'submit'],
  setup(props, { emit }) {
    const visibleProps = computed({
      get: () => props.visible,
      set: value => emit('update:visible', value)
    });

    const routeMap = ref<FaceRunchRouteMapItem[]>([
      {
        pointId: '',
        minTime: 0,
        maxTime: 0
      },
      {
        pointId: '',
        minTime: 0,
        maxTime: 0
      }
    ]);

    /**
     * 计入里程
     */
    const mileage = ref(0);

    /**
     * 计入段数
     */
    const segment = ref(0);

    /**
     * 新增点位
     */
    const addPoint = () =>
      routeMap.value.push({
        pointId: '',
        minTime: 0,
        maxTime: 0
      });

    /**
     * 移除指定设备表单项
     * @param index 指定删除的序号
     */
    const deleteDevice = (index: number) => routeMap.value.splice(index, 1);

    /**
     * 保存点位
     */
    const savePoint = async () => {
      await request.saveFacePunchRoute(props.campusId, {
        routeId: props.routeId === '' ? undefined : props.routeId,
        routeMap: routeMap.value,
        mileage: mileage.value,
        segment: segment.value
      });

      visibleProps.value = false;
      emit('submit');
    };

    /**
     * 加载表单数据
     */
    const loadForm = () => {
      if (props.routeId !== '') {
        routeMap.value = props.value.routeMap;
        mileage.value = props.value.mileage;
        segment.value = props.value.segment;
      }
    };

    /**
     * 重置表单数据
     */
    const resetForm = () => {
      routeMap.value = [
        {
          pointId: '',
          minTime: 0,
          maxTime: 0
        },
        {
          pointId: '',
          minTime: 0,
          maxTime: 0
        }
      ];

      mileage.value = 0;
      segment.value = 0;
    };

    watch(
      () => props.visible,
      newValue => {
        if (newValue === true) {
          loadForm();
        } else {
          resetForm();
        }
      }
    );

    return {
      visibleProps,
      routeMap,
      addPoint,
      deleteDevice,
      mileage,
      segment,
      savePoint
    };
  }
});
</script>

<style lang="less" scoped>
.modal {
  &__content {
    &__point {
      &__title {
        display: flex;
        justify-content: space-between;
        &__point {
          padding-bottom: 28.852px;
        }
        &__time {
          &__sub-title {
            color: #0000003f;
            font-size: 12px;
            margin-top: 10px;
            span:not(:first-child) {
              margin-left: 10px;
            }
          }
        }
      }
      &__form {
        display: flex;
        &__point {
          display: flex;
          flex-direction: column;
          width: 50%;
          &__item {
            display: flex;
            align-items: center;
            &:not(:first-child) {
              margin-top: 25px;
            }
            &__delete {
              margin-left: 5%;
              cursor: pointer;
            }
          }
          &__action {
            margin-top: 10px;
            cursor: pointer;
            color: #1966fe;
          }
        }
        &__time {
          width: 50%;
          margin-top: 8px;
          &__item {
            display: flex;
            align-items: center;
            margin-top: 16px;
            height: 41px;
            &__link-image {
              margin-left: 7%;
              margin-right: 7%;
              width: 15%;
              height: 100%;
              object-fit: fill;
            }

            &__linker {
              margin: 0 2%;
              font-weight: bold;
            }

            &__max-time,
            &__min-time {
              width: 30%;
            }
          }
        }
      }
    }

    &__count-in {
      &__form {
        display: flex;
        align-items: center;
        margin-top: 10px;
        &__input {
          width: 50px;
          margin: 0 5px;
        }
      }
    }
  }
}

:deep(.ant-upload-select-picture-card) {
  height: 146px !important;
  width: 93px !important;
}

:deep(.ant-upload-list-picture-card-container) {
  height: 146px !important;
  width: 93px !important;
}

:deep(.ant-upload-list-item-list-type-picture-card) {
  height: 146px !important;
  width: 93px !important;
}
</style>
