<template>
  <view class="map-content" :style="{ height: screenHeight + 'px' }">
    <map
      id="maps"
      ref="maps"
      :style="{ height: screenHeight + 'px' }"
      class="maps"
      :latitude="latitude"
      :longitude="longitude"
      :circles="circles"
      :scale="scale"
      :enable-poi="true"
      :enable-building="true"
      :show-compass="true"
      :markers="markers"
      :min-scale="17"
      :max-scale="20"
      :enable-3D="true"
    >
      <!-- 返回按钮组件 -->
      <cover-image
        class="nav-bar"
        :style="[{ top: StatusBar + 13 + 'px' }]"
        src="/static/img/map-back.png"
        @click="back"
      />
      <!-- 不在范围提示框 -->
      <view
        v-if="showScope"
        :style="[{ top: StatusBar + 63 + 'px' }]"
        class="no-scope"
        @click="sigin"
      >
        <text class="no-scope-text">
          你未在考勤范围内，请前往考勤范围内完成签到！
        </text>
      </view>
      <!-- 签到按钮组件 -->
      <view
        class="btn"
        :class="{ 'btn-disabled': showScope, 'btn-bg': !showScope }"
        @click="sigin"
      >
        <text v-if="siginInfo.pageType === 'course'" class="btn-text">
          {{ siginInfo.startSignNumber == 2 ? '二次签到' : '课程签到' }}
        </text>
        <text v-if="siginInfo.pageType === 'activity'" class="btn-text">
          活动签到
        </text>
      </view>
      <!-- 右边定位按钮 -->
      <cover-image
        class="location-img img"
        src="/static/img/map-location.png"
        @click="location"
      />
      <!-- 右侧定位刷新按钮 -->
      <cover-image
        class="refresh-img img"
        src="/static/img/map-refresh.png"
        @click="refresh"
      />
    </map>
  </view>
</template>

<script>
import { course, attainability, activity } from '@/request/api/student';
import { getUserInfo, calculateLineDistance } from '@/utils/common';
import events from '@/nativeEvent';

export default {
  onLoad(params) {
    this.siginInfo = params;
    const _this = this;
    this.map = uni.createMapContext('maps');
    uni.getSystemInfo({
      success(e) {
        _this.screenHeight = e.screenHeight;
        _this.StatusBar = e.statusBarHeight;
      }
    });
    uni.showLoading({
      title: '加载中...',
      mask: true
    });
    // uni.getLocation({
    //   type: 'gcj02', //返回可以用于uni.openLocation的经纬度
    //   altitude: true,
    //   success(res) {
    //     const { latitude, longitude } = res;
    //     _this.latitude = latitude;
    //     _this.longitude = longitude;
    //     _this.setMarkers(latitude, longitude);
    //     _this.getGpsInfo();
    //   },
    //   fail() {
    //     uni.showToast({
    //       title: '定位失败',
    //       icon: 'none',
    //       mask: true
    //     });
    //   },
    //   complete() {
    //     uni.hideLoading();
    //   }
    // });
  },
  data() {
    return {
      screenHeight: 0,
      // pageType:'', // 页面来源，活动签到，课程签到
      pageTypes: {
        course: '课程',
        activity: '活动'
      },
      map: null,
      StatusBar: 0,
      radius: 0,
      showScope: true,
      latitude: 0, // //纬度
      longitude: 0, // //经度
      title: 'map',
      markers: [],
      circles: [],
      siginInfo: {},
      gpsInfo: {}
    };
  },
  computed: {
    userInfo() {
      return getUserInfo();
    },
    scale() {
      if (this.radius > 150) return 17;
      if (this.radius >= 100) return 18;
      if (this.radius >= 90) return 18;
      if (this.radius >= 30 && this.radius <= 90) return 18;
      else return 20;
    }
  },
  mounted() {
    uni.$on('popup-ok', () => {
      const subNVue = uni.getSubNVueById('popup');
      subNVue.hide('fade-out', 300);
    });
  },
  beforeDestroy() {
    uni.$off('popup-ok');
  },
  methods: {
    showPopup({ content }) {
      //打开弹窗
      uni.$emit('popup-on', {
        content
      });
      const subNVue = uni.getSubNVueById('popup');
      subNVue.show('fade-in', 300);
    },
    async sigin() {
      if (this.showScope) {
        this.showPopup({
          content: '你未在考勤范围内，请前往考勤范围内完成签到！'
        });
        return;
      }
      if (this.siginInfo.pageType === 'course') {
        try {
          const str = `${this.siginInfo.courseId}0${this.userInfo.id}${this.siginInfo.weekNumber}`;
          // 通过原生获取加密后数据
          const signDigital = await events.getEncryptedData(str);

          const res = await course.sign(
            Object.assign({}, { attainabilityType: 0 }, this.siginInfo, {
              userId: this.userInfo.id,
              signDigital
            })
          );
          if (res.code === 0) {
            uni.showToast({
              title: '签到成功',
              icon: 'success',
              mask: true
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 2000);
          }
        } catch (err) {
          if (err.type && err.type === 'fail') {
            uni.showToast({
              title: '签到失败，请检查网络环境是否正常',
              duration: 1500,
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: err.message || '签到失败，请检查网络环境是否正常',
              duration: 1500,
              icon: 'none'
            });
          }
        }
      }
      if (this.siginInfo.pageType === 'activity') {
        const { attainabilityType = 2 } = this.gpsInfo;
        try {
          const str = `${this.siginInfo.activityId}${attainabilityType}${this.userInfo.id}`;
          // 通过原生获取加密后数据
          const signDigital = await events.getEncryptedData(str);
          const res = await activity.sign(
            Object.assign({}, this.siginInfo, {
              userId: this.userInfo.id,
              activityType: 0,
              attainabilityType,
              signDigital
            })
          );
          if (res.code === 0) {
            uni.showToast({
              title: '签到成功',
              icon: 'success',
              mask: true
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 2000);
          }
        } catch (err) {
          if (err.type && err.type === 'fail') {
            uni.showToast({
              title: '签到失败，请检查网络环境是否正常',
              duration: 1500,
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: err.message || '签到失败，请检查网络环境是否正常',
              duration: 1500,
              icon: 'none'
            });
          }
        }
      }
    },
    // 获取教师设置的gps坐标信息以及半径
    async getGpsInfo() {
      const { courseId, weekNumber, startSignNumber, pageType } =
        this.siginInfo;
      try {
        if (pageType === 'course') {
          const query = {
            courseId,
            times: startSignNumber, //第几次的签到startSignNumber
            weekIndex: weekNumber //第几周的签到
          };
          const res = await attainability.getGps(query);
          if (res.code === 0 && res.data) {
            const { locationLatitude, locationLongitude, radius } = res.data;
            this.radius = radius;
            this.setCircles(locationLatitude, locationLongitude);
            this.gpsInfo = res.data;
            this.showScope = !this.getScoped();
          }
        }
        if (pageType === 'activity') {
          const { activityId, times } = this.siginInfo;
          const query = {
            simpleActivityId: activityId,
            times
          };
          const res = await activity.getGps(query);
          if (res.code === 0 && res.data) {
            const { locationLatitude, locationLongitude, radius } = res.data;
            this.radius = radius;
            this.setCircles(locationLatitude, locationLongitude);
            this.gpsInfo = res.data;
            this.showScope = !this.getScoped();
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    back() {
      uni.navigateBack();
    },
    location() {
      // 复位
      this.map.moveToLocation({
        longitude: this.longitude,
        latitude: this.latitude
      });
    },
    refresh() {
      this.getGpsInfo();
    },
    setMarkers(latitude, longitude) {
      this.markers = [
        {
          id: 0,
          width: 35,
          height: 35,
          latitude, //纬度
          longitude, //经度
          iconPath: '../../static/img/location.png'
        }
      ];
    },
    setCircles(latitude, longitude) {
      this.circles = [
        {
          latitude,
          longitude,
          color: '#3C55CB',
          fillColor: '#4B6AFF40',
          radius: this.radius,
          strokeWidth: 3
        }
      ];
    },
    // 距离
    getScoped() {
      // 用户当前位置
      const { latitude, longitude } = this;
      // 教师设置的范围
      const { locationLatitude, locationLongitude, radius } = this.gpsInfo;
      // 教师端未开启GPS签到，或者用户获取GPS失败
      if (
        !latitude ||
        !longitude ||
        !locationLatitude ||
        !locationLongitude ||
        !radius
      )
        return false;
      // 未在范围内
      if (
        calculateLineDistance(
          latitude,
          longitude,
          locationLatitude,
          locationLongitude
        ) > radius
      )
        return false;
      return true;
    }
  }
};
</script>

<style scoped>
.map-content {
  width: 750rpx;
  position: relative;
}
.maps {
  position: relative;
  width: 750rpx;
}
.nav-bar {
  width: 80rpx;
  height: 80rpx;
  left: 32rpx;
}
.no-scope {
  position: absolute;
  left: 87rpx;
  width: 576rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffece6;
  border: 1px solid #fc6c37;
  border-radius: 10rpx;
}
.no-scope-text {
  font-size: 24rpx;
  text-align: center;
  color: #fc6c37;
}
.btn-disabled {
  opacity: 0.5;
  background-color: #fdb59b;
}
.btn-bg {
  background-color: #ff5c20;
}
.btn {
  display: flex;
  position: absolute;
  left: 48rpx;
  bottom: 35rpx;
  width: 654rpx;
  height: 100rpx;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 1px 18px -1px rgba(252, 108, 55, 0.4);
  border-radius: 24rpx;
}
.btn-text {
  font-size: 36rpx;
  color: #fff;
}
.location-img,
.refresh-img {
  position: absolute;
  width: 90rpx;
  height: 90rpx;
  right: 32rpx;
}
.location-img {
  bottom: 410rpx;
}
.refresh-img {
  bottom: 300rpx;
}
</style>
