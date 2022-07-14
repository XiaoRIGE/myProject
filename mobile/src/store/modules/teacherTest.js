const teacherTest = {
  state: () => ({
    studentList: [] //学生列表
  }),
  mutations: {
    SET_STUDENT_LIST: (state, list) => {
      state.studentList = list;
    }
  },
  actions: {}
};

export default teacherTest;
