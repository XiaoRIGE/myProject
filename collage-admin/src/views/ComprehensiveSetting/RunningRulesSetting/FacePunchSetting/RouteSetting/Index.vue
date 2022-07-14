<template>
  <div class="route-setting">
    <div class="route-setting__title">
      通用打卡路线设置
    </div>
    <a-divider />
    <div class="route-setting__action">
      <a-button type="primary" @click="showCreateModal">
        新建打卡路线
      </a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="pageList"
      :pagination="paginationConfig"
      class="route-setting__table"
    >
      <template #routeMap="{ record }">
        {{ routeInfoToText(record.routeMap) }}
      </template>
      <template #segment="{ record }">{{ record.segment }} 段</template>
      <template #action="{ record }">
        <div class="route-setting__table__action">
          <a
            class="route-setting__table__action__button"
            @click="() => showEditModal(record)"
          >
            编辑
          </a>
          <a
            class="route-setting__table__action__button warn-text"
            @click="() => deleteRoute(record)"
          >
            删除
          </a>
        </div>
      </template>
    </a-table>

    <CreateOrEditRouteModal
      v-model:visible="modalData.visible"
      :point-list="pointList"
      :campus-id="campusId"
      :value="modalFormData"
      :route-id="modalData.routeId"
      @submit="loadPageData"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref, watch } from 'vue';

import request from '@/request-v2/api';
import CreateOrEditRouteModal from './CreateOrEditRouteModal/Index.vue';
import {
  FacePunchPointBasicInfo,
  FacePunchRouteInfo,
  FaceRunchRouteMapItem
} from '@/@types/facePunch';
import { RouteModalData } from './types';

const columns = [
  {
    title: '路线',
    dataIndex: 'routeMap',
    key: 'routeMap',
    width: '70%',
    slots: { customRender: 'routeMap' }
  },
  {
    title: '计入',
    dataIndex: 'segment',
    key: 'segment',
    slots: { customRender: 'segment' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { customRender: 'action' }
  }
];

export default defineComponent({
  components: {
    CreateOrEditRouteModal
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
  setup(props) {
    const isLoading = ref(false);

    const modalData = reactive<RouteModalData>({
      visible: false,
      routeId: '',
      routeMap: [],
      mileage: 0,
      segment: 0
    });

    const modalFormData = computed(() => ({
      routeMap: modalData.routeMap,
      mileage: modalData.mileage,
      segment: modalData.segment
    }));

    const pageList = ref<FacePunchRouteInfo[]>([]);

    /**
     * 分页器配置项
     */
    const pagination = reactive({
      total: 0,
      showTotal: (total: number) => `共${total}条`,
      current: 1,
      pageSize: 10
    });

    const paginationConfig = computed(() => ({
      total: pagination.total,
      showTotal: pagination.showTotal,
      current: pagination.current,
      pageSize: pagination.pageSize
    }));

    const showCreateModal = () => {
      modalData.routeId = '';
      modalData.visible = true;
    };

    const showEditModal = (routeInfo: FacePunchRouteInfo) => {
      modalData.routeId = routeInfo.routeId as string;

      modalData.routeMap = routeInfo.routeMap;
      modalData.mileage = routeInfo.mileage;
      modalData.segment = routeInfo.segment;

      modalData.visible = true;
    };

    /**
     * 路线信息转化为文字
     */
    const routeInfoToText = (routeMap: FaceRunchRouteMapItem[]) => {
      let text = '';

      routeMap.map((item, index) => {
        if (index === 0) {
          text += item.pointName;
        } else {
          text += ' - | ';
          text += `${item.minTime}’~${item.maxTime}’`;
          text += ' | - ';
          text += item.pointName;
        }
      });

      return text;
    };

    /**
     * 加载页面数据
     */
    const loadPageData = async () => {
      isLoading.value = true;

      const routeInfo = await request.getFacePunchRouteList(props.campusId, {
        page: paginationConfig.value.current,
        size: paginationConfig.value.pageSize
      });
      pagination.total = routeInfo.total;
      pageList.value = routeInfo.routeList;

      isLoading.value = false;
    };

    const deleteRoute = async (routeInfo: FacePunchRouteInfo) => {
      await request.deleteFacePunchRoute(routeInfo.routeId as string);
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
      modalData,
      modalFormData,
      columns,
      pageList,
      paginationConfig,
      loadPageData,
      routeInfoToText,
      showCreateModal,
      showEditModal,
      deleteRoute
    };
  }
});
</script>

<style lang="less" scoped>
.route-setting {
  &__title {
    font-weight: bold;
  }
  &__table {
    margin-top: 40px;
    &__action {
      &__button {
        &:not(:nth-child(1)) {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
