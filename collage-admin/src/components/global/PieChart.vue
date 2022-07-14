<!--
 * @Author: your name
 * @Date: 2021-08-11 11:33:30
 * @LastEditTime: 2021-09-13 14:21:06
 * @LastEditors: Please set LastEditors
 * @Description: 达标图饼图
 * @FilePath: \collage-admin\src\components\global\PieChart.vue
-->
<template>
  <div class="charts-box">
    <div ref="myChart" class="myChart" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from 'vue';
interface myChartList {
  allSchoolReachRate: number;
  excellent: {
    percentage: number;
    number: number;
  };
  good: {
    percentage: number;
    number: number;
  };
  passrate: {
    percentage: number;
    number: number;
  };
  flunk: {
    percentage: number;
    number: number;
  };
  unconfirmed: {
    percentage: number;
    number: number;
  };
}
export default defineComponent({
  props: {
    // 图表数据
    chartsData: {
      type: Object,
      default: () => ({
        // allSchoolReachRate: 68.1, //全校达标率
        // excellent: {
        //   percentage: 10,
        //   number: 1000
        // }, //优秀
        // good: {
        //   percentage: 20,
        //   number: 2000
        // }, //良好
        // passrate: {
        //   percentage: 30,
        //   number: 1200
        // }, //及格
        // flunk: {
        //   percentage: 38,
        //   number: 2000
        // }, //不及格
        // unconfirmed: {
        //   percentage: 2,
        //   number: 2000
        // } //未测完
      })
    },
    title: {
      type: String,
      default: '全校达标率'
    }
  },
  setup(props) {
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/pie'); //饼图
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    require('echarts/lib/component/legend');
    const myChart = ref<any>();
    const myChartList = reactive<myChartList>({
      allSchoolReachRate: 0, //全校达标率
      excellent: {
        percentage: 0,
        number: 0
      }, //优秀
      good: {
        percentage: 0,
        number: 0
      }, //良好
      passrate: {
        percentage: 0,
        number: 0
      }, //及格
      flunk: {
        percentage: 0,
        number: 0
      }, //不及格
      unconfirmed: {
        percentage: 0,
        number: 0
      } //未测完
    });

    let options: any;

    const initData = () => {
      options = {
        title: [
          {
            text: props.title,
            x: '32%',
            y: '40%',
            textAlign: 'center',
            textStyle: {
              fontSize: 20
            }
          },
          {
            text: `${myChartList.allSchoolReachRate}%`,
            x: '32.5%',
            y: '52%',
            textAlign: 'center',
            textStyle: {
              fontSize: 20
            }
          }
        ],
        tooltip: {
          trigger: 'item'
        },
        legend: [
          {
            top: '32%',
            left: '50%',
            icon: 'circle',
            data: [
              `优秀  |  ${myChartList.excellent.percentage}%  ${myChartList.excellent.number}人`
            ]
          },
          {
            top: '32%',
            left: '70%',
            icon: 'circle',
            data: [
              `及格  |  ${myChartList.passrate.percentage}%  ${myChartList.passrate.number}人`
            ]
          },
          {
            top: '47%',
            left: '70%',
            icon: 'circle',
            data: [
              `不及格  |  ${myChartList.flunk.percentage}%  ${myChartList.flunk.number}人`
            ]
          },
          {
            top: '47%',
            left: '50%',
            icon: 'circle',
            data: [
              `良好  |  ${myChartList.good.percentage}%  ${myChartList.good.number}人`
            ]
          },
          {
            top: '62%',
            left: '50%',
            icon: 'circle',
            data: [
              `未测完  |  ${myChartList.unconfirmed.percentage}%  ${myChartList.unconfirmed.number}人`
            ]
          }
        ],
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            // hoverAnimation: false,
            left: '-35%',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: myChartList.excellent.percentage,
                name: `优秀  |  ${myChartList.excellent.percentage}%  ${myChartList.excellent.number}人`,
                itemStyle: {
                  color: '#67b0f8'
                }
              },
              {
                value: myChartList.good.percentage,
                name: `良好  |  ${myChartList.good.percentage}%  ${myChartList.good.number}人`,
                itemStyle: {
                  color: '#45c39d'
                }
              },
              {
                value: myChartList.passrate.percentage,
                name: `及格  |  ${myChartList.passrate.percentage}%  ${myChartList.passrate.number}人`,
                itemStyle: {
                  color: '#faab0e'
                }
              },
              {
                value: myChartList.flunk.percentage,
                name: `不及格  |  ${myChartList.flunk.percentage}%  ${myChartList.flunk.number}人`,
                itemStyle: {
                  color: '#f26565'
                }
              },
              {
                value: myChartList.unconfirmed.percentage,
                name: `未测完  |  ${myChartList.unconfirmed.percentage}%  ${myChartList.unconfirmed.number}人`,
                itemStyle: {
                  color: '#787a86'
                }
              }
            ]
          }
        ]
      };
    };

    const init = () => {
      initData();
      myChart.value = echarts.init(myChart.value);
      myChart.value.setOption(options);
    };

    watch(
      () => props.chartsData,
      () => {
        myChartList.allSchoolReachRate = props.chartsData.allSchoolReachRate;
        myChartList.excellent = props.chartsData.excellent;
        myChartList.good = props.chartsData.good;
        myChartList.passrate = props.chartsData.passrate;
        myChartList.flunk = props.chartsData.flunk;
        myChartList.unconfirmed = props.chartsData.unconfirmed;
        initData();
        myChart.value.setOption(options);
      },
      {
        deep: true
      }
    );

    onMounted(() => {
      init();

      window.onresize = () => {
        if (myChart.value) {
          myChart.value.resize();
        }
      };
    });

    return {
      myChart,
      myChartList
    };
  }
});
</script>

<style lang="less" scoped>
.myChart {
  width: 100%;
  height: 300px;
}
</style>
