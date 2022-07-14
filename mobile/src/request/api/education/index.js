import { post, get } from '@/request';
const BASE_API = 'education';

// 获取校区列表
export const getSchoolList = data =>
  post({ url: `${BASE_API}/campus/queryAll`, data, loading: false });

// 活动签到时间检测
export const checkSignInterval = data =>
  get({ url: `${BASE_API}/app/activity/checkSignInterval`, data });
