import { ref } from 'vue';
import ApiPrefix from '@/request/config/prefix';

export default function useImportFace() {
  const uploadState = ref<boolean>(false);

  const zipFileUrl = `${process.env.VUE_APP_BASE_URL}${ApiPrefix.FASERUNNING}/facePhoto/uploadPhotoZip`;

  const lookUploadState = () => {
    // 查看状态
    console.log('afasdf');
  };

  const ziphandleChange = () => {
    console.log('file');
  };
  return {
    uploadState,
    lookUploadState,
    zipFileUrl,
    ziphandleChange
  };
}
