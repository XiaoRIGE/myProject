const BASE_API = 'education/app/forStudent';
import { get } from '@/request/index';
const mine = {
  getUserInfo: data => get({ url: `${BASE_API}/userinfo`, data })
};
export default mine;
