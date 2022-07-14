const webview = {
  state: () => ({
    query: {} // 参数列表
  }),
  mutations: {
    SET_LINK_QUERY: (state, query) => {
      state.query = query || {};
    }
  },
  actions: {}
};

export default webview;
