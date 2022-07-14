<template>
  <div class="list-content">
    <div class="header">
      <span class="name">
        {{ JsonStudentList.name }}({{ JsonStudentList.sex }})
      </span>
      <span class="number">
        {{ JsonStudentList.number }}
      </span>
      <span v-if="type === '里程'">
        学期目标：{{ studentMessage.data.targetMileage }}KM &emsp; 有效里程：{{
          studentMessage.data.effictiveMileage
        }}KM&emsp; 总里程：{{ studentMessage.data.totalMileage }}KM
      </span>
      <span v-else>
        学期目标：{{ studentMessage.data.targetlPart }} &emsp; 有效段数：{{
          studentMessage.data.effictivePart
        }}&emsp; 总段数：{{ studentMessage.data.totalPart }}
      </span>
      <a-popover>
        <template v-if="type === '里程'" #content>
          <p>APP计入有效里程：{{ studentMessage.data.appMileage }}KM</p>
          <p>
            岗亭打卡计入有效里程：0
          </p>
          <p>
            跑步机计入有效里程：0
          </p>
        </template>
        <template v-else #content>
          <p>APP计入有效段数：{{ studentMessage.data.appPart }}</p>
          <p>
            岗亭打卡计入有效里程：0
          </p>
          <p>
            跑步机计入有效里程：0
          </p>
        </template>
        <span class="detail">
          详情
        </span>
      </a-popover>
    </div>
  </div>
  <div class="content-list">
    <a-button type="primary" @click="showModal">
      新增跑步数据
    </a-button>
    <div class="table-content">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        row-key="id"
        :pagination="false"
        :loading="loading"
      >
        <template #effectiveMileage="{record}">
          <span
            v-if="record.operationMileage && record.effectiveMileage !== null"
          >
            <del>{{ record.effectiveMileage }}KM</del>
            &nbsp;
            <span>{{ record.operationMileage }}KM</span>
          </span>
          <span v-else-if="record.effectiveMileage">
            {{ record.effectiveMileage }}KM
          </span>
          <span v-else>--</span>
        </template>
        <template #totalMileage="{record}">
          <span v-if="record.totalMileage !== null">
            {{ record.totalMileage }}KM
          </span>
          <span v-else>--</span>
        </template>
        <template #totalNumber="{record}">
          <span v-if="record.totalPart !== null">
            {{ record.totalPart }}
          </span>
          <span v-else>--</span>
        </template>
        <template #effectivePart="{record}">
          <span v-if="record.operationPart && record.effectivePart !== null">
            <del>{{ record.effectivePart }}段</del>
            &nbsp;
            <span>{{ record.operationPart }}段</span>
          </span>
          <span v-else-if="record.effectivePart">
            {{ record.effectivePart }}段
          </span>
          <span v-else>--</span>
        </template>
        <template #startTime="{record}">
          <span v-if="record.startTime !== null">
            {{ record.year }}&nbsp;&nbsp;{{ record.startTime }}~{{
              record.endTime
            }}
          </span>
          <span v-else>
            --
          </span>
        </template>
        <template #keepTime="{record}">
          <span v-if="record.keepTime !== null">
            {{ record.keepTime }}
          </span>
          <span v-else>
            --
          </span>
        </template>
        <template #uneffectiveReason="{record}">
          <span v-if="record.uneffectiveReason !== null">
            {{ record.uneffectiveReason }}
          </span>
          <span v-else>
            --
          </span>
        </template>
        <template #action="{record}">
          <a
            v-if="
              (record.runningTypeName === '范围跑') |
                (record.runningTypeName === '定点跑') |
                (record.runningTypeName === '自由跑')
            "
            @click="runningData(record)"
          >
            查看详情
          </a>
          <a
            v-if="record.runningTypeName === '数据修改'"
            @click="update(record)"
          >
            编辑
          </a>
          <a
            v-if="record.runningTypeName === '数据修改'"
            class="delate"
            @click="delate(record)"
          >
            删除
          </a>
        </template>
      </a-table>
      <a-pagination
        v-model:current="current"
        v-model:pageSize="pageSize"
        class="pagination"
        :total="totalNum"
        :show-total="total => `共 ${total} 条`"
      />
    </div>
  </div>

  <a-modal
    v-model:visible="visible"
    :title="updateOrAdd === true ? '新增' : '编辑'"
    @ok="handleOk"
  >
    <a-form :model="formState">
      <a-row>
        <a-col :span="8">
          <a-form-item style="margin:0 20px">
            <a-select v-model:value="formState.region">
              <a-select-option :value="1">
                增加
              </a-select-option>
              <a-select-option :value="2">
                减少
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item v-if="type === '里程'">
            <span>
              里程：
            </span>
            <a-input-number v-model:value="formState.mileage" :min="1" />
            KM
          </a-form-item>
          <a-form-item v-else>
            <span>
              段数：
            </span>
            <a-input-number v-model:value="formState.mileage" :min="1" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>

  <RunParticularDialog
    :visible="dialogVisible"
    :prop-data="propData.data"
    @change-visible="changeVisible"
    @refresh="refreshList"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  computed,
  watch
} from 'vue';
import RunParticularDialog from './RunParticularDialog/Index.vue';
import { useRoute } from 'vue-router';
import { RunningConditionPresenter } from '@/request/api/presenter/runSettings';
import { useStore } from 'vuex';
import { message, Modal } from 'ant-design-vue';
import { getModalHeadVNode } from '@/utils/common';
import moment from 'moment';

export default defineComponent({
  components: { RunParticularDialog },
  setup() {
    const route = useRoute();
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息
    const columns = reactive([
      {
        title: '跑步方式',
        dataIndex: 'runningTypeName',
        key: 'runningTypeName'
      },
      {
        title: '总里程',
        dataIndex: 'totalMileage',
        key: 'totalMileage',
        slots: { customRender: 'totalMileage' }
      },
      {
        title: '有效里程',
        dataIndex: 'effectiveMileage',
        key: 'effectiveMileage',
        slots: { customRender: 'effectiveMileage' }
      },
      {
        title: '总段数',
        dataIndex: 'totalNumber',
        key: 'totalNumber',
        slots: { customRender: 'totalNumber' }
      },
      {
        title: '有效段数',
        dataIndex: 'effectivePart',
        key: 'effectivePart',
        slots: { customRender: 'effectivePart' }
      },
      {
        title: '跑步时间',
        dataIndex: 'startTime',
        key: 'startTime',
        slots: { customRender: 'startTime' }
      },
      {
        title: '运动时长',
        dataIndex: 'keepTime',
        key: 'keepTime',
        slots: { customRender: 'keepTime' }
      },
      {
        title: '无效原因',
        dataIndex: 'uneffectiveReason',
        key: 'uneffectiveReason',
        slots: { customRender: 'uneffectiveReason' }
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 200,
        slots: { customRender: 'action' }
      }
    ]);
    const dataSource = ref<any[]>([]);
    const propData = reactive({
      data: {
        key: '',
        runMode: '',
        valid: '无效',
        mileage: -10.0,
        number: 5,
        runTime: '',
        sportTime: '',
        invalidMessage: '',
        userId: '',
        averageCadenceEnd: 0, // 平均步频
        averageCadenceStart: 0,
        averageSpeedStart: '0', // 平均配速
        averageSpeedEnd: '0',
        effectiveMileageStart: 0, // 有效里程范围
        effectiveMileageEnd: 0,
        effectiveParagraphStart: 0, // 有效段数范围
        effectiveParagraphEnd: 0
      }
    });
    let JsonStudentList = reactive({
      userId: '',
      name: '',
      sex: '',
      number: 0,
      mileage: 0
    });
    const studentMessage = reactive({
      data: {
        appMileage: 0,
        appPart: 0,
        effictiveMileage: 0,
        effictivePart: 0,
        targetMileage: 0,
        targetlPart: 0,
        totalMileage: 0,
        totalPart: 0
      }
    });
    const totalNum = ref(0);
    const pageSize = ref(10);
    const current = ref(1);
    let studentList: any = [];
    studentList = route.params.data1; //跳转到此页面获取数据
    JsonStudentList = JSON.parse(studentList);
    const type = ref(route.params.isScoringType1); //当前模式 里程 段数
    const formState = reactive({
      mileage: 1,
      region: 1
    });
    const visible = ref<boolean>(false);
    const dialogVisible = ref<boolean>(false);
    const updateOrAdd = ref<boolean>(true);
    const loading = ref<boolean>(false);

    const getStudentRunningDetails = async () => {
      loading.value = true;
      const data = {
        page: current.value,
        semesterId: currentSemester.value.id,
        size: pageSize.value,
        userId: JsonStudentList.userId
      };
      try {
        const res = await RunningConditionPresenter.getStudentRunningDetails(
          data
        );
        totalNum.value = res.total;
        dataSource.value = res.gradeDetails;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const formateDate = (timestamp: any) => {
      return moment(timestamp).format('mm:ss');
    };

    // 获取学期目标
    const getStudentRunningInfo = async () => {
      const data = {
        page: current.value,
        semesterId: currentSemester.value.id,
        size: pageSize.value,
        userId: JsonStudentList.userId,
        type: 0
      };
      if (type.value && type.value === '里程') {
        data.type = 1;
      } else {
        data.type = 2;
      }

      try {
        const res = await RunningConditionPresenter.getStudentRunningInfo(data);

        const {
          averageCadenceStart,
          averageCadenceEnd,
          averageSpeedStart,
          averageSpeedEnd,
          effectiveMileageStart,
          effectiveMileageEnd,
          effectiveParagraphStart,
          effectiveParagraphEnd
        } = res;

        studentMessage.data = res;
        propData.data.averageCadenceStart = averageCadenceStart || 0;
        propData.data.averageCadenceEnd = averageCadenceEnd || 0;
        propData.data.averageSpeedStart = averageSpeedStart
          ? formateDate(Number(averageSpeedStart))
          : '0';
        propData.data.averageSpeedEnd = averageSpeedEnd
          ? formateDate(Number(averageSpeedEnd))
          : '0';
        propData.data.effectiveMileageStart = effectiveMileageStart || 0;
        propData.data.effectiveParagraphStart = effectiveParagraphStart || 0;
        propData.data.effectiveParagraphEnd = effectiveParagraphEnd || 0;
        propData.data.effectiveMileageEnd = effectiveMileageEnd || 0;
      } catch (error) {
        console.log('error', error);
      }
    };

    onMounted(async () => {
      try {
        await getStudentRunningDetails();
      } catch (error) {
        console.log(error);
      }
      try {
        await getStudentRunningInfo();
      } catch (error) {
        console.log(error);
      }
      if (type.value === '里程') {
        //判断模式改变列表内容
        columns.splice(3, 2);
      } else {
        columns.splice(1, 2);
      }
    });

    watch(
      () => pageSize.value,
      async () => {
        try {
          await getStudentRunningDetails();
        } catch (error) {
          console.log(error);
        }
      }
    );
    watch(
      () => current.value,
      async () => {
        try {
          await getStudentRunningDetails();
        } catch (error) {
          console.log(error);
        }
      }
    );

    const showModal = () => {
      updateOrAdd.value = true;
      formState.mileage = 1;
      formState.region = 1;
      visible.value = true;
    };

    const runningData = (data: any) => {
      //跑步详情
      propData.data = { ...propData.data, ...data };
      propData.data.userId = JsonStudentList.userId;
      dialogVisible.value = true;
    };

    const changeVisible = (visibele: boolean) => {
      dialogVisible.value = visibele;
    };

    const delate = (data: any) => {
      const titleVnode = getModalHeadVNode(
        `确定要删除（${data.runningTypeName}）吗？`
      );
      const params = {
        id: data.id,
        type: 0
      };
      type.value === '里程' ? (params.type = 1) : (params.type = 2);
      Modal.confirm({
        title: titleVnode,
        class: 'modal-class',
        async onOk() {
          try {
            await RunningConditionPresenter.delateRunningDetails(params);
            visible.value = false;
            await getStudentRunningDetails();
            message.success('删除成功！');
            getStudentRunningInfo();
          } catch (error) {
            console.log(error);
            message.error('删除失败！');
          }
        }
      });
    };
    const updateData = {
      id: '',
      mileage: 0,
      part: 0,
      type: 0
    };
    const update = (data: any) => {
      visible.value = true;
      updateOrAdd.value = false;
      updateData.id = data.id;
      if (type.value === '里程') {
        updateData.type = 1;
        formState.region = data.effectiveMileage > 0 ? 1 : 2;
        formState.mileage = Math.abs(data.effectiveMileage);
      } else {
        updateData.type = 2;
        formState.region = data.effectivePart > 0 ? 1 : 2;
        formState.mileage = Math.abs(data.effectivePart);
      }
    };

    const handleOk = async () => {
      const data = {
        mileage: formState.mileage,
        part: 0,
        semesterId: currentSemester.value.id,
        type: 0,
        userId: JsonStudentList.userId
      };
      if (type.value === '里程') {
        //判断当前模式
        data.type = 1;
        data.mileage = formState.mileage;
        data.part = 0;
        updateData.mileage = formState.mileage;
      } else {
        data.type = 2;
        data.mileage = 0;
        data.part = formState.mileage;
        updateData.part = formState.mileage;
      }
      if (formState.region === 2) {
        //如果减少传负数
        data.mileage = data.mileage - data.mileage * 2;
        data.part = data.part - data.part * 2;
        updateData.part = updateData.part - updateData.part * 2;
        updateData.mileage = updateData.mileage - updateData.mileage * 2;
      }

      if (updateOrAdd.value === true) {
        try {
          await RunningConditionPresenter.addRunningDetails(data);
          visible.value = false;
          await getStudentRunningDetails();
          message.success('新增成功');
          getStudentRunningInfo();
        } catch (error) {
          message.error('新增失败');
          console.log(error);
        }
      } else {
        try {
          await RunningConditionPresenter.updateRunningDetails(updateData);
          visible.value = false;
          await getStudentRunningDetails();
          message.success('更新成功');
          getStudentRunningInfo();
        } catch (error) {
          message.error('更新失败');
          console.log(error);
        }
      }
    };

    // 修改成功回调
    const refreshList = async () => {
      dialogVisible.value = false;
      try {
        await getStudentRunningDetails();
      } catch (error) {
        console.log(error);
      }
    };

    return {
      columns,
      dataSource,
      formState,
      visible,
      showModal,
      runningData,
      dialogVisible,
      changeVisible,
      propData,
      JsonStudentList,
      handleOk,
      delate,
      update,
      updateOrAdd,
      current,
      pageSize,
      totalNum,
      type,
      studentMessage,
      refreshList,
      loading
    };
  }
});
</script>

<style lang="less" scoped>
.list-content {
  background: #fff;
  padding: 0 0 16px 24px;

  .name {
    font-size: 20px;
    font-weight: 700;
  }
  .number {
    font-weight: 700;
    margin-right: 20px;
  }
  .detail {
    margin-left: 20px;
    color: #1966fe;
    cursor: pointer;
  }
}
.content-list {
  margin: 24px;
  background: #fff;
  padding: 24px;

  .table-content {
    margin-top: 24px;
  }
}
.icon-warn {
  width: 24px;
  height: 24px;
}
.delate {
  color: #ff4d4f;
  margin-left: 24px;
}
</style>
