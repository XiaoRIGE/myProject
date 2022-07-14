<template>
  <div class="search-box">
    <div class="base-info">
      <a-form :model="formState" layout="inline" label-align="left">
        <a-form-item label="班级" class="min-width-350">
          <a-select
            v-model:value="formState.courseId"
            show-search
            :filter-option="filterOption"
            placeholder="请选择"
            @change="handleChange"
          >
            <a-select-option
              v-for="item in classList"
              :key="item.id"
              :value="item.id"
              :title="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 6 }">
          <span v-show="classInfo.registeredPeopleNumber !== 0">
            共{{ classInfo.registeredPeopleNumber }}人
          </span>
          <span v-show="classInfo.registeredPeopleNumber === 0">
            该班级暂无学生
          </span>
        </a-form-item>
        <a-form-item label="上课日期">
          <span v-show="classInfo.classTime === ''">--</span>
          <span v-show="classInfo.classTime !== ''">
            {{ classInfo.classTime }}
          </span>
        </a-form-item>
        <a-form-item>
          <span v-show="classInfo.classStatus === ''">--</span>
          <a-tag
            v-show="classInfo.classStatus !== ''"
            :color="getColor(classInfo.classStatus)"
          >
            {{ classInfo.classStatus }}
          </a-tag>
        </a-form-item>
        <a-form-item label="上课地点">
          <span v-show="classInfo.address === ''">--</span>
          <span v-show="classInfo.address !== ''">{{ classInfo.address }}</span>
        </a-form-item>
        <a-form-item label="课程管理员">
          <a-tooltip
            v-for="(tag, index) in state.tags"
            :key="index"
            placement="top"
          >
            <template #title>
              <span>{{ tag.phone ? tag.phone : '-' }}</span>
            </template>
            <a-tag
              :visible="true"
              closable
              @close="handleDeleteAdmin(tag.id, tag.userName)"
            >
              {{ tag.userName }}
            </a-tag>
          </a-tooltip>
          <a-tag class="tag-btn cursor" @click="handleShowVisible">
            新增课程管理员
          </a-tag>
        </a-form-item>
      </a-form>
    </div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="学生情况">
        <div class="container">
          <StudentList
            v-if="activeKey === '1'"
            :course-id="formState.courseId"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="课程考勤">
        <div class="container">
          <CourseAttendance
            v-if="activeKey === '2'"
            :course-id="formState.courseId"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="跑步情况">
        <div class="container">
          <RunCondition
            v-if="activeKey === '3'"
            :course-id="formState.courseId"
            :course-year="classListYear"
          />
        </div>
      </a-tab-pane>
      <!-- <a-tab-pane key="4" tab="活动参与">
        <div class="container">
          <h1>活动参与</h1>
        </div>
      </a-tab-pane> -->
      <a-tab-pane key="5" tab="AI运动">
        <div class="container">
          <AImovement
            v-if="activeKey === '5'"
            :course-id="formState.courseId"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="6" tab="体质测试" :disabled="disabledPhysical">
        <div class="container">
          <PhysicalTest
            v-if="activeKey === '6'"
            :course-id="formState.courseId"
          />
        </div>
      </a-tab-pane>

      <!-- <a-tab-pane key="8" tab="专项考试">
        <div class="container">
          <h1>专项考试</h1>
        </div>
      </a-tab-pane> -->
      <a-tab-pane key="10" tab="课外活动">
        <div class="container">
          <ActivityAttendance
            v-if="activeKey === '10'"
            :course-id="formState.courseId"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="7" tab="理论考试">
        <div class="container">
          <TheoryExamination
            v-if="activeKey === '7'"
            :course-id="formState.courseId"
          ></TheoryExamination>
        </div>
      </a-tab-pane>
      <a-tab-pane key="9" tab="成绩">
        <div class="container">
          <GradeList v-if="activeKey === '9'" :course-id="formState.courseId" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>

  <!-- 添加班级管理员弹窗 -->
  <a-modal
    v-model:visible="visible"
    :mask-closable="false"
    :keyboard="false"
    title="请填写用户信息"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleOk"
      >
        保存
      </a-button>
    </template>
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="用户姓名" v-bind="validateInfos.studentName">
        <a-select
          v-model:value="projectForm.studentName"
          show-search
          allow-clear
          placeholder="请输入用户姓名"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="fetching ? undefined : '暂无数据'"
          @search="handleSearch"
        >
          <a-select-option v-for="d in studentSelectListData" :key="d.id">
            {{ d.realName }}
            {{ d.mobile }}
            {{ d.identity }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  reactive,
  computed,
  watch,
  onActivated,
  nextTick,
  onMounted
} from 'vue';
import CourseAttendance from './CourseAttendance/Index.vue';
import StudentList from './StudentList/Index.vue';
import RunCondition from './RunCondition/Index.vue';
import PhysicalTest from './PhysicalTest/Index.vue';
import GradeList from './GradeList/Index.vue';
import ActivityAttendance from './ActivityAttendance/Index.vue';
import AImovement from './AImovement/Index.vue';
import TheoryExamination from './TheoryExamination/Index.vue';
import { MyClassServicePresenter } from '@/request/api/presenter/class';
import { UserServicePresenter } from '@/request/api/presenter/login';
import { useForm } from '@ant-design-vue/use';
import { Modal, message } from 'ant-design-vue';
import { debounced, getModalHeadVNode } from '@/utils/common';
import moment from 'moment';
import { useStore } from 'vuex';
import Bus from '@/utils/bus';
interface ClassItem {
  year: number;
  id: string;
  name: string;
  address: string;
  startDate: number;
  endDate: number;
  registeredPeopleNumber: number;
  status: number;
}

enum classStatus {
  '未开始',
  '进行中',
  '已结课'
}
interface StudentInfo {
  id: string;
  realName: string;
  identity: string;
  mobile: string | null;
}

interface GetRoleListParams {
  courseId: string;
}

interface RoleItem {
  id: string;
  userId: string;
  userName: string;
}
let isRepeat = false;
const courseId = ref<string | undefined>('');
const formState = reactive({ courseId });

// 班级管理员信息
const useCalssAdminInfo = () => {
  const loading = ref<boolean>(false);
  const visible = ref<boolean>(false);
  const studentSelectListData = ref<StudentInfo[]>([]);
  const projectForm = reactive({
    studentName: undefined
  });

  watch(
    () => projectForm.studentName,
    () => {
      isRepeat = false;
    }
  );

  const validatePass = async (rule: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入用户姓名');
    } else {
      if (isRepeat) {
        return Promise.reject('该用户已添加为本班管理员');
      }
      return Promise.resolve();
    }
  };

  const rulesRef = reactive({
    studentName: [{ validator: validatePass, trigger: 'change' }]
  });

  const { validate, validateInfos, resetFields } = useForm(
    projectForm,
    rulesRef
  );

  const tags = ref<RoleItem[]>([]);
  const state = reactive({
    tags
  });

  // 获取课程管理员信息
  const getRoleList = async () => {
    try {
      const params = {
        courseId: formState.courseId
      };
      const data = await MyClassServicePresenter.getRoleList(
        (params as unknown) as GetRoleListParams
      );
      state.tags = data;
    } catch (error) {
      console.log(error);
    }
  };

  getRoleList();

  // 删除课程管理员
  const onDelete = async (id: string) => {
    try {
      const params = {
        id
      };
      await MyClassServicePresenter.delRole(params);
      getRoleList();
    } catch (error) {
      console.log(error);
      Modal.error({
        title: '删除失败',
        content: error?.message
      });
    }
  };

  // 重置课程管理atg
  const resetRoleList = () => {
    state.tags = [];
  };

  // 二次弹窗-删除课程管理员
  const handleDeleteAdmin = async (
    removedTagUserId: string,
    userName: string
  ) => {
    const titleVnode = getModalHeadVNode('删除');
    Modal.confirm({
      title: titleVnode,
      content: `删除后，${userName}将不能查看当前班级信息，确定要删除吗？`,
      okText: '确定',
      cancelText: '取消',
      class: 'modal-class',
      onOk() {
        onDelete(removedTagUserId);
      }
    });
  };

  const handleShowVisible = () => {
    studentSelectListData.value = [];
    visible.value = true;
  };

  const handleCancel = () => {
    resetFields();
    visible.value = false;
  };

  // 添加课程管理员
  const AddRole = async () => {
    try {
      loading.value = true;
      const params = {
        courseId: (formState.courseId as unknown) as string,
        userId: (projectForm.studentName as unknown) as string
      };
      await MyClassServicePresenter.addRole(params);
      handleCancel();
      message.success('新增成功！');
      getRoleList();
    } catch (error) {
      if (error.code === 40016) {
        isRepeat = true;
        validate();
      } else {
        Modal.error({
          title: '添加失败',
          content: error?.message
        });
      }
    } finally {
      loading.value = false;
    }
  };

  const handleOk = () => {
    validate().then(() => {
      AddRole();
    });
  };

  const fetching = ref<boolean>(false);

  // 查询用户（添加管理员选人下拉）
  const handleSearch = debounced(async (val: string) => {
    if (!val) return;
    try {
      const params = {
        userName: val
      };
      fetching.value = true;
      const data = await UserServicePresenter.searchUser(params);
      studentSelectListData.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      fetching.value = false;
    }
  }, 500);

  return {
    state,
    visible,
    loading,
    fetching,
    studentSelectListData,
    validateInfos,
    projectForm,
    handleDeleteAdmin,
    handleShowVisible,
    handleSearch,
    handleOk,
    handleCancel,
    getRoleList,
    resetRoleList
  };
};

export default defineComponent({
  components: {
    CourseAttendance,
    StudentList,
    RunCondition,
    PhysicalTest,
    GradeList,
    ActivityAttendance,
    AImovement,
    TheoryExamination
  },
  setup() {
    const activeKey = ref('1');

    const classList: Ref<ClassItem[]> = ref([]);
    const classListYear = ref(0);

    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

    const {
      state,
      visible,
      loading,
      fetching,
      studentSelectListData,
      validateInfos,
      projectForm,
      handleDeleteAdmin,
      handleShowVisible,
      handleOk,
      handleCancel,
      handleSearch,
      getRoleList,
      resetRoleList
    } = useCalssAdminInfo();

    const findValueByKey = (arr: ClassItem[], key: string | undefined) => {
      return arr
        .filter(item => item.id === key)
        .map(item => {
          const startTimeStr = moment(item.startDate).format('YYYY-MM-DD');
          const endTimeStr = moment(item.endDate).format('YYYY-MM-DD');
          return {
            ...item,
            classTime: `${startTimeStr}至${endTimeStr}`,
            classStatus: classStatus[item.status]
          };
        })[0];
    };

    // 当前选择班级信息
    const classInfo = computed(() => {
      if (formState.courseId && classList.value.length) {
        return findValueByKey(classList.value, formState.courseId);
      } else {
        return {
          id: '',
          name: '',
          address: '暂未设置',
          classTime: '',
          classStatus: '未开始',
          registeredPeopleNumber: 0
        };
      }
    });

    // 获取班级下拉列表
    const getClassList = async () => {
      if (!currentSemester.value.id) return;
      try {
        const params = {
          semesterId: currentSemester.value.id
        };
        const data = await MyClassServicePresenter.getList(params);

        if (data && data.length) {
          classList.value = data;
          formState.courseId = classList.value[0].id;
          classListYear.value = classList.value[0].year;
        } else {
          classList.value = [];
          // formState.courseId = undefined;
          formState.courseId = '';
          classListYear.value = 0;

          resetRoleList();
        }
      } catch (error) {
        console.log(error);
      }
    };

    // 切换学期的时候 更新班级下拉列表
    watch(
      () => currentSemester.value,
      () => {
        if (currentSemester.value) {
          getClassList();
        }
      }
    );

    getClassList();

    /**
     * @description: 切换班级
     */
    const handleChange = () => {
      for (const i in classList.value) {
        if (formState.courseId === classList.value[i].id) {
          classListYear.value = classList.value[i].year;
        }
      }
      getRoleList();
    };

    const filterFn = (input: string, option: any, item: ClassItem[]) => {
      const newArry = item.filter((item: ClassItem) => item.id === option.key);
      if (newArry.length) {
        for (const key in newArry) {
          const element = newArry[key];
          return element.name.indexOf(input.toLowerCase()) >= 0;
        }
      }
    };

    // 下拉关键字过滤
    const filterOption = (input: string, option: any) => {
      return filterFn(input, option, classList.value);
    };

    // 开课状态颜色配置
    const getColor = (status: string) => {
      switch (status) {
        case '未开始':
          return '#BBBBBB';
        case '进行中':
          return '#52C41A';
        case '已结课':
          return '#FF4D4F';
        default:
          return '#BBBBBB';
      }
    };

    onActivated(() => {
      const temp = formState.courseId;
      // formState.courseId = undefined;
      formState.courseId = '';
      nextTick(() => {
        formState.courseId = temp;
      });
    });

    // 选择学期不是当前学期的话不能查看体质测试情况
    const disabledPhysical = computed(() => {
      if (currentSemester.value.current === 1) {
        return false;
      }
      return true;
    });

    onMounted(() => {
      // 监听切换全局学期 如果切换学期不是当前学期 不展示体质测试
      Bus.$on('change-sidebar', (data: any) => {
        if (data !== 1) {
          activeKey.value = '1';
        }
      });
    });

    return {
      activeKey,
      formState,
      classList,
      handleChange,
      filterOption,
      classInfo,
      state,
      visible,
      loading,
      fetching,
      studentSelectListData,
      validateInfos,
      projectForm,
      disabledPhysical,
      handleDeleteAdmin,
      handleShowVisible,
      handleOk,
      handleCancel,
      handleSearch,
      getColor,
      classListYear
    };
  }
});
</script>

<style lang="less" scoped>
.search-box {
  margin: 24px;
  .base-info {
    background: #fff;
    padding: 24px 24px 8px 24px;
    .tag-btn {
      background: #fff;
      border-style: dashed;
    }
  }
}
.container {
  padding: 24px 0;
  background: #f0f2f5;
}
:deep(.ant-tabs-bar) {
  border: none;
  margin-bottom: 0;
}
:deep(.ant-tabs-nav-wrap) {
  padding: 0 24px;
  background: #fff;
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
:deep(.min-width-350 .ant-form-item-control-wrapper) {
  min-width: 450px;
}
</style>
