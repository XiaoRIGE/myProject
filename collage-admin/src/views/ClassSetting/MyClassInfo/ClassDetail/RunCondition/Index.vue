<!--
 * @Author: lyh
 * @Date: 2021-08-18 15:03:41
 * @LastEditTime: 2021-12-17 11:48:29
 * @LastEditors: Please set LastEditors
 * @Description: 跑步情况
 * @FilePath: \collage-admin\src\views\ClassSetting\MyClassInfo\ClassDetail\RunCondition\Index.vue
-->
<template>
  <div class="list-content">
    <div class="header_surround">
      <div class="header">
        <a-button v-if="dataSourceMileage" type="primary" @click="handleExport">
          导出跑步数据
        </a-button>
        <span v-if="dataRuleList.length === 1" class="header-modal">
          计分模式：{{ currentDrawType('scoringTypeName') }}&emsp;&emsp;
          学期目标：
          <span v-if="isScoringType === true">
            {{ currentDrawType('semesterMileage') }}KM
          </span>
          <span v-else>
            {{ currentDrawType('semesterParagraph') }}
          </span>
        </span>
        <span v-else class="header-modal">
          计分模式：{{ currentDrawType('scoringTypeName') }}&emsp;&emsp;
          男：学期目标：
          <span v-if="isScoringType === true">
            {{ currentDrawType('semesterMileage') }}KM
          </span>
          <span v-else>
            {{ currentDrawType('semesterParagraph') }}
          </span>
          &emsp;&emsp; 女：学期目标：
          <span v-if="isScoringType === true">
            {{ currentDrawTypeWomen('semesterMileage') }}KM
          </span>
          <span v-else>
            {{ currentDrawTypeWomen('semesterParagraph') }}
          </span>
        </span>
      </div>
      <a-form :model="formState" layout="inline">
        <a-form-item label="学生">
          <a-input-search
            v-model:value="formState.usernameOrNumber"
            :maxlength="50"
            :allow-clear="true"
            placeholder="请输入学生姓名或学号"
            @search="onSearch"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="table-content">
      <!-- :scroll="{ y: 775 }" -->
      <a-table
        :columns="columnsMileage"
        :data-source="dataSourceMileage"
        :loading="loading"
        :pagination="false"
        row-key="userId"
      >
        <template #name="{record}">
          <p class="table-student">
            {{ record.name }}
            ({{ record.sex }})
          </p>
          <p class="table-student">
            {{ record.number }}
          </p>
        </template>
        <template #grade="{record}">
          <del v-if="record.operationGrade !== null">
            {{ record.grade }}
          </del>
          <span v-if="record.operationGrade !== null">
            &emsp;
            {{ record.operationGrade }}
          </span>
          <span v-else>{{ record.grade }}</span>
        </template>
        <template #mileage="{record}">
          <!-- <del v-if="record.operationMileage !== null">
            {{ record.mileage }}KM
          </del> -->
          <span v-if="record.operationMileage !== null">
            &emsp;
            {{ record.operationMileage }}/{{ record.semesterTarget }}KM
          </span>
          <span v-else>
            &emsp;{{ record.mileage }}/{{ record.semesterTarget }}KM
          </span>
        </template>
        <template #part="{record}">
          <!-- <del v-if="record.operationPart !== null">
            {{ record.part }}
          </del> -->
          <span v-if="record.operationPart !== null">
            &emsp;
            {{ record.operationPart }}/{{ record.semesterTarget }}
          </span>
          <span v-else>
            &emsp;
            {{ record.part }}/{{ record.semesterTarget }}
          </span>
        </template>
        <template #action="{record}">
          <a @click="runningData(record)">跑步数据</a>
        </template>
      </a-table>
      <a-pagination
        v-model:current="current"
        v-model:pageSize="pageSize"
        class="pagination"
        :pagination="{ pageSize: 100 }"
        :total="totalNum"
        :show-total="total => `共 ${total} 条`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { router } from '@/router';
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue';
import { RunningConditionPresenter } from '@/request/api/presenter/runSettings';
import { RunningConditionService } from '@/request/api/model/runSettings';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    courseId: {
      type: String,
      required: true
    },
    courseYear: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息
    const formState = reactive({
      usernameOrNumber: ''
    });
    const totalNum = ref<number>(0);
    const pageSize = ref<number>(100);
    const current = ref<number>(1);
    const isScoringType = ref<boolean>(true);
    const loading = ref<boolean>(false);
    const columnsMileage = reactive([
      {
        title: '学生',
        dataIndex: 'name',
        key: 'name',
        slots: { customRender: 'name' }
      },

      {
        title: '有效里程',
        dataIndex: 'mileage',
        key: 'mileage',
        slots: { customRender: 'mileage' }
      },
      {
        title: '有效段数',
        dataIndex: 'part',
        key: 'part',
        slots: { customRender: 'part' }
      },
      {
        title: '跑步成绩',
        dataIndex: 'grade',
        key: 'grade',
        slots: { customRender: 'grade' }
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 200,
        slots: { customRender: 'action' }
      }
    ]);
    const dataSourceMileage = ref<any[]>([]);
    const dataRuleList = ref<any[]>([]);
    const currentDrawType = computed(() => {
      return (data: string) => {
        return dataRuleList.value[0] ? dataRuleList.value[0][data] : '';
      };
    });

    const currentDrawTypeWomen = computed(() => {
      return (data: string) => {
        return dataRuleList.value[1] ? dataRuleList.value[1][data] : '';
      };
    });

    const getRunCondition = async () => {
      //获取学生列表接口
      loading.value = true;
      const data = {
        courseId: props.courseId,
        page: current.value,
        size: pageSize.value
      };
      try {
        const res = await RunningConditionPresenter.getStudentsGrade(data);
        if (
          dataRuleList.value[0] &&
          dataRuleList.value[0].scoringTypeName === '里程模式'
        ) {
          isScoringType.value = true;
        } else {
          isScoringType.value = false;
        }
        dataSourceMileage.value = res.grades;
        totalNum.value = res.total;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const getStudentsRunningGradeByNameOrNumber = async (data: any) => {
      //查询学生信息接口
      try {
        const res = await RunningConditionPresenter.getStudentsRunningGradeByNameOrNumber(
          data
        );
        dataSourceMileage.value = res.grades;
      } catch (error) {
        console.log(error);
      }
    };

    const getRunningRule = async () => {
      const data = {
        semesterId: currentSemester.value.id,
        year: props.courseYear
      };
      try {
        const res = await RunningConditionPresenter.getRunningRule(data);
        dataRuleList.value = res.data.data;
      } catch (error) {
        console.log(error);
        dataRuleList.value = [];
      }
    };

    onMounted(async () => {
      try {
        await getRunningRule();
      } catch (error) {
        console.log(error);
      }
      try {
        await getRunCondition();
      } catch (error) {
        console.log(error);
      }
      if (dataRuleList.value[0].scoringType === 1) {
        //判断模式改变列表内容
        columnsMileage.splice(2, 1);
      } else {
        columnsMileage.splice(1, 1);
      }
    });

    // 切换班级
    watch(
      () => props.courseId,
      async () => {
        if (props.courseId) {
          getRunningRule();
          try {
            await getRunCondition();
          } catch (error) {
            console.log(error);
          }
        }
      }
    );

    watch(
      () => pageSize.value,
      async () => {
        try {
          await getRunCondition();
        } catch (error) {
          console.log(error);
        }
      }
    );
    watch(
      () => current.value,
      async () => {
        try {
          await getRunCondition();
        } catch (error) {
          console.log(error);
        }
      }
    );

    const runningData = (data: any) => {
      const data1 = JSON.stringify(data);
      const isScoringType1 = isScoringType.value === true ? '里程' : '段数';
      router.push({
        name: 'runningData',
        params: {
          data1,
          isScoringType1
        }
      });
    };

    //根据输入框查询学生
    const onSearch = async () => {
      current.value = 1;
      const data = {
        courseId: props.courseId,
        page: current.value,
        queryParam: formState.usernameOrNumber,
        size: pageSize.value,
        semesterId: currentSemester.value.id
      };
      if (formState.usernameOrNumber === '') {
        try {
          await getRunCondition();
        } catch (error) {
          console.log(error);
        }
      } else {
        getStudentsRunningGradeByNameOrNumber(data);
      }
    };

    const handleExport = async () => {
      await RunningConditionService.importStudentsRunningGrade({
        courseId: props.courseId
      });
    };

    return {
      formState,
      columnsMileage,
      dataSourceMileage,
      runningData,
      onSearch,
      dataRuleList,
      handleExport,
      isScoringType,
      current,
      pageSize,
      totalNum,
      currentDrawType,
      currentDrawTypeWomen,
      loading
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-input-clear-icon) {
  padding-right: 10px;
}
.list-content {
  background: #fff;
  padding: 16px;
  .header_surround {
    display: flex;
    justify-content: space-between;
  }

  .header {
    margin-bottom: 20px;

    .header-modal {
      margin-left: 20px;
    }
  }

  .table-content {
    margin-top: 20px;
  }
  .table-student {
    margin: 0;
  }
}
.icon-warn {
  width: 24px;
  height: 24px;
}
</style>
