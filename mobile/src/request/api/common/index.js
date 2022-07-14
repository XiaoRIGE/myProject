import { BASE_URL, setToken, authType } from '@/request';
import { getToken } from '@/utils/common';
// 图片上传
export const uploadFile = (filePath, name = 'file') =>
  new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}education/upload/pic`, //接口地址
      filePath,
      name,
      header: {
        Authorization: setToken(authType, getToken())
      },
      success: res => {
        if (res.statusCode === 200) {
          const { code, data } = JSON.parse(res.data);
          const _errMessage =
            (res.data && (res.data.message || data.error)) || '图片上传失败';
          if (code === 0) {
            resolve(data);
          } else {
            uni.showToast({
              title: _errMessage,
              icon: 'none'
            });
          }
        } else {
          uni.showToast({
            title: '图片上传失败',
            icon: 'none',
            mask: true
          });
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
