<!--
 * @Author: lyh
 * @Date: 2021-08-31 15:34:30
 * @LastEditTime: 2021-10-15 14:08:03
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理 管理员
 * @FilePath: \collage-admin\src\views\ComprehensiveSetting\UserManage\ManageUser\Index.vue
-->
<template>
  <div v-if="showManager" class="test-wrap">
    <div class="headerAllBtn">
      <div class="button-group">
        <a-space :size="16">
          <a-button type="primary" @click="showModal">
            新增管理员
          </a-button>
          <a-button @click="exportList">
            导出名单
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="headerAllInput">
      <a-form layout="inline" label-align="left" :model="formState">
        <a-form-item label="管理员信息">
          <a-input
            v-model:value="formState.adminMessage"
            placeholder="请输入管理员姓名"
            enter-button
            allow-clear
          />
        </a-form-item>

        <a-form-item label="联系电话">
          <a-input
            v-model:value="formState.telephone"
            placeholder="请输入管理员电话号码"
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

  <!-- 没有任何管理员时显示 -->
  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>您还没添加任何管理员</span>
    </template>
    <a-space :size="32">
      <a-button type="primary" @click="showModal">
        新增管理员
      </a-button>
    </a-space>
  </a-empty>

  <!-- 修改信息dialog -->
  <a-modal
    :visible="showUpdateVisible"
    :mask-closable="false"
    :keyboard="false"
    title="修改管理员信息"
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
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-row>
        <a-form-item
          label="管理员姓名"
          v-bind="validateInfos.adminName"
          required
        >
          <a-input
            v-model:value="updateForm.adminName"
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
            {{ updateForm.telephone }}
            <span
              style="margin-left:10px;cursor:pointer"
              @click="phoneShow(updateForm.id)"
            >
              显示
            </span>
          </p>
        </a-form-item>

        <a-form-item label="状态">
          <!-- todo -->
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

  <!-- 查看管理员联系电话dialog -->
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
            {{ updateForm.adminName }}
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
    who-father-value="管理员"
    @change-visible="changeVisible"
    @create-manager="createManagerData"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref, watch } from 'vue';
import ManageInfoTable from '../ManageInfoTable/index.vue';
import { message, Modal } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import { UserControlManageServicePresenter } from '@/request/api/presenter/userControl';
import { GetUserMobilePresenter } from '@/request/api/presenter/login';
import { getModalHeadVNode } from '@/utils/common';

interface DataItem {
  id: string;
  organizationUserNumber: null;
  realName: string;
  gender: number | string;
  organizationId: string;
  organizationName: string;
  parentOrganizationId: null;
  campusId: null;
  campusName: null;
  birthDay: null;
  year: null;
  mobile: string;
  lockStatus: number;
  organizationVerified: number;
}

//表格数据
const useTableModule = () => {
  const columns = [
    {
      title: '管理员姓名',
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
  const dataSource: Ref<DataItem[]> = ref([]);

  return {
    columns,
    dataSource
  };
};

// 弹窗数据以及相关操作
const useDialogModule = () => {
  const visible = ref<boolean>(false);
  const nowUserPasswordVisible = ref<boolean>(false);
  const manageId = ref('');
  // 展示弹窗
  const showModal = () => {
    visible.value = true;
  };
  // 显示联系电话弹窗
  const phoneShow = (data: any) => {
    manageId.value = data;
    nowUserPasswordVisible.value = true;
  };
  const nowUserPasswordCancel = () => {
    nowUserPasswordVisible.value = false;
  };
  //重置管理员message确定
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
    resetStudent,
    lockStudent,
    nowUserPasswordCancel,
    manageId
  };
};

export default defineComponent({
  components: { ManageInfoTable },
  setup() {
    const showUpdateVisible = ref<boolean>(false);
    const showManager = ref<boolean>(true);
    const showManagerNum = ref<number>(0);
    const accountPassword = ref('');
    const loading = ref<boolean>(false);
    const { columns, dataSource } = useTableModule();
    const {
      visible,
      showModal,
      nowUserPasswordVisible,
      phoneShow,
      resetStudent,
      lockStudent,
      nowUserPasswordCancel,
      manageId
    } = useDialogModule();
    const totalNum = ref(0);
    const pageSize = ref(10);
    const current = ref(1);
    const formState = reactive({
      adminMessage: '',
      telephone: ''
    });
    const updateForm = reactive({
      adminName: '',
      adminNumber: '',
      resource: '1',
      telephone: '1',
      id: '',
      ifState: 0,
      faceUrl: ''
    });
    const rulesRef = reactive({
      adminName: [
        { required: true, message: '请输入管理员姓名', trigger: 'blur' }
      ]
    });
    const { validate, validateInfos } = useForm(updateForm, rulesRef);

    //请请管理员列表
    const queryManageList = async function queryManageList(): Promise<void> {
      loading.value = true;
      const queryManageData = {
        page: current.value,
        size: pageSize.value,
        searchCondition: formState.adminMessage,
        mobile: formState.telephone,
        year: null,
        organizationId: null
      };
      try {
        const res = await UserControlManageServicePresenter.getUserManageList(
          queryManageData
        );
        //根据是否手动查询判断显示数据还是无记录
        if (res.total === 0) {
          //如果条数为0显示空状态
          if (showManagerNum.value === 0) {
            showManager.value = false;
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
      queryManageList();
    };

    onMounted(async () => {
      queryManageList();
    });
    watch(
      () => pageSize.value,
      async () => {
        queryManageList();
      }
    );
    watch(
      () => current.value,
      async () => {
        queryManageList();
      }
    );

    //导出名单
    const exportList = () => {
      const data = {
        parentOrganizationId: ''
      };
      UserControlManageServicePresenter.batchExportManage(data);
    };

    // 编辑班级
    const upDateStudentUser = (obj: any) => {
      obj.gender === '男'
        ? (updateForm.resource = '1')
        : (updateForm.resource = '2');
      showUpdateVisible.value = true;
      updateForm.adminName = obj.realName;
      updateForm.telephone = obj.mobile;
      updateForm.id = obj.id;
      updateForm.ifState = obj.ifState;
    };

    const cancelUpdate = () => {
      showUpdateVisible.value = false;
    };

    const handleOk = () => {
      //保存按钮
      const updateData = {
        id: updateForm.id,
        realName: updateForm.adminName,
        gender: parseInt(updateForm.resource)
      };
      validate()
        .then(async () => {
          try {
            await UserControlManageServicePresenter.updateManage(updateData);
            showUpdateVisible.value = false;
            message.success('更新成功');
            await queryManageList();
          } catch (error) {
            Modal.error({
              title: '编辑失败',
              content: `${error.message}`
            });
          }
        })
        .catch((err: any) => {
          console.log('error', err);
        });
    };

    const nowUserPasswordSave = async () => {
      //查看教师电话弹窗确认
      try {
        const resdata = await GetUserMobilePresenter.getUserMobile({
          password: accountPassword.value,
          userId: manageId.value
        });
        if (resdata === null) {
          message.error('密码错误');
          return;
        } else {
          updateForm.telephone = resdata;
        }
        nowUserPasswordVisible.value = false;
        accountPassword.value = '';
      } catch (error) {
        console.log(error);
      }
    };

    const delateStudentUser = (record: any) => {
      const titleVnode = getModalHeadVNode('删除管理员信息');
      Modal.confirm({
        title: titleVnode,
        content: `删除后无法恢复，确认要删除${record.realName}吗？`,
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          showManagerNum.value = 0;
          try {
            await UserControlManageServicePresenter.deleteManage(record.id);
            queryManageList();
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    const handleSearch = async () => {
      //管理员信息查询
      showManagerNum.value = 1;
      // queryManageList();
      loadFirstPage();
    };

    const createManagerData = async () => {
      showManager.value = true;
      // queryManageList();
      loadFirstPage();
    };

    const resetForm = () => {
      formState.adminMessage = '';
      formState.telephone = '';
    };

    const changeVisible = (visibele: boolean) => {
      visible.value = visibele;
    };

    return {
      columns,
      current,
      pageSize,
      totalNum,
      dataSource,
      formState,
      exportList,
      createManagerData,
      showManager,
      resetForm,
      delateStudentUser,
      updateForm,
      handleSearch,
      useDialogModule,
      resetStudent,
      lockStudent,
      handleOk,
      nowUserPasswordVisible,
      phoneShow,
      nowUserPasswordCancel,
      showManagerNum,
      cancelUpdate,
      validateInfos,
      visible,
      showUpdateVisible,
      rulesRef,
      showModal,
      changeVisible,
      upDateStudentUser,
      accountPassword,
      nowUserPasswordSave,
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
