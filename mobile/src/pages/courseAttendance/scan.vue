<template>
  <view>
    <g-scan ref="scan" :on-success="scanSuccess" />
  </view>
</template>
<script>
import { course } from '@/request/api/student';
import { getUserInfo } from '@/request/api/authorization';
import { getCurrentAttainabilityInfo } from '@/utils/common';
import events from '@/nativeEvent';

export default {
  name: 'Scan',
  computed: {
    userInfo() {
      return getUserInfo();
    }
  },
  methods: {
    async scanSuccess({ data }) {
      const { courseId, weekNumber } = getCurrentAttainabilityInfo();
      const { code, time } = data;

      const str = `${courseId}2${code}${weekNumber}`;
      // 通过原生获取加密后数据
      let signDigital = '';
      // #ifdef APP-PLUS
      signDigital = await events.getEncryptedData(str);
      // #endif

      const params = {
        attainabilityType: 2,
        courseId,
        weekNumber,
        code,
        time,
        signDigital,
        signType: 0
      };

      course
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
    // toast 提示
    showToastHandle(title) {
      uni.showToast({
        title,
        mask: true,
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
