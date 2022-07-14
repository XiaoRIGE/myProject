<template>
  <div v-if="totalNum > 0" class="content">
    <div class="button-group">
      <a-space :size="16">
        <a-button type="primary" @click="showModal">
          新增学生
        </a-button>
        <a-button :loading="exportLoading" @click="handleDownload">
          导出本班学生
        </a-button>
        <a-button @click="handleDeleteAll">
          删除全部学生
        </a-button>
      </a-space>
    </div>
    <div class="table-box">
      <!-- :scroll="{ y: 920 }" -->
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :pagination="false"
        row-key="id"
      >
        <template #name="{ text }">
          <span>{{ text }}</span>
        </template>
        <template #operation="{ record }">
          <a class="warn-text" @click="handleDelete(record.id)">删除</a>
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
      <span>该班级还没有学生选课，快去添加吧</span>
    </template>
    <a-button type="primary" @click="showModal">
      +&emsp;添加学生
    </a-button>
  </a-empty>
  <a-modal
    v-model:visible="visible"
    :mask-closable="false"
    :keyboard="false"
    title="请填写学生信息"
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
      <a-form-item label="学生名称" v-bind="validateInfos.studentName">
        <a-select
          v-model:value="projectForm.studentName"
          show-search
          placeholder="请输入学生姓名或学号"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="fetching ? undefined : '暂无数据'"
          allow-clear
          @search="handleSearch"
        >
          <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
          <a-select-option v-for="d in studentSelectListData" :key="d.id">
            {{ d.name }}
            {{ d.studentNum }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  reactive,
  watch,
  createVNode,
  computed
} from 'vue';
import { Modal, message } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import { ClassServices } from '@/request/api/model/course';
import {
  BaseCourseServicePresenter,
  ClassServicePresenter
} from '@/request/api/presenter/course';
import { useRoute } from 'vue-router';
import { debounced, getModalHeadVNode } from '@/utils/common';
import { useStore } from 'vuex';

interface DataItem {
  courseId: string;
  courseName: string;
  id: string;
  name: string | null;
  number: string;
  sex: string;
  userId: string;
  year: number;
}

interface StudentInfo {
  id: string;
  name: string;
  studentNum: string;
}

let isRepeat = false;

// 列表数据以及相关操作
const useTableModule = (
  courseId: any,
  pageSize: Ref<number>,
  current: Ref<number>,
  totalNum: Ref<number>
) => {
  const columns = [
    {
      title: '姓名',
      width: 100,
      dataIndex: 'name'
    },
    {
      title: '学号',
      width: 100,
      dataIndex: 'number'
    },
    {
      title: '性别',
      width: 100,
      dataIndex: 'sexStr'
    },
    {
      title: '年级',
      width: 100,
      dataIndex: 'year'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 100,
      slots: { customRender: 'operation' }
    }
  ];
  const dataSource: Ref<DataItem[]> = ref([]);

  const getStudentList = async () => {
    const params = {
      courseId,
      size: pageSize.value,
      page: current.value
    };
    try {
      const data = await ClassServicePresenter.getStudentList(params);
      dataSource.value = data.items;
      totalNum.value = data.total;
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (id: string) => {
    const params = { id };
    try {
      await ClassServicePresenter.delStudent(params);
      message.success('删除成功！');
      getStudentList();
    } catch (e) {
      console.log(e);
      Modal.error({
        title: '删除失败',
        content: e?.message
      });
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确认要删除该学生吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        onDelete(id);
      }
    });
  };
  return {
    columns,
    dataSource,
    handleDelete,
    getStudentList
  };
};

// 弹窗数据以及相关操作
const useDialogModule = (
  projectForm: any,
  getStudentList: any,
  courseId: any
) => {
  const validatePass = async (rule: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入学生姓名');
    } else {
      if (isRepeat) {
        return Promise.reject('该课程下已存在该学生，请勿重复添加');
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
  const loading = ref<boolean>(false);
  const visible = ref<boolean>(false);
  const studentSelectListData: Ref<StudentInfo[]> = ref([]);

  const fetching = ref<boolean>(false);

  const getStudentListByCourse = debounced(async (query: string) => {
    const params = {
      courseId,
      query
    };
    try {
      fetching.value = true;
      const data = await BaseCourseServicePresenter.getStudentList(params);

      studentSelectListData.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      fetching.value = false;
    }
  }, 800);

  const handleCancel = () => {
    resetFields();
    studentSelectListData.value = [];
    visible.value = false;
  };

  const store = useStore();
  const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

  // 新增已经在其他班级的学生
  const addExisetedStudent = async () => {
    const params = {
      courseId,
      userId: projectForm.studentName,
      semesterId: currentSemester.value.id
    };
    try {
      await ClassServicePresenter.addExistedStudent(params);
      message.success('新增成功！');
      getStudentList();
      handleCancel();
    } catch (error) {
      console.log(error);
      Modal.error({
        title: '添加失败',
        content: error?.message
      });
    } finally {
      visible.value = false;
    }
  };

  // 二次弹窗-选择学生已存在该学期某个班级中
  const existClassInfoModal = (str: string) => {
    const temparr = str.split('@');
    const titleVnode = getModalHeadVNode('注意！！！');
    const text1 = createVNode('text', {}, '该学员在本学期已分配班级：');
    const text2 = createVNode('p', {}, '是否继续将该学生添加到当前班级');

    const VNodeArr = temparr.map(item => {
      return createVNode('p', { style: { margin: '10px 0 10px' } }, item);
    });
    const contentVNode = createVNode('div', {}, [text1, ...VNodeArr, text2]);
    Modal.confirm({
      title: titleVnode,
      content: contentVNode,
      okText: '确定',
      cancelText: '取消',
      class: 'modal-class',
      onOk() {
        addExisetedStudent();
      }
    });
  };

  // const addStudent = async() => {
  //   const params = {
  //     courseId,
  //     userId: projectForm.studentName
  //   };
  //   try {
  //     await ClassServicePresenter.addStudent(params);
  //     message.success('新增成功！');
  //       handleCancel();
  //       getStudentList();
  //   } catch (e) {
  //     console.log(e);
  //     if (e?.code === 40002) {
  //       isRepeat = true;
  //       validate();
  //     }
  //     // 该学生在本学期已经分配班级
  //     else if (e.code === 40018) {
  //       existClassInfoModal(e.message);
  //     } else {
  //       Modal.error({
  //         title: '添加失败',
  //         content: exports?.message
  //       });
  //     }
  //   }finally{
  //     loading.value = false;
  //   }
  // };

  const handleSearch = (val: string) => {
    if (!val) return;
    getStudentListByCourse(val);
  };

  const showModal = () => {
    visible.value = true;
  };

  // 往班级添加学生
  const addStudentByClass = async () => {
    loading.value = true;
    const params = {
      courseId,
      userId: projectForm.studentName,
      semesterId: currentSemester.value.id
    };
    try {
      await ClassServicePresenter.addStudent(params);
      message.success('新增成功！');
      getStudentList();
      handleCancel();
      // visible.value = false;
      // studentSelectListData.value = [];
    } catch (error) {
      // 该学生已经在这个班级
      if (error.code === 40002) {
        isRepeat = true;
        validate();
      }
      // 该学生在本学期已经分配班级
      else if (error.code === 40018) {
        existClassInfoModal(error.message);
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
      loading.value = true;
      // addStudent();
      addStudentByClass();
    });
  };

  return {
    rulesRef,
    validate,
    studentSelectListData,
    validateInfos,
    loading,
    visible,
    fetching,
    showModal,
    handleCancel,
    resetFields,
    handleOk,
    handleSearch
  };
};

export default defineComponent({
  setup() {
    const projectForm = reactive({
      studentName: undefined
    });

    const route = useRoute();
    const courseId: any = route?.query?.id || '';

    const pageSize = ref(100);
    const current = ref(1);
    const totalNum = ref(0);

    const {
      columns,
      dataSource,
      handleDelete,
      getStudentList
    } = useTableModule(courseId, pageSize, current, totalNum);

    const {
      visible,
      loading,
      studentSelectListData,
      fetching,
      showModal,
      handleOk,
      handleCancel,
      handleSearch,
      validateInfos
    } = useDialogModule(projectForm, getStudentList, courseId);

    getStudentList();

    watch(
      () => pageSize.value,
      () => {
        getStudentList();
      }
    );
    watch(
      () => current.value,
      () => {
        getStudentList();
      }
    );

    watch(
      () => projectForm.studentName,
      () => {
        isRepeat = false;
      }
    );

    const exportLoading = ref(false);

    const handleDownload = async () => {
      exportLoading.value = true;
      try {
        await ClassServices.exportStudentByClass({ courseId });
      } catch (error) {
        console.log(error);
      } finally {
        exportLoading.value = false;
      }
    };

    // 删除班级所有学生
    const deleteAllStudent = async () => {
      const params = {
        courseId
      };
      try {
        await ClassServicePresenter.delAllStudent(params);
        getStudentList();
      } catch (error) {
        Modal.error({
          title: '删除失败',
          content: error?.message
        });
      }
    };

    const handleDeleteAll = () => {
      const titleVnode = getModalHeadVNode('注意！！！');
      const text = createVNode('text', {}, '确认要删除班级中所有学生吗？');
      Modal.confirm({
        title: titleVnode,
        content: text,
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk() {
          deleteAllStudent();
        }
      });
    };

    return {
      columns,
      dataSource,
      visible,
      studentSelectListData,
      showModal,
      loading,
      projectForm,
      handleDelete,
      pageSize,
      current,
      totalNum,
      fetching,
      handleDownload,
      handleOk,
      handleSearch,
      handleCancel,
      validateInfos,
      exportLoading,
      handleDeleteAll
    };
  }
});
</script>

<style lang="less" scoped>
.content {
  background: #fff;
  // padding: 24px 24px 0 24px;
  padding: 24px;
  margin: 24px;
  .button-group {
    margin-bottom: 24px;
  }
}
.nodata {
  margin-top: 90px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
