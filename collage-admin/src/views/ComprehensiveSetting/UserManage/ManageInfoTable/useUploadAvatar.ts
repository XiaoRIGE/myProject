import ApiPrefix from '@/request/config/prefix';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
export default function useUploadAvatar() {
  const accessToken = localStorage.getItem('accessToken');
  const uploadUrlHeaders = {
    Authorization: `Bearer ${accessToken}`
  };
  const imgUrl = ref<string>('');
  const loading = ref<boolean>(false);

  const fileList = ref([]) as any;

  const uploadPlanUrl = `${process.env.VUE_APP_BASE_URL}${ApiPrefix.FASERUNNING}/facePhoto/uploadFacePhoto`;

  const handleChange = (info: any) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      loading.value = true;
      return;
    }
    if (info.file.status === 'done') {
      imgUrl.value = info.fileList[info.fileList.length - 1].response.data;
      loading.value = false;
    }
    if (info.file.status === 'error') {
      loading.value = false;
      message.error('upload error');
    }
  };

  return {
    uploadUrlHeaders,
    uploadPlanUrl,
    imgUrl,
    loading,
    handleChange,
    fileList
  };
}
