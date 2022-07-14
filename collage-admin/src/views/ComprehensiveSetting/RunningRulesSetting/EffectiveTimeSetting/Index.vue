<template>
  <div class="wrapper">
    <div v-if="schoolList && schoolList.length">
      <div>
        <a-radio-group v-model:value="campusRadio" button-style="solid">
          <a-radio-button
            v-for="item in schoolList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-radio-button>
        </a-radio-group>
        <p class="explain">
          特殊说明：仅是APP时间设置的限制；以及跑步数据计入的日期限制；
        </p>
      </div>
      <!-- 校区跑步时间配置 -->
      <div class="campus-setting">
        <div class="campus-setting-header">
          <div class="left">
            <p class="header">校区跑步时间限制：{{ isSameAllCampusText }}</p>
          </div>
          <div class="right">
            <span class="color-blue cursor" @click="handleSwitch">
              切换为{{ isNotSameAllCampusText }}
            </span>
          </div>
        </div>
        <div class="campus-setting-table">
          <a-table
            :columns="runTimeColumns"
            row-key="id"
            :data-source="data"
            bordered
            :pagination="false"
          >
            <template #operation="{ record }">
              <a-space :size="32">
                <a @click="addTarget('timeSet', true, record)">编辑</a>
                <a class="warn-text" @click="handleClear(record)">清除</a>
              </a-space>
            </template>
            <template #effectiveTime="{ record }">
              <div v-for="(item, index) in record.effectiveTime" :key="index">
                {{ item }}
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <!-- 特殊名单 -->
      <div class="white-list">
        <div class="white-list-header">
          <p class="header">
            特殊跑步时间限制
          </p>
        </div>
        <div class="add-special">
          <a-button
            class="add-special-btn"
            type="primary"
            @click="addTarget('specialSet', false)"
          >
            添加特殊跑步时间限制
          </a-button>

          <a-form layout="inline" :model="formState">
            <a-form-item label="学院名称">
              <a-select
                v-model:value="formState.collegeName"
                allow-clear
                placeholder="请选择院系"
              >
                <a-select-option
                  v-for="(item, index) in collegeList"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="学期">
              <a-select
                v-model:value="formState.semester"
                allow-clear
                placeholder="全部"
              >
                <a-select-option value="">
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
                v-model:value="formState.year"
                allow-clear
                placeholder="全部"
              >
                <a-select-option value="">
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
                <a-button
                  class="form-allBtn-query"
                  type="primary"
                  @click="loadFirstPage"
                >
                  查询
                </a-button>
                <a-button @click="resetFields">
                  重置
                </a-button>
              </a-form-item>
            </a-row>
          </a-form>
        </div>
        <div class="white-list-table">
          <a-table
            :columns="whiteListColumns"
            :data-source="SpecialData"
            :pagination="false"
            row-key="id"
            bordered
          >
            <template #effectiveTime="{ record }">
              <div v-for="(item, index) in record.effectiveTime" :key="index">
                {{ item }}
              </div>
            </template>
            <template #operation="{ record }">
              <a-space :size="32">
                <a @click="addTarget('specialSet', true, record)">编辑</a>
                <a class="warn-text" @click="handleDelete(record)">删除</a>
              </a-space>
            </template>
          </a-table>
          <a-pagination
            v-model:current="current"
            v-model:pageSize="pageSize"
            :show-total="total => `共计 ${total} 条数据`"
            class="pagination"
            :total="totalNum"
          />
        </div>
      </div>
    </div>
    <a-empty
      v-else
      :image-style="{
        height: '74px'
      }"
    >
      <template #description>
        <span>暂时没有校区信息，请先创建校区</span>
      </template>
    </a-empty>

    <RunTimeAstrictDialog
      :dialog-type="dialogType"
      :is-edit-dialog="isEditDialog"
      :visible="RunTimeVisible"
      :campus-id="campusRadio"
      :default-info="defaultInfo"
      @change-visible-false="changeVisible"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  h,
  computed,
  reactive,
  watch,
  provide
} from 'vue';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import RunTimeAstrictDialog from './RunTimeAstrictDialog/Index.vue';
import { message, Modal } from 'ant-design-vue';
import { RunSettingRulePresenter } from '@/request/api/presenter/runSettings';
import { UserControlStudentServicePresenter } from '@/request/api/presenter/userControl';
import { useForm } from '@ant-design-vue/use';
import { getModalHeadVNode, getStorageData } from '@/utils/common';
import moment from 'moment';
interface SchoolItem {
  name: string;
  id: string;
  organizationId: string;
}
const data = ref<any[]>([]); //校区跑步时间限制
const SpecialData = ref<any[]>([]); //校区特殊跑步时间限制

const useCampusInfo = () => {
  const campusRadio = ref<string>(''); //当前选择校区
  const schoolList = ref<SchoolItem[]>([]);

  // 获取校区列表
  const getCampusList = async () => {
    const { data } = await CampusServicePresenter.queryAllCampus('abc');
    const schoolRes = data.data;
    schoolList.value = schoolRes;
    if (schoolRes && schoolRes.length) {
      campusRadio.value = schoolRes[0].id;
    }
  };

  getCampusList();
  return {
    campusRadio,
    schoolList
  };
};

export default defineComponent({
  components: {
    RunTimeAstrictDialog
  },
  setup() {
    const formState = reactive({
      collegeName: undefined,
      semester: '',
      year: ''
    });
    const { resetFields } = useForm(formState, {});

    const RunTimeVisible = ref<boolean>(false); //编辑弹窗
    const dialogType = ref<string>(''); //弹窗类型 编辑校区跑步时间 timeSet  特殊跑步时间限制 specialSet
    const isEditDialog = ref<boolean>(false); //弹窗 是否为编辑弹窗

    const isSameAllCampus = ref<boolean>(true); //是否全校一致

    const collegeList = ref<any[]>([]); //学院下拉列表

    const pageSize = ref(10);
    const current = ref(1);
    const totalNum = ref(0);

    const isSameAllCampusText = computed(() => {
      return isSameAllCampus.value ? '全校一致' : '全校不同';
    });

    const isNotSameAllCampusText = computed(() => {
      return isSameAllCampus.value ? '全校不同' : '全校一致';
    });

    const { campusRadio, schoolList } = useCampusInfo();

    // 获取院系
    const getDepartment = async () => {
      const orgId = getStorageData('userInfo', 'schoolId');

      try {
        const {
          data
        } = await UserControlStudentServicePresenter.queryallOrganization(
          orgId
        );
        collegeList.value = data.data;
        // 默认查询第一个学院
        // formState.collegeName = collegeList.value[0].id
      } catch (error) {
        console.log(error);
      }
    };

    getDepartment();

    //向子组件注入collegeList
    provide('collegeList', collegeList);

    // 获取校区跑步时间限制
    const getRunningRule = async () => {
      try {
        const result = await RunSettingRulePresenter.getRunningRule({
          campusId: campusRadio.value
        });
        isSameAllCampus.value = result.type === 1;
        data.value = result.runningTimeRuleVOList;
      } catch (error) {
        console.log(error);
      }
    };

    // 获取特殊跑步时间限制
    const getSpecialRunningRule = async () => {
      try {
        const params = {
          campusId: campusRadio.value,
          index: formState.semester,
          organizationId: (formState.collegeName as unknown) as string,
          schoolYear: formState.year,
          page: current.value,
          size: pageSize.value
        };
        const result = await RunSettingRulePresenter.getSpecialRunningRule(
          params
        );
        SpecialData.value = result.items;
        totalNum.value = result.total;
      } catch (error) {
        console.log('error', error);
      }
    };

    const loadFirstPage = () => {
      current.value = 1;
      getSpecialRunningRule();
    };

    // 切换学院 自动查询
    // watch(
    //   () => formState.collegeName,
    //   () => {
    //     getSpecialRunningRule();
    //   }
    // );

    watch(
      () => pageSize.value,
      () => {
        getSpecialRunningRule();
      }
    );

    watch(
      () => current.value,
      () => {
        getSpecialRunningRule();
      }
    );

    // 切换校区 查询跑步时间限制 和特殊跑步时间限制
    watch(
      () => campusRadio.value,
      () => {
        getRunningRule();
        // getSpecialRunningRule();
        loadFirstPage();
      }
    );

    // 切换全校一致
    const switchRunningRule = async () => {
      try {
        const params = {
          campusId: campusRadio.value
        };
        await RunSettingRulePresenter.switchRunningRule(params);
        getRunningRule();
      } catch (error) {
        console.log(error);
      }
    };

    const handleSwitch = () => {
      Modal.confirm({
        title: '是否确认切换校区跑步时间限制',
        content: '切换后原配置会保存',
        okText: '切换',
        onOk() {
          switchRunningRule();
        }
      });
    };

    const baseColumns: any[] = [
      {
        title: '学期',
        dataIndex: 'semester'
      },
      {
        title: '跑步日期',
        dataIndex: 'runDate'
      },
      {
        title: '有效时段',
        dataIndex: 'effectiveTime',
        slots: { customRender: 'effectiveTime' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        slots: { customRender: 'operation' }
      }
    ];

    const runTimeColumns: any[] = [
      {
        title: '学年',
        dataIndex: 'year',
        customRender: ({ text, index }: { text: string; index: number }) => {
          //单行合并2个 双行设置为0
          if (index % 2 === 0 || index === 0) {
            return {
              children: h('span', {}, text),
              props: {
                rowSpan: 2
              }
            };
          }
          return {
            children: h('span', {}, text),
            props: {
              rowSpan: 0
            }
          };
        }
      },
      ...baseColumns
    ];
    const whiteListColumns: any[] = [
      {
        title: '学院',
        dataIndex: 'school'
      },
      {
        title: '学年',
        dataIndex: 'year'
      },
      ...baseColumns
    ];
    const changeVisible = (visibele: boolean) => {
      RunTimeVisible.value = visibele;
    };

    // 更新列表 关闭弹窗
    const handleRefresh = (type: string) => {
      RunTimeVisible.value = false;
      if (type === 'refreshTable') {
        getRunningRule();
      } else if (type === 'refreshSpecialTable') {
        getSpecialRunningRule();
      }
    };

    // 编辑时回显数据
    const defaultInfo = reactive({
      yearStr: '',
      semesterStr: '',
      id: '',
      yearVal: undefined,
      semesterVal: undefined,
      schoolIdArr: [], //应用院系id
      runDate: [], //跑步日期
      effectiveTimeVal: [] //有效时段数据-接口使用
    });

    /**
     * @description: 打开编辑/添加弹窗
     * @param {string} type 校区/特殊限制
     * @param {boolean} isEdit 是否是编辑
     */
    const addTarget = (type: string, isEdit: boolean, record: any) => {
      dialogType.value = type;
      RunTimeVisible.value = true;
      isEditDialog.value = isEdit;
      // 编辑校区时间限制
      if (type === 'timeSet') {
        const { year, semester, id, runDate, effectiveTimeVal } = record;
        defaultInfo.yearStr = year;
        defaultInfo.semesterStr = semester;
        defaultInfo.id = id;
        defaultInfo.runDate =
          runDate !== '- -'
            ? runDate.split('~').map((item: any) => moment(item))
            : [];
        defaultInfo.effectiveTimeVal = effectiveTimeVal; //接口使用
      }
      // 编辑特殊跑步时间限制
      if (type === 'specialSet' && isEdit) {
        const {
          yearVal,
          semesterVal,
          id,
          schoolIdArr,
          runDate,
          effectiveTimeVal
        } = record;
        defaultInfo.id = id;
        defaultInfo.yearVal = yearVal;
        defaultInfo.semesterVal = semesterVal;
        defaultInfo.schoolIdArr = schoolIdArr;
        defaultInfo.runDate =
          runDate !== '- -'
            ? runDate.split('~').map((item: any) => moment(item))
            : [];
        defaultInfo.effectiveTimeVal = effectiveTimeVal; //接口使用
      }
    };

    // 清除清除有效跑步时间限制接口
    const onDelete = async (id: string) => {
      try {
        await RunSettingRulePresenter.clearRunningRule({ id });
        message.success('清除成功');
        getRunningRule();
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '清除失败',
          content: error?.message
        });
      }
    };

    /**
     * @description: 清除有效跑步时间限制
     */
    const handleClear = (record: any) => {
      const titleVnode = getModalHeadVNode('清除');
      Modal.confirm({
        title: titleVnode,
        content: '确认要清除该跑步时间限制吗？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk() {
          onDelete(record.id);
        }
      });
    };

    /**
     * @description: 删除有效跑步时间限制接口
     */
    const onDeleteSpecialTime = async (id: string) => {
      try {
        await RunSettingRulePresenter.deleteRunningRule({ groupId: id });
        message.success('删除成功');
        getSpecialRunningRule();
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '删除失败',
          content: error?.message
        });
      }
    };

    /**
     * @description: 删除有效跑步时间限制
     */
    const handleDelete = async (record: any) => {
      const titleVnode = getModalHeadVNode('删除');
      Modal.confirm({
        title: titleVnode,
        content: '确认要删除该特殊跑步时间限制吗？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk() {
          onDeleteSpecialTime(record.id);
        }
      });
    };
    return {
      pageSize,
      current,
      totalNum,
      collegeList,
      campusRadio,
      schoolList,
      isSameAllCampusText,
      isNotSameAllCampusText,
      resetFields,
      handleSwitch,
      runTimeColumns,
      whiteListColumns,
      data,
      SpecialData,
      formState,
      RunTimeVisible,
      dialogType,
      defaultInfo,
      isEditDialog,
      changeVisible,
      addTarget,
      handleClear,
      handleDelete,
      handleRefresh,
      getSpecialRunningRule,
      loadFirstPage
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
.wrapper {
  background: #fff;
  margin: 24px;
  padding: 16px;
  .explain {
    margin: 24px 0;
  }
  .campus-setting {
    margin-bottom: 32px;
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgb(126, 126, 126);
      margin-bottom: 16px;
      .header {
        font-weight: 600;
        font-size: 18px;
      }
    }
  }
  .white-list {
    &-header {
      border-bottom: 1px solid rgb(126, 126, 126);
      margin-bottom: 16px;
      .header {
        font-weight: 600;
        font-size: 18px;
      }
    }
  }
  .add-special {
    padding-left: 15px;
    margin-bottom: 20px;
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
}
</style>
