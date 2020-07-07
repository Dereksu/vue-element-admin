<template>
  <div :id="id" :class="className" :style="{height:height,width:width,margin:margin}"/>
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
    margin: {
      type: String,
      default: '2px'
    },
    // 列的数量。支持多列显示，对比显示
    columns: {
      type: Number,
      default: 1
    },
    accurate1xInHz: {
      type: Number,
      default: 0
    },
    totalOverall: {
      type: Number,
      default: 0
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
      if (val.spectrum === undefined) {
        return
      }
      const spec = val.spectrum
      let title = this.chartData.title
      if (val.ratio !== undefined) {
        const ratio = val.ratio

        if (title === undefined) {
          title = ratio.description
        }
        if (ratio.value > 0) {
          title = title + '@' + (this.accurate1xInHz * ratio.value).toFixed(4) + ' Hz'
        }
        title = title + ' Overall=' + spec.rms.toFixed(4)
        title = title + ' Percentage=' + (Math.pow(spec.rms / this.totalOverall, 2) * 100).toFixed(2) + '%'
      }

      const lines = val.spectrum.lines
      const delta = val.spectrum.delta
      const x = new Array(lines)
      for (let i = 0; i < lines; i++) {
        x[i] = (i + 1) * delta
      }
      this.chart.setOption({
        title: {
          text: title
        },
        xAxis: [{
          data: x
        }],
        series: [{
          data: spec.y
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
          top: 10,
          left: '20%',
          text: this.chartData.title,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
            color: '#909399FF'
          }
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
            if (v['value'] !== 0) {
              console.info(v['dataIndex'] + ',' + v['data'] + ',' + v['value'])
              return v['axisValue'] + ' Hz<br />' + v['value'].toFixed(4)
            }
            return '' // params[0]['axisValue'] + ' Hz<br />' + ticket.toFixed(4)
          }
        },
        grid: {
          top: 40,
          left: '2%',
          right: '2%',
          bottom: 40,
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
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 1,
          showSymbol: true,
          lineStyle: {
            normal: {
              width: 0.5
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
            }
          },
          data: []
        }],
        dataZoom: {
          type: 'slider',
          show: true
        }

      })
    }

  }
}
</script>
