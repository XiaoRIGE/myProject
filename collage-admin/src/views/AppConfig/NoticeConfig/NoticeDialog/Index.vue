<template>
  <a-modal
    :visible="showBannerDialog"
    :mask-closable="false"
    :title="isCreate ? '创建通知' : '编辑'"
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
      <a-form-item label="标题" v-bind="validateInfos.name">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入"
          :maxlength="40"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="内容图片">
        <a-upload
          v-model:file-list="formState.imgContentList"
          accept="image/jpg, image/jpeg, image/png"
          :before-upload="beforeUpload"
          list-type="picture-card"
          :custom-request="doActiveImgUpload"
          :remove="remove"
          @preview="handlePreview"
        >
          <div v-if="formState.imgContentList.length < 5">
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
        <p class="img_format">图片格式：.jpg .png，大小不超过2M</p>
      </a-form-item>
      <a-form-item label="详情" v-bind="validateInfos.contentValue">
        <Editor :value="formState.contentValue" @input="handleInput" />
      </a-form-item>
      <a-form-item label="创建人" v-bind="validateInfos.founder">
        <a-select
          v-model:value="formState.founder"
          label-in-value
          placeholder="请选择创建人"
        >
          <a-select-option
            v-for="item in userOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="阅读量" v-bind="validateInfos.readingVolume">
        <a-input-number
          v-model:value="formState.readingVolume"
          placeholder="请输入"
          :min="0"
          :max="999999"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
  watchEffect
} from 'vue';
import Editor from '@/components/global/Editor.vue';
import { useForm } from '@ant-design-vue/use';
import { message } from 'ant-design-vue';
import { OnceActivityList } from '@/request/api/model/course';
import { NoticeServicePresenter } from '@/request/api/presenter/app';
import UserControlTeacherServicePresenter from '@/request/api/presenter/userControl';

/**文件信息 */
interface FileItem {
  type: string;
  size: number;
  uid: string;
  url: string;
  name?: string;
  status?: string;
  response?: string;
  percent?: number;
  preview?: string;
  originFileObj?: any;
}

/**管理员、教师基本信息 */
interface getTeacherAndAdminListResponseData {
  realName: string;
  id: string;
}

/**创建人下拉信息 */

interface selectInfo {
  label: string;
  value: string;
}

export default defineComponent({
  components: { Editor },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['change-visible'],
  setup(props, { emit }) {
    const formState = reactive({
      contentValue: '',
      imgContentList: ref<any[]>([]),
      name: '',
      founder: {
        value: '',
        label: '',
        key: ''
      },
      readingVolume: 0
    });

    const isCreate = computed(() => {
      return JSON.stringify(props.updateData) === '{}';
    });

    const beforeUpload = (file: any) => {
      //上传图片拦截
      const isJpgOrPng =
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpeg';
      if (!isJpgOrPng) {
        message.error('您只能上传jpg、png格式的图片!');
        // formState.imgContentList = [];
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('上传的图片大小不能超过2M!');
        // formState.imgContentList[0].status = [];
        return false;
      }
      return isJpgOrPng && isLt2M;
    };

    const imgUrl = ref<any[]>([]); //上传文件地址列表
    const previewVisible = ref<boolean>(false); //图片查看蒙层
    // 自定义图片上传
    const doActiveImgUpload = async (options: any) => {
      const { file, onSuccess } = options;
      const formData = new FormData();
      formData.append('file', file as any);

      try {
        const res = await OnceActivityList.uploadPic(formData);
        imgUrl.value.push(res.data.data);
        onSuccess(() => {
          console.log('上传成功');
        });
      } catch (error) {
        message.error(error?.message);
        if (formState.imgContentList.length) {
          formState.imgContentList.pop();
        }
      }
    };
    // 文件转base64
    const getBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    };
    // 预览图片地址
    const previewImage = ref<string | undefined>('');
    // 预览
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
    // 移除图片
    const remove = (data: any) => {
      formState.imgContentList.forEach((key, index) => {
        //找到删除的图片对比数组相同，删除
        if (key.url === data.url) {
          imgUrl.value.splice(index, 1);
          formState.imgContentList.splice(index, 1);
        }
      });
      return false;
    };

    // 创建人可选列表
    const userOptions = ref<selectInfo[]>([]);

    const getUser = async () => {
      try {
        const data = await UserControlTeacherServicePresenter.getTeacherAndAdminList();
        userOptions.value = data.map(
          (item: getTeacherAndAdminListResponseData) => {
            return {
              label: item.realName,
              value: item.id
            };
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    const initDefaultUser = () => {
      const userInfoStr = localStorage.getItem('userInfo');
      const userInfo = userInfoStr
        ? JSON.parse(userInfoStr)
        : { id: '- -', realName: '管理员' };
      formState.founder.label = userInfo.realName;
      formState.founder.key = userInfo.id;
      formState.founder.value = userInfo.id;
    };
    initDefaultUser();

    getUser();

    const showBannerDialog = ref<boolean>(false);
    watchEffect(() => {
      showBannerDialog.value = props.visible;
    });

    const rules = reactive({
      name: [
        {
          required: true,
          message: '请输入标题',
          trigger: 'change'
        }
      ],
      founder: [
        {
          required: true,
          message: '请选择创建人'
        }
      ],
      contentValue: [
        {
          required: true,
          message: '请输入通知内容',
          trigger: 'change'
        }
      ]
    });
    const { validate, resetFields, validateInfos } = useForm(formState, rules);

    const cancel = () => {
      emit('change-visible', 'cancel');
      resetFields();
      imgUrl.value = [];
    };

    // 编辑数据回填
    watch(
      () => props.updateData,
      () => {
        if (!isCreate.value) {
          console.log('有传入参数', props.updateData);
          formState.contentValue = props.updateData.article;
          formState.name = props.updateData.title;
          formState.readingVolume = props.updateData.readNumber;
          // 图片回显
          imgUrl.value = props.updateData.urls ? props.updateData.urls : [];
          formState.imgContentList = props.updateData.urls
            ? props.updateData.urls.map((item: string) => {
                return { url: item };
              })
            : [];
          // 创建人
          formState.founder.key = props.updateData.author;
          formState.founder.value = props.updateData.author;
          formState.founder.label = props.updateData.authorName;
        }
      }
    );

    // 富文本编辑回调
    const handleInput = (val: string) => {
      formState.contentValue = val;
    };

    // 新增、编辑成功回调
    const successCallback = (str: string) => {
      message.success(`${str}成功`);
      resetFields();
      emit('change-visible', 'refresh');
    };

    // 新增、编辑
    const saveNotice = async () => {
      const params = {
        article: formState.contentValue,
        author: formState.founder.key,
        authorName: formState.founder.label,
        organizationMessageImageList: imgUrl.value,
        readNumber: formState.readingVolume,
        title: formState.name
      };
      try {
        if (isCreate.value) {
          await NoticeServicePresenter.add(params);
          successCallback('新建');
        } else {
          const editParams = {
            ...params,
            id: props.updateData.id
          };
          await NoticeServicePresenter.edit(editParams);
          successCallback('编辑');
        }
      } catch (error) {
        console.log(error);
        message.error(error ? error?.message : '操作失败');
      }
    };

    // 点击保存
    const handleOk = () => {
      validate()
        .then(async () => {
          saveNotice();
        })
        .catch(err => {
          console.log('error', err);
        });
    };

    return {
      showBannerDialog,
      handleOk,
      cancel,
      formState,
      userOptions,
      isCreate,

      rules,
      validateInfos,
      props,
      handleInput,

      beforeUpload,
      doActiveImgUpload,
      remove,
      previewVisible,
      previewImage,
      handlePreview,
      handleCancel
    };
  }
});
</script>

<style lang="less" scoped>
.background-img {
  width: 100%;
}
.img_format {
  height: 16px;
  margin-top: -24px;
}
</style>
