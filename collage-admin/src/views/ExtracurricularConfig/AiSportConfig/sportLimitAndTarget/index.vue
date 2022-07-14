<template>
  <div class="test-wrap">
    <div v-if="isAllSchoolSameRef" class="header">
      <div class="header-left">
        学校运动限制与目标设置：全校一致
      </div>
      <div class="header-right" @click="switchAllSchool(1)">
        切换为全校不同
      </div>
    </div>
    <div v-else class="header">
      <div class="header-left">
        学校运动限制与目标设置：全校不同
      </div>
      <div class="header-right" @click="switchAllSchool(2)">
        切换为全校一致
      </div>
    </div>

    <div>
      <a-table
        row-key="id"
        :data-source="dataSource"
        :columns="columns"
        :pagination="false"
      >
        <template #dayGoals="record">
          <span v-if="record.record.dayGoals !== null">
            {{ record.record.dayGoals }}
          </span>
          <span v-else>
            -
          </span>
        </template>
        <template #weekGoals="record">
          <span v-if="record.record.weekGoals !== null">
            {{ record.record.weekGoals }}
          </span>
          <span v-else>
            -
          </span>
        </template>
        <template #semesterGoals="record">
          <span v-if="record.record.semesterGoals !== null">
            {{ record.record.semesterGoals }}
          </span>
          <span v-else>
            -
          </span>
        </template>
        <template #operation="{record}">
          <a class="update" @click="update(record)">编辑</a>
          <a @click="reset(record)">重置</a>
        </template>
      </a-table>
    </div>
  </div>

  <updateModal
    :show-visible="modalShow"
    :update-men="updateNosame.men"
    :update-women="updateNosame.women"
    :limit-id="limitGoalsId"
    @close="modalClose"
  />
</template>
<script lang="ts">
import { getModalHeadVNode } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import updateModal from './updateModal/Index.vue';
import { SportLimitTargetServicePresenter } from '@/request/api/presenter/aiSport';
import { useStore } from 'vuex';

const columns = ref([
  {
    title: '学年',
    dataIndex: 'year',
    key: 'year'
  },
  {
    title: '学期',
    dataIndex: 'semester',
    key: 'semester'
  },
  {
    title: '性别',
    dataIndex: 'sexStr',
    key: 'sexStr'
  },
  {
    title: '每日分数上限',
    dataIndex: 'dayGoals',
    key: 'dayGoals',
    slots: { customRender: 'dayGoals' }
  },
  {
    title: '每周分数上限',
    dataIndex: 'weekGoals',
    key: 'weekGoals',
    slots: { customRender: 'weekGoals' }
  },
  {
    title: '学期目标分数',
    dataIndex: 'semesterGoals',
    key: 'semesterGoals',
    slots: { customRender: 'semesterGoals' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: { customRender: 'operation' }
  }
]);
export default defineComponent({
  components: {
    updateModal
  },
  setup() {
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

    const isAllSchoolSameRef = ref<boolean>(true);
    const modalShow = ref<boolean>(false);
    const dataSource = ref<any[]>([]);
    const limitGoalsId = ref<string>('');

    const queryList = async (type: number) => {
      //type 初始传0 全校一致1  全校不同2
      const requestData = {
        semesterId: currentSemester.value.id,
        type
      };
      try {
        const res = await SportLimitTargetServicePresenter.getList(requestData);
        limitGoalsId.value = res.limitGoalsId;
        dataSource.value = res.goalsInfoList;
        isAllSchoolSameRef.value = res.limitType === 1 ? true : false;
      } catch (error) {
        console.log(error);
      }
    };
    queryList(0);

    watch(
      () => currentSemester.value,
      () => {
        queryList(0);
      }
    );

    /**
     * @description 切换全校是否相同状态
     * @value 1全校一致 2全校不同
     */
    const switchAllSchool = (value: number) => {
      if (value === 1) {
        Modal.confirm({
          title: '是否确认切换为全校不同',
          content: '切换后原配置会保存',
          async onOk() {
            queryList(2);
            isAllSchoolSameRef.value = false;
            message.success('切换成功');
          }
        });
      } else {
        Modal.confirm({
          title: '是否确认切换为全校一致',
          content: '切换后原配置会保存',
          async onOk() {
            queryList(1);
            isAllSchoolSameRef.value = true;
            message.success('切换成功');
          }
        });
      }
    };

    const updateNosame = reactive({
      men: {},
      women: {}
    });

    const update = (data: any) => {
      //男女不同
      for (let i = 0; i < dataSource.value.length; i++) {
        const item = dataSource.value[i];
        if (item.id === data.id) {
          if (item.sexStr === '男女一致') {
            updateNosame.men = item;
            break;
          }
          if (item.sexStr === '男') {
            updateNosame.men = item;
            updateNosame.women = dataSource.value[i + 1];
          }
          if (item.sexStr === '女') {
            updateNosame.women = item;
            updateNosame.men = dataSource.value[i - 1];
          }
        }
      }
      modalShow.value = true;
    };

    const reset = (data: any) => {
      const requestData = {
        limitGoalsInfoId: data.limitGoalsInfoId
      };

      const titleVnode = getModalHeadVNode('是否确定重置运动限制与目标设置');
      Modal.confirm({
        title: titleVnode,
        content: '重置后，数据恢复至初始状态。',
        class: 'modal-class',
        async onOk() {
          try {
            await SportLimitTargetServicePresenter.reset(requestData);
            queryList(0);
          } catch (error) {
            message.error(error.message);
          }
          message.success('重置成功');
        }
      });
    };

    const modalClose = (value: boolean) => {
      modalShow.value = false;
      updateNosame.men = {};
      updateNosame.women = {};
      if (value) {
        queryList(0);
      }
    };

    return {
      isAllSchoolSameRef,
      dataSource,
      columns,
      modalShow,
      updateNosame,
      limitGoalsId,
      //事件
      switchAllSchool,
      update,
      reset,
      modalClose
    };
  }
});
</script>
<style lang="less" scoped>
.test-wrap {
  background-color: #fff;
  height: 100%;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .header-left {
      font-weight: 700;
    }
    .header-right {
      color: #1966fe;
      cursor: pointer;
    }
  }

  .update {
    margin-right: 24px;
  }
}
</style>
