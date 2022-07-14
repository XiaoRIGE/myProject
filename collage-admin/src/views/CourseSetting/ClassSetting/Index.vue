<template>
  <div v-if="totalNum > 0 || isNotInit">
    <!-- search dom -->
    <div class="search-box">
      <!-- button-group -->
      <div class="button-group">
        <a-space :size="16">
          <a-button type="primary" @click="showModal">
            新增班级
          </a-button>
          <a-popover
            v-model:visible="exportPopoverVisible"
            trigger="click"
            placement="bottom"
          >
            <template #content>
              <div class="cursor btn-item" @click="handleDownload('class')">
                下载班级模板
              </div>
              <div class="cursor btn-item" @click="handleDownload('student')">
                下载学生模板
              </div>
            </template>
            <a-button
              :loading="templateLoading"
              @click="exportPopoverVisible = true"
            >
              下载标准模板
            </a-button>
          </a-popover>

          <import-file
            :show-file-dialog="showFileDialog"
            :import-service="importService"
            :export-err="downloadErrTemplate"
            :import-service-params="importServiceParams"
            @importExcelSuccess="importExcelSuccess"
          >
            <a-popover
              v-model:visible="importPopoverVisible"
              trigger="click"
              placement="bottom"
              :get-popup-container="
                triggerNode => {
                  return triggerNode.parentNode || document.body;
                }
              "
            >
              <template #content>
                <div class="cursor btn-item" @click="handleImport('class')">
                  导入班级模板
                </div>
                <div class="cursor btn-item" @click="handleImport('student')">
                  导入学生模板
                </div>
                <div
                  class="cursor btn-item"
                  @click="handleImport('repairList')"
                >
                  导入重修学生名单
                </div>
              </template>
              <a-button
                type="primary"
                @click.stop="importPopoverVisible = true"
              >
                批量导入
              </a-button>
            </a-popover>
          </import-file>

          <a-button :loading="classListLoading" @click="exportClassList">
            导出班级列表
          </a-button>

          <a-button :loading="studentLoading" @click="exportStudentList">
            导出学生列表
          </a-button>
        </a-space>
      </div>

      <a-form :model="formState" layout="inline" label-align="left">
        <a-form-item label="项目">
          <a-select
            v-model:value="formState.projectName"
            placeholder="请选择"
            @change="loadFirstPage"
          >
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in projectList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="年级">
          <a-select
            v-model:value="formState.grade"
            placeholder="请选择"
            @change="loadFirstPage"
          >
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in gradeList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="星期">
          <a-select v-model:value="formState.week" @change="loadFirstPage">
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option value="1">
              周一
            </a-select-option>
            <a-select-option value="2">
              周二
            </a-select-option>
            <a-select-option value="3">
              周三
            </a-select-option>
            <a-select-option value="4">
              周四
            </a-select-option>
            <a-select-option value="5">
              周五
            </a-select-option>
            <a-select-option value="6">
              周六
            </a-select-option>
            <a-select-option value="7">
              周日
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="上课时间">
          <!-- show-time -->
          <a-range-picker
            v-model:value="formState.lessonTime"
            type="date"
            :placeholder="['开始日期', '结束日期']"
            @change="loadFirstPage"
          />
        </a-form-item>

        <a-form-item label="校区">
          <a-select
            v-model:value="formState.campus"
            placeholder="请选择"
            @change="loadFirstPage"
          >
            <a-select-option value="0">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in campusList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="任课教师">
          <a-input
            v-model:value="formState.teacher"
            placeholder="请输入"
            @change="loadFirstPage"
          />
        </a-form-item>

        <a-form-item label="创建时间">
          <!-- show-time -->
          <a-range-picker
            v-model:value="formState.createTime"
            type="date"
            :placeholder="['开始日期', '结束日期']"
            @change="loadFirstPage"
          />
        </a-form-item>

        <a-form-item label="课程类型">
          <a-radio-group
            v-model:value="formState.courseType"
            @change="loadFirstPage"
          >
            <a-radio-button value="0">
              全部
            </a-radio-button>
            <a-radio-button value="2">
              固定名单
            </a-radio-button>
            <a-radio-button value="1">
              选课
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-row>
          <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
            <a-space :size="16">
              <a-button type="primary" @click="handleClick">
                搜索
              </a-button>
              <a-button @click="handleReset">
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-row>
      </a-form>
    </div>
    <!-- table dom -->
    <div class="content">
      <!-- y: 600 -->
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :loading="tableLoading"
        :pagination="false"
        row-key="id"
        :scroll="{ x: 2400 }"
      >
        <template #courseSelectionStr="{ text }">
          <div class="ellipsis">
            <a-tooltip :title="text">
              {{ text }}
            </a-tooltip>
          </div>
        </template>
        <template #content="{ text }">
          <div class="ellipsis">
            <a-tooltip :title="text">
              {{ text }}
            </a-tooltip>
          </div>
        </template>
        <template #classTime="{ record }">
          <div v-if="record.timeAllocationName">
            {{ record.timeAllocationName }}
          </div>
          <div v-else>
            <span>{{ moment(record.startTime).format('HH:mm') }}</span>
            至
            <span>{{ moment(record.endTime).format('HH:mm') }}</span>
          </div>
        </template>
        <template #classDate="{ record }">
          <span>{{ moment(record.startDate).format('YYYY-MM-DD') }}</span>
          至
          <span>{{ moment(record.endDate).format('YYYY-MM-DD') }}</span>
        </template>
        <template #chooseTime="{ record }">
          <div v-if="record.registerStartTime">
            <span>
              {{ moment(record.registerStartTime).format('YYYY-MM-DD HH:mm') }}
            </span>
            至
            <span>
              {{ moment(record.registerEndTime).format('YYYY-MM-DD HH:mm') }}
            </span>
          </div>
          <div v-else>
            --
          </div>
        </template>
        <template #maxNum="{ record }">
          <span>{{ record.registeredPeopleNumber }}</span>
          /
          <span>{{ record.limitPeopleNumber }}</span>
        </template>

        <template #createDateTime="{ record }">
          <span>
            {{ moment(record.createDateTime).format('YYYY-MM-DD HH:mm') }}
          </span>
        </template>

        <template #operation="{ record }">
          <a-space :size="32">
            <a @click="handleEdit(record)">编辑</a>
            <a @click="jumpPage(record)">学生名单</a>
            <a-popconfirm
              v-if="record.hasCourse"
              title="该班级有课程分配数据，暂时不可删除。"
              ok-text="我知道了"
              cancel-text="取消"
            >
              <a class="warn-text">删除</a>
            </a-popconfirm>
            <a v-else class="warn-text" @click="handleDelete(record.id)">
              删除
            </a>
          </a-space>
        </template>
      </a-table>
      <a-pagination
        v-if="totalNum > pageSize"
        v-model:current="current"
        v-model:pageSize="pageSize"
        :show-total="total => `共计 ${total} 条数据`"
        class="pagination"
        :total="totalNum"
      />
    </div>
  </div>
  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>您还没添加任何班级，添加后才可以进行班级配置</span>
    </template>
    <a-space :size="32">
      <a-button type="primary" @click="showModal">
        新增班级
      </a-button>
      <import-file
        :show-file-dialog="showFileDialog"
        :import-service="importService"
        :export-err="downloadErrTemplate"
        :import-service-params="importServiceParams"
        @importExcelSuccess="importExcelSuccess"
      >
        <a-popover
          v-model:visible="importPopoverVisible"
          trigger="click"
          placement="bottom"
          :get-popup-container="
            triggerNode => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <template #content>
            <div class="cursor btn-item" @click="handleImport('class')">
              导入班级模板
            </div>
            <div class="cursor btn-item" @click="handleImport('student')">
              导入学生模板
            </div>
            <div class="cursor btn-item" @click="handleImport('repairList')">
              导入重修学生名单
            </div>
          </template>
          <a-button type="primary" @click.stop="importPopoverVisible = true">
            批量导入
          </a-button>
        </a-popover>
      </import-file>
      <a-popover trigger="click">
        <template #content>
          <div class="cursor btn-item" @click="handleDownload('class')">
            下载班级模板
          </div>
          <div class="cursor btn-item" @click="handleDownload('student')">
            下载学生模板
          </div>
        </template>
        <a-button>下载标准模板</a-button>
      </a-popover>
    </a-space>
  </a-empty>
  <!-- form modal -->
  <ClassInfoModal
    :visible="visible"
    :editinfo="currentEditClassInfo"
    @change-visible="changeVisible"
    @refresh-list="handleSearch"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  reactive,
  watch,
  onActivated,
  computed,
  toRaw
} from 'vue';
import { Modal, message } from 'ant-design-vue';
import moment, { Moment } from 'moment';
import { useForm } from '@ant-design-vue/use';
import ClassInfoModal from './ClassInfoModal/Index.vue';
import { ClassServices } from '@/request/api/model/course';
import { ClassServicePresenter } from '@/request/api/presenter/course';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
interface DataItem {
  id: string;
  type: number;
  typeStr: string;
  projectId: string;
  projectName: string;
  year: number;
  teacherName: string;
  weekLabel: string;
  address: string;
  campusId: string;
  campusName: string;
  content: string;
  weekLabelType: number;
  startTime: number;
  startTimeStr: string;
  endTime: number;
  timeAllocationId: number;
  timeAllocationName: number;
  courseSelection: number;
  startDate: number;
  endDate: number;
  registerStartTime: number;
  registerEndTime: number;
  limitPeopleNumber: number;
  registeredPeopleNumber: number;
}
interface FormState {
  projectName: string;
  grade: string;
  week: string;
  campus: string;
  teacher: string;
  courseType: string;
  lessonTime: Array<Moment>;
  createTime: Array<Moment>;
}

const getStoreInfo = () => {
  const store = useStore();
  const projectList = computed(() => store.state.basic.projectList);
  const gradeList = computed(() => store.state.basic.gradeList);
  const campusList = computed(() => store.state.basic.campusList);

  const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

  store.dispatch('basic/updateProjectList');
  store.dispatch('basic/updateGradeList');
  store.dispatch('basic/updateCampusList');
  return {
    projectList,
    gradeList,
    campusList,
    currentSemester
  };
};

// 搜索表单
const useSearchForm = (dataSource: Ref<DataItem[]>, currentSemester: any) => {
  const pageSize = ref(10);
  const current = ref(1);
  const totalNum = ref(0);

  const formState: FormState = reactive({
    courseType: '0',
    projectName: '0',
    grade: '0',
    campus: '0',
    teacher: '',
    week: '0',
    lessonTime: [],
    createTime: []
  });
  const { resetFields } = useForm(formState, reactive({}));
  const tableLoading = ref<boolean>(false);
  const formatParamsAll = (value: string) => {
    return value === '0' ? '' : value;
  };

  const isNotInit = ref<boolean>(false); //标志是否是不带参数查询

  const handleSearch = async () => {
    const type = formatParamsAll(toRaw(formState).courseType);
    const projectId = formatParamsAll(toRaw(formState).projectName);
    const year = formatParamsAll(toRaw(formState).grade);
    const weekLabel = formatParamsAll(toRaw(formState).week);
    const campusId = formatParamsAll(toRaw(formState).campus);

    let startTime = '';
    let endTime = '';
    if (toRaw(formState).lessonTime.length) {
      startTime = moment(toRaw(formState).lessonTime[0]).format('x');
      endTime = moment(toRaw(formState).lessonTime[1]).format('x');
    }
    let createStartTime = '';
    let createEndTime = '';
    if (toRaw(formState).createTime.length) {
      createStartTime = moment(toRaw(formState).createTime[0]).format('x');
      createEndTime = moment(toRaw(formState).createTime[1]).format('x');
    }
    const params = {
      page: current.value,
      size: pageSize.value,
      type,
      projectId,
      year,
      weekLabel,
      campusId,
      teacherName: toRaw(formState).teacher,
      startTime,
      endTime,
      createStartTime,
      createEndTime,
      semesterId: currentSemester.value.id
    };
    tableLoading.value = true;

    // 标志是否是不带参数查询
    if (
      params.type ||
      params.projectId ||
      params.year ||
      params.weekLabel ||
      params.teacherName ||
      params.endTime ||
      params.startTime ||
      params.createStartTime
    ) {
      isNotInit.value = true;
    }

    try {
      const data = await ClassServicePresenter.getList(params);
      dataSource.value = data.items;
      totalNum.value = data.total;
    } catch (error) {
      console.log(error);
    } finally {
      tableLoading.value = false;
    }
  };

  const loadFirstPage = () => {
    current.value = 1;
    handleSearch();
  };

  const handleReset = () => {
    // isNotInit.value = false;
    resetFields();
    // handleSearch();
    loadFirstPage();
  };
  watch(
    () => currentSemester.value.id,
    () => {
      // isNotInit.value = false;
      // handleSearch();
      loadFirstPage();
    }
  );
  const handleClick = () => {
    // isNotInit.value = true;
    // handleSearch();
    loadFirstPage();
  };
  return {
    formState,
    handleReset,
    handleSearch,
    tableLoading,
    isNotInit,
    handleClick,
    loadFirstPage,
    pageSize,
    current,
    totalNum
  };
};

// 列表数据以及相关操作
const useTableModule = () => {
  const columns = [
    {
      title: '校区',
      width: 140,
      fixed: 'left',
      dataIndex: 'campusName',
      ellipsis: true
    },
    {
      title: '项目',
      width: 140,
      dataIndex: 'projectName',
      fixed: 'left',
      ellipsis: true
    },
    {
      title: '年级',
      width: 70,
      dataIndex: 'year'
      // ellipsis: true
    },
    {
      title: '任课教师',
      width: 100,
      dataIndex: 'teacherName',
      ellipsis: true
    },
    {
      title: '星期',
      width: 70,
      dataIndex: 'weekLabel'
    },
    {
      title: '上课时间',
      width: 100,
      dataIndex: 'name',
      slots: { customRender: 'classTime' }
    },
    {
      title: '已选/上限',
      dataIndex: 'limitPeopleNumber',
      width: 100,
      slots: { customRender: 'maxNum' }
    },
    {
      title: '上课类型',
      dataIndex: 'alternateWeekTypeStr',
      width: 100
    },
    {
      title: '上课日期',
      // width: 140,
      dataIndex: 'name',
      slots: { customRender: 'classDate' }
    },
    {
      title: '选课时间',
      // width: 160,
      dataIndex: 'name',
      slots: { customRender: 'chooseTime' }
    },
    {
      title: '上课地点',
      width: 100,
      dataIndex: 'address'
    },
    {
      title: '所属学院',
      // width: 140,
      dataIndex: 'courseSelectionStr',
      slots: { customRender: 'courseSelectionStr' }
    },
    {
      title: '课程类型',
      width: 100,
      dataIndex: 'typeStr',
      // fixed: 'left',
      ellipsis: true
    },
    {
      title: '备注',
      // width: 140,
      dataIndex: 'content',
      slots: { customRender: 'content' }
    },

    {
      title: '创建时间',
      // width: 140,
      slots: { customRender: 'createDateTime' }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 240,
      slots: { customRender: 'operation' }
    }
  ];
  const dataSource: Ref<DataItem[]> = ref([]);
  return {
    columns,
    dataSource
  };
};

// 弹窗数据以及相关操作
const useDialogModule = () => {
  const visible = ref<boolean>(false);
  // 展示弹窗
  const showModal = () => {
    visible.value = true;
  };
  const currentEditClassInfo = reactive({
    data: {
      id: '',
      typeStr: '',
      projectName: '',
      year: 0,
      teacherName: '',
      weekLabel: '',
      startTime: 0,
      endTime: 0,
      address: '',
      courseSelectionStr: '',
      startDate: 0,
      endDate: 0,
      registerStartTime: 0,
      registerEndTime: 0,
      campusName: '',
      content: '',
      limitPeopleNumber: undefined,
      registeredPeopleNumber: 0,
      startTimeStr: ''
    }
  });
  // 编辑班级
  // obj: DataItem
  const handleEdit = (obj: any) => {
    currentEditClassInfo.data = obj;
    showModal();
  };

  return {
    visible,
    showModal,
    handleEdit,
    currentEditClassInfo
  };
};

export default defineComponent({
  components: { ClassInfoModal },
  setup() {
    const { columns, dataSource } = useTableModule();
    const {
      projectList,
      gradeList,
      campusList,
      currentSemester
    } = getStoreInfo();
    const {
      visible,
      showModal,
      handleEdit,
      currentEditClassInfo
    } = useDialogModule();
    const {
      formState,
      handleReset,
      handleSearch,
      loadFirstPage,
      tableLoading,
      isNotInit,
      handleClick,
      pageSize,
      current,
      totalNum
    } = useSearchForm(dataSource, currentSemester);

    const templateLoading: Ref<boolean> = ref(false);
    const importPopoverVisible: Ref<boolean> = ref(false);
    const exportPopoverVisible: Ref<boolean> = ref(false);

    const importService = ref(ClassServices.importCourse);

    const importServiceParams = reactive({
      semesterId: currentSemester.value.id
    });
    const showFileDialog: Ref<boolean> = ref(false);
    const handleImport = (type: string) => {
      if (type === 'class') {
        //导入班级模板方法
        importServiceParams.semesterId = currentSemester.value.id;
        importService.value = ClassServices.importCourse;
      } else if (type === 'student') {
        //导入学生模板方法
        importService.value = ClassServices.importStudent;
      } else if (type === 'repairList') {
        // 导入重修名单
        importService.value = ClassServices.importRepairList;
        console.log('导入重修名单');
      }
      showFileDialog.value = true;
      importPopoverVisible.value = false;
    };

    const importExcelSuccess = async (val: any) => {
      if (val === '导入成功') {
        // await handleSearch();
        await loadFirstPage();
      }
      importServiceParams.semesterId = '';
    };

    const handleDownload = async (type: string) => {
      templateLoading.value = true;
      exportPopoverVisible.value = false;
      const params = {
        semesterId: currentSemester.value.id
      };
      if (type === 'class') {
        try {
          await ClassServices.exportClassTemplate(params);
        } finally {
          templateLoading.value = false;
        }
      } else {
        try {
          await ClassServices.exportStudentTemplate(params);
        } finally {
          templateLoading.value = false;
        }
      }
    };
    const classListLoading: Ref<boolean> = ref(false);
    const exportClassList = async () => {
      classListLoading.value = true;
      const params = {
        semesterId: currentSemester.value.id
      };
      try {
        await ClassServices.exportClassList(params);
      } finally {
        classListLoading.value = false;
      }
    };

    const studentLoading: Ref<boolean> = ref(false);
    const exportStudentList = async () => {
      console.log('导出全校学生', studentLoading.value);
      studentLoading.value = true;
      const params = {
        semesterId: currentSemester.value.id
      };
      try {
        await ClassServices.exportStudentList(params);
      } finally {
        studentLoading.value = false;
      }
    };

    const onDelete = async (id: number) => {
      try {
        await ClassServicePresenter.delete({ id });
        message.success('删除成功！');
        handleSearch();
      } catch (e) {
        console.log(e);
        Modal.error({
          title: '删除失败',
          content: e?.message
        });
      }
    };
    const handleDelete = (id: number) => {
      Modal.confirm({
        title: '确认删除',
        content: '删除后无法恢复，确认要删除该班级吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          onDelete(id);
        }
      });
    };

    watch(
      () => pageSize.value,
      () => {
        handleSearch();
      }
    );
    watch(
      () => current.value,
      () => {
        handleSearch();
      }
    );
    handleSearch();
    onActivated(() => {
      handleSearch();
    });

    const changeVisible = (visibele: boolean) => {
      currentEditClassInfo.data = {
        id: '',
        typeStr: '',
        projectName: '',
        year: 0,
        teacherName: '',
        weekLabel: '',
        startTime: 0,
        endTime: 0,
        address: '',
        courseSelectionStr: '',
        startDate: 0,
        endDate: 0,
        registerStartTime: 0,
        registerEndTime: 0,
        campusName: '',
        content: '',
        limitPeopleNumber: undefined,
        registeredPeopleNumber: 0,
        startTimeStr: ''
      };
      visible.value = visibele;
    };

    const router = useRouter();
    const jumpPage = (obj: DataItem) => {
      const subTitle = `${obj.projectName}-${obj.year}-${obj.teacherName}-${
        obj.weekLabel
      }${obj.startTimeStr || ''}`;
      router.push({
        name: 'studentlist',
        query: { id: obj.id },
        params: { headerSubTitle: subTitle }
      });
    };

    return {
      isNotInit,
      columns,
      handleEdit,
      dataSource,
      currentEditClassInfo,
      visible,
      showModal,
      handleDelete,
      pageSize,
      current,
      formState,
      handleReset,
      handleSearch,
      loadFirstPage,
      handleClick,
      changeVisible,
      handleImport,
      handleDownload,
      exportClassList,
      exportStudentList,
      classListLoading,
      studentLoading,
      templateLoading,
      jumpPage,
      totalNum,
      moment,
      tableLoading,
      projectList,
      gradeList,
      campusList,
      showFileDialog,
      importPopoverVisible,
      exportPopoverVisible,
      importService,
      importServiceParams,
      downloadErrTemplate: ClassServices.downloadErrTemplate,
      importExcelSuccess
    };
  }
});
</script>

<style lang="less" scoped>
.search-box {
  margin: 24px;
  background: #fff;
  padding: 24px 24px 0 24px;
  .button-group {
    margin-bottom: 24px;
  }
}
.content {
  margin: 24px;
  background: #fff;
  padding: 24px 32px;
  border-radius: 4px;
}
.nodata {
  margin-top: 90px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.btn-item {
  line-height: 32px;
  border-bottom: 1px solid #f0f2f5;
  &:nth-last-child(1) {
    border-bottom: none;
  }
}
:deep(.ant-form-item) {
  margin-bottom: 24px !important;
  margin-right: 24px !important;
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
:deep(.ant-table-fixed-left table, .ant-table-fixed-right table) {
  width: min-content;
}
</style>
