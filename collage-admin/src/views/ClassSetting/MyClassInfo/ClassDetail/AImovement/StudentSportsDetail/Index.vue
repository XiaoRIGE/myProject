<template>
  <a-drawer
    :visible="visible"
    :title="title"
    :width="720"
    placement="right"
    @close="handleClose"
  >
    <div class="desc">
      <a-space :size="24">
        <span class="sport-item bg1">
          累积有效得分：
          <span class="sport-value">{{ userInfo.validGrade || 0 }}</span>
        </span>
        <span v-if="userInfo.semesterTarget" class="sport-item bg2">
          学期目标得分：
          <span class="sport-value">{{ userInfo.semesterTarget || 0 }}</span>
        </span>
      </a-space>
    </div>
    <a-table
      :columns="columns"
      :data-source="listData"
      :pagination="pagination"
      :loading="tableLoading"
      row-key="recordId"
    />
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, reactive } from 'vue';
import { AImovementPresenter } from '@/request/api/presenter/class';
import { useStore } from 'vuex';
// 学生单次运动信息
interface listItem {
  effivtiveScore: number;
  keepTime: string;
  projectName: string;
  recordId: string;
  startTime: string;
  totalScore: number;
}
export default defineComponent({
  props: {
    showvisible: {
      type: Boolean,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

    const tableLoading = ref<boolean>(false);
    const columns = [
      {
        title: '运动项目',
        dataIndex: 'projectName',
        ellipsis: true
      },
      {
        title: '总得分',
        dataIndex: 'totalScore'
      },
      {
        title: '有效得分',
        dataIndex: 'effivtiveScore'
      },
      {
        title: '运动时间',
        dataIndex: 'startTime'
      },
      {
        title: '运动时长',
        dataIndex: 'keepTime'
      }
    ];
    const listData = ref<listItem[]>([]);

    const totalNumRef = ref<number>(0);
    const currentRef = ref<number>(1);
    const pageSizeRef = ref<number>(10);

    /**
     * @description: 获取锻炼者运动数据列表
     */
    const getSportList = async () => {
      try {
        const params = {
          userId: props.userInfo.userId,
          semesterId: currentSemester.value.id,
          page: currentRef.value,
          size: pageSizeRef.value
        };
        tableLoading.value = true;
        const {
          items,
          total
        } = await AImovementPresenter.getExerciseRecordList(params);

        listData.value = items;
        totalNumRef.value = total;
      } catch (error) {
        console.log('error');
      } finally {
        tableLoading.value = false;
      }
    };

    /**
     * @description: 分页配置
     */
    const pagination = reactive({
      showTotal: (total: number) => `共计 ${total} 条数据`,
      current: currentRef,
      total: totalNumRef,
      defaultPageSize: pageSizeRef,
      onChange: (current: number) => {
        currentRef.value = current;
        getSportList();
      }
    });

    const initData = () => {
      getSportList();
    };

    const visible = computed(() => {
      return props.showvisible;
    });
    const title = computed(() => {
      return `${props.userInfo.name} ${props.userInfo.sex} ${props.userInfo.number}`;
    });
    watch(
      () => props.showvisible,
      () => {
        if (props.showvisible) {
          initData();
        }
      }
    );
    const handleClose = () => {
      emit('close');
    };

    return {
      visible,
      handleClose,
      tableLoading,
      columns,
      totalNumRef,
      listData,
      title,
      pagination
    };
  }
});
</script>

<style lang="less" scoped>
.desc {
  margin-bottom: 16px;
  .sport-item {
    display: flex;
    align-items: center;
    margin-right: 12px;
    &:before {
      content: '';
      display: inline-block;
      margin-right: 6px;
      width: 4px;
      height: 12px;
      border-radius: 3px;
    }
    .sport-value {
      font-weight: bold;
    }
  }
  .bg1 {
    &:before {
      background: #108ee9;
    }
  }
  .bg2 {
    &:before {
      background: #fa541c;
    }
  }
  .bg3 {
    &:before {
      background: #0000ff;
    }
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
