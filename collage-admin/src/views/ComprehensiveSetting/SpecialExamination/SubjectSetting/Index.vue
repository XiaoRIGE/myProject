<template>
  <div class="content">
    <div class="search-box">
      <a-form :model="formState" layout="inline" label-align="left">
        <a-form-item label="科目">
          <a-input
            v-model:value="formState.subjectName"
            placeholder="请输入科目名称"
          />
        </a-form-item>
        <a-form-item label="项目">
          <a-select
            v-model:value="formState.projectId"
            placeholder="请选择"
            @change="loadFirstPage"
          >
            <a-select-option value="">
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
        <a-form-item label="测试类型">
          <a-select
            v-model:value="formState.testType"
            placeholder="请选择"
            @change="loadFirstPage"
          >
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in testTypeList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
          <a-space :size="16">
            <a-button type="primary" @click="handleSearch">
              搜索
            </a-button>
            <a-button @click="handleReset">
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <div class="button-group">
        <a-space :size="16">
          <a-button type="primary" @click="showModal">
            新建科目
          </a-button>

          <import-file
            :show-file-dialog="showFileDialog"
            :import-service="importService"
            :export-err="downloadErrTemplate"
            :import-service-params="importServiceParams"
            @importExcelSuccess="importExcelSuccess"
          >
            <a-button @click="showFileDialog = true">
              批量导入
            </a-button>
          </import-file>

          <a-button :loading="templateLoading" @click="handleDownload">
            下载科目模板
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="table">
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :pagination="false"
        :loading="tableLoading"
        row-key="id"
      >
        <template #subjectType="{ record }">
          {{ record.subjectType?.description }}
        </template>
        <template #ratingType="{ record }">
          {{ record.ratingType?.description }}
        </template>
        <template #scoringStandard="{ record }">
          <span v-if="record.subjectRatingRule.length === 1">
            统一标准
          </span>
          <span v-if="record.subjectRatingRule.length === 2">
            性别双标准
          </span>
        </template>
        <template #operation="{ record }">
          <a-space :size="32">
            <a @click="handleEdit(record)">编辑</a>
            <a-popconfirm
              v-if="!record.deleteFlag"
              title="该科目正在被专项考试使用，暂时不可删除。"
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
        v-model:current="current"
        v-model:pageSize="pageSize"
        :show-total="total => `共计 ${total} 条数据`"
        class="pagination"
        :total="totalNum"
      />
    </div>
  </div>
  <AddSubjectModal
    :visible="showModalRef"
    :edit-data="editData"
    @close="handleClose"
    @refresh-list="handleRefresh"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, Ref, watch } from 'vue';
import { useStore } from 'vuex';
import AddSubjectModal from './AddSubjectModal/Index.vue';
import { useForm } from '@ant-design-vue/use';
import { getModalHeadVNode, deepCopy } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import { SubjectPresenter } from '@/request/api/presenter/examination';
import { SubjectService } from '@/request/api/model/examination';
// 查询表单
interface FormState {
  projectId: string;
  subjectName: string;
  testType: string | null;
}
// 测试规则数据格式
interface subjectRatingRule {
  id?: string;
  value: string;
  grade: number;
}
// 编辑数据
interface EditData {
  dataGroupType: string;
  dataGroupTypeName: string;
  id: string;
  projectId: string;
  projectName: string;
  ratingType: string;
  ratingTypeName: string;
  subjectType: string;
  subjectTypeName: string;
  title: string;
  subjectRatingRule: Array<subjectRatingRule[]>;
}
export default defineComponent({
  components: { AddSubjectModal },
  setup() {
    // 查询条件
    const formState: FormState = reactive({
      projectId: '',
      subjectName: '',
      testType: ''
    });

    const totalNum = ref<number>(0);
    const current = ref<number>(1);
    const pageSize = ref<number>(10);
    const dataSource = ref<any[]>([]);
    const tableLoading = ref<boolean>(false);

    const { resetFields } = useForm(formState, {});

    // 获取table列表
    const handleSearch = async () => {
      const params = {
        page: current.value,
        size: pageSize.value,
        projectId: formState.projectId,
        subjectType: formState.testType,
        title: formState.subjectName
      };
      try {
        tableLoading.value = true;
        const data = await SubjectPresenter.getList(params);
        dataSource.value = data.items;
        totalNum.value = data.total;
      } catch (error) {
        console.log(error);
      } finally {
        tableLoading.value = false;
      }
    };

    handleSearch();

    watch(
      () => current.value,
      () => {
        handleSearch();
      }
    );

    const loadFirstPage = () => {
      current.value = 1;
      // 获取列表
      handleSearch();
    };

    // 重置表单
    const handleReset = () => {
      resetFields();
      loadFirstPage();
    };

    // 获取store数据
    const getStoreInfo = () => {
      const store = useStore();
      const projectList = computed(() => store.state.basic.projectList);
      const testTypeList = computed(() => store.state.basic.testTypeList); //测试类型列表
      const scoringTypeList = computed(() => store.state.basic.scoringTypeList); //计分方式列表
      const scoringStandardList = computed(
        () => store.state.basic.scoringStandardList
      ); //计分标准列表

      const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

      store.dispatch('basic/updateProjectList');
      return {
        projectList,
        testTypeList,
        scoringTypeList,
        scoringStandardList,
        currentSemester
      };
    };

    const {
      projectList,
      testTypeList,
      scoringTypeList,
      scoringStandardList
    } = getStoreInfo();

    // 新增/编辑弹窗modal
    const showModalRef = ref<boolean>(false);

    // 编辑空数据
    const defaultData = {
      id: '',
      projectId: '',
      projectName: '',
      title: '',
      subjectType: '',
      ratingType: '',
      dataGroupType: '',
      description: '',
      subjectRatingRule: []
    };

    //编辑数据
    const editData: Ref<any> = ref(deepCopy(defaultData));

    // 打开弹窗
    const showModal = () => {
      editData.value = deepCopy(defaultData);
      showModalRef.value = true;
    };
    // 关闭弹窗
    const handleClose = () => {
      editData.value = deepCopy(defaultData);
      showModalRef.value = false;
    };

    // 新增/编辑成功回调
    const handleRefresh = () => {
      handleClose();
      handleSearch();
    };

    // 点击编辑
    const handleEdit = (record: any) => {
      showModal();
      editData.value = record;
    };

    const deleteItem = async (id: string) => {
      const params = {
        id
      };
      try {
        await SubjectPresenter.delete(params);
        message.success('科目删除成功！');
        handleSearch();
      } catch (error) {
        Modal.error({
          title: '删除失败',
          content: error?.message
        });
      }
    };

    // 点击删除
    const handleDelete = (record: string) => {
      const titleVnode = getModalHeadVNode('删除');
      Modal.confirm({
        title: titleVnode,
        content: '确认要删除科目吗？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        onOk() {
          deleteItem(record);
        }
      });
    };

    // 导入文件弹窗
    const showFileDialog = ref<boolean>(false);
    // 导入接口
    const importService = SubjectService.importTemplate;
    // 下载错误数据接口
    const downloadErrTemplate = SubjectService.getErrFile;
    // 导入接口参数
    const importServiceParams = {};
    // 导入成功回调
    const importExcelSuccess = () => {
      handleSearch();
    };

    // 导入loading
    // const importPopoverVisible = ref<boolean>(false);

    // 导出loading
    const templateLoading = ref<boolean>(false);
    const handleDownload = async () => {
      templateLoading.value = true;
      try {
        await SubjectService.getTemplate();
      } catch (error) {
        console.log(error);
      } finally {
        templateLoading.value = false;
      }
    };

    return {
      showModalRef,
      showModal,
      handleClose,

      // importPopoverVisible,
      templateLoading,
      showFileDialog,
      importService,
      downloadErrTemplate,
      importServiceParams,
      importExcelSuccess,
      handleDownload,

      projectList,
      testTypeList,
      scoringTypeList,
      scoringStandardList,
      formState,
      handleReset,
      handleSearch,
      loadFirstPage,
      handleRefresh,

      dataSource,
      columns: [
        {
          title: '科目名称',
          dataIndex: 'title'
        },
        {
          title: '所属项目',
          dataIndex: 'projectName'
        },
        {
          title: '测试类型',
          dataIndex: 'subjectTypeName'
        },
        {
          title: '计分方式',
          dataIndex: 'ratingTypeName'
        },
        {
          title: '计分规则',
          dataIndex: 'dataGroupTypeName'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          slots: { customRender: 'operation' }
        }
      ],
      tableLoading,
      totalNum,
      current,
      pageSize,
      editData,
      handleEdit,
      handleDelete
    };
  }
});
</script>

<style lang="less" scoped>
.search-box {
  background: #fff;
  margin: 24px;
  padding: 24px;
  .button-group {
    margin-top: 24px;
  }
}
.table {
  margin: 24px;
  background: #fff;
  padding: 24px 32px;
  border-radius: 4px;
}
:deep(.ant-form-item-control-wrapper) {
  width: 190px;
}
</style>
