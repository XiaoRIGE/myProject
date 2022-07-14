<template>
  <div class="container">
    <div class="container-header">
      <a-form layout="inline" :model="formData">
        <a-form-item label="校区">
          <a-select v-model:value="formData.schoolArea" style="width: 200px">
            <a-select-option
              v-for="item in schoolArea"
              :key="item.label"
              :value="item.id"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="点位">
          <a-cascader
            v-model:value="formData.point"
            :options="options"
            expand-trigger="hover"
            placeholder="全部 / 全部"
          />
        </a-form-item>
        <a-form-item label="处理状态">
          <a-select v-model:value="formData.state" style="width: 200px">
            <a-select-option
              v-for="item in FACESTATE"
              :key="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="日期时间">
          <a-range-picker v-model:value="formData.date" />
        </a-form-item>
        <a-form-item label="学生">
          <a-input
            v-model:value="formData.studentText"
            placeholder="请输入学生学号或姓名"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            :style="{ marginRight: '20px' }"
            @click="searchList"
          >
            查 询
          </a-button>
          <a-button @click="resetForm">重 置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="dataList"
        row-key="name"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #timer="{ record }">
          <span>
            {{
              `${moment(record.uploadingTime).format('YYYY-MM-DD HH:mm:ss')}`
            }}
          </span>
        </template>
        <template #namenumber="{ record }">
          <span>{{ `${record.name} ${record.number}` }}</span>
        </template>
        <template #action="{ record }">
          <span>
            <span v-if="record.state === 1">暂未处理</span>
            <span v-else-if="record.state === 2" :style="{ color: '#5cd668' }">
              {{ `▲ 有效, ${record.unEffectiveReason}` }}
            </span>
            <span v-else-if="record.state === 3" :style="{ color: '#E65A6B' }">
              {{ `无效: ${record.unEffectiveReason}` }}
            </span>
            <span v-else-if="record.state === 4" :style="{ color: '#c8c8c8' }">
              重复打卡
            </span>
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useTableConfig from './useTableConfig';
import useGetRecordPage from './useGetRecordPage';
import moment from 'moment';

export default defineComponent({
  setup() {
    const { formData, ...restParams } = useTableConfig();

    return {
      ...restParams,
      formData,
      moment,
      ...useGetRecordPage(formData)
    };
  }
});
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
}
</style>
