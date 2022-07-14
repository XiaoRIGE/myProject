// 用的是发布订阅的设计模式实现一个简单的bus
class Bus {
  list: { [key: string]: Array<Function> };
  constructor() {
    // 收集订阅信息,调度中心
    this.list = {};
  }

  // 订阅
  $on(name: string, fn: Function) {
    this.list[name] = this.list[name] || [];
    this.list[name].push(fn);
  }

  // 发布
  $emit(name: string, data?: any) {
    if (this.list[name]) {
      this.list[name].forEach((fn: Function) => {
        fn(data);
      });
    }
  }

  // 取消订阅
  $off(name: string) {
    if (this.list[name]) {
      delete this.list[name];
    }
  }
}
export default new Bus();