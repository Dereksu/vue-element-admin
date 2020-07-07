<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    chartData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: function (val) {
      const wfm = val.waveform
      const count = wfm.count
      const delta = wfm.delta
      const x = new Array(count)
      for (let i = 0; i < count; i++) {
        x[i] = (i + 1) * delta
      }
      this.chart.setOption({
        title: {
          text: this.chartData.title
        },
        xAxis: [{
          data: x
        }],
        series: [{
          data: wfm.y
        }]
      })
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#eeeeeeff',
        title: {
          top: 20,
          text: this.chartData.title,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#909399FF'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          },
          formatter: function (params) {
            let v = params[0]
            return parseFloat(v['axisValue']).toFixed(6) + ' ms<br />' + v['value'].toFixed(4)
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: []
        }],
        yAxis: [{
          type: 'value',
          name: '',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: 'CTCC',
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 1,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 0.5
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12
            }
          },
          data: []
        }]
      })
    }

  }
}
</script>
