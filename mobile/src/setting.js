// 二维码组件需要携带的auth标识来检测是否是内部二维码
export const qrCodeAuth = 'legym';

// 参数映射表
export const queryMappingTable = {
  token: 'accessToken', // token
  studentNumber: 'organizationUserNumber', // 学号
  userId: 'id', // 用户id
  gender: 'gender', // 性别
  schoolId: 'schoolId', // 学校id
  mobile: 'mobile', // 电话号码
  semesterId: 'semesterId', // 学期id
  role: 'identity' // 角色
};

// 接口环境
export const BASE_URL_LIST = {
  dev: 'http://192.168.1.119:8000/', // 开发环境
  test: 'http://192.168.1.129:8000/', // 测试环境
  wDev: 'http://dev.ledreamer.com:8130/', //  'http://125.71.210.73:8130/' 外网开发环境ip
  wTest: 'http://dev.ledreamer.com:8140/', //  'http://125.71.210.73:8140/' 外网测试环境ip
  baseTest: 'http://47.108.181.101/', // 公测环境
  product: 'https://cpes.legym.cn/' // 生产环境
};

// 缓存文件目录配置
export const CACHE_DIR = {
  activitie: 'activitie/cacheImages/' // 活动图片缓存位置
};
