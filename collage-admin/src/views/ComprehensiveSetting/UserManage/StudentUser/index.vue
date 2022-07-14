<!--
 * @Author: lyh
 * @Date: 2021-08-06 13:44:54
 * @LastEditTime: 2022-02-17 11:09:25
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理 学生管理
 * @FilePath: \collage-admin\src\views\ComprehensiveSetting\UserManage\StudentUser\index.vue
-->
<template>
  <div v-if="showStudent" class="test-wrap">
    <div class="headerAllBtn">
      <div>
        <a-space :size="16">
          <a-button type="primary" @click="showModal">
            新增学生
          </a-button>
          <ImoortFile
            :show-file-dialog="showFileDialog"
            :import-service="batchImport"
            :export-err="exportErr"
            :import-service-params="studentImportData"
            @importExcelSuccess="importExcelSuccess"
          >
            <a-button @click="bulkImport">
              批量导入名单
            </a-button>
          </ImoortFile>
          <a-button type="primary" @click="exportExcel">
            下载标准表格
          </a-button>
          <a-button @click="exportList">
            导出名单
          </a-button>
        </a-space>
        <a-space class="a-space-add">
          <a-upload
            v-model:file-list="fileList"
            accept="file"
            name="zipFile"
            :headers="uploadUrlHeaders"
            :show-upload-list="false"
            :action="zipFileUrl"
            @change="ziphandleChange"
          >
            <a-button type="primary">
              批量导入人脸
            </a-button>
          </a-upload>
          <!-- <a-button type="primary" v-else @click="lookUploadState">
            批量导入人脸
          </a-button> -->
          <a-button @click="deleteHandle">
            批量删除人脸
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="headerAllInput">
      <a-form layout="inline" label-align="left" :model="formState">
        <a-form-item label="学生信息">
          <a-input
            v-model:value="formState.studentMessage"
            placeholder="请输入学生姓名、学号"
            enter-button
            allow-clear
          />
        </a-form-item>

        <a-form-item label="联系电话">
          <a-input
            v-model:value="formState.mobile"
            placeholder="请输入学生电话号码"
            enter-button
            allow-clear
          />
        </a-form-item>

        <a-form-item label="年级">
          <a-select
            v-model:value="formState.grade"
            placeholder="全部"
            @change="reviewState"
          >
            <a-select-option :value="undefined">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in yearSelect.data"
              :key="item.key"
              :value="item.value"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学院">
          <a-select
            v-model:value="formState.organizationId"
            placeholder="全部"
            @change="chooseSelectChange"
          >
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in organizationData.data"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
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
          row-key="id"
          :columns="columns"
          :loading="loading"
          :data-source="dataSource"
          :pagination="dataSource.length > 10"
        >
          <template #ifState="{ text,record }">
            <a
              v-if="text === 2"
              class="activated"
              @click="changeActivate(record.id)"
            >
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

  <!-- 没有任何学生时显示 -->
  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>您还没添加任何学生</span>
    </template>
    <a-space :size="32">
      <a-button type="primary" @click="showModal">
        新增学生
      </a-button>
      <a-button type="primary" @click="exportExcel">
        下载标准表格
      </a-button>

      <ImoortFile
        :show-file-dialog="showFileDialog"
        :import-service="batchImport"
        :export-err="exportErr"
        :import-service-params="studentImportData"
        @importExcelSuccess="importExcelSuccess"
      >
        <a-button type="primary" @click="bulkImport">
          批量导入
        </a-button>
      </ImoortFile>
    </a-space>
  </a-empty>

  <!-- 编辑学生信息 -->
  <a-modal
    :visible="showUpdateVisible"
    :mask-closable="false"
    :keyboard="false"
    title="请编辑学生信息"
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
          label="学生姓名"
          v-bind="validateInfos.studentName"
          required
        >
          <a-input
            v-model:value="updateForm.studentName"
            allow-clear
            :maxlength="30"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="学号" v-bind="validateInfos.studentNumber" required>
          <a-input
            v-model:value="updateForm.studentNumber"
            :disabled="true"
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
        <a-form-item label="年级" v-bind="validateInfos.grade" required>
          <a-select
            v-model:value="updateForm.grade"
            allow-clear
            placeholder="请选择"
          >
            <a-select-option
              v-for="item in yearSelect.data"
              :key="item.key"
              :value="item.value"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学院" v-bind="validateInfos.college" required>
          <a-select
            v-model:value="updateForm.college"
            allow-clear
            placeholder="请选择"
          >
            <a-select-option
              v-for="item in organizationData.data"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="校区" v-bind="validateInfos.village" required>
          <a-select
            v-model:value="updateForm.village"
            allow-clear
            placeholder="请选择"
          >
            <a-select-option v-for="item in updateCampusData" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="人脸照片">
          <a-upload
            v-model:file-list="fileList"
            accept="image/jpg"
            name="imgFile"
            list-type="picture-card"
            class="avatar-uploader"
            :headers="uploadUrlHeaders"
            :show-upload-list="false"
            :action="uploadPlanUrl"
            @change="handleChange"
          >
            <img
              v-if="updateForm.faceUrl"
              :src="updateForm.faceUrl"
              alt="avatar"
            />
            <div v-else>
              <loading-outlined v-if="loadings"></loading-outlined>
              <plus-outlined v-else>+</plus-outlined>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
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

  <!-- 查看学生联系电话dialog -->
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
      <a-button key="back" @click="lookStudentPasswordCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="lookStudentPassword">
        确定
      </a-button>
    </template>
    <!-- layout="inline" -->
    <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
      <a-row>
        <a-form-item label="用户名">
          <p style="margin-left:5px">
            {{ updateForm.studentName }}
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
    :organization-data="organizationData"
    who-father-value="学生"
    @change-visible="changeVisible"
    @create-student="createStudentData"
  />
  <!-- 批量删除人脸 -->
  <a-modal
    v-model:visible="batchDeleteState"
    width="300px"
    title="批量删除人脸"
    ok-text="确认"
    cancel-text="取消"
    @ok="deleteHandleOk(selectedYear)"
  >
    <div>
      删除后，这批学生都不能再使用岗亭打卡功能，请确认留级学生已经切换年级，并谨慎操作。
    </div>
    <div :style="{ marginTop: '20px' }">
      要删除人脸的年级：
      <a-select
        v-model:value="selectedYear"
        placeholder="全部"
        style="width: 120px"
        @change="handleGradeYear"
      >
        <a-select-option
          v-for="item in yearSelect.data"
          :key="item.key"
          :value="item.value"
        >
          {{ item.value }}
        </a-select-option>
      </a-select>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  Ref,
  ref,
  watch,
  computed
} from 'vue';
import ManageInfoTable from '../ManageInfoTable/index.vue';
import ImoortFile from '@/components/global/ImportFile.vue';
import { message, Modal } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import {
  UserControlStudentServicePresenter,
  UserControlStudentInfoType
} from '@/request/api/presenter/userControl';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import { BaseCourseServicePresenter } from '@/request/api/presenter/course';
import { useStore } from 'vuex';
import { GetUserMobilePresenter } from '@/request/api/presenter/login';
import { getModalHeadVNode } from '@/utils/common';
import useBatchFace from './useBatchFace';
import useEditAvatar from './useEditAvatar';
import useGetFacePhoto from './useGetFacePhoto';
import useImportFace from './useImportFace';

//表格数据
const useTableModule = () => {
  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'realName',
      key: 'realName'
    },
    {
      title: '学号',
      dataIndex: 'organizationUserNumber',
      key: 'organizationUserNumber'
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
      title: '年级',
      dataIndex: 'year',
      key: 'year'
    },
    {
      title: '学院',
      dataIndex: 'organizationName',
      key: 'organizationName'
    },
    {
      title: '校区',
      dataIndex: 'campusName',
      key: 'campusName'
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
  const dataSource: Ref<UserControlStudentInfoType[]> = ref([]);

  return {
    columns,
    dataSource
  };
};

// 弹窗数据以及相关操作
const useDialogModule = () => {
  const visible = ref<boolean>(false);
  const nowUserPasswordVisible = ref<boolean>(false);
  const studentId = ref('');
  // 展示弹窗
  const showModal = () => {
    visible.value = true;
  };
  // 显示联系电话弹窗
  const phoneShow = (id: string) => {
    studentId.value = id;
    nowUserPasswordVisible.value = true;
  };
  const nowUserPasswordCancel = () => {
    nowUserPasswordVisible.value = false;
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
    resetStudent,
    lockStudent,
    nowUserPasswordCancel,
    studentId
  };
};

export default defineComponent({
  components: { ManageInfoTable, ImoortFile },
  setup() {
    const showFileDialog: Ref<boolean> = ref(false);
    const showUpdateVisible = ref<boolean>(false);
    const showStudent = ref<boolean>(true);
    const showStudentNum = ref<number>(0);
    const totalNum = ref(0);
    const pageSize = ref(10);
    const current = ref(1);
    const selectedYear = ref<string>('');
    const studentImportData = reactive({
      organizationId: ''
    });
    const loading = ref<boolean>(false);
    const accountPassword = ref('');
    const { columns, dataSource } = useTableModule();
    const {
      visible,
      showModal,
      nowUserPasswordVisible,
      phoneShow,
      resetStudent,
      lockStudent,
      nowUserPasswordCancel,
      studentId
    } = useDialogModule();

    const provinceData = ['Zhejiang', 'Jiangsu'];

    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

    const organizationData = reactive({
      data: {}
    });
    const updateCampusData = ref();
    const formState = reactive({
      studentMessage: '',
      mobile: '',
      grade: undefined,
      college: undefined,
      organizationId: ''
    });
    const yearSelect = reactive({
      data: {}
    });
    const updateForm = reactive({
      studentName: '',
      studentNumber: '',
      id: '',
      resource: '1',
      telephone: '1',
      ifState: 0,
      grade: '',
      college: '',
      village: '',
      faceUrl: ''
    });
    const rulesRef = reactive({
      studentName: [
        { required: true, message: '请输入学生姓名', trigger: 'blur' }
      ],
      studentNumber: [
        { required: true, message: '请输入学号', trigger: 'blur' }
      ],
      grade: [{ required: true, message: '请选择年级', trigger: 'blur' }],
      college: [{ required: true, message: '请选择学院', trigger: 'blur' }],
      village: [{ required: true, message: '请选择校区', trigger: 'blur' }]
    });
    const { validate, validateInfos } = useForm(updateForm, rulesRef);

    //请求学生用户列表
    const queryStudentList = async function queryStudentList(): Promise<void> {
      loading.value = true;
      try {
        const res = await UserControlStudentServicePresenter.getUserStudentList(
          {
            page: current.value,
            size: pageSize.value,
            searchCondition: formState.studentMessage,
            mobile: formState.mobile,
            year: Number(formState.grade),
            organizationId: formState.organizationId
          }
        );
        //根据是否手动查询判断显示数据还是无记录
        if (res.total === 0) {
          //如果条数为0显示空状态
          if (showStudentNum.value === 0) {
            //showStudentNum查询时数据为空显示列表无数据
            showStudent.value = false;
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
      queryStudentList();
    };

    watch(
      () => currentSemester.value,
      async () => {
        try {
          const params = {
            semesterId: currentSemester.value.id
          };
          //获取年级下拉
          const data = await BaseCourseServicePresenter.getGradeList(params);
          yearSelect.data = data;
        } catch (error) {
          console.log(error);
        }
      }
    );

    onMounted(async () => {
      await queryStudentList();
      try {
        const res = await UserControlStudentServicePresenter.queryallOrganization(
          ''
        );
        organizationData.data = res.data.data;
      } catch (error) {
        console.log(error);
      }

      try {
        const campusData = await CampusServicePresenter.queryAllCampus('');
        updateCampusData.value = campusData.data.data;
      } catch (error) {
        console.log(error);
      }
      try {
        const params = {
          semesterId: currentSemester.value.id
        };
        //获取年级下拉
        const data = await BaseCourseServicePresenter.getGradeList(params);
        yearSelect.data = data;
        selectedYear.value = data && data[0].key;
      } catch (error) {
        console.log(error);
      }
    });

    watch(
      () => pageSize.value,
      async () => {
        queryStudentList();
      }
    );
    watch(
      () => current.value,
      async () => {
        queryStudentList();
      }
    );

    const changeActivate = (data: any) => {
      const titleVnode = getModalHeadVNode('提示');
      const formData = new FormData();
      formData.append('id', data);
      Modal.confirm({
        title: titleVnode,
        content: '未激活的学生将不能登录使用App，是否继续？',
        okText: '继续',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await UserControlStudentServicePresenter.resetStudent(formData);
            message.success('修改成功');
            await queryStudentList();
          } catch (error) {
            Modal.error({
              title: '修改失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    // 编辑班级
    const upDateStudentUser = async (obj: UserControlStudentInfoType) => {
      showUpdateVisible.value = true;
      //列表显示
      if (obj.gender === '男') {
        updateForm.resource = '1';
      } else {
        updateForm.resource = '2';
      }
      updateForm.studentName = obj.realName;
      updateForm.studentNumber = obj.organizationUserNumber;
      updateForm.id = obj.id;
      updateForm.ifState = obj.ifState;
      updateForm.college = obj.organizationId;
      updateForm.village = obj.campusId;
      updateForm.grade = `${obj.year}`;
      updateForm.telephone = obj.mobile;
      const { getFaceData } = useGetFacePhoto();
      updateForm.faceUrl = await getFaceData(obj.id);
    };

    const cancelUpdate = () => {
      showUpdateVisible.value = false;
    };

    const handleOk = () => {
      //保存按钮
      const updateData = {
        id: updateForm.id,
        organizationUserNumber: updateForm.studentNumber,
        parentOrganizationId: '',
        realName: updateForm.studentName,
        gender: parseInt(updateForm.resource),
        organizationId: updateForm.college,
        campusId: updateForm.village,
        year: Number(updateForm.grade),
        faceUrl: updateForm.faceUrl
      };
      validate()
        .then(async () => {
          try {
            await UserControlStudentServicePresenter.updateStudent(updateData);
            await queryStudentList();
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
      const titleVnode = getModalHeadVNode('删除学生信息');
      Modal.confirm({
        title: titleVnode,
        content: `删除后无法恢复，确认要删除${record.realName}吗？`,
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          showStudentNum.value = 0;
          try {
            await UserControlStudentServicePresenter.deleteStudent(record.id);
            await queryStudentList();
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    const handleSearch = () => {
      //查询
      showStudentNum.value = 1;
      loadFirstPage();
    };

    const resetForm = () => {
      //重置
      formState.studentMessage = '';
      formState.mobile = '';
      formState.grade = undefined;
      formState.college = undefined;
      formState.organizationId = '';
      handleSearch();
    };

    const reviewState = () => {
      handleSearch();
    };

    const changeVisible = (visibele: boolean) => {
      visible.value = visibele;
    };

    //学院下拉select
    const chooseSelectChange = (value: string) => {
      formState.organizationId = value;
      handleSearch();
    };

    const importExcelSuccess = async (val: any) => {
      if (val === '导入成功') {
        await queryStudentList();
      }
    };

    //导出excel
    const exportExcel = async () => {
      try {
        await UserControlStudentServicePresenter.exportStudentExcelTemplate();
      } catch (error) {
        Modal.error({
          title: '下载失败',
          content: `${error.message}`
        });
      }
    };

    //导出名单
    const exportList = async () => {
      const data = {
        parentOrganizationId: ''
      };
      try {
        await UserControlStudentServicePresenter.batchExportStudent(data);
      } catch (error) {
        Modal.error({
          title: '导出失败',
          content: `${error.message}`
        });
      }
    };

    const createStudentData = async () => {
      //新增学生
      showStudent.value = true;
      await queryStudentList();
    };

    const bulkImport = () => {
      showFileDialog.value = true;
    };

    const lookStudentPassword = async () => {
      //查看学生密码
      try {
        const resdata = await GetUserMobilePresenter.getUserMobile({
          password: accountPassword.value,
          userId: studentId.value
        });
        updateForm.telephone = resdata;
        nowUserPasswordVisible.value = false;
        accountPassword.value = '';
      } catch (error) {
        message.error(`${error.message}`);
      }
    };

    const lookStudentPasswordCancel = () => {
      accountPassword.value = '';
      nowUserPasswordVisible.value = false;
    };

    const handleGradeYear = (value: string) => {
      selectedYear.value = value;
    };

    return {
      totalNum,
      pageSize,
      current,
      yearSelect,
      createStudentData,
      columns,
      dataSource,
      showStudentNum,
      formState,
      exportExcel,
      exportList,
      resetForm,
      importExcelSuccess,
      studentImportData,
      handleSearch,
      delateStudentUser,
      updateForm,
      showStudent,
      updateCampusData,
      useDialogModule,
      resetStudent,
      lockStudent,
      handleOk,
      nowUserPasswordVisible,
      phoneShow,
      nowUserPasswordCancel,
      organizationData,
      cancelUpdate,
      validateInfos,
      visible,
      showUpdateVisible,
      rulesRef,
      showModal,
      changeVisible,
      upDateStudentUser,
      chooseSelectChange,
      batchImport: UserControlStudentServicePresenter.batchImportStudent,
      exportErr: UserControlStudentServicePresenter.exportErr,
      bulkImport,
      showFileDialog,
      lookStudentPassword,
      accountPassword,
      lookStudentPasswordCancel,
      loading,
      changeActivate,
      reviewState,
      provinceData,
      selectedYear,
      handleGradeYear,
      ...useBatchFace(),
      ...useEditAvatar(updateForm),
      ...useImportFace()
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
.a-space-add {
  margin-left: 100px;
}
</style>
