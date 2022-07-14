<template>
  <div v-if="hasTheoryExamination" class="list-content">
    <div class="head">
      <div class="left">
        <div v-if="isCurrentSemester" class="mr-24">
          考试时间：
          <span>{{ examTime }}</span>
        </div>
        <div>
          已完成考试：
          <span class="color-blue">{{ finishNum }}</span>
          人
        </div>
      </div>
      <div class="right">
        <a-form :model="formState" layout="inline">
          <a-form-item label="考试状态">
            <a-select
              v-model:value="formState.status"
              :disabled="examStatus === 0"
              :options="selectOption"
              @change="handleSearch"
            ></a-select>
          </a-form-item>
          <a-form-item label="学生">
            <a-input-search
              v-model:value="formState.usernameOrNumber"
              placeholder="请输入学生姓名或学号"
              @search="handleSearch"
            />
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="content">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="tableLoading"
        :pagination="pagination"
        row-key="id"
      >
        <template #name="{ record }">
          <div>{{ record.name }}({{ record.sexStr }})</div>
          <div>{{ record.number }}</div>
        </template>
        <template #examStatusStr="{ record,text }">
          <span :class="'examStatusBase examStatus' + record.EXAMSTATUS">
            <span v-if="examStatus === 0">-</span>
            <span v-else-if="examStatus === 1 && record.state === 0">
              未考试
            </span>
            <span v-else>{{ text }}</span>
          </span>
        </template>
        <template #totalGrade="{ text, record }">
          <div>
            <a-input-number
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id]['totalGradeVal']"
              :min="0"
              :step="1"
              :precision="1"
              style="margin: -5px 0"
            />
            <template v-else>
              <span @click="edit(record.id)">{{ text }}</span>
            </template>
          </div>
        </template>
        <template #operation="{record}">
          <a-space v-if="editableData[record.id]" :size="32">
            <a-button type="link" @click="editGrade(record.id)">保存</a-button>
            <a-popconfirm
              title="退出后不保存当前录入，确定退出编辑状态吗?"
              @confirm="cancel(record.id)"
            >
              <a-button type="link">取消</a-button>
            </a-popconfirm>
          </a-space>
          <a-space v-else :size="32">
            <!-- disabled -->
            <a-button
              type="link"
              :disabled="record.state === 1"
              @click="edit(record.id)"
            >
              编辑总分
            </a-button>
            <a-button
              type="link"
              :disabled="
                examStatus === 0 ||
                  examStatus === 2 ||
                  (record.state === 0 && examStatus === 1)
              "
              @click="handleReset(record.theoryExaminationInfo)"
            >
              重新考试
            </a-button>
          </a-space>
        </template>
      </a-table>
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
      <span>当前学期未配置理论考试</span>
    </template>
  </a-empty>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  UnwrapRef,
  watch
} from 'vue';
import { useStore } from 'vuex';
import { usePagination } from '@/hooks/usePagination';
import { getModalHeadVNode } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import {
  NoticeServicePresenter,
  getExamListResponseMap
} from '@/request/api/presenter/exam';

export default defineComponent({
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const isCurrentSemester = computed(
      () => store.state.basic.currentSemester.current === 1
    ); //是否当前学期
    const currentSemesterId = computed(
      () => store.state.basic.currentSemester.id
    ); //当前学期信息

    const examTime = ref<string>(''); //考试时间
    const finishNum = ref<number>(0); //已完成考试人数
    const hasTheoryExamination = ref<boolean>(false); //是否有配置理论考试
    const theoryTestConfigId = ref<string>(''); //考试配置id
    const examStatus = ref<number>(1); //0未开始 1考试中  2考试完成

    //获取班级考试信息（时间、状态）
    const getExamInfo = async () => {
      try {
        const params = {
          courseId: props.courseId,
          semesterId: currentSemesterId.value
        };
        const {
          examTimeVal,
          completePeopleNum,
          theoryExaminationState,
          hasTheoryExaminationVal,
          theoryTestConfigIdVal
        } = await NoticeServicePresenter.getExamInfo(params);
        examTime.value = examTimeVal;
        finishNum.value = completePeopleNum;
        examStatus.value = theoryExaminationState;
        hasTheoryExamination.value = hasTheoryExaminationVal;
        theoryTestConfigId.value = theoryTestConfigIdVal;
      } catch (error) {
        console.log(error);
        hasTheoryExamination.value = false;
      }
    };
    watch(
      () => props.courseId,
      () => {
        getExamInfo();
      },
      {
        immediate: true
      }
    );

    const formState = reactive({
      usernameOrNumber: '',
      status: null
    });

    const selectOption = computed(() => {
      const baseOption = [
        {
          value: null,
          label: '全部'
        }
      ];
      if (examStatus.value === 0) {
        return baseOption;
      } else if (examStatus.value === 1) {
        return [
          ...baseOption,
          {
            value: 0,
            label: '未考试'
          },
          {
            value: 1,
            label: '考试中'
          },
          {
            value: 2,
            label: '考试完成'
          }
        ];
      } else if (examStatus.value === 2) {
        return [
          ...baseOption,
          {
            value: 0,
            label: '缺考'
          },

          {
            value: 2,
            label: '考试完成'
          }
        ];
      }
    });

    const columns = [
      {
        title: '学生',
        dataIndex: 'name',
        slots: { customRender: 'name' }
      },
      {
        title: '考试状态',
        dataIndex: 'examStatusStr',
        slots: { customRender: 'examStatusStr' }
      },
      {
        title: '交卷时间',
        dataIndex: 'time'
      },
      {
        title: '答题时长',
        dataIndex: 'duration',
        ellipsis: true
      },
      {
        title: '总分',
        dataIndex: 'totalGrade',
        slots: { customRender: 'totalGrade' },
        ellipsis: true
      },
      {
        title: '操作',
        slots: { customRender: 'operation' }
      }
    ];
    const dataSource = ref<getExamListResponseMap[]>([]);
    const tableLoading = ref<boolean>(false);

    const pageSizeRef = ref<number>(10);
    const currentRef = ref<number>(1);
    const totalNumRef = ref<number>(0);

    // 获取列表数据
    const getList = async () => {
      try {
        tableLoading.value = true;
        const params = {
          courseId: props.courseId,
          offsetPage: 0,
          page: currentRef.value,
          query: formState.usernameOrNumber,
          size: pageSizeRef.value,
          state: formState.status,
          theoryTestConfigId: theoryTestConfigId.value
        };
        const data = await NoticeServicePresenter.getExamList(params);
        dataSource.value = data.items;
        totalNumRef.value = data.total;
      } catch (error) {
        console.log(error);
      } finally {
        tableLoading.value = false;
      }
    };
    // 加载第一页数据
    const handleSearch = async () => {
      currentRef.value = 1;
      getList();
    };
    watch(
      () => theoryTestConfigId.value,
      () => {
        handleSearch();
      }
    );

    // 重新考试
    const handleReset = (theoryExaminationInfoId: string) => {
      const titleVnode = getModalHeadVNode('重新考试');
      Modal.confirm({
        title: titleVnode,
        content: '当前考试数据将被删除，不可恢复，是否继续？',
        okText: '继续',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await NoticeServicePresenter.resetExam({ theoryExaminationInfoId });
            message.success('操作成功');
            await getList();
          } catch (error) {
            Modal.error({
              title: '操作失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    /**
     * @description: 分页配置
     */
    const { pagination } = usePagination(
      getList,
      pageSizeRef,
      currentRef,
      totalNumRef
    );

    const editableData: UnwrapRef<Record<
      string,
      getExamListResponseMap
    >> = reactive({});

    // 修改成绩
    const editGrade = async (key: string) => {
      try {
        const params = {
          achievement: editableData[key].totalGradeVal,
          courseId: props.courseId,
          theoryTestConfigId: theoryTestConfigId.value,
          userId: editableData[key].userId
        };
        await NoticeServicePresenter.updateAchievement(params);
        message.success('保存成功!');
        getList();
        delete editableData[key];
        return true;
      } catch (error) {
        console.log(error);
        message.error('保存失败!');
        return false;
      }
    };

    // 编辑的时候如果有未保存的列 先提交该行数据
    const checkHasEdit = async () => {
      let NoEditingStatus = true;
      if (Object.keys(editableData).length !== 0) {
        try {
          const [key] = Object.keys(editableData);
          const saveSuccess = await editGrade(key);

          NoEditingStatus = saveSuccess;
        } catch (error) {
          console.log(error);
        }
      }
      return NoEditingStatus;
    };

    const edit = async (key: string) => {
      // 如果保存失败则下一行不进入编辑状态
      const NoEditingStatus = await checkHasEdit();
      if (!NoEditingStatus) return;

      editableData[key] = JSON.parse(
        JSON.stringify(dataSource.value.filter(item => key === item.id)[0])
      );
    };

    const cancel = (key: string) => {
      delete editableData[key];
    };

    return {
      examTime,
      finishNum,
      hasTheoryExamination,
      examStatus,
      isCurrentSemester,
      formState,
      selectOption,
      handleSearch,
      columns,
      dataSource,
      tableLoading,
      pagination,
      handleReset,
      editableData,
      edit,
      editGrade,
      cancel
    };
  }
});
</script>

<style lang="less" scoped>
.list-content {
  background: #fff;
  padding: 16px;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
    }
  }
  .content {
    margin-top: 24px;
    .examStatusBase {
      display: flex;
      align-items: center;
      &::before {
        content: '';
        display: inline-block;
        margin-right: 8px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
    }
    .examStatus0::before {
      background: @border-color-base;
    }
    .examStatus1::before {
      background: @primary;
    }
    .examStatus2::before {
      background: @success-color;
    }
    .examStatus3::before {
      background: @error-color;
    }
  }
}
.mr-24 {
  margin-right: 24px;
}
.nodata {
  margin-top: 70px;
}
:deep(.ant-space-item .ant-btn) {
  padding: 0;
}
</style>
