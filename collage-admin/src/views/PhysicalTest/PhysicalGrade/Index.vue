<!--
 * @Author: your name
 * @Date: 2021-07-26 14:53:00
 * @LastEditTime: 2021-10-15 14:11:25
 * @LastEditors: Please set LastEditors
 * @Description: 体测成绩（全校）
 * @FilePath: \collage-admin\src\views\PhysicalTest\PhysicalGrade\Index.vue
-->

<template>
  <div class="year">
    <a-form layout="inline">
      <a-form-item label="年份">
        <a-select v-model:value="yaerRef">
          <a-select-option
            v-for="item in yearListRef"
            :key="item.id"
            :value="item.year"
          >
            {{ item.year }}年
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
  <div class="content">
    <div class="base-info">
      <div class="pie-box">
        <a-spin :spinning="spinningRef">
          <pie-chart :charts-data="chartsData" />
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
        <a-form-item label="学生">
          <a-input
            v-model:value="formState.organizationUserNumber"
            placeholder="请输入学生学号"
            allow-clear
            @change="loadFirstPage"
          />
        </a-form-item>
        <a-form-item label="年级">
          <a-select
            v-model:value="formState.years"
            placeholder="请选择"
            allow-clear
            mode="multiple"
            @change="loadFirstPage"
          >
            <a-select-option :value="0">
              全部
            </a-select-option>
            <a-select-option
              v-for="item in gradeList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.value }}
            </a-select-option>
          </a-select>
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
        <a-row>
          <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
            <a-popover
              v-model:visible="exportPopoverStandardVisibleRef"
              trigger="click"
            >
              <template #content>
                <div class="cursor btn-item" @click="handleDownload(0, 3)">
                  导出全部国标体测
                </div>
                <div class="cursor btn-item" @click="handleDownload(1, 4)">
                  导出已测完国标体测
                </div>
              </template>
              <a-button :loading="templateStandLoadingRef">
                导出国标体测
              </a-button>
            </a-popover>
          </a-form-item>

          <a-form-item
            :wrapper-col="{ span: 4, offset: 0 }"
            class="download_right"
          >
            <a-popover
              v-model:visible="exportPopoverVisibleRef"
              trigger="click"
            >
              <template #content>
                <div class="cursor btn-item" @click="handleDownload(0, 1)">
                  导出全部体测详情
                </div>
                <div class="cursor btn-item" @click="handleDownload(1, 2)">
                  导出已测完体测详情
                </div>
              </template>
              <a-button :loading="templateLoadingRef">
                导出体测详情
              </a-button>
            </a-popover>
          </a-form-item>
        </a-row>
      </a-form>
      <!-- 体测列表组件 -->
      <physical-test-table
        :sex="formState.sex"
        :list-data="listData"
        :input-year="yaerRef"
        :loading="tableLoadingRef"
        :current-page="currentRef"
        @refresh-list="refresh"
      />
    </div>
  </div>
</template>

<script lang="ts">
import PhysicalTestTable from '@/components/global/PhysicalTestTable.vue';
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import {
  PhysicalConfigPresenter,
  PhysicalTestPresenter
} from '@/request/api/presenter/physical';
import { useForm } from '@ant-design-vue/use';
import { PhysicalTestService } from '@/request/api/model/physical';
import { useStore } from 'vuex';
export default defineComponent({
  components: { PhysicalTestTable },
  setup() {
    // 搜索表单
    const formState = reactive({
      organizationUserNumber: '',
      sex: 0,
      years: [0]
    });

    const { resetFields } = useForm(formState, {});

    const yearListRef = ref<any[]>([]); //体测配置年份下拉列表
    const yaerRef = ref<number>(2020); //选择年份

    // 获取体测配置年下拉信息
    const getList = async () => {
      try {
        const data = await PhysicalConfigPresenter.list();
        yearListRef.value = data.list;
        if (data.currentYearInfo) {
          // 存在录入年 则查询录入年体测列表
          yaerRef.value = data.currentYearInfo.year;
        } else if (data.list && data.list.length) {
          // 不存在录入年 则查询第一个年份体测列表
          yaerRef.value = data.list[0].year;
        }
      } catch (error) {
        console.log(error);
      }
    };

    getList();

    // 获取年份下拉
    const store = useStore();
    const gradeList = computed(() => store.state.basic.gradeList);
    store.dispatch('basic/updateGradeList');

    const exportPopoverVisibleRef = ref<boolean>(false); //导出visible
    const exportPopoverStandardVisibleRef = ref<boolean>(false); //导出国标visible
    const templateLoadingRef = ref<boolean>(false); //导出loading
    const templateStandLoadingRef = ref<boolean>(false); //导出国标loading
    // 导出
    const handleDownload = async (type: number, value: number) => {
      //value 1 2 体测详情    3 4国标
      const params = {
        gender: formState.sex,
        inputYear: yaerRef.value,
        organizationUserNumber: formState.organizationUserNumber,
        years: formState.years,
        type
      };
      if (params.years.includes(0)) {
        params.years = [];
      }
      if (value === 1 || value === 2) {
        templateLoadingRef.value = true;
        exportPopoverVisibleRef.value = false;
        try {
          await PhysicalTestService.exportSchoolList(params);
        } catch (error) {
          console.log(error);
        } finally {
          templateLoadingRef.value = false;
        }
      } else {
        templateStandLoadingRef.value = true;
        exportPopoverStandardVisibleRef.value = false;
        try {
          await PhysicalTestService.exportStandardSchoolList(params);
        } catch (error) {
          console.log(error);
        } finally {
          templateStandLoadingRef.value = false;
        }
      }
    };

    const listData: any = ref([]); //体测列表数据
    const pageSizeRef = ref<number>(10);
    const currentRef = ref<number>(1);
    const tableLoadingRef = ref<boolean>(false);
    // 获取体测列表
    const handleSearch = async () => {
      const params = {
        gender: formState.sex,
        inputYear: yaerRef.value,
        offsetPage: 0,
        organizationUserNumber: formState.organizationUserNumber,
        page: currentRef.value,
        size: pageSizeRef.value,
        years: formState.years
      };
      if (params.years.includes(0) && params.years.length < 2) {
        //年级筛选全部：数组为空   年级筛选有年级：删除全部选项
        params.years = [];
      } else {
        if (params.years.includes(0)) {
          params.years.splice(params.years.indexOf(0), 1);
        }
      }

      tableLoadingRef.value = true;
      try {
        const data = await PhysicalTestPresenter.schoolList(params);
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

    const refresh = (obj: any) => {
      pageSizeRef.value = obj.pageSize;
      currentRef.value = obj.current;
      handleSearch();
    };

    const handleReset = () => {
      resetFields();
      loadFirstPage();
    };

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
    // 获取体测统计
    const getCount = async () => {
      const params = {
        year: yaerRef.value
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
        } = await PhysicalTestPresenter.schoolCount(params);
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

    watch(
      () => yaerRef.value,
      () => {
        // handleSearch();
        loadFirstPage();
        getCount();
      }
    );

    return {
      formState,
      yaerRef,
      yearListRef,
      exportPopoverVisibleRef,
      exportPopoverStandardVisibleRef,
      templateLoadingRef,
      spinningRef,
      tableLoadingRef,
      chartsData,
      averageData,
      listData,
      handleDownload,
      handleSearch,
      loadFirstPage,
      handleReset,
      refresh,
      gradeList,
      currentRef,
      templateStandLoadingRef
    };
  }
});
</script>

<style lang="less" scoped>
.year {
  padding: 0 24px;
  background: #fff;
}
.content {
  margin: 24px;
}
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
.btn-item {
  line-height: 32px;
  &:nth-child(1) {
    border-bottom: 1px solid #f0f2f5;
  }
}
.download_right {
  margin-left: -60px;
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
