import { get } from '@/request/index';
const BAST_API = 'education/semester';

// 获得全部学期
export const getAllSemester = data =>
  get({ url: `${BAST_API}/queryAll`, data });

export const getCurrentSemester = data =>
  get({ url: `${BAST_API}/getCurrent`, data, loading: false });
