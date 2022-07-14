<template>
  <div class="notice-box">
    <div class="header">
      <a-form layout="inline" label-align="left" :model="formState">
        <a-form-item label="标题">
          <a-input
            v-model:value="formState.title"
            placeholder="请输入标题名称"
            enter-button
            allow-clear
          />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 4, offset: 0 }">
          <a-space :size="16">
            <a-button type="primary" @click="handleSearch">
              查询
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <a-button class="form-btn" type="primary" @click="createNotice">
        创建通知
      </a-button>
    </div>

    <div class="banner-table">
      <a-table
        row-key="id"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
      >
        <template #operation="{ record }">
          <a class="operation" @click="editItem(record)">编辑</a>
          <a class="operation" @click="handleDelete(record)">删除</a>
        </template>
      </a-table>
    </div>
  </div>

  <BannerDialog
    :visible="addBannerVisible"
    :update-data="editInfo.data"
    @change-visible="changeVisible"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import BannerDialog from './NoticeDialog/Index.vue';
import { getModalHeadVNode } from '@/utils/common';
import { Modal } from 'ant-design-vue';
import { NoticeServicePresenter } from '@/request/api/presenter/app';

/**通知信息 */
interface noticeList {
  article: string;
  author: string;
  authorName: string;
  id: string;
  publishTime: string;
  readNumber: number;
  status: number;
  title: string;
  updateTime: number;
  urls: string[];
}

export default defineComponent({
  components: {
    BannerDialog
  },
  setup() {
    const loading = ref<boolean>(false);
    const formState = reactive({
      title: ''
    });
    const dataSource = ref<noticeList[]>([]);
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '阅读量',
        dataIndex: 'readNumber',
        key: 'readNumber'
      },
      {
        title: '创建时间',
        dataIndex: 'publishTime',
        key: 'publishTime'
      },
      {
        title: '创建人',
        dataIndex: 'authorName',
        key: 'authorName'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'left',
        slots: { customRender: 'operation' }
      }
    ];
    const addBannerVisible = ref<boolean>(false);

    /**
     * @description: 请求通知列表接口
     */
    const getNoticeList = async () => {
      loading.value = true;

      const params = {
        offsetPage: 0,
        page: 1,
        query: formState.title,
        size: 100
      };
      try {
        const res = await NoticeServicePresenter.queryList(params);

        dataSource.value = res.items;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    getNoticeList();

    /**
     * @description: 关闭弹窗
     */
    const changeVisible = async (type: string) => {
      addBannerVisible.value = false;
      if (type === 'refresh') {
        getNoticeList();
      }
    };

    const editInfo = reactive({
      data: {}
    });
    const createNotice = () => {
      editInfo.data = {};
      addBannerVisible.value = true;
    };
    const editItem = (data: any) => {
      editInfo.data = data;
      addBannerVisible.value = true;
    };

    const handleDelete = (record: any) => {
      const titleVNode = getModalHeadVNode('删除');
      const data = {
        id: record.id
      };
      Modal.confirm({
        title: titleVNode,
        content: '确定要删除吗',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await NoticeServicePresenter.delete(data);
            await getNoticeList();
          } catch (error) {
            console.log(error);
          }
        }
      });
    };

    const handleSearch = () => {
      getNoticeList();
    };

    return {
      formState,
      dataSource,
      columns,
      addBannerVisible,
      createNotice,
      changeVisible,
      editItem,
      handleDelete,
      editInfo,
      loading,
      handleSearch
    };
  }
});
</script>

<style lang="less" scoped>
.notice-box {
  background-color: #fff;
  margin: 20px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 10px #eee;
  padding: 24px 32px;
  .header {
    margin-bottom: 20px;
  }
  .operation {
    margin-right: 10px;
  }

  .form-btn {
    margin-top: 10px;
  }
}
</style>
