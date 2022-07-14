<!--
 * @Author: lyh
 * @Date: 2021-08-15 14:39:57
 * @LastEditTime: 2022-05-10 16:19:23
 * @LastEditors: lyh112549 1125492259@qq.com
 * @Description: 活动列表 学生名单
 * @FilePath: \collage-admin\src\views\ActivitySetting\ActivityList\DrawerList\Index.vue
-->
<template>
  <a-drawer
    title="学生名单"
    placement="right"
    :closable="true"
    :visible="showVisible"
    width="800px"
    @close="closeDrawer"
  >
    <div class="header-flex">
      <a-button
        v-if="props.isNowSemester"
        class="addStudent"
        type="primary"
        @click="addStudent"
      >
        添加学生
      </a-button>
      <div>
        <span>
          学生：
        </span>
        <a-input-search
          v-model:value="studentNumberSearch"
          class="header-input"
          placeholder="请输入学生学号"
          @search="searchStudent"
        />
      </div>
    </div>

    <a-table
      row-key="userId"
      :data-source="dataSource"
      :pagination="true"
      :columns="columns"
      :loading="loading"
    >
      <template #name="{record}">
        {{ record.name }}
        <br />
        {{ record.studentNumber }}
      </template>
      <template #sex="{text}">
        <span v-if="text === 1">
          男
        </span>
        <span v-if="text === 2">
          女
        </span>
      </template>
      <template #signState="{record}">
        <span v-if="record.signState === null">
          -
        </span>
        <a-select
          v-else
          v-model:value="record.signState"
          style="width: 120px"
          @change="signStateChange(record)"
        >
          <a-select-option :value="1">
            已签到
          </a-select-option>
          <a-select-option :value="0">
            未签到
          </a-select-option>
          <a-select-option :value="2">
            请假
          </a-select-option>
        </a-select>
      </template>
      <template #operation="{ record }">
        <a
          v-if="props.isNowSemester && props.activityState !== 3"
          @click="delStudent(record)"
        >
          删除
        </a>
        <a-tooltip v-else placement="top">
          <template #title>
            <span>报名开始不能删除学生</span>
          </template>
          <div class="delate_studetn">删除</div>
        </a-tooltip>
      </template>
    </a-table>
  </a-drawer>
  <a-modal
    v-model:visible="addStudentVisible"
    :mask-closable="false"
    :keyboard="false"
    title="添加学生"
    centered
    @ok="addStudentOk"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="addStudentOk">
        保存
      </a-button>
    </template>
    <a-form :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="学生信息" v-bind="validateInfos.studentName">
        <a-select
          v-model:value="studentForm.studentName"
          allow-clear
          :show-search="true"
          :show-arrow="false"
          placeholder="请输入学生姓名或学号"
          :filter-option="false"
          @search="handleSearch"
        >
          <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
          <a-select-option
            v-for="d in selectListData"
            :key="d.id"
            :value="d.organizationUserNumber"
          >
            {{ d.realName }}
            {{ d.organizationUserNumber }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { getModalHeadVNode, debounced } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import { OnceActivityListPresenter } from '@/request/api/presenter/course';
import { useForm } from '@ant-design-vue/use';
interface selectListItem {
  birthDay: string;
  campusId: string;
  campusName: string;
  gender: number;
  dataStatus: number;
  id: string;
  lockStatus: number;
  mobile: string;
  organizationId: string;
  organizationName: string;
  organizationUserNumber: string;
  organizationVerified: number;
  parentOrganizationId: string;
  realName: string;
  year: number;
}
interface dataSourceItem {
  campusId: string;
  campusName: string;
  name: string;
  sex: number;
  signId: string;
  signState: number;
  studentNumber: string;
  userId: string;
  year: number;
}
export default defineComponent({
  props: {
    isDrawerShow: {
      type: Boolean
    },
    activityId: {
      type: String,
      default: ''
    },
    restrictinId: {
      type: String,
      default: ''
    },
    isNowSemester: {
      type: Boolean,
      default: true
    },
    activityState: {
      type: Number,
      default: 0
    }
  },
  emits: ['change-visible'],
  setup(props, { emit }) {
    const addStudentVisible = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const studentNumberSearch = ref<string>('');
    const studentForm = reactive({
      studentName: undefined
    });
    const fetching = ref<boolean>(false);

    const dataSource = ref<dataSourceItem[]>([]);

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        slots: { customRender: 'name' }
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        slots: { customRender: 'sex' }
      },
      {
        title: '学院',
        dataIndex: 'campusName',
        key: 'campusName'
      },
      {
        title: '年级',
        dataIndex: 'year',
        key: 'year'
      },
      {
        title: '签到',
        dataIndex: 'signState',
        key: 'signState',
        slots: { customRender: 'signState' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        slots: { customRender: 'operation' }
      }
    ];

    const rules = reactive({
      studentName: [{ required: true, message: '请输入学生信息' }]
    });
    const { resetFields, validate, validateInfos } = useForm(
      studentForm,
      rules
    );

    const showVisible = computed(() => {
      return props.isDrawerShow;
    });

    const getStudentList = async () => {
      loading.value = true;
      const data = {
        activityId: props.activityId,
        studentNumber: studentNumberSearch.value
      };
      try {
        const res = await OnceActivityListPresenter.getStudentList(data);
        dataSource.value = res;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    watch(
      () => props.isDrawerShow,
      async (newValue: any) => {
        if (newValue) {
          try {
            await getStudentList();
          } catch (error) {
            console.log(error);
          }
        }
      }
    );

    const restrictinId = ref<string>('');
    watch(
      () => props.restrictinId,
      () => {
        restrictinId.value = props.restrictinId;
      }
    );
    const selectListData = ref<selectListItem[]>([]);
    const name = ref<string>('');
    const getStudentListByCourse = debounced(async (val: string) => {
      if (!val) return;
      name.value = val;
      try {
        const data = {
          nameOrganizationNum: val,
          restrictionId: restrictinId.value
        };
        fetching.value = true;
        const res = await OnceActivityListPresenter.getStudent(data);
        selectListData.value = res;
      } catch (error) {
        console.log(error);
      } finally {
        fetching.value = false;
      }
    }, 500);
    watch(
      () => studentForm.studentName,
      () => {
        if (!studentForm.studentName) {
          selectListData.value = [];
        }
      }
    );
    const handleSearch = async (val: string) => {
      if (!val) return;
      try {
        await getStudentListByCourse(val);
      } catch (error) {
        console.log(error);
      }
    };

    const closeDrawer = () => {
      emit('change-visible', false);
    };

    const addStudent = () => {
      addStudentVisible.value = true;
    };

    const addStudentOk = async () => {
      validate()
        .then(async () => {
          let userId = '';
          selectListData.value.forEach((e: any) => {
            if (studentForm.studentName === e.organizationUserNumber) {
              userId = e.id;
            }
          });
          const requestData = {
            activityId: props.activityId,
            students: [
              {
                studentNumber: studentForm.studentName,
                userId
              }
            ]
          };
          try {
            const res = await OnceActivityListPresenter.importStudent(
              requestData
            );
            if (res.success === false) {
              message.error(res.reason);
              return;
            } else {
              if (res.failStudents.length === 0 || res.failStudents === null) {
                message.success('添加成功');
                addStudentVisible.value = false;
                selectListData.value = [];
                resetFields();
              } else {
                message.error('已存在该学生');
                return;
              }
            }

            try {
              await getStudentList();
            } catch (error) {
              console.log(error);
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    };

    const delStudent = (data: any) => {
      const titleVnode = getModalHeadVNode(`你确定要删除${data.name}吗？`);
      const requestData = {
        activityId: props.activityId,
        studentId: data.userId
      };
      Modal.confirm({
        title: titleVnode,
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            const res = await OnceActivityListPresenter.delStudent(requestData);
            if (res) {
              message.success('删除成功');
              getStudentList();
            } else {
              message.error('删除失败');
            }
          } catch (error) {
            message.error(error.message);
          }
        }
      });
    };

    const signStateChange = async (value: any) => {
      const requestData = {
        signType: value.signState,
        activityId: props.activityId,
        courseUserId: value.id,
        userId: value.userId
      };
      try {
        await OnceActivityListPresenter.updateSignType(requestData);
        message.success('修改签到状态成功！');
        try {
          await getStudentList();
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    const searchStudent = () => {
      getStudentList();
    };

    const handleCancel = () => {
      addStudentVisible.value = false;
      selectListData.value = [];
      resetFields();
    };
    return {
      dataSource,
      columns,
      closeDrawer,
      showVisible,
      addStudentVisible,
      addStudent,
      addStudentOk,
      delStudent,
      handleCancel,
      loading,
      handleSearch,
      fetching,
      selectListData,
      studentForm,
      validateInfos,
      rules,
      signStateChange,
      props,
      studentNumberSearch,
      searchStudent
    };
  }
});
</script>
<style lang="less" scoped>
.addStudent {
  margin-bottom: 24px;
}
.name-number {
  margin-top: 20px;
  position: relative;
  .number {
    position: absolute;
    left: 230px;
  }
}
.begin-time-no-data {
  text-align: center;
  line-height: 200px;
}
.add-student-content {
  height: 180px;
  overflow: scroll;
  overflow-x: hidden;
}
.header-flex {
  display: flex;
  justify-content: space-between;
}
:deep(.ant-input-search) {
  width: 194px;
}
.delate_studetn {
  color: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
</style>
