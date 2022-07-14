<template>
  <div class="list-content">
    <div class="operation">
      <a-form :model="formState" layout="inline">
        <a-form-item label="学生">
          <a-input-search
            v-model:value="formState.usernameOrNumber"
            show-clear
            placeholder="请输入学生姓名或学号"
            @search="handleSearch"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="table-content">
      <div v-if="tableDataRef.length">
        <a-table
          :columns="columns"
          :data-source="tableDataRef"
          :pagination="pagination"
          :loading="tableLoading"
          row-key="userId"
        >
          <template #name="{ record }">
            <div>{{ record.name }}({{ record.sex }})</div>
            <div>{{ record.number }}</div>
          </template>
          <template #validGrade="{record}">
            <span>
              {{ record.validGrade || 0 }}/{{ record.semesterTarget || 0 }}
            </span>
          </template>
          <template #operation="{record}">
            <a-button
              type="link"
              class="no-padding"
              :disabled="record.validGrade === null"
              @click="handleDetail(record)"
            >
              运动详情
            </a-button>
          </template>
        </a-table>
      </div>

      <a-empty
        v-else
        class="nodata"
        :image-style="{
          height: '74px'
        }"
      >
        <template #description>
          <span>目前没有学生选择或被分配入当前班级</span>
        </template>
      </a-empty>
    </div>
    <StudentSportsDetail
      :showvisible="showvisible"
      :user-info="userInfo"
      @close="showvisible = false"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import StudentSportsDetail from './StudentSportsDetail/Index.vue';
import { AImovementPresenter } from '@/request/api/presenter/class';
import { useStore } from 'vuex';
interface StudentItem {
  grade: number;
  name: string;
  number: string;
  semesterTarget: number;
  sex: string;
  userId: string;
  validGrade: number;
}
interface studentInfo {
  name: string;
  number: string;
  sex: string;
  userId: string;
  validGrade: number;
  semesterTarget: number;
}
export default defineComponent({
  components: { StudentSportsDetail },
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

    const tableLoading = ref<boolean>(false);
    const columns = [
      {
        title: '学生',
        dataIndex: 'name',
        slots: { customRender: 'name' }
      },
      {
        title: '累计有效得分',
        dataIndex: 'validGrade',
        slots: { customRender: 'validGrade' }
      },
      {
        title: '成绩',
        dataIndex: 'grade'
      },
      {
        title: '操作',
        slots: { customRender: 'operation' }
      }
    ];
    const tableDataRef = ref<StudentItem[]>([]);

    const pageSizeRef = ref<number>(10);
    const current = ref<number>(1);
    const totalNumRef = ref<number>(0);
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

    // 获取AI运动学生列表
    const getStudentList = async () => {
      const params = {
        courseId: props.courseId,
        queryItem: formState.usernameOrNumber,
        page: current.value,
        size: pageSizeRef.value,
        semesterId: currentSemester.value.id
      };
      try {
        tableLoading.value = true;
        const data = await AImovementPresenter.getList(params);

        totalNumRef.value = data?.total || 0;
        tableDataRef.value = data?.grades || [];
      } catch (error) {
        console.log(error);
      } finally {
        tableLoading.value = false;
      }
    };
    getStudentList();

    /**
     * @description: 分页配置
     */
    const pagination = reactive({
      showTotal: (total: number) => `共计 ${total} 条数据`,
      current,
      total: totalNumRef,
      defaultPageSize: pageSizeRef,
      onChange: (currentVal: number) => {
        current.value = currentVal;
        getStudentList();
      }
    });
    // 姓名和学号过滤
    const handleSearch = () => {
      current.value = 1;
      getStudentList();
    };
    // 切换班级
    watch(
      () => props.courseId,
      () => {
        if (props.courseId) {
          handleSearch();
        } else {
          tableDataRef.value = [];
          totalNumRef.value = 0;
        }
      }
    );

    const showvisible = ref<boolean>(false);
    const handleShow = () => {
      showvisible.value = true;
    };

    // 点击学生基本信息
    const userInfo: studentInfo = reactive({
      name: '',
      number: '',
      sex: '男',
      userId: '',
      validGrade: 0,
      semesterTarget: 0
    });

    /**
     * @description: 查看详情
     * @param {StudentItem} item 传入学生基本信息
     */
    const handleDetail = (item: StudentItem) => {
      const { name, number, sex, userId, validGrade, semesterTarget } = item;
      userInfo.name = name;
      userInfo.number = number;
      userInfo.sex = sex;
      userInfo.userId = userId;
      userInfo.validGrade = validGrade;
      userInfo.semesterTarget = semesterTarget;

      handleShow();
    };

    return {
      formState,
      tableLoading,
      columns,
      pagination,
      tableDataRef,
      handleDetail,
      handleSearch,
      showvisible,
      userInfo
    };
  }
});
</script>

<style lang="less" scoped>
.list-content {
  background: #fff;
  padding: 16px;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .no-padding {
    padding: 0;
  }
}
</style>
