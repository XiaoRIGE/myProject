// 小程序向宿主原生App发送的事件列表
export const sendNativeEvents = {
  /**
   * @description 事件名称
   * @returns undefined
   * */
  navigatorNativePage: {
    /**
     * @description 事件描述
     * */
    description: '跳转对应原生页面',
    /**
     * @description 事件参数, 类型：Object:{page,query} ，page:参数一是跳转页面，query参数二是携带相关参数 可选参数
     * */

    /**
     *@enum page {
     *  gpsActivitySignIn: 教师进入活动签到页面开启签到,
     *  gpsSignIn: 教师进入课程签到页面开启签到,
     *  aiPage: 学生进入Ai运动页面,
     *  sports: 学生进入跑步页面,
     *  aiSportsResultPage: 学生进入ai运动结果页面
     * }
     */
    params: 'Object: {page: string , query: any, ...args} ',
    /**
     *@description 返回值, 默认null
     * */
    result: null, // 返回值，通过Promise获取
    senUser: true, // 是否需要传递用户信息
    sendBaseUrl: true // 是否需要传递域名
  },
  quitApp: {
    description: '首页点击2次返回退出App',
    params: null,
    result: null
  },
  getLocation: {
    description: '原生获取GPS经纬度',
    params: null,
    result: '{error: string || null, latitude: number , longitude: number}'
  },
  checkRunningCache: {
    description: '提示原生查看跑步是否有缓存',
    params: null,
    result:
      '{ hasRunningCache:boolean, isFinished: number 0: 跑步未结束 1:  已经结束，没有上传成功 }',
    senUser: true, // 是否需要传递用户信息
    sendBaseUrl: true // 是否需要传递域名
  },
  checkAIRecordCache: {
    description: '检查AI运动缓存',
    params: null,
    result: null,
    senUser: true, // 是否需要传递用户信息
    sendBaseUrl: true // 是否需要传递域名
  },
  IsContinueRunning: {
    description: '通知原生是否继续跑步',
    params: 'Object: {IsContinueRunning: boolean} ',
    result: null,
    senUser: true, // 是否需要传递用户信息
    sendBaseUrl: true // 是否需要传递域名
  },
  getEncryptedData: {
    description: '字符串加密',
    params: 'originalData: string ', //原始数据
    result: 'encryptedData: string' //加密后数据
  }
};

// 小程序监听原生App向小程序发送的事件列表
export const onNativeEvents = {};
