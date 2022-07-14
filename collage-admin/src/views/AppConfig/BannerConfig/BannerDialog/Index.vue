<!--
 * @Author: lyh
 * @Date: 2021-09-15 16:53:03
 * @LastEditTime: 2022-05-10 14:50:04
 * @LastEditors: lyh112549 1125492259@qq.com
 * @Description: Banner配置
 * @FilePath: \collage-admin\src\views\AppConfig\BannerConfig\BannerDialog\Index.vue
-->
<template>
  <a-modal
    :visible="showBannerDialog"
    :title="props.isAddOrUpdate ? '创建' + 'banner图' : '编辑'"
    width="1000px"
    @ok="handleOk"
    @cancel="cancel"
  >
    <a-form
      :rules="rules"
      :model="formState"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="banner图" v-bind="validateInfos.fileList">
        <a-upload
          v-model:file-list="formState.fileList"
          :before-upload="beforeBannerUpload"
          list-type="picture-card"
          :custom-request="doImgUpload"
          @preview="handlePreview"
        >
          <div v-if="formState.fileList.length < 1">
            <div class="ant-upload-text">
              上传
            </div>
          </div>
        </a-upload>
        <a-modal
          :visible="previewVisible"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" class="background-img" :src="previewImage" />
        </a-modal>
        <span>图片尺寸：686*220，图片格式：.jpg .png，大小不超过2M</span>
      </a-form-item>
      <a-form-item label="标题" v-bind="validateInfos.name">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入"
          :maxlength="40"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="链接类型"
        v-bind="formState.linkType === 0 ? '' : validateInfos.linkUrl"
      >
        <a-radio-group
          v-model:value="formState.linkType"
          @change="linkTypeChange"
        >
          <a-radio :value="0" @click="noLink">
            无跳转
          </a-radio>
          <a-radio :value="1">
            跳转外部
          </a-radio>
          <a-radio :value="2">
            跳转内部
          </a-radio>
        </a-radio-group>
        <a-input
          v-if="formState.linkType === 1"
          v-model:value="formState.linkUrl"
          placeholder="请输入链接地址"
          allow-clear
        />
        <a-select
          v-if="formState.linkType === 2"
          v-model:value="formState.linkUrl"
          :options="selectLinkUrlOption"
        ></a-select>
      </a-form-item>
      <a-form-item label="状态" v-bind="validateInfos.state">
        <a-select v-model:value="formState.state" placeholder="请选择">
          <a-select-option :value="1">
            启用
          </a-select-option>
          <a-select-option :value="0">
            禁用
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="活动图片">
        <a-upload
          v-model:file-list="formState.activityList"
          :before-upload="beforeUpload"
          list-type="picture-card"
          :custom-request="doActiveImgUpload"
          :remove="remove"
          @preview="handlePreview"
        >
          <div v-if="formState.activityList.length < 5">
            <div class="ant-upload-text">
              上传
            </div>
          </div>
        </a-upload>
        <a-modal
          :visible="previewVisible"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" class="background-img" :src="previewImage" />
        </a-modal>
        <span>图片格式：.jpg .png，大小不超过2M</span>
      </a-form-item>
      <a-form-item label="详情">
        <Editor :value="formState.contentValue" @input="handleInput" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import Editor from '@/components/global/Editor.vue';
// import UploadImage from '../UploadImage/Index.vue';
import { message, Modal } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import moment from 'moment';
import { BannerServiceModalPresenter } from '@/request/api/presenter/userControl';
import { OnceActivityList } from '@/request/api/model/course';

const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

interface FileItem {
  type: string;
  size: number;
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  percent?: number;
  url: string;
  preview?: string;
  originFileObj?: any;
}
export default defineComponent({
  components: { Editor },
  props: {
    visibled: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: Object,
      default: () => ({})
    },
    isAddOrUpdate: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change-visible'],
  setup(props, { emit }) {
    const formState = reactive({
      contentValue: '',
      fileList: ref<any[]>([]),
      activityList: ref<any[]>([]),
      name: '',
      state: undefined,
      linkUrl:
        'https://university.legym.cn/swpu/mooc?studentNumber=studentNumber&token=token',
      linkType: 0
    });
    const previewImage = ref<string | undefined>('');
    const previewVisible = ref<boolean>(false);
    const showBannerDialog = computed(() => {
      return props.visibled;
    });

    const selectLinkUrlOption = ref([
      {
        value: '/pages/courseSelection/index',
        label: '/pages/courseSelection/index'
      },
      {
        value: '/pages/theoryExam/list',
        label: '/pages/theoryExam/list'
      }
    ]);

    const rules = {
      fileList: [
        {
          required: true,
          message: '请上传benner图'
        }
      ],
      state: [
        {
          required: true,
          message: '请选择状态'
        }
      ],
      name: [
        {
          required: true,
          message: '请输入标题'
        }
      ],
      linkUrl: [
        {
          required: true,
          message: '请输入'
        }
      ]
    };
    const { resetFields, validate, validateInfos } = useForm(formState, rules);
    const backGroundUrl = ref<any>('');
    const activityUrl = ref<any>([]);

    const handleInput = (val: any) => {
      formState.contentValue = val;
    };

    const id = ref('');

    watch(
      () => props.updateData,
      () => {
        if (JSON.stringify(props.updateData) === '{}') {
          resetFields();
          return;
        }
        resetFields();
        const [first] = props.updateData.urls;
        formState.name = props.updateData.title;
        formState.state = props.updateData.open;
        formState.contentValue = props.updateData.article;
        backGroundUrl.value = first;
        id.value = props.updateData.id;
        formState.fileList[0] = {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: first
        };
        formState.linkType = props.updateData.linkType;
        formState.linkUrl = props.updateData.linkUrl;

        for (let i = 0; i < props.updateData.urls.length; i++) {
          activityUrl.value[i] = props.updateData.urls[i + 1];

          formState.activityList[i] = {
            uid: i,
            name: i,
            status: 'done',
            url: props.updateData.urls[i + 1]
          };
        }
        formState.activityList.pop();
        activityUrl.value.pop();
      }
    );

    //点击无连接按钮 给有链接input赋值
    const noLink = () => {
      formState.linkUrl =
        'https://university.legym.cn/swpu/mooc?studentNumber=studentNumber&token=token';
    };

    const handleOk = () => {
      const addData = {
        article: formState.contentValue,
        author: '',
        createdDate: Number(moment().format('x')),
        open: formState.state,
        readNumber: 0,
        title: formState.name,
        urls: [backGroundUrl.value, ...activityUrl.value],
        linkType: formState.linkType,
        linkUrl: formState.linkUrl
      };
      const updateData = {
        article: formState.contentValue,
        author: '',
        createdDate: Number(moment().format('x')),
        open: formState.state,
        readNumber: 0,
        id: id.value,
        title: formState.name,
        urls: [backGroundUrl.value, ...activityUrl.value],
        linkType: formState.linkType,
        linkUrl: formState.linkUrl
      };

      validate()
        .then(async () => {
          if (props.isAddOrUpdate === true) {
            try {
              await BannerServiceModalPresenter.addBanner(addData);
              message.success('创建成功');
              emit('change-visible', 'refresh');
            } catch (error) {
              Modal.error({
                title: '创建失败',
                content: `${error.message}`
              });
            }
          } else {
            try {
              await BannerServiceModalPresenter.updateBanner(updateData);
              message.success('编辑成功');
              emit('change-visible', 'refresh');
            } catch (error) {
              Modal.error({
                title: '编辑失败',
                content: `${error.message}`
              });
            }
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    };

    const cancel = () => {
      emit('change-visible', 'cancel');
    };

    const beforeBannerUpload = async (file: any) => {
      //上传banner拦截
      const promiseSize = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const image: any = new Image();
          image.src = reader.result;
          image.onload = () => {
            const w = image.width;
            const h = image.height;

            const prefix = 3.118181818181818;
            // 宽高比+最低尺寸限制（目前限制最低686*220）
            if (w / h !== prefix || w < 686 || h < 220) {
              message.error('您只能上传尺寸686*220尺寸的图片!');
              formState.fileList[0].status = 'error';
              resolve('失败');
            } else {
              resolve('成功');
            }
          };
        };
      });
      if (promiseSize === '成功') {
        const isJpgOrPng =
          file.type === 'image/jpg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpeg';
        if (!isJpgOrPng) {
          message.error('您只能上传jpg、png格式的图片!');
          formState.fileList[0].status = 'error';
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传的图片大小不能超过2M!');
          formState.fileList[0].status = 'error';
          return false;
        }
        return isJpgOrPng && isLt2M;
      } else {
        return false;
      }
    };

    const beforeUpload = (file: any) => {
      //上传图片拦截
      const isJpgOrPng =
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpeg';
      if (!isJpgOrPng) {
        message.error('您只能上传jpg、png格式的图片!');
        formState.fileList[0].status = 'error';
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('上传的图片大小不能超过2M!');
        formState.fileList[0].status = 'error';
        return false;
      }
      return isJpgOrPng && isLt2M;
    };

    const doImgUpload = async (options: any) => {
      const { onSuccess, file } = options;
      const formData = new FormData();
      formData.append('file', file as any);

      try {
        const res = await OnceActivityList.uploadPic(formData);
        backGroundUrl.value = res.data.data;
        onSuccess(() => {
          console.log('成功');
        });
      } catch (error) {
        message.error(error.message);
      }
    };

    const doActiveImgUpload = async (options: any) => {
      const { onSuccess, file } = options;
      const formData = new FormData();
      formData.append('file', file as any);

      try {
        const res = await OnceActivityList.uploadPic(formData);
        activityUrl.value.push(res.data.data);
        onSuccess(() => {
          console.log('成功');
        });
      } catch (error) {
        message.error(error.message);
      }
    };

    const remove = (data: any) => {
      formState.activityList.forEach((key, index) => {
        //找到删除的图片对比数组相同，删除
        if (key.name === data.name) {
          activityUrl.value.splice(index, 1);
          return;
        }
      });
    };

    const handlePreview = async (file: FileItem) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };

    const handleCancel = () => {
      previewVisible.value = false;
    };

    const linkTypeChange = (e: any) => {
      const { value } = e.target;
      if (value) {
        formState.linkUrl =
          'https://university.legym.cn/swpu/mooc?studentNumber=studentNumber&token=token';
      }
      if (value === 2) {
        formState.linkUrl = '/pages/courseSelection/index';
      }
    };

    return {
      showBannerDialog,
      handleOk,
      cancel,
      formState,
      beforeUpload,
      beforeBannerUpload,
      doImgUpload,
      doActiveImgUpload,
      handlePreview,
      previewVisible,
      previewImage,
      rules,
      validateInfos,
      props,
      handleCancel,
      handleInput,
      remove,
      noLink,
      linkTypeChange,
      selectLinkUrlOption
    };
  }
});
</script>

<style lang="less" scoped>
.background-img {
  width: 100%;
}
</style>
