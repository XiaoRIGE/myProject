// @ts-ignore
import AMapJS from 'amap-js';
import { ref, reactive, watch } from 'vue';

// 高德地图定位信息
interface CoordinateItem {
  Q: number;
  R: number;
  lat: number;
  lng: number;
}

// 参数
interface MapProps {
  radius: number; //半径
  needSearch: boolean; //是否需要搜索插件
  position: any[]; //位置（经度、纬度）
  visible: boolean; //地图是否展示
}

export const useMap = (mapProp: MapProps) => {
  let mapObj: any; // 地图对象
  let gaodeMap: any; //地图实例

  const mapIsReady = ref<boolean>(false); //地图加载完成

  // 实时经纬度 默认定位成都
  const circlePosition = reactive({
    lng: 104.057182, //经度
    lat: 30.696035 //纬度
  });

  const [lng, lat] = mapProp.position;
  circlePosition.lng = lng;
  circlePosition.lat = lat;

  const circleName = ref<string>(''); // 实时位置

  const pointOverlays: CoordinateItem[] = []; //地图点位绘制信息
  const circleOverlays: CoordinateItem[] = []; //地图圆形绘制信息

  // 删除覆盖物
  const deleteOverlays = () => {
    // 删除之前的绘制的点位
    if (pointOverlays.length >= 2) {
      mapObj.remove(pointOverlays.shift());
    }
    if (circleOverlays.length) {
      mapObj.remove(circleOverlays.shift());
    }
  };

  // 逆地理编码（坐标 -> 地址）
  const regeoCode = async (AMap: any, lnglatArr: number[]) => {
    if (!lnglatArr.length) return;
    const geocoder = new AMap.Geocoder({
      // city: '010', //城市设为北京，默认：“全国”
      radius: 1000 //范围，默认：500
    });

    await geocoder.getAddress(lnglatArr, (status: any, result: any) => {
      if (status === 'complete' && result.regeocode) {
        const address = result.regeocode.formattedAddress;
        circleName.value = address;
      } else {
        console.log('根据经纬度查询地址失败');
      }
    });
  };

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

  // 圆绘制
  const drawCircle = (AMap: any, mapObj: any, lnglatArr: number[]) => {
    if (!lnglatArr[0] || !lnglatArr) {
      return;
    }
    regeoCode(AMap, lnglatArr);

    deleteOverlays();
    const circle = new AMap.Circle({
      center: lnglatArr,
      radius: mapProp.radius, //半径
      borderWeight: 3,
      strokeColor: '#FF33FF',
      strokeWeight: 2,
      strokeOpacity: 0.2,
      fillOpacity: 0.4,
      strokeStyle: '#1966FE',
      strokeDasharray: [10, 10],
      fillColor: '#1791fc',
      zIndex: 50
    });

    circleOverlays.push(circle);
    circle.setMap(mapObj);
    // 缩放地图到合适的视野级别
    mapObj.setFitView([circle]);

    const circleEditor = new AMap.CircleEditor(mapObj, circle);
    circleEditor.close();
  };

  // 点位绘制
  const drawPoint = (AMap: any, mapObj: any) => {
    AMap.plugin(['AMap.MouseTool'], () => {
      const mouseTool = new AMap.MouseTool(mapObj);

      mouseTool.marker();

      mouseTool.on('draw', (e: any) => {
        // 存储绘制覆盖物的经纬度信息
        pointOverlays.push(e.obj);
        deleteOverlays();

        const { Q, R } = e.obj.getPosition();
        const pointLocation = [R, Q];

        // 更新经纬度
        circlePosition.lat = Q; //纬度
        circlePosition.lng = R; //经度

        drawCircle(AMap, mapObj, pointLocation);
      });
    });
  };

  // 初始化地图
  const init = async (): Promise<any> => {
    gaodeMap = new AMapJS.AMapLoader({
      key: '3ee6c7d4f86150b33c9b57d748068a5e',
      version: '1.4.15',
      plugins: ['AMap.Geolocation', 'AMap.CircleEditor', 'AMap.Geocoder'] //需要加载的插件
    });
    const { AMap } = await gaodeMap.load();

    new AMap.Geolocation({
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      timeout: 10000 //超过10秒后停止定位，默认：无穷大
    }).getCurrentPosition((status: any, result: any) => {
      // 默认定位到成都
      let latPosition = 30.57899372; //30.657482;
      let lngPosition = 104.07274727; //104.065733;
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
      if (mapProp.needSearch) {
        useSearchPlugin(AMap, mapObj); //关键字提示匹配插件
      }
      drawPoint(AMap, mapObj);

      // 检测到半径值改变，重新绘制圆
      watch(
        () => mapProp.radius,
        () => {
          drawCircle(AMap, mapObj, [circlePosition.lng, circlePosition.lat]);
        },
        {
          immediate: true
        }
      );

      // 检测到默认原点，绘制点位
      watch(
        () => mapProp.position,
        () => {
          if (!mapProp.position || !mapProp.position[0] || !mapProp.position[1])
            return;

          const startPointOverlays = new AMap.Marker({
            position: mapProp.position,
            map: mapObj
          });
          pointOverlays.push(startPointOverlays);

          const [lng, lat] = mapProp.position;
          circlePosition.lng = lng;
          circlePosition.lat = lat;

          drawCircle(AMap, mapObj, [mapProp.position[0], mapProp.position[1]]);
        },
        {
          immediate: true
        }
      );
    });
  };
  watch(
    () => mapProp.visible,
    () => {
      if (mapProp.visible) {
        init();
      }
    }
  );

  return {
    circlePosition,
    circleName
  };
};
