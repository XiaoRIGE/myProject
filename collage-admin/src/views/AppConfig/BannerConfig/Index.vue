<!--
 * @Author: lyh
 * @Date: 2021-09-15 15:34:33
 * @LastEditTime: 2022-05-05 17:40:15
 * @LastEditors: Please set LastEditors
 * @Description: Banner配置
 * @FilePath: \collage-admin\src\views\AppConfig\BannerConfig\Index.vue
-->
<template>
  <div v-if="isEmpty" class="test-wrap">
    <div class="header">
      <a-form layout="inline" label-align="left" :model="formState">
        <a-form-item label="标题名称">
          <a-input-search
            v-model:value="formState.name"
            placeholder="请输入"
            @search="handleSearch"
          />
        </a-form-item>
      </a-form>
      <a-button class="form-btn" type="primary" @click="createBanner">
        创建banner
      </a-button>
    </div>
    <div class="alert">
      <a-alert :message="'已启用' + howManyOpenBanner + '/5 条'" type="info" />
    </div>

    <div class="banner-table">
      <a-table
        row-key="id"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="false"
      >
        <template #image="{ record }">
          <img
            class="image"
            :src="record.urls[0]"
            @click="handleImage(record)"
          />
        </template>
        <template #state="{ record }">
          <a-switch
            v-model:checked="record.openStatus"
            checked-children="开"
            un-checked-children="关"
            @change="switchChange(record)"
          />
        </template>
        <template #operation="{ record }">
          <a-tooltip placement="top" title="上移">
            <a
              v-if="record.open && record.isUp === 1"
              class="operation arrows"
              @click="moveUp(record)"
            >
              上移
            </a>
          </a-tooltip>
          <a-tooltip placement="top" title="下移">
            <a
              v-if="record.open && record.isDown === 0"
              class="operation arrows"
              @click="moveDown(record)"
            >
              下移
            </a>
          </a-tooltip>

          <a class="operation" @click="upload(record)">编辑</a>
          <a class="operation" @click="delate(record)">删除</a>
        </template>
      </a-table>
    </div>
  </div>
  <a-empty
    v-else
    class="nodata"
    :image-style="{
      height: '74px'
    }"
  >
    <template #description>
      <span>您还没添加任何banner，添加后才可以进行banner配置</span>
    </template>
    <a-space :size="32">
      <a-button type="primary" @click="createBanner">
        新增banner
      </a-button>
    </a-space>
  </a-empty>

  <BannerDialog
    :visibled="addBannerVisible"
    :update-data="uploadData.data"
    :is-add-or-update="isAddOrUpdate"
    @change-visible="changeVisible"
  />
  <ImagePreview
    :visibled="previewImgVisible"
    :preview-img="previewImg"
    @change-visible="changePreviewImg"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import BannerDialog from './BannerDialog/Index.vue';
import ImagePreview from '@/components/global/ImagePreview.vue';
import { getModalHeadVNode } from '@/utils/common';
import { Modal } from 'ant-design-vue';
import { BannerServiceModalPresenter } from '@/request/api/presenter/userControl';

interface bannerList {
  article: string;
  author: string;
  createdDate: number;
  id: string;
  open: number;
  openStatus: boolean;
  readNumber: number;
  title: string;
  urls: string[];
}

export default defineComponent({
  components: {
    BannerDialog,
    ImagePreview
  },
  setup() {
    const isEmpty = ref<boolean>(true);
    const loading = ref<boolean>(false);
    const formState = reactive({
      name: ''
    });
    const dataSource = ref<bannerList[]>([]);
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '图片',
        dataIndex: 'image',
        key: 'image',
        slots: { customRender: 'image' }
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        key: 'createdDate'
      },
      {
        title: '创建人',
        dataIndex: 'author',
        key: 'author'
      },
      {
        title: '状态',
        dataIndex: 'open',
        key: 'open',
        slots: { customRender: 'state' }
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
    const previewImgVisible = ref<boolean>(false);
    const isAddOrUpdate = ref<boolean>(true); //true新增
    const howManyOpenBanner = ref<number>(0);

    /**
     * @description: 请求banner列表接口
     */
    const getBannerList = async () => {
      loading.value = true;
      howManyOpenBanner.value = 0;
      const data = {
        keyword: formState.name
      };
      try {
        const res = await BannerServiceModalPresenter.getBanner(data);
        dataSource.value = res;
        dataSource.value.forEach(key => {
          if (key.openStatus) {
            howManyOpenBanner.value++;
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await getBannerList();
    });

    const handleOk = () => {
      addBannerVisible.value = false;
    };

    const changeVisible = async (visibele: string) => {
      if (visibele === 'refresh') {
        addBannerVisible.value = false;
        await getBannerList();
      } else {
        addBannerVisible.value = false;
      }
    };

    const changePreviewImg = () => {
      previewImgVisible.value = false;
    };

    const switchChange = async (record: any) => {
      const data = {
        id: record.id
      };
      try {
        await BannerServiceModalPresenter.switchBanner(data);
        await getBannerList();
      } catch (error) {
        Modal.error({
          title: '切换失败',
          content: `${error.message}`,
          async onOk() {
            await getBannerList();
          }
        });
      }
    };

    const moveUp = async (data: any) => {
      const requestData = {
        id1: data.id, //当前id
        id2: ''
      };

      dataSource.value.forEach((key, index, arr) => {
        if (key.id === data.id) {
          requestData.id2 = arr[index - 1].id;
        }
      });
      try {
        await BannerServiceModalPresenter.moveBanner(requestData);
        await getBannerList();
      } catch (error) {
        Modal.error({
          title: '移动失败',
          content: `${error.message}`
        });
      }
    };

    const moveDown = async (data: any) => {
      const requestData = {
        id1: data.id, //当前id
        id2: ''
      };

      dataSource.value.forEach((key, index, arr) => {
        if (key.id === data.id) {
          requestData.id2 = arr[index + 1].id;
        }
      });
      try {
        await BannerServiceModalPresenter.moveBanner(requestData);
        await getBannerList();
      } catch (error) {
        Modal.error({
          title: '移动失败',
          content: `${error.message}`
        });
      }
    };

    const uploadData = reactive({
      data: {}
    });
    const createBanner = () => {
      uploadData.data = {};
      addBannerVisible.value = true;
      isAddOrUpdate.value = true;
    };
    const upload = (data: any) => {
      uploadData.data = data;
      isAddOrUpdate.value = false;
      addBannerVisible.value = true;
    };

    const delate = (record: any) => {
      const titleVnode = getModalHeadVNode('删除');
      const data = {
        id: record.id
      };
      Modal.confirm({
        title: titleVnode,
        content: '确定要删除吗',
        okText: '确定',
        cancelText: '取消',
        class: 'modal-class',
        async onOk() {
          try {
            await BannerServiceModalPresenter.delBanner(data);
            await getBannerList();
          } catch (error) {
            console.log(error);
          }
        }
      });
    };

    const handleSearch = () => {
      getBannerList();
    };

    const previewImg = ref<string>('');
    const handleImage = (data: any) => {
      const [first] = data.urls;
      previewImg.value = first;
      previewImgVisible.value = true;
    };

    return {
      isEmpty,
      formState,
      dataSource,
      columns,
      addBannerVisible,
      createBanner,
      handleOk,
      changeVisible,
      switchChange,
      upload,
      delate,
      handleImage,
      previewImgVisible,
      changePreviewImg,
      previewImg,
      moveUp,
      moveDown,
      uploadData,
      loading,
      isAddOrUpdate,
      howManyOpenBanner,
      handleSearch
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
    margin-bottom: 20px;
  }
  .operation {
    margin-right: 10px;
  }

  .form-btn {
    margin-top: 10px;
  }
}
.alert {
  margin-bottom: 20px;
}
.nodata {
  margin-top: 90px;
}
.image {
  width: 149px;
  height: 84px;
  cursor: pointer;
  object-fit: cover;
}
</style>
