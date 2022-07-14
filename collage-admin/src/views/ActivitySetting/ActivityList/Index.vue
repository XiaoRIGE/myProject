<template>
  <div class="test-wrap">
    <div class="add-semester">
      <a-form layout="inline" label-align="left" :model="formState">
        <a-form-item label="活动名称">
          <a-input
            v-model:value="formState.name"
            placeholder="请输入"
            enter-button
            allow-clear
          />
        </a-form-item>
        <a-form-item label="所属专题">
          <a-select
            v-model:value="formState.special"
            placeholder="请选择"
            @change="reviewState"
          >
            <a-select-option :value="0">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in specialList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="isNowSemester" label="活动状态">
          <a-select
            v-model:value="formState.state"
            placeholder="请选择"
            @change="reviewState"
          >
            <a-select-option :value="0">
              全部
            </a-select-option>
            <a-select-option :value="1">
              未发布
            </a-select-option>
            <a-select-option :value="2">
              已发布
            </a-select-option>
            <a-select-option :value="3">
              报名中
            </a-select-option>
            <a-select-option :value="4">
              报名结束
            </a-select-option>
            <a-select-option :value="5">
              进行中
            </a-select-option>
            <a-select-option :value="6">
              已结束
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-else label="活动状态">
          <a-select v-model:value="formState.state" placeholder="请选择">
            <a-select-option :value="0">
              全部
            </a-select-option>
            <a-select-option :value="6">
              已结束
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-row class="twice-form">
          <a-form-item label="活动时间">
            <a-range-picker
              v-model:value="formState.activityTime"
              :disabled-date="activityTimeDisabled"
              value-format="YYYY-MM-DD"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
            <a-space :size="16">
              <a-button type="primary" @click="loadFirstPage">
                查询
              </a-button>
              <a-button @click="resetForm">
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-row>
        <!-- </a-col> -->
      </a-form>
      <a-button
        v-if="isNowSemester"
        class="form-btn"
        type="primary"
        @click="addOneceActivity"
      >
        创建单次活动
      </a-button>

      <ImoortFile
        :show-file-dialog="showFileDialog"
        :import-service="batchImport"
        :export-err="exportErr"
        @importExcelSuccess="importExcelSuccess"
      >
        <a-button v-if="isNowSemester" class="form-btn" @click="bulkImport">
          批量导入
        </a-button>
      </ImoortFile>
      <a-button class="form-btn" @click="downLoadTable">
        下载标准表格
      </a-button>
    </div>
    <div>
      <a-table
        row-key="id"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="false"
      >
        <template #activityTopicVO="{ text }">
          <span v-if="text === null">
            -
          </span>
          <span v-else>
            {{ text.name }}
          </span>
        </template>
        <template #activityStatus="{ text }">
          <span v-if="text === 1" class="state-out">
            <div class="state-spot state-spot-gray">·</div>
            <span class="state-text">
              未发布
            </span>
          </span>
          <span v-else-if="text === 2" class="state-out">
            <div class="state-spot state-spot-qianBlue">·</div>
            <span class="state-text">
              已发布
            </span>
          </span>
          <span v-else-if="text === 3" class="state-out">
            <div class="state-spot state-spot-green">·</div>
            <span class="state-text">
              报名中
            </span>
          </span>
          <span v-else-if="text === 4" class="state-out">
            <div class="state-spot state-spot-pouple">·</div>
            <span class="state-text">
              报名结束
            </span>
          </span>
          <span v-else-if="text === 5" class="state-out">
            <div class="state-spot state-spot-blue">·</div>
            <span class="state-text">
              进行中
            </span>
          </span>
          <span v-else-if="text === 6" class="state-out">
            <div class="state-spot state-spot-gray">·</div>
            <span class="state-text">
              已结束
            </span>
          </span>
        </template>
        <template #releaseDate="{ text }">
          {{ text }}
        </template>
        <template #startTime="{ record }">
          {{ record.startTime }}~{{ record.endTime }}
        </template>
        <template #registeredNumber="{ record }">
          <span v-if="record.limitPeopleNumber === null">
            {{ record.registeredNumber }}
          </span>
          <span v-else>
            {{ record.registeredNumber }}/{{ record.limitPeopleNumber }}
          </span>
        </template>
        <template #operation="{ record }">
          <!-- 活动状态 1未发布，2已发布，3报名中，4报名结束，5进行中，6已结束 -->
          <a
            v-if="
              record.activityStatus === 3 ||
                record.activityStatus === 4 ||
                record.activityStatus === 5 ||
                record.activityStatus === 6
            "
            class="studentList"
            @click="studentList(record)"
          >
            学生名单
          </a>
          <a
            v-if="record.activityStatus !== 6"
            class="update"
            @click="upDateStudentUser(record)"
          >
            编辑
          </a>
          <a v-else class="update" @click="upDateStudentUser(record)">查看</a>
          <a
            v-if="record.activityStatus === 1 || record.activityStatus === 2"
            class="delate"
            @click="delateStudentUser(record)"
          >
            删除
          </a>
        </template>
      </a-table>
      <a-pagination
        v-model:current="current"
        v-model:pageSize="pageSize"
        :hide-on-single-page="true"
        class="pagination"
        :total="totalNum"
        :show-total="total => `共 ${total} 条`"
      />
    </div>
  </div>
  <AddOneActivityDrawer
    :is-drawer-show="isDrawerShow"
    :add-or-update="addOrUpdate"
    :update-list="updateList.data"
    @change-visible="changeVisible"
  />
  <DrawerList
    :is-drawer-show="isDrawerListShow"
    :is-now-semester="isNowSemester"
    :activity-id="activityId"
    :restrictin-id="restrictinId"
    :activity-state="activityState"
    @change-visible="DrawerListVisible"
  />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  UnwrapRef,
  watch
} from 'vue';
import AddOneActivityDrawer from './AddOneActivityDrawer/Index.vue';
import DrawerList from './DrawerList/Index.vue';
import moment, { Moment } from 'moment';
import { useStore } from 'vuex';
import { OnceActivityListPresenter } from '@/request/api/presenter/course';
import { getModalHeadVNode } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import ImoortFile from '@/components/global/ImportFile.vue';
import { OnceActivityList } from '@/request/api/model/course';
import { useForm } from '@ant-design-vue/use';

const getStoreInfo = () => {
  const store = useStore();
  const specialList = computed(() => store.state.basic.SpecialList);

  store.dispatch('basic/updateSpecialList');
  return {
    specialList
  };
};
export default defineComponent({
  components: {
    AddOneActivityDrawer,
    DrawerList,
    ImoortFile
  },
  setup() {
    const { specialList } = getStoreInfo();
    const isDrawerShow = ref<boolean>(false); //新增弹窗
    const isDrawerListShow = ref<boolean>(false); //学生名单
    const addOrUpdate = ref<string>('添加'); //true添加 false update
    const loading = ref<boolean>(false);
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息
    const activityId = ref<string>('');
    const totalNum = ref<number>(0);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const formState: UnwrapRef<any> = reactive({
      name: '',
      special: 0,
      state: 0,
      activityTime: ref<Moment[]>([])
    });
    const activityState = ref<number>(0);
    const dataSource = ref([]);

    const columns = [
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '所属专题',
        dataIndex: 'activityTopicVO',
        key: 'activityTopicVO',
        slots: { customRender: 'activityTopicVO' }
      },
      {
        title: '活动状态',
        dataIndex: 'activityStatus',
        key: 'activityStatus',
        slots: { customRender: 'activityStatus' }
      },
      {
        title: '发布日期',
        dataIndex: 'releaseDate',
        key: 'releaseDate',
        slots: { customRender: 'releaseDate' }
      },
      {
        title: '活动时间',
        dataIndex: 'startTime',
        key: 'startTime',
        slots: { customRender: 'startTime' }
      },
      {
        title: '报名人数',
        dataIndex: 'registeredNumber',
        key: 'registeredNumber',
        slots: { customRender: 'registeredNumber' }
      },
      {
        title: '活动地点',
        dataIndex: 'address',
        key: 'address',
        slots: { customRender: 'address' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'left',
        slots: { customRender: 'operation' }
      }
    ];
    const isNowSemester = ref<boolean>(true); //true为当前学期
    if (currentSemester.value.current === 1) {
      isNowSemester.value = true;
    } else {
      isNowSemester.value = false;
    }

    const getOnceActivityList = async () => {
      loading.value = true;

      const startTime =
        formState.activityTime.length === 0
          ? currentSemester.value.startDate
          : Number(moment(formState.activityTime[0]).format('x'));
      const endTime =
        formState.activityTime.length === 0
          ? currentSemester.value.endDate
          : Number(moment(formState.activityTime[1]).format('x')) +
            24 * 60 * 60 * 1000;
      const data = {
        activityStatus: formState.state === undefined ? null : formState.state,
        activityTopicId: formState.special === 0 ? null : formState.special,
        endTime,
        page: current.value,
        simpleActivityName: formState.name,
        size: pageSize.value,
        startTime
      };
      try {
        const res = await OnceActivityListPresenter.getOnceActivity(data);
        totalNum.value = res.total;
        dataSource.value = res.items;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const loadFirstPage = () => {
      current.value = 1;
      getOnceActivityList();
    };

    const { resetFields } = useForm(formState, reactive({}));

    watch(
      () => currentSemester.value,
      async () => {
        if (currentSemester.value.current === 1) {
          isNowSemester.value = true;
        } else {
          isNowSemester.value = false;
        }
        loadFirstPage();
      }
    );

    onMounted(async () => {
      loadFirstPage();
    });

    watch(
      () => pageSize.value,
      async () => {
        await getOnceActivityList();
      }
    );

    watch(
      () => current.value,
      async () => {
        await getOnceActivityList();
      }
    );
    const updateList = reactive({
      data: {}
    });
    const changeVisible = async (visibele: string) => {
      updateList.data = {};
      isDrawerShow.value = false;
      if (visibele === '刷新') {
        await getOnceActivityList();
      }
    };
    const DrawerListVisible = (visibele: boolean) => {
      isDrawerListShow.value = visibele;
    };
    const restrictinId = ref<string>('');
    const studentList = (data: any) => {
      //学生名单
      if (data.restrictionVO === null) {
        restrictinId.value = '';
      } else {
        restrictinId.value = data.restrictionVO.id;
      }
      activityId.value = data.id;
      isDrawerListShow.value = true;
      activityState.value = data.activityStatus;
    };

    const addOneceActivity = () => {
      //活动名单
      updateList.data = {};
      addOrUpdate.value = '添加';
      isDrawerShow.value = true;
    };
    const upDateStudentUser = (data: any) => {
      updateList.data = data;
      addOrUpdate.value = '编辑';
      isDrawerShow.value = true;
    };

    const delateStudentUser = (data: any) => {
      const requestData = {
        simpleActivityId: data.id
      };
      const titleVnode = getModalHeadVNode('删除');
      Modal.confirm({
        title: titleVnode,
        content: '确定要删除吗',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await OnceActivityListPresenter.delOnceActivity(requestData);
            await getOnceActivityList();
          } catch (error) {
            message.error(error.message);
          }
        }
      });
    };

    const reviewState = () => {
      loadFirstPage();
    };

    const resetForm = () => {
      resetFields();
      loadFirstPage();
    };

    const activityTimeDisabled = computed(() => {
      const startDate = moment(currentSemester.value.startDate);
      const endDate = moment(currentSemester.value.endDate);
      return (current: Moment) => {
        return current > endDate || current < startDate;
      };
    });

    const downLoadTable = async () => {
      try {
        await OnceActivityListPresenter.exportOnceActivityTemplate();
      } catch (error) {
        message.error(error.message);
      }
    };

    const showFileDialog = ref<boolean>(false);
    const bulkImport = () => {
      //批量导入
      showFileDialog.value = true;
    };

    const importExcelSuccess = (val: any) => {
      if (val === '导入成功') {
        loadFirstPage();
      }
    };
    return {
      dataSource,
      columns,
      addOneceActivity,
      isDrawerShow,
      changeVisible,
      studentList,
      isDrawerListShow,
      DrawerListVisible,
      upDateStudentUser,
      formState,
      specialList,
      loadFirstPage,
      activityTimeDisabled,
      moment,
      addOrUpdate,
      updateList,
      loading,
      delateStudentUser,
      downLoadTable,
      bulkImport,
      showFileDialog,
      batchImport: OnceActivityList.importOnceActivity,
      exportErr: OnceActivityList.downloadErrTemplate,
      importExcelSuccess,
      activityId,
      pageSize,
      totalNum,
      current,
      restrictinId,
      resetForm,
      isNowSemester,
      reviewState,
      activityState
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
.test-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
  .add-semester {
    margin-bottom: 24px;
  }
  .delate {
    color: #ff4d4f;
  }
  .update {
    margin-right: 20px;
  }
}
.form-btn {
  margin-right: 20px;
  margin-top: 10px;
}
.twice-form {
  margin-top: 10px;
}
.state-out {
  position: relative;
  .state-spot {
    position: absolute;
    top: -42px;
    font-size: 58px;
  }
  .state-text {
    margin-left: 20px;
  }
  .state-spot-pouple {
    color: #722ed1;
  }
  .state-spot-gray {
    color: #d9d9d9;
  }
  .state-spot-blue {
    color: #1966fe;
  }
  .state-spot-green {
    color: #52c41a;
  }
  .state-spot-qianBlue {
    color: #13c2c2;
  }
}
.studentList {
  margin-right: 20px;
}
</style>
