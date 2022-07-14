import { post, get } from '@/request';
const BAST_API1 = 'authorization/user';
const BAST_API2 = 'authorization/organization';
const BAST_API3 = 'authorization/mobileApp';
const BAST_API4 = 'authorization/student';

// 登录
export const login = (data) =>
  post({
    url: `${BAST_API1}/manage/login`,
    data,
    header: { Authorization: '' },
    loading: false
  });

// 刷新token
export const refreshToken = (data) =>
  get({
    url: `${BAST_API1}/refreshToken`,
    data,
    header: { Authorization: '' },
    loading: false,
    hiddenToast: true,
    refrenshTokenFlag: true
  });

// 获取当前最新版本APP
export const getLastVersion = (data) =>
  get({
    url: `${BAST_API3}/getLastVersion`,
    data
  });

// 学生激活
export const activateStudent = (data) =>
  post({
    url: `${BAST_API1}/activate/student`,
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: ''
    },
    loading: false,
    hiddenToast: true
  });

// 教师激活
export const activateTeacher = (data) =>
  post({
    url: `${BAST_API1}/activate/teacher`,
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: ''
    },
    loading: false,
    hiddenToast: true
  });

// 验证手机号
export const verifyPhoneNumber = (data) =>
  post({
    url: `${BAST_API1}/verifyPhoneNumber`,
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: ''
    },
    hiddenToast: true
  });

// 获取验证码
export const getMobileCode = (data) =>
  post({
    url: `${BAST_API1}/manage/getMobileCode`,
    data,
    header: {
      Authorization: ''
    },
    hiddenToast: true
  });

// 忘记密码
export const resetPassword = (data) =>
  post({
    url: `${BAST_API1}/manage/resetPassword/mobileCode`,
    data,
    header: {
      Authorization: ''
    },
    hiddenToast: true
  });

// 修改手机号
export const changePhone = (data) =>
  post({
    url: `${BAST_API1}/update/phoneNumber`,
    data,
    header: {
      Authorization: ''
    },
    hiddenToast: true
  });

// 获取学校
export const querySchool = (data) =>
  get({
    url: `${BAST_API2}/querySchool`,
    data,
    header: {
      Authorization: ''
    }
  });

// 获取学生信息
export const getStudentInfo = (data) =>
  post({
    url: `${BAST_API4}/userInfoListById`,
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    hiddenToast: true
  });

// 获取背景图片
export const getImage = (data) =>
  get({ url: 'authorization/find/organization/image', data, loading: false });

// 首页banner列表
export const getBannerList = (data) =>
  post({
    url: 'authorization/banner/images',
    data,
    loading: false
  });

// 获取banner详情
export const getBannerDetail = (data) =>
  post({
    url: 'authorization/banner/detail/by/id',
    data
  });

// 首页的消息通知
export const getMessage = (data) =>
  get({ url: 'authorization/notice/message', data, loading: false });

// 学校通知列表
export const getMessageList = (data) =>
  post({
    url: 'authorization/message/list',
    data,
    loading: false
  });
// 学校通知详情
export const getMessageDetail = (data) =>
  get({
    url: 'authorization/message/detail',
    data,
    loading: false
  });
// 注销app账号
export const cancellation = (data) =>
  post({
    url: 'authorization//app/student/cancellation',
    data
  });
