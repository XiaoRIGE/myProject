<!--
 * @Author: your name
 * @Date: 2021-08-11 11:42:09
 * @LastEditTime: 2021-10-15 14:05:44
 * @LastEditors: Please set LastEditors
 * @Description: 我的班级-体质测试
 * @FilePath: \collage-admin\src\views\ClassSetting\MyClassInfo\ClassDetail\PhysicalTest\Index.vue
-->
<template>
  <div class="base-info">
    <div class="pie-box">
      <a-spin :spinning="spinningRef">
        <pie-chart :charts-data="chartsData" title="班级达标率" />
      </a-spin>
    </div>
    <div class="average">
      <a-spin :spinning="spinningRef">
        <average :average-data="averageData" />
      </a-spin>
    </div>
  </div>
  <div class="list-box">
    <a-form :model="formState" layout="inline" label-align="left">
      <a-row type="flex" justify="space-between">
        <a-col :span="16">
          <a-form-item label="学生">
            <a-input
              v-model:value="formState.usernameOrNumber"
              placeholder="请输入学生学号"
              allow-clear
              @change="loadFirstPage"
            />
          </a-form-item>
          <a-form-item label="性别">
            <a-select
              v-model:value="formState.sex"
              placeholder="请选择"
              allow-clear
              @change="loadFirstPage"
            >
              <a-select-option :value="0">
                全部
              </a-select-option>
              <a-select-option :value="1">
                男
              </a-select-option>
              <a-select-option :value="2">
                女
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
            <a-space :size="16">
              <a-button type="primary" @click="loadFirstPage">
                查询
              </a-button>
              <a-button @click="handleReset">
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-col>
        <a-col :span="2.5">
          <a-button
            class="standard"
            :loading="exportStandardLoading"
            @click="handleExport(2)"
          >
            导出班级国标体测
          </a-button>
          <a-button :loading="exportLoading" @click="handleExport(1)">
            导出班级体测详情
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <!-- 体测列表组件 -->
    <physical-test-table
      :sex="formState.sex"
      :list-data="listData"
      :input-year="null"
      :loading="tableLoadingRef"
      :current-page="currentRef"
      @refresh-list="refresh"
    />
  </div>
</template>

<script lang="ts">
import { PhysicalTestPresenter } from '@/request/api/presenter/physical';
import { defineComponent, reactive, ref, watch } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { PhysicalTestService } from '@/request/api/model/physical';

export default defineComponent({
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const formState = reactive({
      usernameOrNumber: '',
      sex: 0
    });
    const { resetFields } = useForm(formState, {});

    const chartsData = reactive({
      allSchoolReachRate: 0, //全校达标率
      excellent: {
        percentage: 0,
        number: 0
      }, //优秀
      good: {
        percentage: 0,
        number: 0
      }, //良好
      passrate: {
        percentage: 0,
        number: 0
      }, //及格
      flunk: {
        percentage: 0,
        number: 0
      }, //不及格
      unconfirmed: {
        percentage: 0,
        number: 0
      } //未测完
    }); //体测达标率数据

    const averageData = reactive({
      allSchoolAverage: 0, //全校平均分
      men: 0, //男生分数
      women: 0 //女生分数
    }); //平均分数据

    const spinningRef = ref<boolean>(false);
    const getCount = async () => {
      const params = {
        courseId: props.courseId
      };
      spinningRef.value = true;
      try {
        const {
          allSchoolReachRate,
          excellent,
          good,
          passrate,
          flunk,
          unconfirmed,
          average,
          averageForMan,
          averageForWoman
        } = await PhysicalTestPresenter.count(params);
        // 达标率
        chartsData.allSchoolReachRate = allSchoolReachRate;
        chartsData.excellent = excellent;
        chartsData.good = good;
        chartsData.passrate = passrate;
        chartsData.flunk = flunk;
        chartsData.unconfirmed = unconfirmed;
        // 平均分
        averageData.allSchoolAverage = average;
        averageData.men = averageForMan;
        averageData.women = averageForWoman;
      } catch (error) {
        console.log(error);
      } finally {
        spinningRef.value = false;
      }
    };

    const listData: any = ref([]); //体测列表数据
    const pageSizeRef = ref<number>(10);
    const currentRef = ref<number>(1);
    const tableLoadingRef = ref<boolean>(false);
    // 获取体测列表
    const handleSearch = async () => {
      const params = {
        courseId: props.courseId,
        gender: formState.sex,
        offsetPage: 0,
        organizationUserNumber: formState.usernameOrNumber,
        page: currentRef.value,
        size: pageSizeRef.value
      };
      tableLoadingRef.value = true;
      try {
        const data = await PhysicalTestPresenter.list(params);
        listData.value = data;
      } catch (error) {
        console.log(error);
      } finally {
        tableLoadingRef.value = false;
      }
    };

    const loadFirstPage = () => {
      currentRef.value = 1;
      handleSearch();
    };

    const exportLoading = ref<boolean>(false);
    const exportStandardLoading = ref<boolean>(false);
    const handleExport = async (value: number) => {
      //value 1 详情   value 2 国标
      const params = {
        gender: formState.sex,
        courseId: props.courseId,
        organizationUserNumber: formState.usernameOrNumber
      };
      if (value === 1) {
        exportLoading.value = true;
        try {
          await PhysicalTestService.exportList(params);
        } catch (error) {
          console.log(error);
        } finally {
          exportLoading.value = false;
        }
      } else {
        exportStandardLoading.value = true;
        try {
          await PhysicalTestService.exportStandardList(params);
        } catch (error) {
          console.log(error);
        } finally {
          exportStandardLoading.value = false;
        }
      }
    };

    watch(
      () => props.courseId,
      () => {
        getCount();
        handleSearch();
      }
    );

    const refresh = (obj: any) => {
      pageSizeRef.value = obj.pageSize;
      currentRef.value = obj.current;
      handleSearch();
    };
    const handleReset = () => {
      resetFields();
      // handleSearch();
      loadFirstPage();
    };

    getCount();
    handleSearch();
    return {
      formState,
      chartsData,
      listData,
      spinningRef,
      tableLoadingRef,
      averageData,
      exportLoading,
      exportStandardLoading,
      refresh,
      handleSearch,
      loadFirstPage,
      currentRef,
      handleReset,
      handleExport
    };
  }
});
</script>

<style lang="less" scoped>
.base-info {
  display: flex;
  justify-content: space-between;
  .pie-box {
    margin-right: 16px;
    width: 70%;
    height: 300px;
    background: #fff;
    border-radius: 8px;
  }
  .average {
    width: 30%;
    height: 300px;
    background: #fff;
    border-radius: 8px;
  }
}
.list-box {
  margin-top: 16px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}
.standard {
  margin-right: 24px;
}
:deep(.form .ant-select, form .ant-cascader-picker) {
  width: 100%;
}
:deep(.ant-form-item-control-wrapper) {
  min-width: 190px;
}
:deep(.ant-form-item) {
  margin-bottom: 24px !important;
  margin-right: 24px !important;
}
</style>
