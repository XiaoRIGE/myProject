<template>
  <a-modal
    :visible="limitListVisible"
    width="1000px"
    title="报名限制"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-alert
      class="limit-alert"
      message="可以在活动限制页面新建限制条件。"
      type="info"
      show-icon
    />
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ y: 550 }"
      row-key="id"
    >
      <template #name="{ text }">
        <a-radio-group v-model:value="chooseLimitName">
          <a-radio :value="text">
            {{ text }}
          </a-radio>
        </a-radio-group>
      </template>
      <template #year="{ text }">
        <span v-for="item in text" :key="item">{{ item }}&emsp;</span>
      </template>
      <template #sex="{ text }">
        <span v-if="text === 0">
          不限
        </span>
        <span v-if="text === 1">
          仅男生
        </span>
        <span v-if="text === 2">
          仅女生
        </span>
      </template>
      <template #time="{ text }">
        <span v-if="text === 0">
          不限
        </span>
        <span v-else>
          {{ text }}
        </span>
      </template>
    </a-table>
  </a-modal>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { ActivityLimitManagePresenter } from '@/request/api/presenter/course';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    limitListDialog: {
      type: Boolean
    },
    limitId: {
      type: String,
      default: ''
    }
  },
  emits: ['change-visible', 'limiting-condition'],
  setup(props, { emit }) {
    const chooseLimitName = ref<string>('');
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息
    const columns = [
      {
        title: '限制名称',
        dataIndex: 'name',
        slots: { customRender: 'name' }
      },
      {
        title: '可报年级',
        dataIndex: 'year',
        slots: { customRender: 'year' }
      },
      {
        title: '可报性别',
        dataIndex: 'sex',
        slots: { customRender: 'sex' }
      },
      {
        title: '每日次数上限',
        dataIndex: 'dayTime',
        slots: { customRender: 'dayTime' }
      },
      {
        title: '每周次数上限',
        dataIndex: 'weekTime',
        slots: { customRender: 'weekTime' }
      },
      {
        title: '学期次数上限',
        dataIndex: 'time',
        slots: { customRender: 'time' }
      }
    ];

    const data = ref<any>([]);
    const limitListVisible = computed(() => {
      return props.limitListDialog;
    });

    const getList = async () => {
      const requestData = {
        semesterId: currentSemester.value.id
      };
      try {
        const res = await ActivityLimitManagePresenter.getRestriction(
          requestData
        );
        data.value = res;
      } catch (error) {
        console.log(error);
      }
    };
    onMounted(() => {
      getList();
    });
    watch(
      () => props.limitId,
      () => {
        chooseLimitName.value = props.limitId;
      }
    );
    const handleOk = () => {
      data.value.forEach((correntvalue: { name: string }) => {
        if (correntvalue.name === chooseLimitName.value) {
          emit('limiting-condition', correntvalue);
        }
      });
      emit('change-visible', false);
    };
    const handleCancel = () => {
      emit('change-visible', false);
    };

    return {
      limitListVisible,
      data,
      columns,
      handleOk,
      chooseLimitName,
      handleCancel,
      props
    };
  }
});
</script>
<style lang="less" scoped>
.addStudent {
  margin-bottom: 24px;
}
.name-number {
  margin-top: 20px;
  position: relative;
  .number {
    position: absolute;
    left: 230px;
  }
}
.begin-time-no-data {
  text-align: center;
  line-height: 200px;
}
.add-student-content {
  height: 180px;
  overflow: scroll;
  overflow-x: hidden;
}
.limit-alert {
  margin-bottom: 20px;
}
</style>
