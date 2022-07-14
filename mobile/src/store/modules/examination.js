const examination = {
  state: () => ({
    tableHeader: null
  }),
  mutations: {
    SET_EXAMINATION_RULES: (state, rules) => {
      state.tableHeader = rules;
    }
  },
  actions: {}
};

export default examination;
