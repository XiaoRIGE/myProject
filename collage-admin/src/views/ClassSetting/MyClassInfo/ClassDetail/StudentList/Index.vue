<template>
  <div class="list-content">
    <div class="operation">
      <a-space :size="24">
        <a-button type="primary" @click="handleShowVisible">
          添加学生
        </a-button>
        <a-button :loading="exportLoading" @click="handleExport">
          导出学生名单
        </a-button>
      </a-space>
      <a-form :model="formState" layout="inline">
        <a-form-item label="学生">
          <a-input-search
            v-model:value="formState.usernameOrNumber"
            placeholder="请输入学生姓名或学号"
            @search="onSearch"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="table-content">
      <div v-if="listData.length">
        <!-- :scroll="{ y: 'calc(100vh - 580px)' }" -->
        <a-table
          :columns="columns"
          :data-source="showData"
          :pagination="false"
          :loading="tableLoading"
          row-key="id"
        >
          <!-- <template #index="{ index }">
            <span>{{ index + 1 }}</span>
          </template> -->
          <template #mobile="{ text }">
            <div>{{ text ? text : '-' }}</div>
          </template>
          <template #name="{ record }">
            <div>{{ record.name }}({{ record.sexStr }})</div>
            <div>{{ record.number }}</div>
          </template>
          <template #operation="{ record }">
            <a class="warn-text" @click="handleRemove(record.id, record.name)">
              移除
            </a>
          </template>
        </a-table>
        <!-- v-if="totalNum > pageSize" -->
        <a-pagination
          v-model:current="current"
          v-model:pageSize="pageSize"
          :show-total="total => `共计 ${filterData.length} 条数据`"
          class="pagination"
          :total="filterData.length"
        />
      </div>

      <a-empty
        v-else
        class="nodata"
        :image-style="{
          height: '74px'
        }"
      >
        <template #description>
          <span>目前没有学生选择或被分配入当前班级</span>
        </template>
      </a-empty>
    </div>
  </div>
  <!-- 添加班级学生弹窗 -->
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
      <a-form-item label="学生信息" v-bind="validateInfos.studentName">
        <a-select
          v-model:value="studentForm.studentName"
          allow-clear
          :show-search="true"
          :show-arrow="false"
          placeholder="请输入学生姓名或学号"
          :filter-option="false"
          :not-found-content="fetching ? undefined : '暂无数据'"
          @search="handleSearch"
        >
          <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
          <a-select-option v-for="d in selectListData" :key="d.id">
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
  reactive,
  ref,
  computed,
  Ref,
  createVNode,
  watch
} from 'vue';
import { Modal, message } from 'ant-design-vue';
import { getModalHeadVNode, debounced } from '@/utils/common';
import { useForm } from '@ant-design-vue/use';
import {
  ClassServicePresenter,
  BaseCourseServicePresenter
} from '@/request/api/presenter/course';
import { ClassServices } from '@/request/api/model/course';
import { useStore } from 'vuex';

// 学生下拉弹窗参数
interface StudentInfo {
  id: string;
  name: string;
  studentNum: string;
}

// 学生列表参数
interface StudentItem {
  campusName: string;
  courseId: string;
  courseName: string;
  id: string;
  name: string;
  number: string;
  organizationName: string;
  sex: string;
  userId: string;
  year: number;
  orderNum: number;
}

let isRepeat = false;

export default defineComponent({
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const formState = reactive({
      usernameOrNumber: ''
    });

    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const totalNum = ref<number>(0);

    const exportLoading = ref<boolean>(false);

    const columns = [
      {
        title: '序号',
        dataIndex: 'orderNum',
        width: 120,
        slots: { customRender: 'orderNum' }
      },
      {
        title: '学生',
        dataIndex: 'name',
        slots: { customRender: 'name' }
      },
      {
        title: '联系方式',
        dataIndex: 'mobile',
        slots: { customRender: 'mobile' }
      },
      {
        title: '年级',
        dataIndex: 'year'
      },
      {
        title: '学院',
        dataIndex: 'organizationName',
        ellipsis: true
      },
      {
        title: '校区',
        dataIndex: 'campusName',
        ellipsis: true
      },
      {
        title: '操作',
        slots: { customRender: 'operation' }
      }
    ];

    // 该班级下所有的学生数据
    const listData = ref<StudentItem[]>([]);

    // 关键词过滤后数据
    const filterData = ref<StudentItem[]>([...listData.value]);

    // table展示数据
    const showData = computed(() => {
      const start = (current.value - 1) * pageSize.value;
      const end = current.value * pageSize.value;
      return filterData.value.slice(start, end);
    });

    const tableLoading = ref<boolean>(false);
    // 获取所有学生列表
    const getStudentList = async () => {
      try {
        const params = {
          courseId: props.courseId
        };
        tableLoading.value = true;
        const data = await ClassServicePresenter.getAllStudent(params);

        if (!data) {
          listData.value = [];
          totalNum.value = 0;
          return;
        }
        listData.value = data;
        totalNum.value = data.length;
      } catch (error) {
        console.log(error);
      } finally {
        tableLoading.value = false;
      }
    };

    // 姓名和学号过滤
    const onSearch = () => {
      current.value = 1;
      filterData.value = listData.value.filter(item => {
        return (
          item.name.indexOf(formState.usernameOrNumber) > -1 ||
          item.number.indexOf(formState.usernameOrNumber) > -1
        );
      });
      console.log('filterData', filterData.value);
    };

    // 学生列表数据改变
    watch(
      () => listData.value,
      () => {
        filterData.value = listData.value.filter(item => {
          return (
            item.name && item.name.indexOf(formState.usernameOrNumber) > -1
          );
        });
      }
    );

    // 切换班级
    watch(
      () => props.courseId,
      () => {
        if (props.courseId) {
          getStudentList();
        } else {
          listData.value = [];
          totalNum.value = 0;
        }
        isRepeat = false;
      },
      {
        immediate: true
      }
    );

    // 移除学生
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

    // 确认移除学生二次弹窗
    const handleRemove = (id: string, name: string) => {
      const titleVnode = getModalHeadVNode('移除');
      Modal.confirm({
        title: titleVnode,
        content: `移除后，${name}将会被移除出当前班级，确认要移除该学生吗？`,
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk() {
          onDelete(id);
        }
      });
    };

    // 班级管理员
    const useCalssAdminInfo = () => {
      const validatePass = async (rule: any, value: string) => {
        if (!value) {
          return Promise.reject('请输入学生姓名');
        } else {
          if (isRepeat) {
            return Promise.reject('该学生已经在本班级中，请勿重复添加！');
          }
          return Promise.resolve();
        }
      };
      const loading = ref<boolean>(false);
      const visible = ref<boolean>(false);
      const selectListData: Ref<StudentInfo[]> = ref([]);

      const studentForm = reactive({
        studentName: undefined
      });

      watch(
        () => studentForm.studentName,
        () => {
          isRepeat = false;
        }
      );

      const rulesRef = reactive({
        studentName: [{ validator: validatePass, trigger: 'change' }]
      });

      const { validate, validateInfos, resetFields } = useForm(
        studentForm,
        rulesRef
      );

      const handleShowVisible = () => {
        visible.value = true;
      };

      const handleCancel = () => {
        selectListData.value = [];
        resetFields();
        visible.value = false;
      };

      const store = useStore();
      const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

      // 新增已经在其他班级的学生
      const addExisetedStudent = async () => {
        const params = {
          courseId: props.courseId,
          userId: (studentForm.studentName as unknown) as string,
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
        const contentVNode = createVNode('div', {}, [
          text1,
          ...VNodeArr,
          text2
        ]);
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

      // 往班级添加学生
      const addStudentByClass = async () => {
        loading.value = true;
        const params = {
          courseId: props.courseId,
          userId: (studentForm.studentName as unknown) as string,
          semesterId: currentSemester.value.id
        };
        try {
          await ClassServicePresenter.addStudent(params);
          message.success('新增成功！');
          getStudentList();
          handleCancel();
          // resetFields();
          // selectListData.value = [];
          // visible.value = false;
        } catch (error) {
          console.log('err', error);

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
          addStudentByClass();
        });
      };

      const fetching = ref<boolean>(false);

      // 查询可以添加的学生-精确查询
      const handleSearch = debounced(async (val: string) => {
        if (!val) return;
        try {
          const params = {
            courseId: 'xx', // 该字段接口未使用 但是必传
            query: val
          };
          fetching.value = true;
          const data = await BaseCourseServicePresenter.getStudentList(params);
          selectListData.value = data;
        } catch (error) {
          console.log(error);
        } finally {
          fetching.value = false;
        }
      }, 800);

      return {
        visible,
        loading,
        selectListData,
        validateInfos,
        studentForm,
        fetching,
        handleShowVisible,
        handleSearch,
        handleOk,
        handleCancel
      };
    };

    const {
      visible,
      loading,
      selectListData,
      validateInfos,
      studentForm,
      fetching,
      handleShowVisible,
      handleOk,
      handleCancel,
      handleSearch
    } = useCalssAdminInfo();

    const handleExport = async () => {
      exportLoading.value = true;
      try {
        await ClassServices.exportStudentByClass({ courseId: props.courseId });
      } catch (error) {
        console.log(error);
      } finally {
        exportLoading.value = false;
      }
    };

    return {
      formState,
      pageSize,
      current,
      totalNum,
      listData,
      showData,
      tableLoading,
      columns,
      fetching,
      onSearch,
      handleRemove,
      visible,
      loading,
      selectListData,
      validateInfos,
      studentForm,
      exportLoading,
      handleShowVisible,
      handleOk,
      handleCancel,
      handleSearch,
      handleExport,
      filterData
    };
  }
});
</script>

<style lang="less" scoped>
.list-content {
  background: #fff;
  padding: 16px;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}
.icon-warn {
  width: 24px;
  height: 24px;
}
</style>
