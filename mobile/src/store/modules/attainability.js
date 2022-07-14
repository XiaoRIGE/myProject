const attainability = {
  state: () => ({
    currentAttainabilityInfo: null //教师端-当前二维码签到所需参数
  }),
  mutations: {
    SET_CURRENTATTAINABILITYINFO: (state, currentAttainabilityInfo) => {
      state.currentAttainabilityInfo = currentAttainabilityInfo;
    }
  },
  actions: {}
};
export default attainability;
