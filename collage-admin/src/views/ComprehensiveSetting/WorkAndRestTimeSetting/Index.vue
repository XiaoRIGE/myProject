<template>
  <div v-if="showContentFlag" class="container">
    <div class="add-time">
      <a-button type="primary" @click="onClickHandle(1)">
        新增时段
      </a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :row-key="record => record.id"
      @change="onChange"
    >
      <template #startTime="{record}">
        {{ moment(record.startTime).format('HH:mm') }}
      </template>
      <template #endTime="{record}">
        {{ moment(record.endTime).format('HH:mm') }}
      </template>
      <template #action="{record}">
        <a class="update" @click="onClickHandle(2, record)">编辑</a>
        <a class="delete" @click="deleteTimeHandle(record)">删除</a>
      </template>
    </a-table>
  </div>
  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>您还没添加任何作息时间</span>
    </template>
    <a-button type="primary" @click="onClickHandle(1)">
      +&emsp;新增时段
    </a-button>
  </a-empty>

  <a-modal
    v-model:visible="deleteModelVisible"
    :mask-closable="false"
    destroy-on-close
    centered
    title="确认删除"
    @cancel="canceldeleteHandle"
  >
    <template #footer>
      <a-button key="back" @click="canceldeleteHandle">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="onDelete">
        确认
      </a-button>
    </template>
    <p v-if="!noDelete">
      不允许删除存在课程中有使用到的时间段,确认删除该项吗?
    </p>
    <p v-else>
      该时段已被课程使用，不允许删除
    </p>
  </a-modal>

  <a-modal
    v-model:visible="visible"
    :mask-closable="false"
    destroy-on-close
    centered
    :title="title"
    class="modal-time"
    @cancel="cancelHandle"
  >
    <template #footer>
      <a-button key="back" @click="cancelHandle">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="onSubmit">
        保存
      </a-button>
    </template>
    <template v-if="isHint1">
      <a-alert
        message="结束时间必须大于开始时间"
        type="warning"
        show-icon
        class="warning"
      />
    </template>
    <template v-if="isHint2">
      <a-alert
        message="开始结束时间与已有时段相同，请重新选择"
        type="warning"
        show-icon
        class="warning"
      />
    </template>
    <a-form
      :model="formState"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      class="timeForm"
    >
      <a-form-item ref="name" label="时段名称">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入时段名称"
          :class="isName || isRepeat ? 'border-color-red' : ''"
        />
        <div v-if="isName" style="color:#FF4D4F;position:absolute">
          请输入时段名称
        </div>
        <div v-if="isRepeat" style="color:#FF4D4F;position:absolute">
          已存在该时段名称，请重新输入
        </div>
      </a-form-item>
      <a-form-item ref="startTime" label="开始时间">
        <a-time-picker
          v-model:value="formState.startTime"
          format="HH:mm"
          :class="isStartTime ? 'border-color-red' : ''"
        />
        <div v-if="isStartTime" style="color:#FF4D4F;position:absolute">
          请选择开始时间
        </div>
      </a-form-item>
      <a-form-item ref="endTime" label="结束时间">
        <a-time-picker
          v-model:value="formState.endTime"
          format="HH:mm"
          :class="isStartTime ? 'border-color-red' : ''"
        />
        <div v-if="isEndTime" style="color:#FF4D4F;position:absolute">
          请选择结束时间
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, Ref, toRefs, watch } from 'vue';
import moment, { Moment } from 'moment';
import { timeAllocationServicePresenter } from '@/request/api/presenter/timeAllocation';

interface formStateType {
  name: string;
  startTime: Moment | undefined;
  endTime: Moment | undefined;
}

interface timeItemType {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
}

export default defineComponent({
  setup() {
    const showContentFlag = ref<boolean>(true);
    const actionFlag = ref<number>(0);
    const visible = ref<boolean>(false);
    const deleteModelVisible = ref<boolean>(false);
    const deletePopIndex = ref(0);
    const noDelete = ref<boolean>(false);
    const title = ref('');
    const state = reactive({
      isName: false,
      isStartTime: false,
      isEndTime: false,
      isRepeat: false,
      isHint1: false,
      isHint2: false,
      timeId: ''
    });
    const formState: formStateType = reactive({
      name: '',
      startTime: undefined,
      endTime: undefined
    });
    const dataSource: Ref<timeItemType[]> = ref([]);
    const columns = [
      {
        title: '时段名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '开始时间',
        key: 'startTime',
        slots: { customRender: 'startTime' },
        defaultSortOrder: 'descend',
        sorter: (a: any, b: any) => a.startTime - b.startTime
      },
      {
        title: '结束时间',
        key: 'endTime',
        slots: { customRender: 'endTime' },
        defaultSortOrder: 'descend',
        sorter: (a: any, b: any) => a.endTime - b.endTime
      },
      {
        title: '操作',
        slots: { customRender: 'action' }
      }
    ];
    const onChange = (pagination: any, filters: any, sorter: any) => {
      console.log('params', pagination, filters, sorter);
    };

    /**
     * @description 获取作息时间列表
     */
    const getallocationTimeList = async () => {
      try {
        const res = await timeAllocationServicePresenter.getLocationTimetList();
        showContentFlag.value = res.data.length ? true : false;
        dataSource.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };

    /**
     * @description 初始化提示
     */
    const initHint = () => {
      state.isRepeat = false;
      state.isHint1 = false;
      state.isHint2 = false;
    };

    /**
     * @description 取消新增、编辑弹窗
     */
    const cancelHandle = () => {
      initHint();
      visible.value = false;
      formState.name = '';
      formState.startTime = undefined;
      formState.endTime = undefined;
    };

    /**
     * @description 新增：1/编辑：2  作息时间
     */
    const onClickHandle = (flag: number, item: any) => {
      visible.value = true;
      actionFlag.value = flag;
      if (flag === 1) {
        title.value = '新增时段';
      } else {
        formState.name = item.name;
        formState.startTime = moment(item.startTime);
        formState.endTime = moment(item.endTime);
        state.timeId = item.id;
        title.value = '编辑时段';
      }
    };

    /**
     * @description 新增作息时间
     */
    const createTime = async () => {
      const params = {
        name: formState.name,
        startTime: moment(formState.startTime).valueOf(),
        endTime: moment(formState.endTime).valueOf()
      };
      try {
        await timeAllocationServicePresenter.createTime(params);
        cancelHandle();
        getallocationTimeList();
      } catch (error) {
        if (error?.code === 40057) {
          state.isRepeat = true;
        } else if (error?.code === 40056) {
          state.isHint1 = true;
        } else if (error?.code === 40058) {
          state.isHint2 = true;
        }
      }
    };

    /**
     * @description 编辑作息时间
     */
    const udpDateTime = async () => {
      const params = {
        id: state.timeId,
        name: formState.name,
        startTime: moment(formState.startTime).valueOf(),
        endTime: moment(formState.endTime).valueOf()
      };
      try {
        await timeAllocationServicePresenter.upDateTime(params);
        cancelHandle();
        getallocationTimeList();
      } catch (error) {
        if (error?.code === 40057) {
          state.isRepeat = true;
        } else if (error?.code === 40056) {
          state.isHint1 = true;
        } else if (error?.code === 40058) {
          state.isHint2 = true;
        }
      }
    };

    /**
     * @description 保存新增/编辑操作
     */
    const onSubmit = () => {
      initHint();
      let isSubmit = true;
      if (!formState.name) {
        state.isName = true;
        isSubmit = false;
      }
      if (!formState.startTime) {
        state.isStartTime = true;
        isSubmit = false;
      }
      if (!formState.endTime) {
        state.isEndTime = true;
        isSubmit = false;
      }
      if (actionFlag.value === 1 && isSubmit) {
        createTime();
      }
      if (actionFlag.value === 2 && isSubmit) {
        udpDateTime();
      }
    };

    watch(formState, () => {
      if (formState.name) {
        state.isName = false;
      }
      if (formState.startTime !== undefined) {
        state.isStartTime = false;
      }
      if (formState.endTime !== undefined) {
        state.isEndTime = false;
      }
    });
    /**
     * @description 确认删除
     */
    const onDelete = async () => {
      const formData = new FormData();
      formData.append('timeAllocationId', state.timeId);
      try {
        await timeAllocationServicePresenter.deleteTime(formData);
        deleteModelVisible.value = false;
        getallocationTimeList();
      } catch (error) {
        // if (error?.code === 40023) {
        //   noDelete.value = true;
        // }
        if (error?.code === 40055) {
          noDelete.value = true;
        }
      }
    };

    /**
     * @description 点击删除按钮
     */
    const deleteTimeHandle = async (item: any) => {
      deleteModelVisible.value = true;
      state.timeId = item.id;
      noDelete.value = false;
    };

    /**
     * @description 隐藏删除弹窗
     */
    const canceldeleteHandle = () => {
      deleteModelVisible.value = false;
    };

    getallocationTimeList();

    return {
      columns,
      dataSource,
      onChange,
      title,
      visible,
      deleteModelVisible,
      deletePopIndex,
      onClickHandle,
      cancelHandle,
      deleteTimeHandle,
      noDelete,
      formState,
      showContentFlag,
      moment,
      onDelete,
      onSubmit,
      ...toRefs(state),
      canceldeleteHandle
    };
  }
});
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  margin: 24px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
  .add-time {
    margin-bottom: 24px;
  }
}

.delete {
  margin-left: 24px;
  color: #ff4d4f;
}

.border-color-red {
  border-color: #ff4d4f;
}

.nodata {
  margin-top: 90px;
}
</style>

<style lang="less">
.modal-time {
  .ant-time-picker {
    width: 100%;
  }
  .ant-modal-body {
    padding-top: 12px;
  }
  .warning {
    margin-bottom: 12px;
  }
}
.delete-pop {
  button:first-child {
    display: none;
  }
}
.timeForm {
  .ant-form-item-control {
    line-height: 22px;
  }
}
</style>
