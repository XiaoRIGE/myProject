<!--
 * @Author: lyh
 * @Date: 2021-07-23 09:37:17
 * @LastEditTime: 2021-09-24 17:58:12
 * @LastEditors: Please set LastEditors
 * @Description: 学校设置 校区设置
 * @FilePath: \collage-admin\src\views\ComprehensiveSetting\SchoolSetting\CampusSetting\SchoolCampus.vue
-->
<template>
  <div v-if="campusList.length > 0" class="test-wrap">
    <div class="new-project">
      <a-button type="primary" @click="showModal">
        新增校区
      </a-button>
    </div>
    <div class="curriculum-provision-table">
      <a-table
        :columns="columns"
        :data-source="campusList"
        :loading="loading"
        row-key="id"
        :pagination="campusList.length > 10"
      >
        <template #action="{record}">
          <a class="update" @click="upDate(record)">编辑</a>
          <a class="delate" @click="delate(record)">删除</a>
        </template>
      </a-table>
    </div>
    <a-pagination
      v-model:current="current"
      v-model:pageSize="pageSize"
      :show-total="total => `共 ${total} 条`"
      :hide-on-single-page="true"
      class="pagination"
      :total="totalNum"
    />
  </div>

  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>您还没有添加任何校区，添加后才能进行课程配置</span>
    </template>
    <a-button type="primary" @click="showModal">
      +&emsp;添加校区
    </a-button>
  </a-empty>

  <a-modal
    v-model:visible="visible"
    :mask-closable="false"
    centered
    title="请填写校区信息"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" @click="onSubmit">
        保存
      </a-button>
    </template>
    <p>
      <a-form
        :rules="rules"
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item ref="name" label="校区名称" v-bind="validateInfos.name">
          <a-input
            v-model:value="formState.name"
            :maxlength="30"
            placeholder="请输入"
          />
        </a-form-item>
      </a-form>
    </p>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  UnwrapRef,
  onMounted,
  watch,
  Ref
} from 'vue';
import { Modal } from 'ant-design-vue';
import { CampusServicePresenter } from '@/request/api/presenter/schoolSetting';
import { getModalHeadVNode } from '@/utils/common';
import { useForm } from '@ant-design-vue/use';

interface FormState {
  name: string;
}
interface dataItem {
  id: string;
  name: string;
  organizationId: string;
}

export default defineComponent({
  components: {},
  setup() {
    const loading = ref<boolean>(false);
    const showModalVal = ref<number>(1);
    const keyId = ref<string>('');
    const totalNum = ref<number>(0);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const formState: UnwrapRef<FormState> = reactive({
      name: ''
    });
    const visible = ref<boolean>(false);
    const columns = [
      { title: '校区名称', dataIndex: 'name', key: 'name' },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        slots: { customRender: 'action' }
      }
    ];
    const campusList: Ref<dataItem[]> = ref([]);

    const rules = {
      name: [
        {
          required: true,
          message: '请输入校区名称'
        }
      ]
    };
    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    const getCampusList = async function getCampusList(): Promise<void> {
      //请求校区设置列表接口
      loading.value = true;
      const data1 = {
        page: current.value,
        size: pageSize.value,
        organizationId: ''
      };
      try {
        const res = await CampusServicePresenter.getCampusService(data1);
        totalNum.value = res.total;
        campusList.value = res.items;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const createCampus = async function createCampus(
      hdData: any
    ): Promise<void> {
      //新增校区接口
      try {
        await CampusServicePresenter.createCampus(hdData);
        await getCampusList();
        visible.value = false;
      } catch (error) {
        Modal.error({
          title: '新增失败',
          content: `${error.message}`
        });
      }
    };

    const updateCampus = async function updateCampus(
      hdData: any
    ): Promise<void> {
      //编辑校区接口
      try {
        await CampusServicePresenter.updateCampus(hdData);
        await getCampusList();
        visible.value = false;
      } catch (error) {
        Modal.error({
          title: '编辑失败',
          content: `${error.message}`
        });
      }
    };

    onMounted(async () => {
      await getCampusList();
    });

    watch(
      () => pageSize.value,
      async () => {
        await getCampusList();
      }
    );
    watch(
      () => current.value,
      async () => {
        await getCampusList();
      }
    );

    const showModal = () => {
      showModalVal.value = 1;
      formState.name = '';
      visible.value = true;
    };

    const handleCancel = () => {
      visible.value = false;
      resetFields();
    };

    const upDate = function upDate(key: any) {
      keyId.value = key.id;
      showModalVal.value = 2;
      formState.name = key.name;
      visible.value = true;
    };

    const onSubmit = async () => {
      const data = {
        name: '',
        organizationId: ''
      };
      const upData1 = {
        id: '',
        name: '',
        organizationId: ''
      };
      validate()
        .then(async () => {
          if (showModalVal.value === 2) {
            upData1.id = keyId.value;
            upData1.name = formState.name;
            try {
              await updateCampus(upData1);
              resetFields();
            } catch (error) {
              Modal.error({
                title: '编辑失败',
                content: `${error.message}`
              });
            }
          } else {
            data.name = formState.name;
            try {
              await createCampus(data);
              resetFields();
            } catch (error) {
              Modal.error({
                title: '新增失败',
                content: `${error.message}`
              });
            }
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    };

    const delate = function delate(key: any) {
      const titleVnode = getModalHeadVNode('确认删除');
      Modal.confirm({
        title: titleVnode,
        content: '确认要删除该校区吗？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          const id = {
            id: key.id
          };
          try {
            await CampusServicePresenter.delateCampus(id.id);
            await getCampusList();
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: error.message
            });
          }
        }
      });
    };

    return {
      campusList,
      columns,
      upDate,
      delate,
      visible,
      showModal,
      handleCancel,
      formState,
      onSubmit,
      totalNum,
      pageSize,
      current,
      loading,
      validateInfos
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
}
.new-project {
  margin-bottom: 24px;
  float: left;
}
.curriculum-provision-table {
  width: 100%;
  margin: 48px 0 48px 0;

  .update {
    margin-right: 32px;
  }
  .delate {
    color: #ff4d4f;
  }
}
.nodata {
  margin-top: 90px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
