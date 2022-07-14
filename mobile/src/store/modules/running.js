import { running } from '../../request/api/student';

const runningStore = {
  state: () => ({
    UnReadNum: 0 //学生端-当前未读的已处理申诉数量
  }),
  mutations: {
    SET_UNREADNUM: (state, UnReadNum) => {
      state.UnReadNum = UnReadNum;
    }
  },
  actions: {
    async get_unReadNum(context) {
      try {
        const { data: unReadNum } = await running.getUnReadNum();
        context.commit('SET_UNREADNUM', unReadNum);
      } catch (error) {
        throw Error(error);
      }
    }
  }
};
export default runningStore;
