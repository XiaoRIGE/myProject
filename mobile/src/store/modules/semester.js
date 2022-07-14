const semester = {
  state: () => ({
    semesterList: [], // 学期列表
    currentSemester: {} // 当前学期信息
  }),
  mutations: {
    SET_SEMESTER_LIST: (state, data) => {
      if (data && Array.isArray(data)) {
        state.semesterList = data;
      }
    },
    SET_CURRENT_SEMESTER: (state, data) => {
      state.currentSemester = data;
    }
  },
  actions: {},
  getters: {
    // 通过学期列表过滤当前学期信息
    GET_CURRENT_SEMESTER: state =>
      state.semesterList.find(semester => semester.current === 1) || {}
  }
};

export default semester;
