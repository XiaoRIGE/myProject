<template>
  <view class="demo-content">
    <g-navbar
      :background="{ backgroundColor: '#fff' }"
      :border-bottom="false"
      back-icon-color="#222"
      back-icon-size="48"
      title="demo"
    />
    <g-scan ref="scan" :on-success="scanSuccess"></g-scan>
  </view>
</template>

<script>
export default {
  onLoad() {},
  onReady() {},
  data() {
    return {
      show: true
    };
  },
  computed: {
    height() {
      return this.screenHeight - 80;
    }
  },
  methods: {
    scanSuccess({ data }) {
      console.log('data:', data);
    },
    go() {
      uni.navigateTo({
        url: '/pages/activityAttendanceDetail/index'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btns {
  position: fixed;
  left: 0;
  bottom: 5px;
  right: 0;
}
</style>
