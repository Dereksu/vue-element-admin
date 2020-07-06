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
      default: []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: function (val) {
      if (val === undefined || val.length < 1) {
        // TODO : Clear all data
        return
      }
      let chartCounts = val.length;
      const charts = []
      val.each(item => {
        charts.push({name: item.ratio.description, data: item.spectrum.y})
      })
      // const spec = val.spectrum;
      // let title = this.chartData.title;
      // if (val.ratio !== undefined) {
      //   let ratio = val.ratio;
      //   console.info(title)
      //   console.info(title !== undefined)
      //   if (title === undefined) {
      //     title = ratio.description;
      //   }
      //   title = title + '@' + this.accurate1xInHz * ratio.value + ' Hz';
      //   title = title + ' Overall=' + spec.rms;
      //   title = title + ' Percentage=' + Math.pow(spec.rms / this.totalOverall, 2);
      //
      // }
      this.chart.setOption({
        series:charts
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
          }
        },
        grid: [
          {top: '2%', bottom: '18%', left: '2%', right: '2%'},
          {top: '18%', bottom: '34%', left: '2%', right: '2%'},
          {top: '34%', bottom: '50%', left: '2%', right: '2%'},
          {top: '50%', bottom: '66%', left: '2%', right: '2%'},
          {top: '66%', bottom: '82%', left: '2%', right: '2%'},
          {top: '82%', bottom: '98%', left: '2%', right: '2%'}
        ],
        series: [
          {type: 'line', data: [1, 2, 3]},
          {type: 'line', data: [4, 5, 6]},
          {type: 'line', data: [7, 8, 9]},
          {type: 'line', data: [10, 11, 12]},
          {type: 'line', data: [13, 14, 15]},
          {type: 'line', data: [16, 17, 18]},
        ]
      })
    }

  }
}
</script>
