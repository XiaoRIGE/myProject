// const BASE_API = 'course/app/forStudent';
import { post } from '@/request/index';
const motion = {
  // 获取跑步规则
  getRunningLimit: data =>
    post({ url: 'running/app/getRunningLimit', data, loading: false }),
  getTotalRunning: data =>
    post({ url: 'running/app/getTotalRunning', data, loading: false }),
  /**
   * @description 获取点位信息
   * */
  getRunningRange: data =>
    post({ url: 'running/app/getRunningRange', data, loading: false })
};
export default motion;
