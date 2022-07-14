<template>
  <div>
    <div class="special_btn">
      <a-button class="add-special-btn" type="primary" @click="addTarget">
        添加特殊限制与目标
      </a-button>

      <a-form layout="inline" :model="formState">
        <a-form-item label="学院名称">
          <a-select
            v-model:value="formState.collegeId"
            placeholder="请选择学院"
          >
            <a-select-option :value="''">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in collegeList"
              :key="item.value"
              :value="item.key"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学期">
          <a-select v-model:value="formState.semester" placeholder="请选择学期">
            <a-select-option :value="0">
              全部
            </a-select-option>
            <a-select-option :value="1">
              上学期
            </a-select-option>
            <a-select-option :value="2">
              下学期
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学年">
          <a-select
            v-model:value="formState.schoolYear"
            placeholder="请选择学年"
          >
            <a-select-option :value="0">
              全部
            </a-select-option>
            <a-select-option :value="1">
              大一
            </a-select-option>
            <a-select-option :value="2">
              大二
            </a-select-option>
            <a-select-option :value="3">
              大三
            </a-select-option>
            <a-select-option :value="4">
              大四
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-row>
          <a-form-item class="form-allBtn">
            <a-button class="form-allBtn-query" type="primary" @click="query">
              查询
            </a-button>
            <a-button @click="reset">
              重置
            </a-button>
          </a-form-item>
        </a-row>
      </a-form>
    </div>
    <a-table
      v-if="isAllSchoolSame"
      bordered
      row-key="id"
      :data-source="dataSource"
      :loading="loadingMileage"
      :columns="columnsMileage"
    >
      <template #averagespeed="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.averageSpeedStart }}-{{ record.averageSpeedEnd }}
          </div>
        </div>
      </template>
      <template #stride="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.averageCadenceStart }}-{{ record.averageCadenceEnd }}
          </div>
        </div>
      </template>
      <template #effectiverange="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.effectiveMileageStart }}~{{
              record.effectiveMileageEnd
            }}KM
          </div>
        </div>
      </template>
      <template #mileagelimit="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.dailyMileage }}KM
          </div>
        </div>
      </template>
      <template #weeklylimit="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.weeklyMileage }}KM
          </div>
        </div>
      </template>
      <template #semestermilestone="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.semesterMileage }}KM
          </div>
        </div>
      </template>
      <template #operation="{ record }">
        <div class="update">
          <a @click="update(record)">编辑</a>
          <a class="delate" @click="delate(record)">删除</a>
        </div>
      </template>
    </a-table>

    <a-table
      v-else
      bordered
      row-key="id"
      :data-source="dataSourceNumber"
      :loading="loadingNumber"
      :columns="columnsNumber"
    >
      <template #averagespeed="{ record }">
        <div class="editable-cell">
          {{ record.averageSpeedStart }}-{{ record.averageSpeedEnd }}
        </div>
      </template>
      <template #stride="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.averageCadenceStart }}-{{ record.averageCadenceEnd }}
          </div>
        </div>
      </template>
      <template #effectiverange="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.effectiveParagraphMileage }}
          </div>
        </div>
      </template>
      <template #mileagelimit="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.effectiveParagraphStart }}~{{
              record.effectiveParagraphEnd
            }}
          </div>
        </div>
      </template>
      <template #weeklylimit="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.dailyParagraph }}
          </div>
        </div>
      </template>
      <template #semestermilestone="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.weeklyParagraph }}
          </div>
        </div>
      </template>
      <template #semesterNumberTarget="{ record }">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ record.semesterParagraph }}
          </div>
        </div>
      </template>
      <template #operation="{ record }">
        <div class="update">
          <a @click="update(record)">编辑</a>
          <a class="delate" @click="delate(record)">删除</a>
        </div>
      </template>
    </a-table>
  </div>
  <RunRestrictDialog
    :close-app-visible="showVisible"
    :who-click="whoClick"
    :is-mileage-message1="isMileageMessage1"
    :add-or-update="addOrUpdate"
    :form-data-list="specialTargetUpdataList.data"
    @change-visible="changeVisible"
    @add-success="addSuccess"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  Ref,
  UnwrapRef,
  watch
} from 'vue';
import RunRestrictDialog from '../RunRestrictDialog/Index.vue';
import { SchoolRunAstrictTargetSettingsServicePresenter } from '@/request/api/presenter/runSettings';
import { message, Modal } from 'ant-design-vue';
import { BaseCourseServicePresenter } from '@/request/api/presenter/course';
import { getModalHeadVNode } from '@/utils/common';
interface DataItem {
  [x: string]: any;
  limitGoalsInfoId: any;
  key: string;
  college: string;
  year: string;
  semester: string;
  gender: string;
  stride: string;
  effectiverange: string;
  mileagelimit: string;
  weeklylimit: string;
  semestermilestone: string;
}
interface FomrState {
  collegeId: undefined | string;
  semester: undefined | number;
  schoolYear: undefined | number;
  page: number;
  size: number;
  scoringType: number;
}
export default defineComponent({
  components: {
    RunRestrictDialog
  },
  props: {
    isAllSchoolSame: {
      type: Boolean
    },
    isMileageMessage: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const formState: UnwrapRef<FomrState> = reactive({
      collegeId: undefined,
      semester: undefined,
      schoolYear: undefined,
      page: 1,
      size: 10,
      scoringType: 0
    });
    const whoClick = ref('newTargetSeeting');
    const isMileageMessage1 = ref<string>('');
    const loadingMileage = ref<boolean>(false);
    const loadingNumber = ref<boolean>(false);
    const columnsMileage = [
      {
        title: '名称/学院',
        dataIndex: 'name',
        align: 'center'
      },
      {
        title: '学年',
        dataIndex: 'schoolYear',
        align: 'center'
      },
      {
        title: '学期',
        dataIndex: 'semesterStr',
        align: 'center'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        align: 'center'
      },
      {
        title: '平均配速（/公里）',
        dataIndex: 'averagespeed',
        align: 'center',
        slots: { customRender: 'averagespeed' }
      },
      {
        title: '平均步频（步/分钟）',
        dataIndex: 'stride',
        align: 'center',
        slots: { customRender: 'stride' }
      },
      {
        title: '每次有效里程',
        dataIndex: 'effectiverange',
        align: 'center',
        slots: { customRender: 'effectiverange' }
      },
      {
        title: '每日里程上限',
        dataIndex: 'mileagelimit',
        align: 'center',
        slots: { customRender: 'mileagelimit' }
      },
      {
        title: '每周里程上限',
        dataIndex: 'weeklylimit',
        align: 'center',
        slots: { customRender: 'weeklylimit' }
      },
      {
        title: '学期目标里程',
        dataIndex: 'semestermilestone',
        align: 'center',
        slots: { customRender: 'semestermilestone' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        slots: { customRender: 'operation' }
      }
    ];
    const columnsNumber = [
      {
        title: '名称/学院',
        dataIndex: 'name',
        align: 'center'
      },
      {
        title: '学年',
        dataIndex: 'schoolYear',
        align: 'center'
      },
      {
        title: '学期',
        dataIndex: 'semesterStr',
        align: 'center'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        align: 'center'
      },
      {
        title: '平均配速（/公里）',
        dataIndex: 'averagespeed',
        align: 'center',
        slots: { customRender: 'averagespeed' }
      },
      {
        title: '平均步频（步/分钟）',
        dataIndex: 'stride',
        align: 'center',
        slots: { customRender: 'stride' }
      },
      {
        title: '每段有效里程',
        dataIndex: 'effectiverange',
        align: 'center',
        slots: { customRender: 'effectiverange' }
      },
      {
        title: '每次有效段数',
        dataIndex: 'mileagelimit',
        align: 'center',
        slots: { customRender: 'mileagelimit' }
      },
      {
        title: '每日段数上限',
        dataIndex: 'weeklylimit',
        align: 'center',
        slots: { customRender: 'weeklylimit' }
      },
      {
        title: '每周段数上限',
        dataIndex: 'semestermilestone',
        align: 'center',
        slots: { customRender: 'semestermilestone' }
      },
      {
        title: '学期段数目标',
        dataIndex: 'semesterNumberTarget',
        align: 'center',
        slots: { customRender: 'semesterNumberTarget' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        slots: { customRender: 'operation' }
      }
    ];
    const dataSource: Ref<DataItem[]> = ref([]);
    const collegeList = ref([]);
    const dataSourceNumber: Ref<DataItem[]> = ref([]);
    const showVisible = ref<boolean>(false);
    const addOrUpdate = ref<string>('');

    const requestData = {
      collegeId: '',
      page: 1,
      scoringType: 0,
      schoolYear: 0,
      semester: 0,
      size: 10
    };

    const specialTargetUpdataList = reactive({
      data: {}
    });

    const getSpecialLimitGoalsInfo = async (requestData: any) => {
      // 获取列表详情接口
      loadingMileage.value = true;
      loadingNumber.value = true;
      try {
        const res = await SchoolRunAstrictTargetSettingsServicePresenter.specialLimitGoalsInfo(
          requestData
        );
        if (props.isAllSchoolSame === true) {
          dataSource.value = [];
          for (let i = 0; i < res.items.length; i++) {
            for (
              let k = 0;
              k < res.items[i].goalsInfoVO.sexInfoList.length;
              k++
            ) {
              dataSource.value.push(res.items[i].goalsInfoVO.sexInfoList[k]);
            }
          }
        } else {
          dataSourceNumber.value = [];
          for (let i = 0; i < res.items.length; i++) {
            for (
              let k = 0;
              k < res.items[i].goalsInfoVO.sexInfoList.length;
              k++
            ) {
              dataSourceNumber.value.push(
                res.items[i].goalsInfoVO.sexInfoList[k]
              );
            }
          }
        }
      } catch (error) {
        Modal.error({
          title: '切换失败',
          content: `${error.message}`
        });
      } finally {
        loadingMileage.value = false;
        loadingNumber.value = false;
      }
    };

    watch(
      () => props.isAllSchoolSame,
      async () => {
        if (props.isAllSchoolSame === true) {
          //里程模式
          requestData.scoringType = 1;
          try {
            await getSpecialLimitGoalsInfo(requestData);
          } catch (error) {
            console.log(error);
          } finally {
            loadingMileage.value = false;
            loadingNumber.value = false;
          }
        } else {
          //段数模式
          requestData.scoringType = 2;
          try {
            await getSpecialLimitGoalsInfo(requestData);
          } catch (error) {
            console.log(error);
          } finally {
            loadingMileage.value = false;
            loadingNumber.value = false;
          }
        }
      }
    );

    onMounted(async () => {
      try {
        await getSpecialLimitGoalsInfo(requestData);
      } catch (error) {
        console.log(error);
      } finally {
        loadingMileage.value = false;
        loadingNumber.value = false;
      }

      const data: any = await BaseCourseServicePresenter.getCollegetList();
      collegeList.value = data;
    });

    const addTarget = () => {
      //添加特殊限制与目标
      specialTargetUpdataList.data = {};
      isMileageMessage1.value = props.isMileageMessage;
      addOrUpdate.value = '添加';
      whoClick.value = '男女一致';
      showVisible.value = true;
    };

    const changeVisible = async () => {
      showVisible.value = false;
    };

    const addSuccess = async () => {
      //添加特殊限制成功dialog
      try {
        await getSpecialLimitGoalsInfo(requestData);
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '切换失败',
          content: `${error.message}`
        });
      } finally {
        loadingMileage.value = false;
        loadingNumber.value = false;
      }
      showVisible.value = false;
    };

    const update = (data: any) => {
      //编辑
      let abcWoMen = {};
      if (props.isMileageMessage === '里程') {
        for (let i = 0; i < dataSource.value.length; i++) {
          if (data.groupId === dataSource.value[i].groupId) {
            if (data.gender !== dataSource.value[i].gender) {
              abcWoMen = dataSource.value[i];
            }
          }
        }
      } else {
        for (let i = 0; i < dataSourceNumber.value.length; i++) {
          if (data.groupId === dataSourceNumber.value[i].groupId) {
            if (data.gender !== dataSourceNumber.value[i].gender) {
              abcWoMen = dataSourceNumber.value[i];
            }
          }
        }
      }

      const number = JSON.stringify(abcWoMen);
      const number1 = JSON.parse(number);
      data.elsePeople = number1;
      isMileageMessage1.value = props.isMileageMessage;
      addOrUpdate.value = '编辑';
      whoClick.value = data.gender;
      specialTargetUpdataList.data = data;
      showVisible.value = true;
    };

    const delate = (data: any) => {
      const titleVnode = getModalHeadVNode(
        '是否确认删除特殊跑步限制与目标设置'
      );
      Modal.confirm({
        title: titleVnode,
        class: 'modal-class',
        async onOk() {
          try {
            await SchoolRunAstrictTargetSettingsServicePresenter.delateSpecialLimitGoalsInfo(
              { groupId: data.groupId }
            );
            try {
              await getSpecialLimitGoalsInfo(requestData);
            } catch (error) {
              console.log(error);
              Modal.error({
                title: '切换失败',
                content: `${error.message}`
              });
            } finally {
              loadingMileage.value = false;
              loadingNumber.value = false;
            }
            message.success('删除成功');
          } catch (error) {
            console.log(error, 'error');
            message.error('删除失败');
          }
        },
        onCancel() {
          console.log('cancel');
        }
      });
    };

    const query = async () => {
      //查询按钮

      formState.scoringType = requestData.scoringType;
      if (formState.schoolYear === undefined) {
        requestData.schoolYear = 0;
      } else {
        requestData.schoolYear = formState.schoolYear;
      }
      if (formState.collegeId === undefined) {
        requestData.collegeId = '';
      } else {
        requestData.collegeId = formState.collegeId;
      }
      if (formState.semester === undefined) {
        requestData.semester = 0;
      } else {
        requestData.semester = formState.semester;
      }
      try {
        await getSpecialLimitGoalsInfo(requestData);
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '切换失败',
          content: `${error.message}`
        });
      } finally {
        loadingMileage.value = false;
        loadingNumber.value = false;
      }
    };

    const reset = () => {
      formState.schoolYear = undefined;
      formState.collegeId = undefined;
      formState.semester = undefined;
    };

    return {
      columnsMileage,
      columnsNumber,
      dataSource,
      dataSourceNumber,
      showVisible,
      addTarget,
      changeVisible,
      addSuccess,
      whoClick,
      update,
      delate,
      isMileageMessage1,
      formState,
      collegeList,
      query,
      reset,
      specialTargetUpdataList,
      addOrUpdate,
      loadingMileage,
      loadingNumber
    };
  }
});
</script>
<style lang="less" scoped>
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
.special_btn {
  margin: 20px 0;
  .add-special-btn {
    margin-bottom: 20px;
  }
}
.form-allBtn {
  margin-top: 15px;
  .form-allBtn-query {
    margin-right: 20px;
  }
}
.update {
  display: flex;
  justify-content: space-around;
  .delate {
    color: #eb3f2f;
  }
}
</style>
