<template>
  <div v-show="!isEmpty" class="activity-attendance-container">
    <!-- 课外活动操作(导出、搜索) -->
    <div class="operation">
      <div>
        <a-button :loading="exportLoading" type="primary" @click="exportHandle">
          导出活动数据
        </a-button>
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
    </div>
    <!-- 课外活动(表格) -->
    <div class="table-box">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        row-key="key"
        :pagination="false"
      >
        <template #name="{ record }">
          <div>{{ record.name }}({{ record.sex === 1 ? '男' : '女' }})</div>
          <div>{{ record.number }}</div>
        </template>
        <template #signedTimes="{ record }">
          <div>{{ record.signedTimes || 0 }}</div>
        </template>
        <template #totalTimes="{ record }">
          <div>{{ record.totalTimes || 0 }}</div>
        </template>
      </a-table>
      <a-pagination
        v-model:current="current"
        v-model:pageSize="pageSize"
        :show-total="total => `共 ${total} 条`"
        class="pagination"
        :total="total"
      />
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
      <span>目前没有学生选择或被分配入当前班级</span>
    </template>
  </a-empty>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, Ref, computed } from 'vue';
import { useStore } from 'vuex';
import { MyClassServicePresenter } from '@/request/api/presenter/class';
import { MyClassService } from '@/request/api/model/class';
// import { message } from 'ant-design-vue';

interface ListItem {
  key: number;
  name: string;
  number: number;
  sex: number;
  signedTimes: number;
  totalTimes: number;
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

    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const total = ref<number>(0);
    const type = ref<number>(0);
    const isEmpty = ref(false);
    const exportLoading = ref(false);
    const loading = ref<boolean>(false);
    const columns = ref([
      {
        title: '序号',
        width: 100,
        dataIndex: 'key',
        fixed: 'left',
        slots: { customRender: 'key' }
      },
      {
        title: '学生',
        dataIndex: 'name',
        fixed: 'left',
        slots: { customRender: 'name' }
      },
      {
        title: '已签到次数',
        dataIndex: 'signedTimes',
        slots: { customRender: 'signedTimes' }
      },
      {
        title: '应签到次数',
        dataIndex: 'totalTimes',
        slots: { customRender: 'totalTimes' }
      }
    ]);

    const dataSource: Ref<ListItem[]> = ref([]);

    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

    /**
     * @description 获取课外活动列表
     */
    const getStudentActivityList = async () => {
      loading.value = true;
      const params = {
        page: current.value,
        size: pageSize.value,
        courseId: props.courseId,
        semesterId: currentSemester.value.id
      };
      try {
        const res = await MyClassServicePresenter.getActivityList(params);
        if (res.items.length > 0) {
          dataSource.value = res.items;
          total.value = res.total;
        } else {
          isEmpty.value = true;
        }
      } catch (err) {
        console.log(err);
        // message.warning(err?.message);
      } finally {
        loading.value = false;
      }
    };
    /**
     * @description 查询学生课外活动列表
     */
    const queryActivityList = async () => {
      loading.value = true;
      const params = {
        page: current.value,
        size: pageSize.value,
        param: formState.usernameOrNumber,
        type: type.value
      };
      try {
        const res = await MyClassServicePresenter.queryActivityList(params);
        dataSource.value = res.items;
        total.value = res.total;
      } catch (err) {
        console.log(err);
        // message.warning(err?.message);
      } finally {
        loading.value = false;
      }
    };

    /**
     * @description 点击搜索
     */
    const onSearch = async () => {
      const reg = /^\d+$/;
      const value = formState.usernameOrNumber;
      current.value = 1;
      if (value) {
        // 有搜索值调用查询接口
        if (reg.test(value)) {
          // 全是数字，查学号
          type.value = 1;
        } else {
          // 查姓名
          type.value = 0;
        }
        queryActivityList();
      } else {
        // 没有搜索值调用列表接口
        getStudentActivityList();
      }
    };

    /**
     * @description 导出课外活动
     */
    const exportHandle = async () => {
      const params = {
        courseId: props.courseId,
        semesterId: currentSemester.value.id
      };
      exportLoading.value = true;
      try {
        await MyClassService.exportStudentActivityList(params);
      } catch (error) {
        console.log(error);
      } finally {
        exportLoading.value = false;
      }
    };

    watch(
      () => props.courseId,
      () => {
        dataSource.value = [];
        current.value = 1;
        getStudentActivityList();
        formState.usernameOrNumber = '';
      },
      {
        immediate: true
      }
    );
    watch(
      () => current.value,
      async () => {
        // 页码改变且无搜索时，调用课外活动列表接口
        if (!formState.usernameOrNumber) {
          getStudentActivityList();
        }
      }
    );

    getStudentActivityList();

    return {
      formState,
      columns,
      dataSource,
      pageSize,
      current,
      total,
      isEmpty,
      exportLoading,
      loading,
      onSearch,
      getStudentActivityList,
      queryActivityList,
      exportHandle
    };
  }
});
</script>

<style lang="less" scoped>
.activity-attendance-container {
  background: #fff;
  padding: 16px;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}
.nodata {
  margin-top: 90px;
}
</style>
