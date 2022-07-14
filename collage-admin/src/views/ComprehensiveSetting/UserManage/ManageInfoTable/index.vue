<template>
  <a-modal
    :visible="showVisible"
    :mask-closable="false"
    :keyboard="false"
    :title="`请填写${whoFatherValue}信息`"
    width="680px"
    centered
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">
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
          :label="`${whoFatherValue}姓名`"
          v-bind="validateInfos.userName"
          required
        >
          <a-input
            v-model:value="projectForm.userName"
            allow-clear
            :maxlength="29"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          v-if="whoFatherValue === '学生'"
          label="学号"
          v-bind="validateInfos.userNumber"
          required
        >
          <a-input
            v-model:value="projectForm.userNumber"
            allow-clear
            :maxlength="30"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model:value="projectForm.resource">
            <a-radio value="1">
              男
            </a-radio>
            <a-radio value="2">
              女
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="whoFatherValue !== '学生'"
          label="联系电话"
          v-bind="validateInfos.telephone"
          required
        >
          <a-input
            v-model:value="projectForm.telephone"
            allow-clear
            :maxlength="30"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          v-if="whoFatherValue === '学生'"
          label="年级"
          v-bind="validateInfos.grade"
          required
        >
          <a-select
            v-model:value="projectForm.grade"
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
        <a-form-item
          v-if="whoFatherValue === '学生'"
          label="学院"
          v-bind="validateInfos.college"
          required
        >
          <a-select
            v-model:value="projectForm.college"
            allow-clear
            placeholder="请选择"
          >
            <a-select-option
              v-for="item in organization.data.data"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="whoFatherValue === '学生'"
          label="校区"
          v-bind="validateInfos.village"
          required
        >
          <a-select
            v-model:value="projectForm.village"
            allow-clear
            placeholder="请选择"
          >
            <a-select-option v-for="item in CampusData" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="whoFatherValue == '学生'" label="人脸照片">
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
            <img v-if="imgUrl" :src="imgUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else>+</plus-outlined>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useForm } from '@ant-design-vue/use';
import UserControlTeacherServicePresenter, {
  UserControlStudentServicePresenter,
  UserControlManageServicePresenter
} from '@/request/api/presenter/userControl';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import { Modal } from 'ant-design-vue';
import { BaseCourseServicePresenter } from '@/request/api/presenter/course';
import { useStore } from 'vuex';
import useUploadAvatar from './useUploadAvatar';

export default defineComponent({
  props: {
    visible: {
      type: Boolean
    },
    whoFatherValue: {
      type: String,
      default: ''
    },
    organizationData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [
    'change-visible',
    'create-student',
    'create-teacher',
    'create-manager'
  ],
  setup(props, { emit }) {
    const projectForm = reactive({
      userName: '',
      userNumber: '',
      telephone: '',
      resource: '1',
      grade: '',
      college: '',
      village: ''
    });
    const organization = reactive({
      data: {}
    });
    const yearSelect = reactive({
      data: {}
    });
    const CampusData = ref();
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息
    onMounted(async () => {
      organization.data = props.organizationData;
      const campusData = await CampusServicePresenter.queryAllCampus('');
      CampusData.value = campusData.data.data;
      //获取年级下拉
      const params = {
        semesterId: currentSemester.value.id
      };
      const data = await BaseCourseServicePresenter.getGradeList(params);
      yearSelect.data = data;
    });

    const showVisible = computed(() => {
      return props.visible;
    });
    const whoValue = computed(() => {
      return props.whoFatherValue;
    });

    const studentNumberRule = ref<string>('');
    const studentRule = (
      rule: any,
      value: any,
      callback: (arg0?: Error) => any
    ) => {
      //学号验证
      if (studentNumberRule.value === '123' && value !== '') {
        return callback(new Error('该学号已存在，请重新输入'));
      } else if (!value) {
        return callback(new Error('请输入学号'));
      } else {
        return callback();
      }
    };

    const rulesRef = reactive({
      userName: [
        { required: true, message: '请输入学生姓名', trigger: 'blur' }
      ],
      userNumber: [{ required: true, validator: studentRule, tigger: 'blur' }],
      telephone: [
        // { required: true, validator: telephoneRule, tigger: 'blur' },
        { min: 11, max: 11, message: '请输入正确电话号码', trigger: 'blur' }
      ],
      grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
      college: [{ required: true, message: '请选择学院', trigger: 'change' }],
      village: [{ required: true, message: '请选择校区', trigger: 'change' }]
    });
    const { validate, validateInfos, resetFields } = useForm(
      projectForm,
      rulesRef
    );

    const { imgUrl, ...restParams } = useUploadAvatar();

    const handleOk = async () => {
      //保存按钮
      if (props.whoFatherValue === '学生') {
        studentNumberRule.value = '';
        rulesRef.telephone = [];
        const createData = {
          organizationUserNumber: projectForm.userNumber,
          realName: projectForm.userName,
          gender: parseInt(projectForm.resource),
          parentOrganizationId: '',
          grade: '',
          organizationId: projectForm.college,
          campusId: projectForm.village,
          year: Number(projectForm.grade),
          faceUrl: imgUrl.value
        };

        validate()
          .then(async () => {
            try {
              await UserControlStudentServicePresenter.createStudent(
                createData
              );
              emit('create-student', projectForm);
              emit('change-visible', false);
              resetFields();
            } catch (error) {
              Modal.error({
                title: '保存失败',
                content: error?.message
              });
            }
          })
          .catch((err: any) => {
            console.log('error', err);
          });
      }
      if (props.whoFatherValue === '教师') {
        rulesRef.userNumber = [];
        rulesRef.grade = [];
        rulesRef.college = [];
        rulesRef.village = [];

        validate()
          .then(async () => {
            try {
              await UserControlTeacherServicePresenter.createTeacher({
                organizationId: '',
                realName: projectForm.userName,
                gender: parseInt(projectForm.resource),
                mobile: projectForm.telephone
              });
              emit('create-teacher', projectForm);
              emit('change-visible', false);
              resetFields();
            } catch (error) {
              Modal.error({
                title: '保存失败',
                content: error?.message
              });
            }
          })
          .catch((err: any) => {
            console.log('error', err);
          });
      }
      if (props.whoFatherValue === '管理员') {
        rulesRef.userNumber = [];
        rulesRef.grade = [];
        rulesRef.college = [];
        rulesRef.village = [];
        const createData = {
          organizationId: '',
          realName: projectForm.userName,
          gender: parseInt(projectForm.resource),
          mobile: projectForm.telephone
        };

        validate()
          .then(async () => {
            try {
              await UserControlManageServicePresenter.createManage(createData);
              emit('create-manager', projectForm);
              emit('change-visible', false);
              resetFields();
            } catch (error) {
              Modal.error({
                title: '保存失败',
                content: error?.message
              });
            }
          })
          .catch((err: any) => {
            console.log('error', err);
          });
      }
    };

    // 取消输入信息
    const handleCancel = () => {
      resetFields();
      emit('change-visible', false);
    };

    return {
      showVisible,
      handleCancel,
      projectForm,
      handleOk,
      organization,
      validateInfos,
      whoValue,
      CampusData,
      yearSelect,
      restParams
    };
  }
});
</script>
