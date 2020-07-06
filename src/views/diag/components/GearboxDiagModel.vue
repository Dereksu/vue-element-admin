<template>

  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <input type="file" @change="readFile">
        <el-button v-loading="loading"
                   style="margin-left: 10px;"
                   type="success"
                   @click="submitForm"> 诊断
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="120px" label="齿轮箱信息:" class="postInfo-container-item">
                <span>{{ contentGearboxInfo }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="120px" label="采样频率(Hz):" class="postInfo-container-item">
                <span>{{ postForm.sampling }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="120px" label=" 1x (Hz):" class="postInfo-container-item">
                <span>{{ contentAccurate1x }}</span>
              </el-form-item>
            </el-col>

          </el-row>
        </div>
      </div>

    </el-form>

    <!--    <ratio-spectrum-chart :chart-data="result.ratioSpectrums" height="400px" width="100%"/>-->

    <!-- Impact Result -->
    <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
      冲击检测结果
    </sticky>
    <el-table :data="result.impactResult"
              border fit highlight-current-row style="width: 100%">

      <el-table-column width="60px" align="center" label="序号">
        <template slot-scope="scope"> {{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column align="center"
                       label="特征频率名称">
        <template slot-scope="scope">
          <span>{{result.gearboxInfo.ratioInfoList[scope.row.ratioPosition-1].description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="特征阶次">
        <template slot-scope="scope">
          <span>{{result.gearboxInfo.ratioInfoList[scope.row.ratioPosition-1].value.toFixed(4) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="特征频率(Hz)">
        <template slot-scope="scope">
          <span>{{(result.gearboxInfo.ratioInfoList[scope.row.ratioPosition-1].value * result.accurate1xInHz ).toFixed(4)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="实际/理论 冲击次数">
        <template slot-scope="scope">
          <span v-if="scope.row.detail.hit">{{  scope.row.detail.actualCount + ' / ' + scope.row.detail.calculatedCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="计算峰峰值">
        <template slot-scope="scope">
          <span
            v-if="scope.row.detail.hit">{{  scope.row.detail.scaledPeakToPeak.toFixed(4)  }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="通频值">
        <template slot-scope="scope">
          <span v-if="scope.row.detail.hit">{{  scope.row.detail.overall.toFixed(4) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="计算峰值系数">
        <template slot-scope="scope">
          <span v-if="scope.row.detail.hit">{{  scope.row.detail.scaledCrest.toFixed(4) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="频谱图" width="80">
        <template>
          <span>显示</span>
        </template>
      </el-table-column>

    </el-table>

    <!-- Six Charts-->
    <el-row>
      <el-col :span="8">
        <chart-waveform id="org3" height="400px" width="100%"
                        :chart-data="result.lowFrequencyWaveform"/>
      </el-col>
      <el-col :span="8">
        <chart-waveform id="org2" height="400px" width="100%"
                        :chart-data="result.originWaveform"/>
      </el-col>
      <el-col :span="8">
        <chart-waveform id="org1" height="400px" width="100%"
                        :chart-data="result.highFrequencyWaveform"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <chart-spectrum id="org6" height="400px" width="100%"
                        :chart-data="result.lowFrequencySpectrum"/>
      </el-col>
      <el-col :span="8">
        <chart-spectrum id="org5" height="400px" width="100%"
                        :chart-data="result.originSpectrum"/>
      </el-col>
      <el-col :span="8">
        <chart-spectrum id="org4" height="400px" width="100%"
                        :chart-data="result.highFrequencySpectrum"/>
      </el-col>
    </el-row>

    <!-- 拆分的频谱图 -->
    <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
      特征频率频谱
    </sticky>
    <el-table :data="result.ratioSpectrums" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="名称" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio.description }}</span>
        </template>
      </el-table-column>

      <el-table-column width="800px" align="center" label="特征频率频谱图">
        <template slot-scope="scope">
          <chart-spectrum
            :id="'rs_' + scope.$index"
            height="200px"
            width="100%"
            :chart-data="scope.row"
            :accurate1x-in-hz="result.accurate1xInHz"
            :total-overall="result.originSpectrum.spectrum.rms"
          />
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import {ChartDataSpectrum, ChartDataWaveform} from '@/api/models'
import {DiagGearbox} from '@/api/diag'
import ChartSpectrum from '@/components/Charts/ChartSpectrum'
import ChartWaveform from '@/components/Charts/ChartWaveform'
import RatioSpectrumChart from '@/components/Charts/RatioSpectrumChart'

const localFile = {
  files: null

}
const defaultForm = {
  gearboxInfo: [],
  sampling: 5120,
  y: []
}
const analyseResult = {
  gearboxInfo: {},  // 齿轮箱信息
  accurate1xInHz: 0.0,
  accurate1xOrder: 0,
  originWaveform: {
    title: 'empty',
    waveform: {}
  },
  originSpectrum: {
    title: 'empty',
    spectrum: {}
  },
  highFrequencyWaveform: {
    title: 'empty',
    waveform: {}
  },
  highFrequencySpectrum: {
    title: 'empty',
    spectrum: {}
  },
  lowFrequencyWaveform: {
    title: 'empty',
    waveform: {}
  },
  lowFrequencySpectrum: {
    title: 'empty',
    spectrum: {}
  },
  ratioSpectrums: [],
  impactResult: []
}

export default {
  name: 'GearboxDiagModel',
  components: {
    ChartWaveform,
    ChartSpectrum,
    RatioSpectrumChart,
    Sticky
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      localFile: localFile,
      loading: false,
      result: Object.assign({}, analyseResult),
      userListOptions: [],
      rules: {
        image_uri: [{validator: validateRequire}],
        title: [{validator: validateRequire}],
        content: [{validator: validateRequire}]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentGearboxInfo() {
      return this.postForm.gearboxInfo.toString()
    },
    contentAccurate1x() {
      return this.result.accurate1xInHz.toFixed(4) + 'Hz@' + this.result.accurate1xOrder
    }
  },
  created() {
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = {
            gearboxInfo: this.postForm.gearboxInfo,
            sampling: this.postForm.sampling,
            y: this.postForm.y
          }
          console.info(data)
          DiagGearbox(data).then(response => {
            console.log('finished')
            console.log(response)

            const data1 = response.data
            this.result.ratioSpectrums = data1['ratioSpectrums']
            this.result.impactResult = data1['impactResult']
            this.result.accurate1xInHz = data1['accurate1xInHz']
            this.result.accurate1xOrder = data1['accurate1xOrder']
            this.result.gearboxInfo = data1['gearbox']

            this.result.originWaveform = new ChartDataWaveform('原始波形', data1['originWaveform'])
            this.result.originSpectrum = new ChartDataSpectrum('原始频谱', data1['originSpectrum'])
            this.result.highFrequencyWaveform = new ChartDataWaveform('高频波形', data1['highFrequencyWaveform'])
            this.result.highFrequencySpectrum = new ChartDataSpectrum('高频频谱', data1['highFrequencySpectrum'])
            this.result.lowFrequencyWaveform = new ChartDataWaveform('低频波形', data1['lowFrequencyWaveform'])
            this.result.lowFrequencySpectrum = new ChartDataSpectrum('低频频谱', data1['lowFrequencySpectrum'])

            console.log(this.result)
          })

          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 读取本地文件到内存中，预备上传执行诊断
    readFile(evt) {
      if (evt.target.files.length < 1) {
        return
      }
      const file = evt.target.files[0]
      console.log(file.name)
      console.log(file.size)
      console.log(file.type)
      const reader = new FileReader()
      if (typeof FileReader === 'undefined') {
        this.$message({
          type: 'info',
          message: '您的浏览器不支持FileReader接口'
        })
        return
      }
      reader.onload = e1 => {
        const obj = JSON.parse(e1.target.result)
        this.postForm.gearboxInfo = obj['gearboxInfo']
        this.postForm.sampling = obj['sampling']
        this.postForm.y = obj['y']
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 10px 15px 5px 10px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 2px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
