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
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: this.chartData.title,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
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
            if (v['value'] !== 0) {
              console.info(v['dataIndex'] + ',' + v['data'] + ',' + v['value'])
              return v['axisValue'] + ' Hz<br />' + v['value'].toFixed(4)
            }
            return '' // params[0]['axisValue'] + ' Hz<br />' + ticket.toFixed(4)
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
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 1,
          showSymbol: true,
          lineStyle: {
            normal: {
              width: 1
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
