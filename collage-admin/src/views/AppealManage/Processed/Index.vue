<template>
  <div class="content">
    <div>
      <a-form layout="inline" label-align="left">
        <a-form-item label="学生">
          <a-input
            v-model:value="form.studentNumber"
            placeholder="请输入学生学号"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="申诉时间">
          <a-select
            v-model:value="form.appealTime"
            placeholder="请选择"
            :options="apealTimeOptions"
            @change="sumDateTime"
          ></a-select>
        </a-form-item>
        <a-form-item v-show="form.appealTime === 0">
          <a-range-picker
            v-model:value="form.time"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
          />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
          <a-space :size="16">
            <a-button type="primary" @click="handleSearch">
              查询
            </a-button>
            <a-button @click="reset">
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <div class="table">
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        row-key="courseId"
        :pagination="false"
        :on-change="tableChange"
      >
        <template #name="record">
          {{ record.record.name }}
          <br />
          {{ record.record.studentNum }}
        </template>
        <template #handleStateStr="record">
          <span class="state">
            <div
              :class="
                record.record.handleState === 1
                  ? 'pointer_green'
                  : 'pointer_red'
              "
            >
              ·
            </div>
            {{ record.record.handleStateStr }}
          </span>
        </template>
        <template #operation="{ record}">
          <a @click="checkDetail(record)">查看详情</a>
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
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { router } from '@/router';
import { ApealManageServicePresenter } from '@/request/api/presenter/apeal';
import { useStore } from 'vuex';
import moment from 'moment';

export default defineComponent({
  setup() {
    const apealTimeOptions = ref([
      {
        value: 1,
        label: '近24小时'
      },
      {
        value: 3,
        label: '近3天'
      },
      {
        value: 7,
        label: '近7天'
      },
      {
        value: 0,
        label: '自定义时间范围'
      }
    ]);
    const store = useStore();
    const currentSemester = computed(() => store.state.basic.currentSemester); //当前学期信息

    const totalNum = ref<number>(0);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);

    const form = reactive({
      time: [],
      appealTime: undefined,
      studentNumber: '',
      startTime: 0,
      endTime: 0
    });
    const { resetFields } = useForm(form, reactive({}));
    const dataSource = ref<any>([]);

    const loading = ref<boolean>(false);

    const handleTimeOrder = ref(3); //时间排序

    const queryList = async () => {
      loading.value = true;

      const data = {
        appealTimeEnd: form.endTime,
        appealTimeStart: form.startTime,
        handleState: 1,
        num: form.studentNumber,
        page: current.value,
        semesterId: currentSemester.value.id,
        size: pageSize.value,
        handleTimeOrder: handleTimeOrder.value
      };
      try {
        const res = await ApealManageServicePresenter.getList(data);
        dataSource.value = res.items;
        totalNum.value = res.total;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };
    queryList();

    watch(
      () => currentSemester.value,
      () => {
        queryList();
      }
    );

    const columns = [
      {
        title: '学生',
        dataIndex: 'name',
        key: 'name',
        slots: { customRender: 'name' }
      },
      {
        title: '所在学院',
        dataIndex: 'collegeName',
        key: 'collegeName'
      },
      {
        title: '年级',
        dataIndex: 'year',
        key: 'year'
      },
      {
        title: '问题类型',
        dataIndex: 'appealTypeStr',
        key: 'appealTypeStr'
      },
      {
        title: '申诉结果',
        dataIndex: 'handleStateStr',
        key: 'handleStateStr',
        slots: { customRender: 'handleStateStr' }
      },
      {
        title: '申诉时间',
        dataIndex: 'appealTime',
        key: 'appealTime'
      },
      {
        title: '处理人',
        dataIndex: 'handlePersonName',
        key: 'handlePersonName'
      },
      {
        title: '处理时间',
        dataIndex: 'handleTime',
        key: 'handleTime',
        sortDirections: ['descend', 'ascend'],
        sorter: true
      },
      {
        title: '申诉反馈',
        dataIndex: 'appealTypeStr',
        key: 'appealTypeStr'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        slots: { customRender: 'operation' }
      }
    ];

    const tableChange = () => {
      switch (handleTimeOrder.value) {
        case 3:
          return (handleTimeOrder.value = 0), queryList();
        case 1:
          return (handleTimeOrder.value = 3), queryList();
        case 0:
          return (handleTimeOrder.value = 1), queryList();
      }
    };

    watch(
      () => pageSize.value,
      async () => {
        queryList();
      }
    );

    watch(
      () => current.value,
      async () => {
        queryList();
      }
    );

    const sumDateTime = (value: any) => {
      if (Number(value) !== 0) {
        form.startTime = Number(
          moment()
            .subtract(Number(value), 'days')
            .format('x')
        );
        form.endTime = Number(moment().format('x'));
        queryList();
      } else {
        //自定义时间
        form.startTime = 0;
        form.endTime = 0;
      }
    };

    const handleSearch = () => {
      if (form.appealTime === 0) {
        form.startTime = Number(moment(form.time[0]).format('x'));
        form.endTime = Number(moment(form.time[1]).format('x'));
        if (form.time.length === 0) {
          //自定义情况下 清空了自定义日期
          form.startTime = 0;
          form.endTime = 0;
        }
      }
      queryList();
    };
    const checkDetail = (value: any) => {
      const data1 = value.id;
      router.push({
        name: 'appealDetail',
        params: {
          data1
        }
      });
    };

    const reset = () => {
      resetFields();
      queryList();
    };
    return {
      //表格
      dataSource,
      columns,
      //表单
      form,
      reset,
      apealTimeOptions,
      //事件
      checkDetail,
      handleSearch,
      sumDateTime,
      tableChange,
      //状态
      loading,
      pageSize,
      totalNum,
      current
    };
  }
});
</script>
<style lang="less" scoped>
.content {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
.table {
  margin-top: 20px;
}

.state {
  position: relative;
  padding-left: 18px;

  .pointer_green {
    position: absolute;
    font-size: 60px;
    color: #10c700;
    top: -43px;
  }
  .pointer_red {
    position: absolute;
    font-size: 60px;
    color: #ff1919;
    top: -43px;
  }
}
</style>
