<template>
  <a-drawer
    title="活动名单"
    placement="right"
    :closable="true"
    :visible="showVisible"
    width="800px"
    @close="closeDrawer"
  >
    <a-table
      row-key="id"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="false"
    >
      <template #topicName="{ text }">
        <span v-if="text === null">
          -
        </span>
        <span v-else>
          {{ text }}
        </span>
      </template>
      <template #time="{ record }">
        起: {{ record.startTime }}
        <br>
        止: {{ record.endTime }}
      </template>
    </a-table>
    <a-pagination
      v-model:current="current"
      v-model:pageSize="pageSize"
      class="pagination"
      :total="totalNum"
      :show-total="total => `共 ${total} 条`"
    />
  </a-drawer>
</template>
<script lang="ts">
import { ActivityLimitManagePresenter } from '@/request/api/presenter/course';
import { computed, defineComponent, ref, watch } from 'vue';
import moment from 'moment';
export default defineComponent({
  props: {
    isDrawerShow: {
      type: Boolean
    },
    limitId: {
      type: String,
      default: ''
    }
  },
  emits: ['change-visible'],
  setup(props, { emit }) {
    const drawerVisible = ref<boolean>(false);
    const dataSource = ref<any>([]);
    const totalNum = ref<number>(0);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);

    const columns = [
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '所属专题',
        dataIndex: 'topicName',
        key: 'topicName',
        slots: { customRender: 'topicName' }
      },
      {
        title: '活动状态',
        dataIndex: 'stateName',
        key: 'stateName'
      },
      {
        title: '活动时间',
        dataIndex: 'time',
        key: 'time',
        slots: { customRender: 'time' }
      }
    ];
    const showVisible = computed(() => {
      return props.isDrawerShow;
    });
    const loading = ref<boolean>(false);
    const limitId = ref<string>('');

    const getLimitActivityList = async () => {
      loading.value = true;
      const requestData = {
        page: current.value,
        restrictionId: props.limitId,
        size: pageSize.value
      };
      try {
        const res = await ActivityLimitManagePresenter.getLimitActivityList(
          requestData
        );
        dataSource.value = res.items;
        totalNum.value = res.total;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    watch(
      () => props.limitId,
      async () => {
        limitId.value = props.limitId;
        try {
          await getLimitActivityList();
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      }
    );
    watch(
      () => pageSize.value,
      async () => {
        try {
          await getLimitActivityList();
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      }
    );

    watch(
      () => current.value,
      async () => {
        try {
          await getLimitActivityList();
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      }
    );
    const closeDrawer = () => {
      emit('change-visible', false);
    };
    return {
      dataSource,
      columns,
      closeDrawer,
      drawerVisible,
      showVisible,
      moment,
      pageSize,
      totalNum,
      current,
      loading
    };
  }
});
</script>
<style lang="less" scoped>
.pagination {
  margin-top: 20px;
}
</style>
