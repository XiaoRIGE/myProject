<template>
  <div class="test-wrap">
    <a-button type="primary" @click="addSpecial">
      新增专题
    </a-button>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #action="{record}">
          <a class="update" @click="update(record)">编辑</a>
          <a class="delate" @click="delate(record)">删除</a>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model:visible="visible"
      :title="`${dialogTitle}专题`"
      @ok="handleOk"
      @cancel="cancel"
    >
      <a-form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item v-bind="validateInfos.name" label="专题名称">
          <a-input v-model:value="formState.name" maxlength="40" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { getModalHeadVNode } from '@/utils/common';
import { message, Modal } from 'ant-design-vue';
import { ActivityThemeConfigurationPresenter } from '@/request/api/presenter/course';
interface datasourceItem {
  id: string;
  name: string;
  number: number;
}
export default defineComponent({
  setup() {
    const visible = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const formState = reactive({
      name: '',
      id: ''
    });
    const dialogTitle = ref('');
    const columns = [
      {
        title: '专题名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '活动数',
        dataIndex: 'number',
        key: 'number'
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: 200,
        slots: { customRender: 'action' }
      }
    ];
    const dataSource = ref<datasourceItem[]>([]);

    const rules = reactive({
      name: [
        {
          required: true,
          message: '请输入专题名称'
        }
      ]
    });
    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    const getAllTheme = async () => {
      loading.value = true;
      try {
        const res = await ActivityThemeConfigurationPresenter.getAllTheme();
        dataSource.value = res;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      getAllTheme();
    });

    const addSpecial = () => {
      visible.value = true;
      dialogTitle.value = '新建';
    };

    const update = (data: { age: number; id: string; name: string }) => {
      visible.value = true;
      formState.name = data.name;
      formState.id = data.id;
      dialogTitle.value = '编辑';
    };

    const delate = (data: {
      age: number;
      number: number;
      id: string;
      name: string;
    }) => {
      const titleVnode = getModalHeadVNode(
        `确定要删除专题（${data.name}）吗？`
      );

      formState.id = data.id;
      const params = {
        id: formState.id
      };

      Modal.confirm({
        title: titleVnode,
        class: 'modal-class',
        async onOk() {
          try {
            await ActivityThemeConfigurationPresenter.delateThemeSpecial(
              params
            );
            getAllTheme();
            visible.value = false;
            message.success('删除成功！');
          } catch (error) {
            Modal.error({
              title: '删除失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    const handleOk = () => {
      //保存
      const data = {
        name: formState.name,
        id: formState.id
      };
      validate().then(async () => {
        if (dialogTitle.value === '新建') {
          try {
            await ActivityThemeConfigurationPresenter.addThemeSpecial(
              formState.name
            );
            await getAllTheme();
            visible.value = false;
            message.success('创建成功！');
            resetFields();
          } catch (error) {
            Modal.error({
              title: '创建失败',
              content: `${error.message}`
            });
          }
        } else {
          try {
            await ActivityThemeConfigurationPresenter.updateThemeSpecial(data);
            await getAllTheme();

            visible.value = false;
            message.success('更新成功！');
            resetFields();
          } catch (error) {
            Modal.error({
              title: '更新失败',
              content: `${error.message}`
            });
          }
        }
      });
    };

    const cancel = () => {
      visible.value = false;
      resetFields();
    };
    return {
      visible,
      formState,
      columns,
      dataSource,
      addSpecial,
      rules,
      validateInfos,
      handleOk,
      update,
      delate,
      cancel,
      dialogTitle,
      loading
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

  .table {
    margin-top: 24px;
  }

  .delate {
    color: #ff4d4f;
    margin-left: 24px;
  }
}
</style>
