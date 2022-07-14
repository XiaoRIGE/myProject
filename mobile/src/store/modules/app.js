const app = {
  state: () => ({
    telePhone: '4000222985',
    telePhoneList: [
      '4000222985',
      '15388236292',
      '19136109813',
      '19136106205',
      '15308223807',
      '19136127335'
    ],
    userInfo: null,
    network: 'wifi' // 网络状态 wifi 2g 3g 4g 5g none
  }),
  mutations: {
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    REFRESH_TOKEN: (state, data) => {
      if (!data) return;
      state.userInfo = Object.assign({}, state.userInfo, data);
    },
    SET_NETWORK: (state, network) => {
      state.network = network;
    }
  },
  actions: {}
};

export default app;
