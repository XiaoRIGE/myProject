<template>
  <view>
    <g-scan ref="scan" :on-success="scanSuccess" />
  </view>
</template>
<script>
import { activity } from '@/request/api/teacher';
// import { getStudentInfo } from '@/request/api/authorization';
import events from '@/nativeEvent';
// import { getCurrentAttainabilityInfo } from '@/utils/common';

export default {
  name: 'ActivityScan',
  data() {
    return {
      activityId: ''
    };
  },
  onLoad(option) {
    this.activityId = option.activityId;
  },
  methods: {
    // scanSuccess({ data }) {
    //   const { userId } = data;
    //   activity
    //     .sign({
    //       attainabilityType: 2,
    //       activityId: this.activityId,
    //       userId
    //     })
    //     .then(res => {
    //       if (res.code === 0) {
    //         this.getRealName(userId);
    //       }
    //     })
    //     .catch(res => {
    //       this.showToastHandle(res.message);
    //     });
    // },
    async scanSuccess({ data }) {
      const { code, time } = data;

      const str = `${this.activityId}2${code}`;
      // 通过原生获取加密后数据
      let signDigital = '';
      // #ifdef APP-PLUS
      signDigital = await events.getEncryptedData(str);
      // #endif

      const params = {
        activityId: this.activityId,
        attainabilityType: 2,
        code,
        signDigital,
        signType: 0,
        time
      };

      activity
        .newSign(params)
        .then((res) => {
          if (res.code === 0) {
            const realName = res.data.realName || '学生';
            const title = `${realName}签到成功`;
            this.showToastHandle(title);
          }
        })
        .catch((res) => {
          this.showToastHandle(res.message);
        });
    },
    //  获取学生姓名
    // getRealName(userId) {
    //   getStudentInfo({
    //     userId
    //   }).then((res) => {
    //     if (res.code === 0) {
    //       const realName = res.data[0].realName;
    //       const title = `${realName}签到成功`;
    //       this.showToastHandle(title);
    //     }
    //   });
    // },
    // toast 提示
    showToastHandle(title) {
      uni.showToast({
        title,
        mask: false,
        icon: 'none',
        success: () => {
          this.$refs.scan.start();
        }
      });
    }
  }
};
</script>

<style scoped></style>
