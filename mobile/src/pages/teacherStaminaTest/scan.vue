<template>
  <view>
    <g-scan ref="scan" :on-success="scanSuccess" />
  </view>
</template>
<script>
import { projectItemType } from './stamina';
import { test } from '@/request/api/teacher';
export default {
  name: 'Scan',
  onLoad(options) {
    const { pageType, projectType } = options;
    this.pageType = pageType;
    this.projectType = projectType;
  },
  data() {
    return {
      projectType: '',
      id: '',
      pageType: ''
    };
  },
  computed: {
    userList() {
      return this.$store.state.teacherTest.studentList;
    }
  },
  methods: {
    async scanSuccess({ data }) {
      const { userId, schoolId } = data;
      // 判断是班级体测，还是学校体测
      if (this.pageType === 'class') {
        const currentUser = this.userList.find(item => item.id === userId);
        if (!currentUser) {
          uni.showToast({
            title: '用户不存在该班级中',
            icon: 'none',
            mask: true
          });
          // 打开扫描继续扫
          this.$refs.scan.start();
          return;
        }
        this.id = currentUser.id;
        uni.redirectTo({
          url: `/pages/teacherStaminaTest/detail?type=${this.projectType}&id=${this.id}`
        });
      } else if (this.pageType === 'school') {
        try {
          const res = await test.getUserInfo({
            userId,
            type: projectItemType[this.projectType]
          });
          if (res.code === 0 && res.data) {
            // 判断该学生是不是这个学校的
            if (schoolId !== this.$store.state.app.userInfo.schoolId) {
              uni.showToast({
                title: '用户不存在该学校中',
                icon: 'none',
                duration: 800,
                mask: true
              });
              return;
            }
            this.id = res.data.id;
            this.$store.commit('teacherTest/SET_STUDENT_LIST', [res.data]);
            uni.redirectTo({
              url: `/pages/teacherStaminaTest/detail?type=${this.projectType}&id=${this.id}`
            });
          } else {
            // 打开扫描继续扫
            this.$refs.scan.start(1000);
          }
        } catch (err) {
          setTimeout(() => {
            uni.navigateBack({ delta: 1 });
          }, 2000);
        }
      }
    }
  }
};
</script>

<style scoped></style>
