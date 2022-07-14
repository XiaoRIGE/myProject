<template>
  <div class="student-class-query-container">
    <!-- 搜索框及学生信息 -->
    <div class="student-info">
      <a-form :model="formState" layout="inline">
        <a-form-item label="学生">
          <a-input-search
            v-model:value="formState.studentNumber"
            placeholder="请输入学生学号"
            @search="onSearch"
          />
        </a-form-item>
      </a-form>
      <a-space v-show="isStudentInfo" :size="24" class="student-info-details">
        <div>
          {{ studentInfo.name }} ({{ studentInfo.sexStr }})
          {{ studentInfo.number }}
        </div>
        <div>年级：{{ studentInfo.year }}级</div>
        <div>学院：{{ studentInfo.organizationName }}</div>
        <div>校区：{{ studentInfo.campusName }}</div>
      </a-space>
    </div>
    <!-- 班级数量提示 -->
    <div v-show="isStudent">
      <a-alert type="info" class="alert-box">
        <template #message>
          <span>
            查询到该学生存在
            <span class="color-blue">{{ total }}</span>
            个班级中
          </span>
        </template>
      </a-alert>
    </div>
    <!-- 班级表格 -->
    <a-config-provider class="table-box">
      <template #renderEmpty>
        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE">
          <template #description>
            <span>{{ emptyText }}</span>
          </template>
        </a-empty>
      </template>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :row-key="record => record.id"
        :pagination="false"
      >
        <template #orderNum="{record}">
          {{ record.orderNum + (current - 1) * 10 }}
        </template>
        <template #operation="{ record }">
          <a-button
            type="link"
            class="btn"
            :class="!currentSemester.current ? 'color-gray' : 'color-blue'"
            :disabled="!currentSemester.current"
            @click="updateHandle(record)"
          >
            变更班级
          </a-button>
          <a-button
            type="link"
            class="btn"
            :class="!currentSemester.current ? 'color-gray' : 'warn-text'"
            :disabled="!currentSemester.current"
            @click="deleteHandle(record.id)"
          >
            移除
          </a-button>
        </template>
      </a-table>
      <a-pagination
        v-show="total"
        v-model:current="current"
        v-model:pageSize="pageSize"
        :show-total="total => `共 ${total} 条`"
        class="pagination"
        :total="total"
      />
    </a-config-provider>
    <!-- 变更班级 -->
    <a-modal
      :visible="showUpdateVisible"
      :mask-closable="false"
      :keyboard="false"
      title="变更班级"
      width="680px"
      centered
      @cancel="cancelUpdate"
    >
      <template #footer>
        <a-button key="back" @click="cancelUpdate">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="submitUpdateHandle">
          保存
        </a-button>
      </template>
      <a-alert
        type="warning"
        style="margin-bottom: 12px;"
        message="变更班级后，新班级的考勤统计将记为满勤"
      />
      <a-form
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 20 }"
        class="update-form"
      >
        <a-form-item label="原班级">
          <span>{{ selectClass.courseName }}</span>
        </a-form-item>
        <a-form-item
          label="新班级"
          required
          v-bind="validateInfos.changeCourseId"
        >
          <a-select
            v-model:value="classFormState.changeCourseId"
            show-search
            :filter-option="filterOption"
            placeholder="请选择"
          >
            <a-select-option
              v-for="item in classOptionList"
              :key="item.id"
              :value="item.id"
              :title="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <span v-show="repeatWarn" class="warn-text repeat-warn">
          {{ warnText }}
        </span>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, computed, watch } from 'vue';
import { MyClassServicePresenter } from '@/request/api/presenter/class';
import { Empty, message, Modal } from 'ant-design-vue';
import { getModalHeadVNode } from '@/utils/common';
import { useStore } from 'vuex';
import { useForm } from '@ant-design-vue/use';

interface StudentInClassItem {
  id: string;
  courseId: string;
  orderNum: number;
  courseName: string;
  signNumberStr: string;
}
interface StudentInfo {
  number: string;
  name: string;
  sexStr: string;
  year: number;
  organizationName: string;
  campusName: string;
  userId: string;
}
interface ClassItem {
  id: string;
  name: string;
}

export default defineComponent({
  setup() {
    const store = useStore();
    const formState = reactive({
      studentNumber: ''
    });
    const classFormState = reactive({
      changeCourseId: ''
    });
    const selectClass = reactive({
      id: '',
      courseName: '',
      courseId: ''
    });
    const isStudentInfo = ref(false);
    const isStudent = ref(false);
    const showUpdateVisible = ref(false);
    const repeatWarn = ref(false);
    const warnText = ref<string>('');
    const loading = ref<boolean>(false);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const total = ref<number>(0);
    const studentInfo: Ref<StudentInfo> = ref({
      number: '',
      name: '',
      sexStr: '',
      year: 0,
      organizationName: '',
      campusName: '',
      userId: ''
    });
    const classOptionList: Ref<ClassItem[]> = ref([]);
    const emptyText = ref<string>('请通过学生学号进行查询');
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息
    const columns = ref([
      {
        title: '序号',
        width: 100,
        dataIndex: 'orderNum',
        fixed: 'left',
        slots: { customRender: 'orderNum' }
      },
      {
        title: '所在班级',
        dataIndex: 'courseName',
        fixed: 'left',
        slots: { customRender: 'courseName' }
      },
      {
        title: '考勤统计',
        dataIndex: 'signNumberStr',
        slots: { customRender: 'signNumberStr' }
      },
      {
        title: '操作',
        slots: { customRender: 'operation' }
      }
    ]);
    const dataSource: Ref<StudentInClassItem[]> = ref([]);

    const rulesRef = reactive({
      changeCourseId: [
        { required: true, message: '请选择新班级', trigger: 'blur' }
      ]
    });
    const { validate, validateInfos } = useForm(classFormState, rulesRef);

    // 初始化
    const initData = (flag: number) => {
      isStudent.value = false;
      isStudentInfo.value = false;
      dataSource.value = [];
      current.value = 1;
      total.value = 0;
      emptyText.value = flag ? '学号不存在' : '请通过学生学号进行查询';
    };

    // 查询学生所在班级列表
    const queryStudentInClassList = async () => {
      loading.value = true;
      const params = {
        page: current.value,
        size: pageSize.value,
        stuNumber: formState.studentNumber,
        semesterId: currentSemester.value.id
      };
      try {
        const res = await MyClassServicePresenter.queryStudentInClassList(
          params
        );
        const {
          name,
          number,
          sexStr,
          year,
          organizationName,
          campusName,
          userId
        } = res;
        studentInfo.value = {
          name,
          number,
          sexStr,
          year,
          organizationName,
          campusName,
          userId
        };
        isStudentInfo.value = true;
        isStudent.value = true;
        if (res.studentClassQueryVOS.length > 0) {
          dataSource.value = res.studentClassQueryVOS;
          total.value = res.total;
        } else {
          dataSource.value = [];
          emptyText.value = '没有找到和该学号相关的班级';
        }
      } catch (err) {
        if (err?.code === 40017) {
          initData(1);
        }
        message.warning(err?.message);
      } finally {
        loading.value = false;
      }
    };

    // 搜索回调
    const onSearch = () => {
      initData(0);
      if (formState.studentNumber !== '') {
        queryStudentInClassList();
      }
    };

    // 删除学生回调
    const onDelete = async (id: string) => {
      const params = { id, semesterId: currentSemester.value.id };
      try {
        await MyClassServicePresenter.delStudentInClass(params);
        message.success('删除成功！');
        queryStudentInClassList();
      } catch (e) {
        console.log(e);
        Modal.error({
          title: '删除失败',
          content: e?.message
        });
      }
    };

    // 确认移除学生二次弹窗
    const deleteHandle = (id: string) => {
      const { name } = studentInfo.value;
      const titleVnode = getModalHeadVNode('移除');
      Modal.confirm({
        title: titleVnode,
        content: `移除后，${name}在该班级中的考勤数据将被清除`,
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk() {
          onDelete(id);
        }
      });
    };

    // 变更班级下拉列表
    const queryStudentInClassAll = async () => {
      const params = {
        semesterId: currentSemester.value.id,
        userId: studentInfo.value.userId,
        courseId: selectClass.courseId
      };
      try {
        const res = await MyClassServicePresenter.queryStudentInClassAll(
          params
        );
        if (res && res.length) {
          classOptionList.value = res;
        } else {
          classOptionList.value = [];
        }
      } catch (e) {
        console.log(e);
      }
    };

    // 过滤班级
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
      return filterFn(input, option, classOptionList.value);
    };

    // 点击变更班级回调
    const updateHandle = (record: StudentInClassItem) => {
      const { courseName, id, courseId } = record;
      showUpdateVisible.value = true;
      repeatWarn.value = false;
      warnText.value = '';
      classFormState.changeCourseId = '';
      selectClass.courseName = courseName;
      selectClass.id = id;
      selectClass.courseId = courseId;
      queryStudentInClassAll();
    };

    // 取消变更
    const cancelUpdate = () => {
      showUpdateVisible.value = false;
    };

    // 提交变更
    const submitUpdateHandle = () => {
      const params = {
        changeCourseId: classFormState.changeCourseId,
        courseId: selectClass.courseId,
        id: selectClass.id,
        semesterId: currentSemester.value.id,
        userId: studentInfo.value.userId
      };
      validate().then(async () => {
        try {
          await MyClassServicePresenter.updateStudentInClass(params);
          showUpdateVisible.value = false;
          repeatWarn.value = false;
          message.success('变更成功');
          queryStudentInClassList();
        } catch (e) {
          if (e?.code === 40002 || e?.code === 40016) {
            repeatWarn.value = true;
          }
          warnText.value = e.message;
          message.error('变更失败，请重试');
        }
      });
    };

    // 切换学期的时候 更新班级下拉列表
    watch(
      () => currentSemester.value,
      () => {
        if (currentSemester.value) {
          onSearch();
        }
      }
    );
    watch(
      () => current.value,
      async () => {
        queryStudentInClassList();
      }
    );

    return {
      formState,
      isStudentInfo,
      isStudent,
      showUpdateVisible,
      repeatWarn,
      warnText,
      columns,
      loading,
      dataSource,
      Empty,
      emptyText,
      pageSize,
      current,
      total,
      studentInfo,
      currentSemester,
      selectClass,
      classOptionList,
      classFormState,
      validateInfos,
      filterOption,
      queryStudentInClassList,
      onSearch,
      deleteHandle,
      updateHandle,
      cancelUpdate,
      submitUpdateHandle
    };
  }
});
</script>

<style lang="less" scoped>
.student-class-query-container {
  background-color: #fff;
  margin: 24px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
  .student-info {
    display: flex;
    margin-bottom: 16px;
    &-details {
      margin-left: 8px;
    }
  }
  .alert-box {
    margin-bottom: 16px;
  }
  .color-gray {
    color: rgba(0, 0, 0, 0.25) !important;
  }
  .btn {
    padding: 0 15px 0 0;
  }
}
.repeat-warn {
  margin-left: 80px;
}
.update-form {
  margin-bottom: 30px;
  :deep(.ant-form-item) {
    margin-bottom: 0px;
  }
}
</style>
