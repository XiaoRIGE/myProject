import md5Libs from 'uview-ui/libs/function/md5';
import store from '@/store';
import events from '@/nativeEvent';
import { queryMappingTable } from '@/setting';
const sha1 = require('sha1');

/**
 * @description 获取 APP 缓存大小字符串。该方法会根据不同大小返回带有合适单位的字符串。
 */
export const getAppCacheSizeString = async function getCacheNumber() {
  // #ifdef APP-PLUS
  let appCacheSizeString = '';

  const size = await new Promise((resolve) => {
    plus.cache.calculate((size) => {
      resolve(size);
    });
  });

  const sizeCache = parseInt(size);
  if (sizeCache === 0) {
    appCacheSizeString = '0B';
  } else if (sizeCache < 1024) {
    appCacheSizeString = `${sizeCache}B`;
  } else if (sizeCache < 1048576) {
    appCacheSizeString = `${(sizeCache / 1024).toFixed(2)}KB`;
  } else if (sizeCache < 1073741824) {
    appCacheSizeString = `${(sizeCache / 1048576).toFixed(2)}MB`;
  } else {
    appCacheSizeString = `${(sizeCache / 1073741824).toFixed(2)}GB`;
  }

  return appCacheSizeString;
  // #endif
};

/**
 * @description 清除 APP 缓存。
 */
export const clearAppCache = function clearAppCache() {
  // #ifdef APP-PLUS
  const clearAppCachePromise = new Promise((resolve) => {
    plus.cache.clear(() => {
      uni.showToast({
        title: '清除成功',
        icon: 'none'
      });
      resolve();
    });
  });

  return clearAppCachePromise;
  // #endif
};

/**
 *  @description 路由鉴权
 */
export const routePermission = () => {
  // 允许的不存在token的页面
  let permission = false;
  const whiteList = [
    'pages/login/index',
    'pages/chooseIdentity/index',
    'pages/activateStudent/index',
    'pages/studentCompleteInfo/index',
    'pages/activateTeacher/index',
    'pages/changePassword/index',
    'pages/webView/index'
  ];
  const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
  if (routes && routes.length > 0) {
    const currentPath = routes[routes.length - 1].route;
    permission = whiteList.includes(currentPath);
  }
  return permission;
};

/**
 * @description px转换rpx
 * */
export const toRpx = (px) => {
  return px / (uni.upx2px(100) / 100);
};

/**
 * @description 获取用户身份
 */
export const getRole = (role) => {
  if (!role) return '';
  const menu = {
    TEACHER: 'teacher',
    STUDENT: 'student',
    ADMIN: 'teacher'
  };
  return menu[role];
};

/**
 * 短信签名
 * @param tel 手机号
 * @returns 加密数据
 */
export const getSign = (tel, type) => {
  const SALT = 'e3b624665de444e3a199f8dc50c84538';
  const str = `${md5Libs.md5(tel)}:${type * 256}:${SALT}`;
  return sha1(str);
};
/**
 * @description 获取用户token
 * */
export const getToken = () => {
  return store.state.app.userInfo
    ? store.state.app.userInfo.accessToken
    : undefined;
};

/**
 * @description 获取当前网络状态
 * */
export const getNetworkType = (type) => {
  if (type) return type === store.state.app.network;
  return store.state.app.network;
};

/**
 * @description 获取当前登录用户信息
 * */
export const getUserInfo = () => {
  return store.state.app.userInfo ? store.state.app.userInfo : null;
};

/**
 * @description 获取当前学期id
 * */
export const getSemesterId = () => {
  return store.state.semester.currentSemester
    ? store.state.semester.currentSemester.id
    : null;
};

/**
 * @description 获取绑定手机号脱敏方法
 * */
export const getDesMobile = () => {
  let mobile = '';
  if (store.state.app.userInfo) {
    let tel = store.state.app.userInfo.mobile;
    tel = '' + `${tel}`;
    const reg = /(\d{3})\d{4}(\d{4})/;
    mobile = tel.replace(reg, '$1****$2');
  }
  return mobile;
};

/**
 * @description 获取教师端-当前二维码签到所需参数
 * */
export const getCurrentAttainabilityInfo = () => {
  return store.state.attainability.currentAttainabilityInfo
    ? store.state.attainability.currentAttainabilityInfo
    : null;
};

/**
 * @description 获取教师端-选中活动的详情
 * */
export const getCurrentActivityInfo = () => {
  return store.state.attainability.selectActivityInfo
    ? store.state.attainability.selectActivityInfo
    : null;
};

/**
 * @description 获取用户默认头像
 * */
export const getUserDefaultAvatar = (role, sex) => {
  if (!role) return '';
  const userRole = role.toUpperCase();
  const avatars = {
    // #ifndef APP-PLUS-NVUE || APP-NVUE
    1: require('@/static/img/avatar/student-man-avatar.png'),
    2: require('@/static/img/avatar/student-woman-avatar.png'),
    3: require('@/static/img/avatar/teacher-man-avatar.png'),
    4: require('@/static/img/avatar/teacher-woman-avatar.png')
    // #endif
  };
  if (userRole === 'STUDENT') {
    return avatars[sex];
  }
  if (userRole === 'TEACHER') {
    if (sex === 1) {
      return avatars[3];
    }
    if (sex === 2) {
      return avatars[4];
    }
  }
};

/**
 * @description 退出登录
 * */
export const logOut = () => {
  // 需要判断是否在可退出页面
  const permission = routePermission();
  if (permission) return;
  // 清除store
  uni.reLaunch({
    url: '/pages/login/index'
  });
  Promise.resolve().then(() => {
    const clearList = {
      'app/SET_USERINFO': null,
      'semester/SET_SEMESTER_LIST': [],
      'course/SET_STUDENT_COURSE_ID': ''
    };
    for (const key in clearList) {
      store.commit(key, clearList[key]);
    }
    uni.clearStorage();
  });
};
/* @description 密码正则验证
 */
export const checkedPassword = (password) => {
  const pwdReg =
    /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z\W]{8,16}$))/;
  return pwdReg.test(password);
};

/**
 * @description 获取课程考勤统计数据
 */
export const getCountInfo = (countInfoVo) => {
  return [
    {
      index: 1,
      count: countInfoVo ? countInfoVo.firstYetCount : 0
    },
    {
      index: 0,
      count: countInfoVo ? countInfoVo.notYetCount : 0
    },
    {
      index: 2,
      count: countInfoVo ? countInfoVo.secondYetCount : 0
    },
    {
      index: 3,
      count: countInfoVo ? countInfoVo.leaveCount : 0
    }
  ];
};

/**
 * @description 获取教师即将上课课程列表
 */
export const getSoonCourseList = (list) => {
  const newList = [];
  list.forEach((item) => {
    if (item.soonTag) {
      newList.push(item);
    }
  });
  if (newList.length > 1) {
    newList.splice(1);
  }
  return newList;
};

/**
 * @description 获取教师课程列表
 */
export const getCourseList = (list) => {
  const newList = {
    周一: [],
    周二: [],
    周三: [],
    周四: [],
    周五: [],
    周六: [],
    周日: []
  };
  list.forEach((item) => {
    newList[item.weekLabel].push(item);
  });
  // 根据开始时间升序排列
  for (const key in newList) {
    newList[key] = newList[key].sort((a, b) => {
      return a.startTime - b.startTime;
    });
  }
  return newList;
};

/**
 * @description 获取周图标
 */
export const getWeekIcon = (key) => {
  const iconList = {
    //  #ifndef APP-PLUS-NVUE || APP-NVUE
    周一: require('@/static/img/weekIcon/monday.png'),
    周二: require('@/static/img/weekIcon/tuesday.png'),
    周三: require('@/static/img/weekIcon/wednesday.png'),
    周四: require('@/static/img/weekIcon/thursday.png'),
    周五: require('@/static/img/weekIcon/friday.png'),
    周六: require('@/static/img/weekIcon/saturday.png'),
    周日: require('@/static/img/weekIcon/sunday.png')
    // #endif
  };
  return iconList[key];
};

/**
 * @description 根据计算坐标距离
 * */
export const calculateLineDistance = (lat1, lon1, lat2, lon2) => {
  const radLat1 = (lat1 * Math.PI) / 180; //将角度换算为弧度
  const radLat2 = (lat2 * Math.PI) / 180; //将角度换算为弧度
  const a = radLat1 - radLat2;
  const b = (lon1 * Math.PI) / 180 - (lon2 * Math.PI) / 180;
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378137.0; // 取WGS84标准参考椭球中的地球长半径(单位:m)
  return s;
};

export const isPointInPolygon = (point, pts) => {
  /**
   * @description 判断当前坐标是否在区域范围内
   * */
  const N = pts.length; //pts [{lat:xxx,lng:xxx},{lat:xxx,lng:xxx}]
  const boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
  let intersectCount = 0; //cross points count of x
  const precision = 2e-10; //浮点类型计算时候与0比较时候的容差
  let p1, p2; //neighbour bound vertices
  const p = point; //point {lat:xxx,lng:xxx}

  p1 = pts[0]; //left vertex
  for (let i = 1; i <= N; ++i) {
    //check all rays
    if (p.latitude === p1.latitude && p.longitude === p1.longitude) {
      return boundOrVertex; //p is an vertex
    }
    p2 = pts[i % N]; //right vertex
    if (
      p.latitude < Math.min(p1.latitude, p2.latitude) ||
      p.latitude > Math.max(p1.latitude, p2.latitude)
    ) {
      //ray is outside of our interests
      p1 = p2;
      continue; //next ray left point
    }
    if (
      p.latitude > Math.min(p1.latitude, p2.latitude) &&
      p.latitude < Math.max(p1.latitude, p2.latitude)
    ) {
      //ray is crossing over by the algorithm (common part of)
      if (p.longitude <= Math.max(p1.longitude, p2.longitude)) {
        //x is before of ray
        if (
          p1.latitude === p2.latitude &&
          p.longitude >= Math.min(p1.longitude, p2.longitude)
        ) {
          //overlies on a horizontal ray
          return boundOrVertex;
        }
        if (p1.longitude === p2.longitude) {
          //ray is vertical
          if (p1.longitude === p.longitude) {
            //overlies on a vertical ray
            return boundOrVertex;
          } else {
            //before ray
            ++intersectCount;
          }
        } else {
          //cross point on the left side
          const xinters =
            ((p.latitude - p1.latitude) * (p2.longitude - p1.longitude)) /
              (p2.latitude - p1.latitude) +
            p1.longitude; //cross point of lng
          if (Math.abs(p.longitude - xinters) < precision) {
            //overlies on a ray
            return boundOrVertex;
          }
          if (p.longitude < xinters) {
            //before ray
            ++intersectCount;
          }
        }
      }
    } else {
      //special case when ray is crossing through the vertex
      if (p.latitude === p2.latitude && p.longitude <= p2.longitude) {
        //p crossing over p2
        const p3 = pts[(i + 1) % N]; //next vertex
        if (
          p.latitude >= Math.min(p1.latitude, p3.latitude) &&
          p.latitude <= Math.max(p1.latitude, p3.latitude)
        ) {
          //p.lat lies between p1.lat & p3.lat
          ++intersectCount;
        } else {
          intersectCount += 2;
        }
      }
    }
    p1 = p2; //next ray left point
  }
  if (intersectCount % 2 === 0) {
    //偶数在多边形外
    return false;
  } else {
    //奇数在多边形内
    return true;
  }
};
/**
 * @description 获取活动列表图标
 */
export const getActivityIcon = (activityState, applyState) => {
  const iconList = {
    //  #ifndef APP-PLUS-NVUE || APP-NVUE
    进行中: require('@/static/img/activity/activity-ing.png'),
    报名未开始: require('@/static/img/activity/apply-no-start.png'),
    报名中: require('@/static/img/activity/apply-ing.png'),
    报名结束: require('@/static/img/activity/apply-end.png'),
    已结束: require('@/static/img/activity/activity-end.png')
    // #endif
  };
  if (activityState === 4) {
    return iconList['进行中'];
  } else if (activityState === 3) {
    switch (applyState) {
      case 0:
        return iconList['报名未开始'];
      case 1:
        return iconList['报名中'];
      case 2:
        return iconList['报名结束'];
    }
  } else {
    return iconList['已结束'];
  }
};
/**
 * @description 获取活动列表图标
 */
export const getActivityDetailsIcon = (activityState, applyState) => {
  const iconList = {
    //  #ifndef APP-PLUS-NVUE || APP-NVUE
    进行中: require('@/static/img/activity/details-activity-ing.png'),
    报名未开始: require('@/static/img/activity/details-apply-no-start.png'),
    报名中: require('@/static/img/activity/details-apply-ing.png'),
    报名结束: require('@/static/img/activity/details-apply-end.png'),
    已结束: require('@/static/img/activity/details-activity-end.png')
    // #endif
  };
  if (activityState === 4) {
    return iconList['进行中'];
  } else if (activityState === 3) {
    switch (applyState) {
      case 0:
        return iconList['报名未开始'];
      case 1:
        return iconList['报名中'];
      case 2:
        return iconList['报名结束'];
    }
  } else {
    return iconList['已结束'];
  }
};

/**
 * @description 获取活动报名状态
 */
export const getRegisterState = (cardInfo) => {
  let registerState;
  if (Number(cardInfo.currentTime) < Number(cardInfo.registerStartTime)) {
    // 报名未开始
    registerState = 0;
  } else if (Number(cardInfo.currentTime) > Number(cardInfo.registerEndTime)) {
    // 报名已结束
    registerState = 2;
  } else {
    registerState = 1;
  }
  return registerState;
};

/**
 * @description 时间戳中获取星期
 */
export const getWeekItem = (time) => {
  const date = new Date(Number(time));
  const day = date.getDay();
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day];
};

/**
 * @description 时间戳中获取月份
 */
export const getMonthItem = (time) => {
  const date = new Date(Number(time));
  return date.getMonth() + 1;
};

/**
 * @description 时间戳中获取年份
 */
export const getYearItem = (time) => {
  const date = new Date(Number(time));
  return date.getFullYear();
};

/**
 * @description 时间戳中获取日期
 */
export const getDateItem = (time) => {
  const date = new Date(Number(time));
  return date.getDate();
};

/**
 * @description 获取gps定位信息，区分安卓和ios平台，ios调用原生方法，安卓调用uniApp api
 */
export const getLocation = (...args) => {
  // 判断平台
  const platform = uni.getSystemInfoSync().platform;
  if (platform === 'ios') {
    return events.getLocation(...args);
  } else {
    return new Promise((resolve) => {
      uni.getLocation({
        type: 'gcj02',
        success(res) {
          resolve(res);
        },
        fail(err) {
          resolve({ error: err });
        }
      });
    });
  }
};
/**
 * @description  检测是否开启gps
 */

export const locationManager = (cb = undefined) => {
  const system = uni.getSystemInfoSync(); // 获取系统信息
  if (system.platform === 'android') {
    // 判断平台
    const context = plus.android.importClass('android.content.Context');
    const locationManager = plus.android.importClass(
      'android.location.LocationManager'
    );
    const main = plus.android.runtimeMainActivity();
    const mainSvr = main.getSystemService(context.LOCATION_SERVICE);
    cb({
      isOpen: mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER),
      open: () => {
        if (system.platform === 'android') {
          const Intent = plus.android.importClass('android.content.Intent');
          const Settings = plus.android.importClass(
            'android.provider.Settings'
          );
          const intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
          main.startActivity(intent); // 打开系统设置GPS服务页面
        }
      }
    });
  } else if (system.platform === 'ios') {
    const cllocationManger = plus.ios.import('CLLocationManager');
    const enable = cllocationManger.locationServicesEnabled();
    const status = cllocationManger.authorizationStatus();
    plus.ios.deleteObject(cllocationManger);
    cb({
      isOpen: enable && status !== 2,
      open: () => {
        if (system.platform === 'ios') {
          const UIApplication = plus.ios.import('UIApplication');
          const application2 = UIApplication.sharedApplication();
          const NSURL2 = plus.ios.import('NSURL');
          const setting2 = NSURL2.URLWithString(
            'App-Prefs:root=Privacy&path=LOCATION'
          );
          application2.openURL(setting2);
          plus.ios.deleteObject(setting2);
          plus.ios.deleteObject(NSURL2);
          plus.ios.deleteObject(application2);
        }
      }
    });
  }
};

/**
 * @description 处理外部链接参数
 */
export const handelLinkUrlQuery = (query, target) => {
  let params = '';
  const result = [];
  let targetQuery = {
    ...store.state.app.userInfo,
    semesterId: (store.state.semester.currentSemester || {}).id
  };
  if (target && typeof target === 'object' && Object.keys(target).length > 0) {
    targetQuery = Object.assign({}, store.state.app.userInfo, target);
  }
  if (query && typeof query === 'object' && Object.keys(query).length > 0) {
    for (const key in query) {
      result.push(`${key}=${targetQuery[queryMappingTable[query[key]]]}`);
    }
  }
  if (result && result.length > 0) {
    params = `?${result.join('&')}`;
  }
  return params;
};

/**
 * @description 获取文件名称
 */
export const gitFileName = (url) => {
  if (!url) throw new Error('不存在该文件');
  const suffix = url.lastIndexOf('/');
  if (suffix === -1) return '';
  return url.slice(suffix + 1);
};

/**
 * @description 下载网络图片并返回 url id
 */
export const downloadFile = ({ url, id, dir }) => {
  return new Promise((resolve, reject) => {
    const result = {
      filePath: '',
      id,
      filename: ''
    };
    result.filename = gitFileName(url);
    plus.downloader
      .createDownload(
        url,
        {
          filename: `_doc/${dir}${result.filename}`
        },
        (d, status) => {
          if (status === 200) {
            const path = plus.io.convertLocalFileSystemURL(d.filename);
            result.filePath = path;
            resolve(result);
          } else {
            reject(status);
          }
        },
        (err) => reject(err)
      )
      .start();
  });
};

/**
 * @description 判断是否存在本地文件
 * */
export const getSavedFileInfo = (url) => {
  return new Promise((resolve, reject) => {
    // 判断该文件夹是否存在该文件
    uni.getSavedFileInfo({
      filePath: url, //仅做示例用，非真正的文件路径
      success(res) {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * @description 数字设置千分位
 * */
export const setThousandMark = (num) => {
  if (!num) return 0;
  if (num <= 999) return num;
  if (typeof num === 'number') {
    const str = num.toString();
    return str.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  return num;
};
