<!--
 * @Author: lyh
 * @Date: 2021-07-23 09:37:17
 * @LastEditTime: 2021-09-27 16:56:02
 * @LastEditors: Please set LastEditors
 * @Description: 学校设置 学院设置
 * @FilePath: \collage-admin\src\views\ComprehensiveSetting\SchoolSetting\CollegeSetting\SchoolCollege.vue
-->
<template>
  <div v-if="collegeList.length > 0" class="test-wrap">
    <div class="new-project">
      <a-button type="primary" @click="showModal">
        新增学院
      </a-button>
    </div>
    <div class="curriculum-provision-table">
      <a-table
        :columns="columns"
        :data-source="collegeList"
        :loading="loading"
        row-key="id"
        :pagination="false"
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
      <span>您还没添加任何学院，添加后才可以进行课程配置</span>
    </template>
    <a-button type="primary" @click="showModal">
      +&emsp;添加学院
    </a-button>
  </a-empty>

  <a-modal v-model:visible="visible" centered title="请填写学院信息">
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
        :model="formState"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item ref="name" label="学院名称" v-bind="validateInfos.name">
          <a-input
            v-model:value="formState.name"
            placeholder="请输入"
            :maxlength="30"
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
  Ref,
  watch,
  onMounted
} from 'vue';
import { Modal } from 'ant-design-vue';
import { Moment } from 'moment';
import {
  CollegeServicePresenter,
  SchoolSettingCollegeInfoType
} from '@/request/api/presenter/schoolSetting';
import { useForm } from '@ant-design-vue/use';
import { getModalHeadVNode } from '@/utils/common';

interface FormState {
  name: string;
}

export default defineComponent({
  components: {},
  setup() {
    const showModalVal = ref<number>(1);
    const keyId = ref<string>('');
    const loading = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const totalNum = ref<number>(0);
    const pageSize = ref<number>(10);
    const current = ref<number>(1);
    const formState: UnwrapRef<FormState> = reactive({
      name: ''
    });
    const columns = [
      { title: '学院名称', dataIndex: 'name', key: 'name' },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        slots: { customRender: 'action' }
      }
    ];
    const collegeList: Ref<SchoolSettingCollegeInfoType[]> = ref([]);

    const rules = {
      name: [
        {
          required: true,
          message: '请输入学院名称'
        }
      ]
    };
    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    /**
     * 获取学院列表。
     */
    const getCollegeList = async function getCollegeList(): Promise<void> {
      loading.value = true;
      try {
        const newCollageList = await CollegeServicePresenter.getCampusService({
          page: current.value,
          size: pageSize.value,
          parentId: ''
        });
        totalNum.value = newCollageList.total;
        collegeList.value = newCollageList.items;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    const collegeCreate = async function collegeCreate(
      hdData: any
    ): Promise<void> {
      //新增学院接口
      try {
        await CollegeServicePresenter.createCollege(hdData);
        await getCollegeList();
        visible.value = false;
      } catch (error) {
        Modal.error({
          title: '新增失败',
          content: `${error.message}`
        });
      }
    };

    const updateCollege = async function updateCollege(
      hdData: any
    ): Promise<void> {
      //编辑学院接口
      try {
        await CollegeServicePresenter.updateCollege(hdData);
        await getCollegeList();
        visible.value = false;
      } catch (error) {
        Modal.error({
          title: '编辑失败',
          content: `${error.message}`
        });
      }
    };

    onMounted(async () => {
      await getCollegeList();
    });

    watch(
      () => pageSize.value,
      async () => {
        await getCollegeList();
      }
    );
    watch(
      () => current.value,
      async () => {
        await getCollegeList();
      }
    );

    const showModal = () => {
      showModalVal.value = 1;
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
        parentId: ''
      };

      const upData1 = {
        id: '',
        name: '',
        parentId: ''
      };

      validate()
        .then(async () => {
          if (showModalVal.value === 2) {
            upData1.id = keyId.value;
            upData1.name = formState.name;
            try {
              await updateCollege(upData1);
              resetFields();
            } catch (error) {
              console.log(error);
            }
          } else {
            data.name = formState.name;
            try {
              await collegeCreate(data);
              resetFields();
            } catch (error) {
              console.log(error);
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
        content: '确认要删除该学院吗？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          const id = {
            id: key.id
          };
          try {
            await CollegeServicePresenter.delate(id.id);
            await getCollegeList();
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: `${error.message}`
            });
          }
        }
      });
    };
    return {
      collegeList,
      columns,
      upDate,
      delate,
      loading,
      visible,
      showModal,
      handleCancel,
      formState,
      onSubmit,
      value3: ref<Moment[]>([]),
      totalNum,
      current,
      pageSize,
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
