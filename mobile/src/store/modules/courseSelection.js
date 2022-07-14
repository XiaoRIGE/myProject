const courseSelection = {
  state: () => ({
    course: { a: 1 } // 修改前的课程
  }),
  mutations: {
    SET_COURSE: (state, course) => {
      state.course = course;
    },
    DELETE_COURSE: state => {
      state.course = null;
    }
  }
};

export default courseSelection;
