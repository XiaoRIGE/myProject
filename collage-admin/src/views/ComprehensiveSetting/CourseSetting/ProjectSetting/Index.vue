<template>
  <div v-if="totalNum > 0" class="content">
    <a-button type="primary" style="margin-bottom: 24px" @click="showModal">
      +&emsp;新增项目
    </a-button>
    <a-table
      :data-source="dataSource"
      :columns="columns"
      :pagination="false"
      :loading="tableLoading"
      row-key="id"
    >
      <template #name="{ text }">
        <span>{{ text }}</span>
      </template>
      <template #operation="{ record }">
        <a-space :size="32">
          <a @click="handleEdit(record)">编辑</a>

          <a class="warn-text" @click="handleDelete(record.id)">删除</a>
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

  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>您还没添加任何项目，添加后才可以进行课程配置</span>
    </template>
    <a-button type="primary" @click="showModal">
      +&emsp;添加项目
    </a-button>
  </a-empty>
  <!-- form modal -->
  <a-modal
    v-model:visible="visible"
    title="请填写项目信息"
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
      <a-form-item label="项目名称" v-bind="validateInfos.projectName">
        <a-input
          v-model:value="projectForm.projectName"
          :maxlength="30"
          placeholder="请输入"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, reactive, toRaw, watch } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { Modal, message } from 'ant-design-vue';
import { ProjectServicePresenter } from '@/request/api/presenter/course';
import { useStore } from 'vuex';
interface ProjectItem {
  id: string;
  name: string;
}
let isRepeat = false;

// 弹窗数据以及相关操作
const useDialogModule = (projectForm: any) => {
  const validatePass = async (rule: any, value: string) => {
    if (value === '') {
      return Promise.reject('请输入项目名称');
    } else {
      if (isRepeat) {
        return Promise.reject('项目名称不能重复');
      }
      return Promise.resolve();
    }
  };
  const rulesRef = reactive({
    projectName: [{ validator: validatePass, trigger: 'change' }]
  });
  const { validate, validateInfos, resetFields } = useForm(
    projectForm,
    rulesRef
  );
  const loading = ref<boolean>(false);
  const visible = ref<boolean>(false);
  const currentEditId = ref<string>('');
  // 展示弹窗
  const showModal = () => {
    visible.value = true;
    projectForm.projectName = '';
  };
  // 编辑项目
  const handleEdit = (obj: ProjectItem) => {
    showModal();
    projectForm.projectName = obj.name;
    currentEditId.value = obj.id;
  };

  // 取消输入信息
  const handleCancel = () => {
    resetFields();
    visible.value = false;
  };
  return {
    rulesRef,
    validate,
    validateInfos,
    loading,
    visible,
    currentEditId,
    showModal,
    handleEdit,
    handleCancel,
    resetFields
  };
};

export default defineComponent({
  setup() {
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        width: '80%'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        slots: { customRender: 'operation' }
      }
    ];
    const projectForm = reactive({ projectName: '' });
    const dataSource: Ref<ProjectItem[]> = ref([]);
    const tableLoading = ref<boolean>(false);

    const pageSize = ref(10);
    const current = ref(1);
    const totalNum = ref(0);

    const {
      validate,
      validateInfos,
      loading,
      visible,
      currentEditId,
      showModal,
      handleEdit,
      handleCancel,
      resetFields
    } = useDialogModule(projectForm);

    const store = useStore();
    const updateProjectStore = () => {
      store.dispatch('basic/updateProjectList');
    };

    // 获取列表
    const getList = async () => {
      tableLoading.value = true;
      try {
        const res = await ProjectServicePresenter.getList({
          page: current.value,
          size: pageSize.value
        });
        dataSource.value = res.items;
        totalNum.value = res.total;
      } finally {
        tableLoading.value = false;
      }
    };

    const addProject = async () => {
      try {
        await ProjectServicePresenter.add({
          name: toRaw(projectForm).projectName
        });
        message.success('新增成功！');
        resetFields();
        visible.value = false;
        getList();
        updateProjectStore();
      } catch (e) {
        if (e?.code === 40054) {
          isRepeat = true;
          validate();
        }
      } finally {
        loading.value = false;
      }
    };

    const updateProject = async () => {
      const params = {
        id: currentEditId.value,
        name: toRaw(projectForm).projectName
      };
      try {
        await ProjectServicePresenter.update(params);
        message.success('修改成功！');
        resetFields();
        currentEditId.value = '';
        visible.value = false;
        getList();
        updateProjectStore();
      } catch (e) {
        if (e?.code === 40002) {
          isRepeat = true;
          validate();
        }
      } finally {
        loading.value = false;
      }
    };

    const deleteProject = async (id: string) => {
      try {
        await ProjectServicePresenter.delete({ id });
        message.success('删除成功！');
        getList();
        updateProjectStore();
      } catch (e) {
        Modal.error({
          title: '删除失败',
          content: e?.message
        });
      }
    };
    const handleDelete = (id: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '确认要删除该条项目吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          deleteProject(id);
        }
      });
    };
    const handleOk = () => {
      validate().then(() => {
        loading.value = true;
        if (currentEditId.value !== '') {
          updateProject();
        } else {
          addProject();
        }
      });
    };
    getList();
    watch(
      () => projectForm.projectName,
      () => {
        projectForm.projectName = projectForm.projectName.replace('(', '（');
        projectForm.projectName = projectForm.projectName.replace(')', '）');
        projectForm.projectName = projectForm.projectName.replace(
          /[^a-zA-Z0-9\u4e00-\u9fa5（）]/,
          ''
        );
        isRepeat = false;
      }
    );
    watch(
      () => pageSize.value,
      () => {
        getList();
      }
    );
    watch(
      () => current.value,
      () => {
        getList();
      }
    );
    return {
      columns,
      tableLoading,
      handleEdit,
      dataSource,
      loading,
      visible,
      showModal,
      handleOk,
      handleCancel,
      validateInfos,
      projectForm,
      handleDelete,
      pageSize,
      current,
      totalNum
    };
  }
});
</script>

<style lang="less" scoped>
.content {
  background: #fff;
  padding: 24px 32px;
  border-radius: 4px;
  margin: 24px;
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
