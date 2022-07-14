<!--
 * @Author: lyh
 * @Date: 2021-07-23 09:37:17
 * @LastEditTime: 2022-01-10 11:06:36
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理 教师
 * @FilePath: \collage-admin\src\views\ComprehensiveSetting\UserManage\TeacherUser\Index.vue
-->
<template>
  <div v-if="showTeacher" class="test-wrap">
    <div class="headerAllBtn">
      <div class="button-group">
        <a-space :size="16">
          <a-button type="primary" @click="showModal">
            新增教师
          </a-button>
          <ImoortFile
            :show-file-dialog="showFileDialog"
            :import-service="batchImport"
            :export-err="exportErr"
            :import-service-params="teacherImportData"
            @importExcelSuccess="importExcelSuccess"
          >
            <a-button @click="bulkImport">
              批量导入
            </a-button>
          </ImoortFile>
          <a-button type="primary" @click="exportExcel">
            下载标准表格
          </a-button>
          <a-button @click="exportList">
            导出名单
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="headerAllInput">
      <a-form layout="inline" label-align="left" :model="formState">
        <a-form-item label="教师信息">
          <a-input
            v-model:value="formState.studentMessage"
            placeholder="请输入教师姓名"
            enter-button
            allow-clear
          />
        </a-form-item>

        <a-form-item label="联系电话">
          <a-input
            v-model:value="formState.telephone"
            placeholder="请输入教师电话号码"
            enter-button
            allow-clear
          />
        </a-form-item>

        <a-row>
          <a-form-item
            :wrapper-col="{ span: 4, offset: 0 }"
            style="margin-top:20px"
          >
            <a-space :size="16">
              <a-button type="primary" @click="handleSearch">
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
    </div>
    <div class="bodyTable">
      <!-- table dom -->
      <div class="content">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          row-key="id"
          :pagination="dataSource.length > 10"
        >
          <template #ifState="{ text }">
            <a v-if="text === 2" class="activated">
              已激活
            </a>
            <a v-if="text === 1" class="inactive">
              未激活
            </a>
            <a v-if="text === 0" class="lock">
              已锁定
            </a>
          </template>
          <template #action="{record}">
            <a class="update" @click="upDateStudentUser(record)">编辑</a>
            <a class="delate" @click="delateStudentUser(record)">删除</a>
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
  </div>

  <!-- 没有任何老师时显示 -->
  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>您还没添加任何教师</span>
    </template>
    <a-space :size="32">
      <a-button type="primary" @click="showModal">
        新增教师
      </a-button>
      <a-button type="primary" @click="exportList">
        下载标准表格
      </a-button>
      <ImoortFile
        :show-file-dialog="showFileDialog"
        :import-service="batchImport"
        :export-err="exportErr"
        :import-service-params="teacherImportData"
        @importExcelSuccess="importExcelSuccess"
      >
        <a-button type="primary" @click="bulkImport">
          批量导入
        </a-button>
      </ImoortFile>
    </a-space>
  </a-empty>

  <a-modal
    :visible="showUpdateVisible"
    :mask-closable="false"
    :keyboard="false"
    title="修改教师信息"
    width="680px"
    centered
    @cancel="cancelUpdate"
  >
    <template #footer>
      <a-button key="back" @click="cancelUpdate">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        保存
      </a-button>
    </template>
    <!-- layout="inline" -->
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
      <a-row>
        <a-form-item
          label="教师姓名"
          v-bind="validateInfos.teacherName"
          required
        >
          <a-input
            v-model:value="updateForm.teacherName"
            allow-clear
            :maxlength="30"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model:value="updateForm.resource">
            <a-radio value="1">
              男
            </a-radio>
            <a-radio value="2">
              女
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="联系电话">
          <p style="margin-left:5px">
            {{ updateForm.mobile }}
            <span
              style="margin-left:10px;cursor:pointer"
              @click="phoneShow(updateForm.id)"
            >
              显示
            </span>
          </p>
        </a-form-item>

        <a-form-item label="状态">
          <div v-if="updateForm.ifState === 1">
            <span>账号未激活</span>
          </div>
          <div v-if="updateForm.ifState === 2">
            <span style="color:green;margin-right:5px;font-size:16px"></span>
            <span>账号已激活</span>
          </div>
          <div v-if="updateForm.ifState === 0">
            <span style="color:red">账号已锁定</span>
            <div style="float:right">
              <a-button>点击解锁</a-button>
            </div>
          </div>
        </a-form-item>
      </a-row>
    </a-form>
  </a-modal>

  <!-- 查看老师联系电话dialog -->
  <a-modal
    :visible="nowUserPasswordVisible"
    :mask-closable="false"
    :keyboard="false"
    title="请输入当前用户登陆密码"
    width="580px"
    centered
    @cancel="nowUserPasswordCancel"
  >
    <template #footer>
      <a-button key="back" @click="nowUserPasswordCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="nowUserPasswordSave">
        确定
      </a-button>
    </template>
    <!-- layout="inline" -->
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
      <a-row>
        <a-form-item label="用户名">
          <p style="margin-left:5px">
            {{ updateForm.teacherName }}
          </p>
        </a-form-item>
        <a-form-item label="账号密码">
          <a-input
            v-model:value="accountPassword"
            allow-clear
            :maxlength="30"
            placeholder="请输入"
          />
        </a-form-item>
      </a-row>
    </a-form>
  </a-modal>

  <ManageInfoTable
    :visible="visible"
    who-father-value="教师"
    @change-visible="changeVisible"
    @create-teacher="createTeacherData"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref, watch } from 'vue';
import ManageInfoTable from '../ManageInfoTable/index.vue';
import { message, Modal } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import UserControlTeacherServicePresenter, {
  UserControlTeacherInfoType
} from '@/request/api/presenter/userControl';
import { UserControlTeacherServiceModel } from '@/request/api/model/userControl';
import { GetUserMobilePresenter } from '@/request/api/presenter/login';
import ImoortFile from '@/components/global/ImportFile.vue';
import { getModalHeadVNode } from '@/utils/common';

//表格数据
const useTableModule = () => {
  const columns = [
    {
      title: '教师姓名',
      dataIndex: 'realName',
      key: 'realName'
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: '状态',
      dataIndex: 'ifState',
      key: 'id',
      slots: { customRender: 'ifState' }
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      slots: { customRender: 'action' }
    }
  ];
  const dataSource: Ref<UserControlTeacherInfoType[]> = ref([]);

  return {
    columns,
    dataSource
  };
};

// 弹窗数据以及相关操作
const useDialogModule = () => {
  const visible = ref<boolean>(false);
  const nowUserPasswordVisible = ref<boolean>(false);
  const teacherId = ref('');

  // 展示弹窗
  const showModal = () => {
    visible.value = true;
  };
  // 显示联系电话弹窗
  const phoneShow = (data: any) => {
    teacherId.value = data;
    nowUserPasswordVisible.value = true;
  };

  //重置学生message确定
  const resetStudent = () => {
    message.success('重置成功');
  };
  const lockStudent = () => {
    message.success('锁定成功');
  };

  return {
    visible,
    showModal,
    nowUserPasswordVisible,
    phoneShow,
    teacherId,
    resetStudent,
    lockStudent
  };
};

export default defineComponent({
  components: { ManageInfoTable, ImoortFile },
  setup() {
    const showFileDialog: Ref<boolean> = ref(false);
    const showUpdateVisible = ref<boolean>(false);
    const showTeacher = ref<boolean>(true);
    const showTeacherNum = ref<number>(0);
    const totalNum = ref(0);
    const pageSize = ref(10);
    const current = ref(1);
    const accountPassword = ref('');
    const teacherImportData = reactive({
      organizationId: ''
    });
    const loading = ref<boolean>(false);
    const { columns, dataSource } = useTableModule();
    const {
      visible,
      showModal,
      nowUserPasswordVisible,
      phoneShow,
      resetStudent,
      lockStudent,
      teacherId
    } = useDialogModule();
    const formState = reactive({
      studentMessage: '',
      telephone: ''
    });
    const updateForm = reactive({
      id: '',
      teacherName: '',
      teacherNumber: '',
      resource: '1',
      mobile: '1',
      ifState: 0
    });
    const rulesRef = reactive({
      teacherName: [
        { required: true, message: '请输入教师姓名', trigger: 'blur' }
      ]
    });
    const { validate, validateInfos } = useForm(updateForm, rulesRef);

    //请求教师用户列表
    const queryTeacherList = async function queryTeacherList(): Promise<void> {
      loading.value = true;
      try {
        const res = await UserControlTeacherServicePresenter.getUserTeacherList(
          {
            page: current.value,
            size: pageSize.value,
            searchCondition: formState.studentMessage,
            mobile: formState.telephone,
            year: null,
            organizationId: null
          }
        );
        //根据是否手动查询判断显示数据还是无记录
        if (res.total === 0) {
          //如果条数为0显示空状态
          if (showTeacherNum.value === 0) {
            showTeacher.value = false;
          }
        }
        // else {
        //   //如果条数不为零并且数据为空 总页数减一
        //   if (res.items.length === 0) {
        //     current.value = current.value - 1;
        //   }
        // }
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
      queryTeacherList();
    };

    onMounted(async () => {
      queryTeacherList();
    });
    watch(
      () => pageSize.value,
      async () => {
        queryTeacherList();
      }
    );
    watch(
      () => current.value,
      async () => {
        queryTeacherList();
      }
    );

    const handleSearch = async () => {
      //查询
      showTeacherNum.value = 1;
      // queryTeacherList();
      loadFirstPage();
    };

    // 编辑班级
    const upDateStudentUser = (obj: UserControlTeacherInfoType) => {
      obj.gender === '男'
        ? (updateForm.resource = '1')
        : (updateForm.resource = '2');
      showUpdateVisible.value = true;
      updateForm.teacherName = obj.realName;
      updateForm.mobile = obj.mobile;
      updateForm.id = obj.id;
      updateForm.ifState = obj.ifState;
    };

    const cancelUpdate = () => {
      showUpdateVisible.value = false;
    };

    const handleOk = () => {
      //保存按钮
      validate()
        .then(async () => {
          try {
            await UserControlTeacherServicePresenter.updateTeacher({
              id: updateForm.id,
              realName: updateForm.teacherName,
              gender: parseInt(updateForm.resource)
            });
            queryTeacherList();
            showUpdateVisible.value = false;
            message.success('更新成功');
          } catch (error) {
            Modal.error({
              title: '更新失败',
              content: `${error.message}`
            });
          }
        })
        .catch((err: any) => {
          console.log('error', err);
        });
    };

    const delateStudentUser = (record: any) => {
      const titleVnode = getModalHeadVNode('删除教师信息');
      Modal.confirm({
        title: titleVnode,
        content: `删除后无法恢复，确认要删除${record.realName}吗？`,
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          showTeacherNum.value = 0;
          try {
            await UserControlTeacherServiceModel.deleteSTeacher(record.id);
            queryTeacherList();
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    const nowUserPasswordSave = async () => {
      //查看教师电话弹窗确认
      try {
        const resdata = await GetUserMobilePresenter.getUserMobile({
          password: accountPassword.value,
          userId: teacherId.value
        });
        if (resdata === null) {
          message.error('密码错误');
          return;
        } else {
          updateForm.mobile = resdata;
        }
        nowUserPasswordVisible.value = false;
        accountPassword.value = '';
      } catch (error) {
        message.error('密码错误');
        console.log(error);
      }
    };

    const nowUserPasswordCancel = () => {
      //查看教师电话取消按钮
      nowUserPasswordVisible.value = false;
      accountPassword.value = '';
    };

    const createTeacherData = async () => {
      // await queryTeacherList();
      await loadFirstPage();
      showTeacher.value = true;
    };

    //导出excel
    const exportExcel = async () => {
      try {
        await UserControlTeacherServiceModel.exportTeacherExcelTemplate();
      } catch (error) {
        message.error('下载失败');
      }
    };

    const importExcelSuccess = async (val: any) => {
      if (val === '导入成功') {
        // await queryTeacherList();
        loadFirstPage();
      }
    };

    //导出名单
    const exportList = async () => {
      const data = {
        parentOrganizationId: ''
      };
      try {
        await UserControlTeacherServiceModel.batchExportTeacher(data);
      } catch (error) {
        message.error('导出失败');
      }
    };

    const resetForm = () => {
      formState.studentMessage = '';
      formState.telephone = '';
      handleSearch();
    };

    const changeVisible = (visibele: boolean) => {
      visible.value = visibele;
    };

    const bulkImport = () => {
      showFileDialog.value = true;
    };

    return {
      columns,
      current,
      exportExcel,
      exportList,
      pageSize,
      totalNum,
      dataSource,
      createTeacherData,
      nowUserPasswordSave,
      formState,
      resetForm,
      importExcelSuccess,
      delateStudentUser,
      showTeacher,
      showTeacherNum,
      updateForm,
      useDialogModule,
      resetStudent,
      lockStudent,
      handleOk,
      nowUserPasswordVisible,
      handleSearch,
      phoneShow,
      nowUserPasswordCancel,
      cancelUpdate,
      validateInfos,
      visible,
      showUpdateVisible,
      rulesRef,
      showModal,
      changeVisible,
      upDateStudentUser,
      teacherImportData,
      accountPassword,
      batchImport: UserControlTeacherServiceModel.batchImportTeacher,
      exportErr: UserControlTeacherServiceModel.exportTeacherErr,
      showFileDialog,
      bulkImport,
      loading
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
:deep(.ant-pagination) {
  margin-top: 20px;
  text-align: right;
}
.test-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}
.headerAllBtn {
  margin-bottom: 24px;
}
.headerAllBtn button {
  margin-right: 18px;
}
.headerAllInput {
  margin-bottom: 24px;
}
.delate {
  margin-left: 24px;
  color: #ff4d4f;
}
.reset {
  margin-right: 10px;
  color: black;
  font-weight: bold;
}
.lock {
  color: black;
}
.nodata {
  margin-top: 90px;
}
.activated {
  color: rgba(0, 0, 0, 0.65);
}
.inactive {
  color: #faad14;
}
.lock {
  color: #ff4d4f;
}
</style>
