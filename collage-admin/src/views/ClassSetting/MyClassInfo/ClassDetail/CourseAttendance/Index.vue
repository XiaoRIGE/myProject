<template>
  <div v-show="!isEmpty" class="main">
    <a-space :size="24" class="header_space">
      <div>
        <a-button :loading="exportLoading" type="primary" @click="handleExport">
          导出课程考勤
        </a-button>
        <span v-show="attainability === 2">不固定考勤</span>
        <span v-show="attainability === 1">
          固定考勤：
          <span style="color: #1966fe">{{ frequencyNum }}次</span>
        </span>
        <span>
          已考勤：
          <span style="color: #00a971">{{ attendanceNum }}次</span>
        </span>
      </div>
      <a-form :model="formState" layout="inline">
        <a-form-item label="学生">
          <a-input-search
            v-model:value="formState.usernameOrNumber"
            placeholder="请输入学生姓名或学号"
            @search="onSearch"
          />
        </a-form-item>
      </a-form>
    </a-space>
    <div class="table-box">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        row-key="id"
        :scroll="{ x: 1000 }"
      >
        <template #name="{ record }">
          <div class="ellipsis">
            <div>{{ record.name }}({{ record.sex }})</div>
            <div>{{ record.number }}</div>
          </div>
        </template>
        <template v-for="col in editCol" #[col]="{ record }">
          <a-popover
            :key="col"
            :visible="record.id === currentKey && col === currnentCol"
            title="修改考勤状态"
            trigger="click"
          >
            <template #content>
              <a-radio-group v-model:value="editData[col]">
                <a-radio value="1">
                  已到
                </a-radio>
                <a-radio value="0">
                  未到
                </a-radio>
                <a-radio value="2">
                  请假(算作已到)
                </a-radio>
              </a-radio-group>
              <div class="btn-group">
                <a-space :size="24">
                  <a-button size="small" @click="handleCancle">
                    取消
                  </a-button>
                  <a-button
                    type="primary"
                    size="small"
                    @click="handleSure(record, editData[col], col)"
                  >
                    确定
                  </a-button>
                </a-space>
              </div>
            </template>
            <a-tooltip placement="right">
              <template #title>
                <span>点击修改考勤状态</span>
              </template>
              <span
                class="bold"
                :class="getClass(record[`signTypeStr${record.id}${col}`])"
                @click="handleClick(record.id, col)"
              >
                {{ record[`signTypeStr${record.id}${col}`] }}
              </span>
            </a-tooltip>
          </a-popover>
        </template>
      </a-table>
    </div>
  </div>
  <a-empty
    v-show="isEmpty"
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>该班选课暂未结束，暂时没有学生名单</span>
    </template>
  </a-empty>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, watch } from 'vue';
import { MyClassService } from '@/request/api/model/class';
import { MyClassServicePresenter } from '@/request/api/presenter/class';
import { message } from 'ant-design-vue';
interface DataItem {
  key: number;
  name: string;
  age: number;
  address: string;
  address1: string;
  address2: string;
  count: string;
  grade: string;
}
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

    const columns = ref([
      // {
      //   title: '序号',
      //   width: 100,
      //   dataIndex: 'studentIndex',
      //   fixed: 'left',
      //   slots: { customRender: 'studentIndex' }
      // },
      {
        title: '学生',
        width: 120,
        dataIndex: 'name',
        fixed: 'left',
        slots: { customRender: 'name' }
      },
      {
        title: '已到次数',
        width: 100,
        dataIndex: 'signNumberStr',
        slots: { customRender: 'signNumberStr' }
      },
      {
        title: '考勤成绩',
        width: 100,
        dataIndex: 'achievement',
        slots: { customRender: 'achievement' }
      }
    ]);
    const data: DataItem[] = [];

    // 可编辑列 由后端动返回值动态生成
    const editCol: Ref<any[]> = ref([]);

    const dataSource = ref(data);
    const attainability = ref(1);
    const frequencyNum = ref(0);
    const attendanceNum = ref(0);
    const isEmpty = ref(false);

    const editData: any = reactive({});
    const currentKey = ref('');
    const currnentCol = ref('');

    const handleClick = (key: string, col: string) => {
      //todo 传入当前行信息
      editData[col] = '√';
      currentKey.value = key;
      currnentCol.value = col;
    };

    const handleCancle = () => {
      currentKey.value = '';
      currnentCol.value = '';
    };

    const resetColume = () => {
      editCol.value = [];
      columns.value = [
        // {
        //   title: '序号',
        //   width: 100,
        //   dataIndex: 'studentIndex',
        //   fixed: 'left',
        //   slots: { customRender: 'studentIndex' }
        // },
        {
          title: '学生',
          width: 120,
          dataIndex: 'name',
          fixed: 'left',
          slots: { customRender: 'name' }
        },
        {
          title: '已到次数',
          width: 100,
          dataIndex: 'signNumberStr',
          slots: { customRender: 'signNumberStr' }
        },
        {
          title: '考勤成绩',
          width: 100,
          dataIndex: 'achievement',
          slots: { customRender: 'achievement' }
        }
      ];
    };
    // 获取班级考勤列表
    const getRecordListByCourseId = async () => {
      console.log('获取班级考勤信息');

      resetColume();
      const params = {
        page: 1,
        size: 1000,
        courseId: props.courseId,
        query: formState.usernameOrNumber
      };
      try {
        const {
          attainabilityList,
          attainabilityType,
          attendanceNumber,
          frequency
        } = await MyClassServicePresenter.getRecordList(params);

        // 如果存在考勤数据  拼装动态column信息
        if (
          attainabilityList &&
          attainabilityList.length &&
          attainabilityList[0]?.attainabilityRecordList?.length
        ) {
          const oneColumnInfo = attainabilityList[0].attainabilityRecordList;

          oneColumnInfo.forEach((element: any) => {
            // 动态拼装列columns
            columns.value.push({
              title: element.weekNumberStr,
              width: 100,
              dataIndex: element.weekNumber,
              slots: { customRender: element.weekNumber }
            });
            // 可编辑列
            editCol.value.push(element.weekNumber);
          });
        }

        dataSource.value = attainabilityList;
        frequencyNum.value = frequency || 0;
        attendanceNum.value = attendanceNumber;
        attainability.value = attainabilityType;
        isEmpty.value = false;
      } catch (e) {
        console.log(e);
        message.warning(e?.message);
        if (e.code === 40011) {
          isEmpty.value = true;
        }
      }
    };
    const onSearch = () => {
      getRecordListByCourseId();
    };

    const handleSure = async (record: any, value: number, col: string) => {
      const params = {
        id: record[`columeId${record.id}${col}`],
        signType: value
      };
      try {
        await MyClassServicePresenter.updateSineType(params);
        handleCancle();
        message.success('修改成功！');
        getRecordListByCourseId();
      } catch (error) {
        console.log(error);
      }
    };

    watch(
      () => props.courseId,
      () => {
        getRecordListByCourseId();
      },
      {
        immediate: true
      }
    );
    const exportLoading = ref(false);
    const handleExport = async () => {
      const params = {
        courseId: props.courseId
      };
      exportLoading.value = true;
      try {
        await MyClassService.exportClassRecordList(params);
      } catch (error) {
        console.log(error);
      } finally {
        exportLoading.value = false;
      }
    };

    /**
     * @description: 根据考勤状态获取对应样式
     * @param {string} val
     * @return {string}
     */
    const getClass = (val: string) => {
      if (val === 'X') {
        return 'warn-text';
      } else if (val === '√') {
        return 'color-success';
      } else {
        return 'color-orange';
      }
    };

    return {
      dataSource,
      columns,
      editCol,
      handleClick,
      handleCancle,
      handleSure,
      editData,
      currentKey,
      currnentCol,
      attainability,
      frequencyNum,
      attendanceNum,
      isEmpty,
      handleExport,
      exportLoading,
      getClass,
      formState,
      onSearch
    };
  }
});
</script>

<style lang="less" scoped>
.main {
  background: #fff;
  padding: 24px;
  .header_space {
    display: flex;
    justify-content: space-between;
  }

  .table-box {
    margin-top: 24px;
  }
}
.btn-group {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
.nodata {
  margin-top: 90px;
}
.bold {
  font-weight: bold;
}
:deep(.ant-select-selection__rendered) {
  min-width: 60px;
}
:deep(.ant-table-thead > tr > th, .ant-table-tbody > tr > td) {
  height: 65px;
}
:deep(.ant-table-hide-scrollbar) {
  overflow: auto !important;
}
:deep(.ant-table-body) {
  overflow: auto !important;
}
// :deep(.ant-table-fixed-left table, .ant-table-fixed-right table) {
//   max-width: 500px;
// }
</style>
