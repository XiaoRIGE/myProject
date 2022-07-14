<template>
  <div class="point-setting">
    <div class="point-setting__title">
      打卡点位设置
    </div>
    <a-divider />
    <a-spin :spinning="isLoading">
      <div class="point-setting__action">
        <a-button type="primary" @click="showCreateModal">
          新建打卡点位
        </a-button>
      </div>

      <div class="point-setting__content">
        <div
          v-for="(pointInfo, pointIndex) in pointListProps"
          :key="pointIndex"
          class="point-setting__content__point"
        >
          <div class="point-setting__content__point__info">
            <div class="point-setting__content__point__info__title">
              {{ pointInfo.pointName }}
            </div>
            <div class="point-setting__content__point__info__device-number">
              {{ pointInfo.deviceList.length }}设备
            </div>
            <div class="point-setting__content__point__info__action">
              <a-button
                type="link"
                size="small"
                @click="() => showEditModal(pointInfo)"
              >
                编辑点位
              </a-button>
              <a-button
                type="link"
                size="small"
                class="warn-text"
                @click="() => deletePoint(pointInfo)"
              >
                删除点位
              </a-button>
            </div>
          </div>
          <div class="point-setting__content__point__devices">
            <div
              v-for="(deviceInfo, deviceIndex) in pointInfo.deviceList"
              :key="deviceIndex"
              class="point-setting__content__point__devices__device"
            >
              <div
                class="point-setting__content__point__devices__device__title"
              >
                {{ deviceInfo.serialNumber }}
              </div>
              <a-tag
                v-if="deviceInfo.status === FaceDeivceStatus.RUNNING"
                color="green"
                class="point-setting__content__point__devices__device__tag"
              >
                运行中
              </a-tag>
              <a-tag
                v-if="deviceInfo.status === FaceDeivceStatus.OUTLINE"
                color="red"
                class="point-setting__content__point__devices__device__tag"
              >
                设备离线
              </a-tag>
              <a-tag
                v-if="deviceInfo.status === FaceDeivceStatus.DORMANT"
                class="point-setting__content__point__devices__device__tag"
              >
                休眠
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </a-spin>

    <CreateOrEditPointModal
      v-model:visible="modalData.visible"
      :point-id="modalData.pointId"
      :campus-id="campusId"
      @submit="loadPageData"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref, watch } from 'vue';
import CreateOrEditPointModal from './CreateOrEditPointModal/Index.vue';
import request from '@/request-v2/api';
import { FacePunchPointBasicInfo, FaceDeivceStatus } from '@/@types/facePunch';

export default defineComponent({
  components: {
    CreateOrEditPointModal
  },
  props: {
    campusId: {
      type: String,
      default: '',
      required: true
    },
    pointList: {
      type: Array as PropType<FacePunchPointBasicInfo[]>,
      default: () => [],
      required: true
    }
  },
  emits: ['update:pointList'],
  setup(props, { emit }) {
    const isLoading = ref(false);

    const modalData = reactive({
      visible: false,
      pointId: ''
    });

    const pointListProps = computed({
      get: () => props.pointList,
      set: newValue => emit('update:pointList', newValue)
    });

    /**
     * 展示创建弹窗
     */
    const showCreateModal = () => {
      modalData.pointId = '';
      modalData.visible = true;
    };

    const showEditModal = (pointInfo: FacePunchPointBasicInfo) => {
      modalData.pointId = pointInfo.pointId as string;
      modalData.visible = true;
    };

    const loadPageData = async () => {
      isLoading.value = true;
      pointListProps.value = await request.getFacePunchPointList(
        props.campusId
      );
      isLoading.value = false;
    };

    const deletePoint = async (pointInfo: FacePunchPointBasicInfo) => {
      await request.deleteFacePunchRoute(pointInfo.pointId as string);
      await loadPageData();
    };

    watch(
      () => props.campusId,
      newValue => {
        if (newValue !== '') {
          loadPageData();
        }
      }
    );

    return {
      isLoading,
      pointListProps,
      FaceDeivceStatus,
      showCreateModal,
      loadPageData,
      modalData,
      showEditModal,
      deletePoint
    };
  }
});
</script>

<style lang="less" scoped>
.point-setting {
  &__title {
    font-weight: bold;
  }
  &__content {
    margin-top: 30px;
    &__point {
      border: 1px solid #eee;
      padding: 20px;
      &:not(:nth-child(1)) {
        margin-top: 10px;
      }
      &__info {
        display: flex;
        align-items: center;
        &__title {
          font-size: 16px;
          font-weight: bold;
          color: black;
        }
        &__device-number {
          margin-left: 20px;
        }
        &__action {
          margin-left: 10px;
        }
      }
      &__devices {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        &__device {
          border: 1px solid #eee;
          padding: 10px;
          width: 19.2%;
          &:nth-child(n + 6) {
            margin-top: 10px;
          }
          &:not(:nth-child(5n)) {
            margin-right: 1%;
          }
          &__tag {
            margin-top: 5px;
          }
        }
      }
    }
  }
}

.create-or-edit-point-modal {
  &__form {
    &__device {
      margin-left: calc(~'100% / 24 * 5');
      margin-top: -20px;

      &__form {
        margin-top: 5px;
      }

      &__title,
      &__form {
        display: flex;
        align-items: center;
        &__id {
          width: 39%;
        }
        &__account,
        &__password {
          width: 26%;
          margin-left: 1%;
        }
        &__action {
          width: 2%;
          margin-left: 3%;
        }
      }

      &__form {
        &__action {
          &__delete {
            cursor: pointer;
          }
        }
      }

      &__add-device {
        margin-top: 10px;
        cursor: pointer;
        color: #1966fe;
      }
    }
  }
}
</style>
