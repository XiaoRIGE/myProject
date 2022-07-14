<template>
  <div v-if="yearListRef.length" class="test-wrap">
    <div class="header">
      <a-button class="add-new-year" type="primary" @click="showModal">
        新增年份
      </a-button>
      <p>
        录入项为国家标准规定项目，包括引体向上/仰卧起坐、800/1000米、身高体重、立定跳远、坐位体前屈、50米、肺活量、视力
      </p>
      <div v-if="currntActiveRearInfo.data.id" class="header-content">
        <div class="box">
          <p class="entryyear">
            录入年份
          </p>
          <p class="box-p">
            <span class="box-year">{{ currntActiveRearInfo.data.year }}年</span>
            <span
              v-if="currntActiveRearInfo.data.dataStatus"
              class="box-have-data"
            >
              有数据
            </span>
            <span v-else class="box-no-data">无数据</span>
          </p>
        </div>
      </div>
    </div>
    <div class="content">
      <div v-for="item in yearListRef" :key="item.id" class="box">
        <p class="box-p">
          <span class="box-year">{{ item.year }}年</span>
          <span v-if="item.dataStatus" class="box-have-data">有数据</span>
          <span v-else class="box-no-data">无数据</span>
        </p>
        <div class="box-btn">
          <span class="set-entryyear">
            <a-popconfirm
              title="你确定要将2021年设为录入年吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleSetYear(item.id)"
            >
              <!-- 当前年和下一年判断 -->
              <a-tooltip v-if="!item.check" placement="top">
                <template #title>
                  <span>仅可设置当前年及下一年</span>
                </template>
                <a-button type="link" disabled>设为录入年</a-button>
              </a-tooltip>
              <a-button v-else type="link">设为录入年</a-button>
            </a-popconfirm>
          </span>
          <span class="box-cross">|</span>
          <a-tooltip v-if="item.dataStatus" placement="top">
            <template #title>
              <span>有学生体测数据，不可删除</span>
            </template>
            <a-button type="link" disabled>
              删除此年份
            </a-button>
          </a-tooltip>
          <a-button
            v-else
            type="link"
            class="warn-text"
            @click="delYear(item.year, item.id)"
          >
            删除此年份
          </a-button>
        </div>
      </div>
    </div>
  </div>

  <!-- 没有任何年份时显示 -->
  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>暂无可录入年份</span>
    </template>
    <a-space :size="32">
      <a-button type="primary" @click="showModal">
        新增年份
      </a-button>
    </a-space>
  </a-empty>

  <a-modal
    v-model:visible="visible"
    title="新增年份"
    centered
    @ok="handleOk"
    @cancel="hideModal"
  >
    <template #footer>
      <a-button key="back" @click="hideModal">
        取消
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loadingRef"
        :disabled="chooseTagRef"
        @click="handleOk"
      >
        保存
      </a-button>
    </template>
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="年份">
        <a-radio-group v-model:value="yearInfo.resource">
          <a-radio
            v-for="item in chooseyearListRef"
            :key="item.year"
            :value="item.year"
            :disabled="item.check"
          >
            {{ item.year }}年
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="!chooseTagRef">
        <a-checkbox-group v-model:value="yearInfo.checked">
          <a-checkbox :value="1" name="year">
            设置为录入年份
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item v-else>
        <a-button type="link" disabled>
          已添加全部可选年份
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
import { getModalHeadVNode } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import { PhysicalConfigPresenter } from '@/request/api/presenter/physical';

interface PhysicalConfigListResponse {
  check: boolean;
  dataStatus: boolean;
  id: string;
  tag: boolean;
  year: number;
}

export default defineComponent({
  setup() {
    // 当前录入年信息
    const currntActiveRearInfo = reactive({
      data: {
        check: false,
        dataStatus: false,
        id: '',
        tag: false,
        year: 0
      }
    });

    const yearListRef = ref<PhysicalConfigListResponse[]>([]); //体测配置年份列表

    // 获取体测配置列表信息
    const getList = async () => {
      try {
        const data = await PhysicalConfigPresenter.list();
        yearListRef.value = data.list;
        if (data.currentYearInfo) {
          currntActiveRearInfo.data = data.currentYearInfo;
        } else {
          currntActiveRearInfo.data = {
            check: false,
            dataStatus: false,
            id: '',
            tag: false,
            year: 0
          };
        }
      } catch (error) {
        console.log(error);
      }
    };

    getList();

    // 弹窗数据
    const yearInfo = reactive({
      resource: 0,
      checked: [1]
    });
    const visible = ref<boolean>(false); //新增年份弹窗
    const chooseyearListRef = ref<any[]>(); //可选年份
    const chooseTagRef = ref<boolean>(false); //是否最近可选新增年都已存在

    // 获取可新增年份
    const getYearList = async () => {
      try {
        const data = await PhysicalConfigPresenter.getYearList();
        chooseyearListRef.value = data.list;
        chooseTagRef.value = data.tag;
        if (chooseTagRef.value) {
          yearInfo.checked = [];
        } else {
          yearInfo.checked = [1];
          // 默认选中当前年
          // const now = new Date().getFullYear();
          // yearInfo.resource = now;
          if (chooseyearListRef.value?.length) {
            yearInfo.resource = chooseyearListRef.value[0].year;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    watch(
      () => visible.value,
      () => {
        if (visible.value) {
          getYearList();
        }
      }
    );

    // 删除录入年份
    const deleteYear = async (id: string) => {
      const params = {
        id
      };
      try {
        await PhysicalConfigPresenter.delYear(params);
        message.success('删除成功！');
        getList();
      } catch (error) {
        Modal.error({
          title: '删除失败',
          content: error?.message
        });
      }
    };

    // 点击删除年份
    const delYear = (year: string, id: string) => {
      const titleVnode = getModalHeadVNode(`确定要删除${year}年吗？`);
      Modal.confirm({
        title: titleVnode,
        class: 'modal-class',
        async onOk() {
          deleteYear(id);
        }
      });
    };

    // 设置为录入年
    const handleSetYear = async (id: string) => {
      const params = {
        id
      };
      try {
        await PhysicalConfigPresenter.setYear(params);
        message.success('设置成功！');
        getList();
      } catch (error) {
        Modal.error({
          title: '设置失败',
          content: error?.message
        });
      }
    };

    const showModal = () => {
      visible.value = true;
    };

    const hideModal = () => {
      visible.value = false;
    };
    const loadingRef = ref<boolean>(false); //保存loading

    // 新增录入年份
    const addYear = async () => {
      if (!yearInfo.resource) {
        message.warning('请先选择要新增的年份！');
        return;
      }
      const params = {
        tag: yearInfo.checked.includes(1),
        year: yearInfo.resource
      };

      loadingRef.value = true;
      try {
        await PhysicalConfigPresenter.add(params);
        message.success('新增成功！');
        yearInfo.resource = 0;
        getList();
      } catch (error) {
        Modal.error({
          title: '新增失败',
          content: error?.message
        });
      } finally {
        loadingRef.value = false;
        hideModal();
      }
    };
    // 点击保存
    const handleOk = () => {
      addYear();
    };
    return {
      currntActiveRearInfo,
      yearListRef,
      chooseyearListRef,
      visible,
      chooseTagRef,
      yearInfo,
      loadingRef,
      handleSetYear,
      hideModal,
      showModal,
      delYear,
      handleOk
    };
  }
});
</script>

<style lang="less" scoped>
.test-wrap {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
  .header {
    border-bottom: 1px dashed #c0c0c0;
    .add-new-year {
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  .content {
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
  }
  .box {
    border: 1px solid #c0c0c0;
    width: 20%;
    position: relative;
    margin-bottom: 30px;
    margin-right: 5%;
    padding: 25px 20px 0px 20px;
    border-radius: 5px;
    .entryyear {
      margin-bottom: 5px;
    }
    .box-p {
      display: flex;
      justify-content: space-between;
      .box-year {
        font-weight: 700;
        font-size: 18px;
      }
      .box-have-data {
        border: 1px solid #b7eb8f;
        background: #f6ffed;
        color: rgb(56, 158, 13);
        line-height: 26px;
        padding: 0 5px;
      }
      .box-no-data {
        border: 1px solid #ccc;
        background: #f6f6f6;
        color: #797979;
        line-height: 26px;
        padding: 0 5px;
      }
    }
    .box-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #c0c0c0;
      padding: 10px 15px;
      .set-entryyear {
        color: #1966fe;
      }
      .del-year {
        color: #ff3939;
        cursor: pointer;
      }
      .box-cross {
        color: #c0c0c0;
      }
    }
  }
}
.nodata {
  margin-top: 90px;
}
</style>
