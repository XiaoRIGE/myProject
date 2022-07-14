<template>
  <a-upload
    v-model:file-list="fileListProps"
    :action="uploadAction"
    :headers="uploadUrlHeaders"
    :accept="accept"
    :before-upload="beforeUpload"
    list-type="picture-card"
    @preview="() => {}"
    @change="onChangeUpload"
  >
    <div v-if="isShowUploadButton">
      <PlusOutlined />
      <div class="ant-upload-text">添加</div>
    </div>
  </a-upload>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    PlusOutlined
  },
  props: {
    /**
     * 文件列表
     */
    fileList: {
      type: Array,
      default: () => []
    },

    /**
     * 最大上传文件数，若为`undefined`则不限制数量
     *
     * 默认为 `undefined`
     */
    max: {
      type: [Number, undefined] as PropType<number | undefined>,
      default: undefined
    },

    /**
     * 允许上传的文件后缀
     */
    accept: {
      type: String,
      default: undefined
    },

    /**
     * 钩子函数 - 文件上传前执行
     */
    beforeUpload: {
      type: Function as PropType<
        (file: any, fileList: any[]) => boolean | Promise<any>
      >,
      default: undefined
    }
  },
  emits: ['update:fileList', 'change'],
  setup(props, { emit }) {
    const fileListProps = computed({
      get: () => props.fileList,
      set: newValue => emit('update:fileList', newValue)
    });

    const beforeUploadProps = computed(() => () => false);

    const isShowUploadButton = computed(
      () => props.max === undefined || fileListProps.value.length < props.max
    );

    const uploadAction = computed(
      () => `${process.env.VUE_APP_BASE_URL}/education/upload/pic`
    );

    const uploadUrlHeaders = {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
    };

    const onChangeUpload = (e: any) => emit('change', e);

    return {
      uploadUrlHeaders,
      fileListProps,
      beforeUploadProps,
      isShowUploadButton,
      onChangeUpload,
      uploadAction
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-upload-list-item-image) {
  object-fit: fill !important;
}
</style>
