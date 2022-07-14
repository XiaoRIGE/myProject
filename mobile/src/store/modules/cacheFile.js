const cacheFile = {
  state: () => ({
    activitieImages: [] // 活动缓存图片
  }),
  mutations: {
    SET_FILE: (state, file) => {
      state.activitieImages.push(file);
    },
    DEL_FILE: (state, id) => {
      const newImages = state.activitieImages.filter(file => file.id !== id);
      state.activitieImages = newImages;
    }
  },
  actions: {}
};

export default cacheFile;
