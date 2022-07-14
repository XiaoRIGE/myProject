<template>
  <div class="map-box">
    <div id="container" :style="mapStyle" />
    <!-- 地图搜索 -->
    <div v-show="mapIsReady && needSearch" class="search-div">
      <a-input id="tipinput" placeholder="搜索地点" />
    </div>
    <!-- 自定义工具栏 -->
    <div v-show="mapIsReady && isEditState" class="tool-bar">
      <p class="tool-title">
        工具栏
      </p>
      <!-- 范围选择 -->
      <a-radio-group
        v-show="
          currentDrawType === 'effective' || currentDrawType === 'invalid'
        "
        v-model:value="selectAreaType"
        class="radio-group padding-box"
        button-style="solid"
      >
        <a-radio-button value="effective">
          有效区域
        </a-radio-button>
        <a-radio-button value="invalid">
          无效区域
        </a-radio-button>
      </a-radio-group>
      <div class="example padding-box">
        <span class="effective-type example-area">有效区域</span>
        <span class="invalid-type example-area">无效区域</span>
      </div>
      <div class="help padding-box">
        <a-tooltip placement="top">
          <template #title>
            <p>步骤1：选择绘制有效无效区域</p>
            <p>步骤2：单击左键画图形</p>
            <p>步骤3：单击右键停止创建；</p>
            <p>步骤4：区域命名完成创建。</p>
          </template>
          <div class="help-box">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconwenhao" />
            </svg>
            <span>操作帮助</span>
          </div>
        </a-tooltip>
      </div>
      <!-- 点位/线路操作工具 -->
      <div
        v-show="currentDrawType === 'point' || currentDrawType === 'line'"
        class="btn-group padding-box"
      >
        <a-space :size="24">
          <a-button @click="handleClear">
            清除
          </a-button>
          <a-button type="primary" @click="handleSave">
            保存
          </a-button>
        </a-space>
        <div class="tips">
          <span v-show="currentDrawType === 'point'">
            清除正在绘制点位，已保存点位请点击删除
          </span>
          <span v-show="currentDrawType === 'line'">
            清除正在绘制线路，已保存线路请点击删除
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  watch,
  watchEffect
} from 'vue';
import { message } from 'ant-design-vue';

const getDrawType = (params: string) => {
  switch (params) {
    case 'effective':
      return 'polygon';
    case 'invalid':
      return 'polygon-invalid';
    case 'point':
      return 'marker';
    case 'line':
      return 'polyline';
    default:
      return 'marker';
  }
};

interface CoordinateItem {
  Q: number;
  R: number;
  lat: number;
  lng: number;
}

// @ts-ignore
import AMapJS from 'amap-js';

export default defineComponent({
  props: {
    // 绘制覆盖物类型 area：绘制多边形区域 point：绘制点 line：绘制线段
    drawType: {
      type: String,
      default: 'area'
    },
    // 地图回显数据
    mapData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 是否编辑状态（非编辑状态不可进行绘制）
    isEditState: {
      type: Boolean
    },
    // 当前选中地图数据 selectType：高亮类型 selectIndex：高亮索引
    // area：有效区域 invalid-area：无效区域 point：点位 line：线段
    currentSelectMapData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 是否需要搜索插件
    needSearch: {
      type: Boolean,
      default: true
    },
    // 跑步路径
    runPathInfo: {
      type: Array,
      default: () => [
        // [104.05867, 30.719763],
        // [104.058971, 30.718582],
        // [104.059271, 30.717549],
        // [104.059314, 30.716516],
        // [104.059572, 30.715668],
        // [104.059657, 30.715262],
        // [104.059743, 30.714709],
        // [104.059915, 30.713675],
        // [104.060087, 30.713085],
        // [104.06043, 30.71231],
        // [104.061159, 30.711536],
        // [104.061717, 30.710724],
        // [104.062619, 30.709986],
        // [104.063649, 30.708289],
        // [104.064421, 30.707403]
      ]
    },
    // 地图大小 width:calc(100vw - 1040px);height:calc(100vh - 200px)
    mapStyle: {
      type: String,
      default: ''
    }
  },
  emits: [
    'change-edit-state',
    'save-area-info',
    'save-point-info',
    'save-line-info'
  ],
  setup(props, { emit }) {
    let mapObj: any; // 地图对象

    let gaodeMap: any;

    let overlays: CoordinateItem[] = []; //地图绘制的信息 todo 维护有问题 切换校区的时候

    let newPointNum = 0; //当前新绘制点位 数量
    let newLineNum = 0; //当前新绘制线路 数量

    // 删除最新绘制的覆盖物
    const deleteOverlays = () => {
      mapObj.remove(overlays.pop());
    };

    // 工具栏配置
    const useToolBar = () => {
      const selectAreaType = ref<string>('effective'); //绘制范围类型  有效/无效

      //批量保存点位/线路(新绘制的)
      const handleSave = () => {
        if (props.drawType === 'line') {
          const lineDataArr = overlays
            .filter((item: any) => {
              return item.CLASS_NAME === 'AMap.Polyline';
            })
            .map((item: any) => {
              return item.getPath();
            });

          // 计算线段距离
          const lineDataWithdistance = lineDataArr.map(item => {
            const distance = gaodeMap.AMap.GeometryUtil.distance(
              item[0],
              item[1]
            );
            const resultItem = item.map((itemx: any) => {
              return {
                ...itemx,
                distance
              };
            });
            return resultItem;
          });
          emit('save-line-info', lineDataWithdistance);
        }
        if (props.drawType === 'point') {
          const pointDataArr = overlays
            .filter((item: any) => {
              return item.CLASS_NAME === 'AMap.Marker';
            })
            .map((item: any) => {
              return item.getPosition();
            });
          console.log('pointDataArr', pointDataArr);
          emit('save-point-info', pointDataArr);
        }
      };

      //批量清除点位/线路(新绘制的)
      const handleClear = () => {
        if (props.drawType === 'line') {
          console.log('清除最新绘制的线路');
          while (newLineNum > 0) {
            newLineNum--;
            deleteOverlays();
          }
        }
        if (props.drawType === 'point') {
          console.log('清除最新绘制的点位');
          while (newPointNum > 0) {
            newPointNum--;
            deleteOverlays();
          }
        }
      };
      return {
        selectAreaType,
        handleSave,
        handleClear
      };
    };

    const { selectAreaType, handleSave, handleClear } = useToolBar();

    // 搜索配置
    const useSearchPlugin = (AMap: any, mapObj: any) => {
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
        //输入提示
        const autoOptions = {
          input: 'tipinput'
        };
        const auto = new AMap.Autocomplete(autoOptions);

        const placeSearch = new AMap.PlaceSearch({
          map: mapObj
        }); //构造地点查询类

        const select = (e: any) => {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name); //关键字查询查询
        };

        AMap.event.addListener(auto, 'select', select); //注册监听，当选中某条记录时会触发
      });
    };

    // 图钉图标配置（点位）
    const getLocationIcom = (AMap: any, type: string) => {
      if (type === 'checked') {
        //选中图标
        return new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(48, 66),
          // 图标的取图地址
          image: require('@/assets/position-checked.png'),
          // 图标所用图片大小
          imageSize: new AMap.Size(48, 66)
        });
      } else {
        //普通图标
        return new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(25, 37),
          // 图标的取图地址
          image: require('@/assets/position.png'),
          // 图标所用图片大小
          imageSize: new AMap.Size(25, 37)
        });
      }
    };

    // 绘制覆盖物配置
    const useDrawPlugin = (AMap: any, mapObj: any, currentDrawType: any) => {
      AMap.plugin(['AMap.MouseTool'], () => {
        const mouseTool = new AMap.MouseTool(mapObj);

        // 绑定绘制事件
        mouseTool.on('draw', (e: any) => {
          const drawDataType = e.obj.CLASS_NAME;

          // 绘制类型判断  点位、范围（有效、无效）、线路
          if (drawDataType === 'AMap.Marker') {
            console.log('获取点标注位置', e.obj.getPosition()); //获取点标注位置
            newPointNum++; //记录新绘制点位数量
          } else if (
            drawDataType === 'AMap.Polygon' ||
            drawDataType === 'Overlay.Polygon'
          ) {
            console.log('获取范围', e.obj.getPath()); //获取范围
            const areaData = e.obj.getPath();
            setTimeout(() => {
              emit('save-area-info', {
                areaData,
                areaType: selectAreaType.value
              });
            }, 10);
          } else if (drawDataType === 'AMap.Polyline') {
            console.log('获取路径', e.obj.getPath()); //获取路径
            newLineNum++; //记录新绘制线路数量
          }

          // 存储绘制覆盖物的经纬度信息
          overlays.push(e.obj);

          console.log('overlays', overlays);
          // e.stopPropagation();
        });

        // 绘制类型设置(填充颜色 边框颜色)
        const draw = (type: string) => {
          switch (type) {
            case 'marker': {
              mouseTool.marker({
                //画点 同Marker的Option设置
                draggable: false //拖拽
                // icon: getLocationIcom(AMap,'normal'),
                // offset: new AMap.Pixel(-15, -36)
              });
              break;
            }
            // 屏蔽手动绘制线段，通过点击点位完成绘制（保证绘制线段都在点位上）
            // case 'polyline': {
            //   mouseTool.polyline({
            //     strokeColor: '#1966FE',
            //     strokeWeight: 3
            //   });
            //   break;
            // }
            case 'polygon': {
              mouseTool.polygon({
                fillColor: '#00CF0D',
                strokeColor: '#00CF0D',
                fillOpacity: 0.15
                //画多边形-有效范围 同Polygon的Option设置
              });
              break;
            }
            case 'polygon-invalid': {
              mouseTool.polygon({
                fillColor: '#F5222D',
                strokeColor: '#F5222D',
                fillOpacity: 0.15
                //画多边形-无效范围 同Polygon的Option设置
              });
              break;
            }
            case 'rectangle': {
              mouseTool.rectangle({
                fillColor: '#00b0ff',
                strokeColor: '#80d8ff'
                //画矩形 同Polygon的Option设置
              });
              break;
            }
            case 'circle': {
              mouseTool.circle({
                fillColor: '#00b0ff',
                strokeColor: '#80d8ff'
                //画圆 同Circle的Option设置
              });
              break;
            }
          }
        };

        // 开启绘制
        // draw(getDrawType(currentDrawType.value));

        // 切换绘制覆盖物的类型
        watch(
          () => props.drawType,
          newVal => {
            // 如果当前是编辑状态
            if (props.isEditState) {
              // 最新绘制覆盖物类型不是折线  则调用draw方法 开启绘制
              if (newVal !== 'line') {
                draw(getDrawType(newVal));
              } else {
                //否则 关闭绘制
                mouseTool.close(false); //关闭绘制，不清除覆盖物
              }
            }
            // emit('change-edit-state');//切换draw 需要改变编辑状态吗？todo
          }
        );

        // 切换工具栏的有效范围、无效范围
        watch(
          () => selectAreaType.value,
          newVal => {
            draw(getDrawType(newVal));
            emit('change-edit-state');
          }
        );

        // 切换编辑（绘制）状态
        watch(
          () => props.isEditState,
          () => {
            if (!props.isEditState) {
              mouseTool.close(false); //关闭绘制，不清除覆盖物
            } else {
              draw(getDrawType(currentDrawType.value)); //开启绘制
            }
          }
        );
      });
    };

    let linePathOverlays: any[] = [];

    // 绘制跑步路径
    const setRunningPath = (AMap: any, mapObj: any) => {
      // 先移除之前的
      mapObj.remove(linePathOverlays);
      // 清除地图上所有添加的覆盖物
      // mapObj.clearMap();

      const lineArr = props.runPathInfo;
      // 跑步小人
      // const marker = new AMap.Marker({
      //   map:mapObj,
      //   position: lineArr[0],
      //   icon:require('@/assets/run.png'),
      //   offset: new AMap.Pixel(-13, -26)
      // });

      // 起点标记
      const startPointOverlays = new AMap.Marker({
        position: lineArr[0],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        map: mapObj,
        anchor: 'bottom-center',
        offset: new AMap.Pixel(0, 0)
      });

      // 终点标记
      const endPointOverlays = new AMap.Marker({
        position: lineArr[lineArr.length - 1],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        map: mapObj,
        anchor: 'bottom-center',
        offset: new AMap.Pixel(0, 0)
      });

      // 绘制轨迹
      const pathOverlays = new AMap.Polyline({
        map: mapObj,
        path: lineArr,
        showDir: true,
        strokeColor: '#28F', //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      });

      linePathOverlays = [];
      linePathOverlays.push(startPointOverlays, endPointOverlays, pathOverlays);
    };

    // 初始化地图覆盖物数据
    const initData = (AMap: any, map: any, mapData: any) => {
      const { pointData, lineData, areaData, areaInvalidData } = mapData;

      /**
       * @description:获取有效(无效)范围数据（高亮和普通状态）
       * @param {number} index 需要高亮的区域索引，默认值-1表示没有需要高亮的数据
       * @param {string} areaType effective:有效区域  invalid：无效区域
       * @return {*} 有效(无效)范围数组
       */
      const getAreaData = (areaType: string, index = -1) => {
        const targetData =
          areaType === 'effective' ? areaData : areaInvalidData;

        if (targetData && targetData.length) {
          // 绘制颜色
          const corlorConfig = areaType === 'effective' ? '#00CF0D' : '#F5222D';

          if (index !== -1) {
            return targetData.map((item: CoordinateItem[], indexX: number) => {
              const areaSelf = item.map((itemx: CoordinateItem) => {
                return new AMap.LngLat(itemx.lng, itemx.lat);
              });
              if (index === indexX) {
                // 匹配到高亮数据索引
                return new AMap.Polygon({
                  path: areaSelf,
                  fillColor: corlorConfig,
                  strokeColor: corlorConfig,
                  fillOpacity: 0.15,
                  strokeWeight: 6
                });
              } else {
                return new AMap.Polygon({
                  path: areaSelf,
                  fillColor: corlorConfig,
                  strokeColor: corlorConfig,
                  fillOpacity: 0.15,
                  strokeWeight: 1
                });
              }
            });
          } else {
            return targetData.map((item: CoordinateItem[]) => {
              const areaSelf = item.map((itemx: CoordinateItem) => {
                return new AMap.LngLat(itemx.lng, itemx.lat);
              });
              return new AMap.Polygon({
                path: areaSelf,
                fillColor: corlorConfig,
                strokeColor: corlorConfig,
                fillOpacity: 0.15,
                strokeWeight: 1
              });
            });
          }
        } else {
          return [];
        }
      };

      /**
       * @description: 获取点位数据
       * @param {number} index 需要高亮的点位索引，默认值-1表示没有需要高亮的数据
       * @return {*} 点位信息数组
       */
      const getMakerData = (index = -1) => {
        if (pointData && pointData.length) {
          if (index !== -1) {
            return pointData.map((item: CoordinateItem, indexX: number) => {
              if (index === indexX) {
                // 匹配到高亮点
                //选中图钉图标

                return new AMap.Marker({
                  position: new AMap.LngLat(item.lng, item.lat),
                  icon: getLocationIcom(AMap, 'checked'),
                  offset: new AMap.Pixel(-25, -45),
                  size: [150, 70]
                });
              } else {
                return new AMap.Marker({
                  position: new AMap.LngLat(item.lng, item.lat),
                  icon: getLocationIcom(AMap, 'normal'),
                  offset: new AMap.Pixel(-15, -36)
                });
              }
            });
          } else {
            return pointData.map((item: CoordinateItem) => {
              return new AMap.Marker({
                position: new AMap.LngLat(item.lng, item.lat)
              });
            });
          }
        } else {
          return [];
        }
      };

      /**
       * @description: 获取线段数据
       * @param {*} index 需要高亮的线段索引，默认值-1表示没有需要高亮的数据
       * @return {*}
       */
      const getLineData = (index = -1) => {
        if (lineData && lineData.length) {
          if (index !== -1) {
            // 匹配高亮线段
            return lineData.map((item: CoordinateItem[], indexX: number) => {
              const lineSelf = item.map((itemx: CoordinateItem) => {
                return new AMap.LngLat(itemx.lng, itemx.lat);
              });
              if (index === indexX) {
                return new AMap.Polyline({
                  path: lineSelf,
                  strokeColor: '#1966FE',
                  strokeWeight: 6
                });
              } else {
                return new AMap.Polyline({
                  path: lineSelf,
                  strokeColor: '#1966FE',
                  strokeWeight: 3
                });
              }
            });
          } else {
            return lineData.map((item: CoordinateItem[]) => {
              const lineSelf = item.map((itemx: CoordinateItem) => {
                return new AMap.LngLat(itemx.lng, itemx.lat);
              });
              return new AMap.Polyline({
                path: lineSelf,
                strokeColor: '#1966FE',
                strokeWeight: 3
              });
            });
          }
        } else {
          return [];
        }
      };

      // 创建点覆盖物
      let makerArr = getMakerData();

      const hasStartPoint = ref<boolean>(false); //是否存在折线开始点位
      let startPoint: any; //折线开始点位
      let endPoint: any; //折线结束点位

      // 点击事件-通过点位的点击事件生成折线（两个点则生成一条折线）
      const startDarwLine = (e: any) => {
        const markerInfo = e.target.getPosition();

        if (!hasStartPoint.value) {
          //点击某一个点位 如果当前还没有开始点位 修改hasStartPoint的值
          hasStartPoint.value = !hasStartPoint.value;
          startPoint = [markerInfo.lng, markerInfo.lat];
          message.warning('请点击下一个点位完成绘制！');
          return;
        }

        if (hasStartPoint.value) {
          //绘制第二个点时 清空当前绘制的折线  并修改当前折线的开始坐标为第一个点，结束坐标为第二个点  并清空折线开始点位

          // mapObj.remove(overlays.pop());
          endPoint = [markerInfo.lng, markerInfo.lat];

          // 判断开始点位和结束点位是否是同一个，如果是同一个，则提示请换一个点位

          if (
            startPoint &&
            endPoint &&
            startPoint.length &&
            endPoint.length &&
            startPoint[0] === endPoint[0] &&
            startPoint[1] === endPoint[1]
          ) {
            message.warning(
              '连线开始点位和结束点位不能为同一个，请重选一个作为结束点位！'
            );
            endPoint = null;
            return;
          }

          const path = [startPoint, endPoint]; //获取开始点位和结束点位左边

          const line = new AMap.Polyline({
            map: mapObj,
            path,
            strokeColor: '#1966FE',
            strokeWeight: 3
          });
          message.success('当前线路绘制完成！');
          newLineNum++;

          overlays.push(line);
          hasStartPoint.value = false;
          startPoint = null;
          endPoint = null;
        }
      };

      // 给点位绑定点击事件
      const addClickListener = () => {
        if (makerArr.length) {
          makerArr.forEach((element: any) => {
            // console.log('循环绑定点击事件', element);
            element.on('click', startDarwLine);
          });
        }
      };

      if (props.isEditState && props.drawType === 'line') {
        // console.log('当前是编辑状态,绑定点位点击事件');
        setTimeout(() => {
          addClickListener();
        }, 1000); //todo 异步？
      }

      // 创建线覆盖物
      let lineArr = getLineData();

      // 创建范围覆盖物（有效区域）
      let areaArr = getAreaData('effective');

      // 创建范围覆盖物（无效区域）
      let areaInvalidArr = getAreaData('invalid');

      // 先移除之前的
      // map.remove(overlays);
      map.clearMap();

      // 将绘制覆盖物添加到地图
      map.add([...makerArr, ...areaArr, ...lineArr, ...areaInvalidArr]);
      overlays = [];
      overlays = [
        ...overlays,
        ...areaArr,
        ...areaInvalidArr,
        ...makerArr,
        ...lineArr
      ];

      // 切换高亮数据（区域、点位、线段）
      watchEffect(() => {
        const { selectType, selectIndex: index } = props.currentSelectMapData;

        //  1 移除之前覆盖物信息
        map.remove(overlays);

        //  2.获取新的覆盖物数据
        if (selectType === 'area') {
          // 最新高亮区域为有效区域
          areaArr = getAreaData('effective', index);
          areaInvalidArr = getAreaData('invalid');
          makerArr = getMakerData();
          lineArr = getLineData();
        } else if (selectType === 'invalid-area') {
          // 最新高亮区域为无效区域
          areaArr = getAreaData('effective');
          areaInvalidArr = getAreaData('invalid', index);
          makerArr = getMakerData();
          lineArr = getLineData();
        } else if (selectType === 'point') {
          // 最新高亮为 点标记
          areaArr = getAreaData('effective');
          areaInvalidArr = getAreaData('invalid');
          makerArr = getMakerData(index);
          lineArr = getLineData();
        } else if (selectType === 'line') {
          // 最新高亮为 点标记
          areaArr = getAreaData('effective');
          areaInvalidArr = getAreaData('invalid');
          makerArr = getMakerData();
          lineArr = getLineData(index);
        }

        // 3.将新的覆盖物添加到地图
        map.add([...areaArr, ...areaInvalidArr, ...makerArr, ...lineArr]);
        overlays = [];
        overlays = [
          ...overlays,
          ...areaArr,
          ...areaInvalidArr,
          ...makerArr,
          ...lineArr
        ];
      });
    };

    const currentDrawType = computed(() => {
      return props.drawType;
    });

    const mapIsReady = ref(false);

    // 初始化地图
    const init = async (): Promise<any> => {
      gaodeMap = new AMapJS.AMapLoader({
        key: '3ee6c7d4f86150b33c9b57d748068a5e',
        version: '1.4.15',
        // version: '2.0',
        plugins: ['AMap.Geolocation'] //需要加载的插件
      });
      const { AMap } = await gaodeMap.load();

      new AMap.Geolocation({
        enableHighAccuracy: false, //是否使用高精度定位，默认:true
        timeout: 10000 //超过10秒后停止定位，默认：无穷大
      }).getCurrentPosition((status: any, result: any) => {
        // 默认定位到成都
        let latPosition = 30.657482;
        let lngPosition = 104.065733;
        if (status !== 'error') {
          try {
            latPosition = result.position.lat;
            lngPosition = result.position.lng;
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('定位失败，请使用其他方法,失败原因', result);
        }

        // 构造地图
        mapObj = new AMap.Map('container', {
          center: [lngPosition, latPosition],
          zoom: 15
        });

        //地图加载完成
        mapObj.on('complete', () => {
          mapIsReady.value = true;
        });

        //异步加载插件
        if (props.needSearch) {
          useSearchPlugin(AMap, mapObj); //关键字提示匹配插件
        }

        useDrawPlugin(AMap, mapObj, currentDrawType); // 绘制覆盖物插件

        // 地图数据回显
        watchEffect(() => {
          console.log('执行initData');

          initData(AMap, mapObj, props.mapData);

          if (props.runPathInfo.length) {
            setRunningPath(AMap, mapObj);
          }

          // 根据覆盖物调整地图范围-自动自适应所有覆盖物
          mapObj.setFitView();
        });

        // 关闭弹窗时，清除未保存的覆盖物
        watch(
          () => props.isEditState,
          () => {
            if (!props.isEditState) {
              initData(AMap, mapObj, props.mapData);
            }
          }
        );
      });
    };

    onMounted(() => {
      init();
    });

    return {
      selectAreaType,
      currentDrawType,
      mapIsReady,
      deleteOverlays,
      handleSave,
      handleClear
    };
  }
});
</script>

<style lang="less" scoped>
.map-box {
  position: relative;
  display: inline-block;
  #container {
    width: calc(~'100vw - 640px');
    height: calc(~'100vh - 450px');
    min-height: 600px;
  }
  .search-div {
    position: absolute;
    right: 30px;
    top: 40px;
  }
  .tool-bar {
    position: absolute;
    left: 30px;
    top: 40px;
    width: 254px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03),
      0px 9px 28px 0px rgba(0, 0, 0, 0.05),
      0px 6px 16px -8px rgba(0, 0, 0, 0.08);
    .tool-title {
      border-bottom: 1px solid gray;
      text-align: center;
      line-height: 40px;
    }
    .padding-box {
      padding: 0 24px 16px;
    }
    .radio-group {
      padding-bottom: 16px;
    }
    .example {
      &-area {
        display: flex;
        align-items: center;
        &::after {
          content: '';
          display: inline-block;
          margin-left: 8px;
          width: 80px;
          height: 20px;
        }
      }
      .effective-type {
        margin-bottom: 8px;
        &::after {
          background: rgba(0, 207, 13, 0.15);
          border: 1px solid #00cf0d;
        }
      }
      .invalid-type {
        &::after {
          background: rgba(245, 34, 45, 0.15);
          border: 1px solid #f5222d;
        }
      }
    }
    .help {
      &-box {
        display: flex;
        align-items: center;
        .icon {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }
      }
    }
    .btn-group {
      .tips {
        padding-top: 8px;
        line-height: 18px;
      }
    }
  }
}
</style>
