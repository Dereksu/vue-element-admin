<template>

  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <input type="file" @change="readFile">
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >
          诊断
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">清空数据</el-button>
      </sticky>

      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="12">
              <el-form-item label-width="120px" label="齿轮箱信息:" class="postInfo-container-item">
                <el-input v-model="contentGearboxInfo" placeholder="11,22,33,44" readonly />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label-width="120px" label="采样频率(Hz):" class="postInfo-container-item">
                <el-input v-model="postForm.sampling" placeholder="1024" readonly />
              </el-form-item>
            </el-col>

          </el-row>
        </div>
      </div>

      <el-row>
        <el-col :span="8">
          <spectrum-chart id="org4" height="400px" width="100%" />
        </el-col>
        <el-col :span="8">
          <spectrum-chart
            id="org5"
            height="400px"
            width="100%"
          />
        </el-col>
        <el-col :span="8">
          <spectrum-chart id="org6" height="400px" width="100%" />
        </el-col>
      </el-row>

    </el-form>

  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { DiagGearbox } from '@/api/diag'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import SpectrumChart from '@/components/Charts/SpectrumChart'

const localFile = {
  files: null

}
const defaultForm = {
  gearboxInfo: [],
  sampling: 5120,
  y: []
}
const analyseResult = {
  accurate1xInHz: 0.0,
  accurate1xOrder: 0,
  originWaveform: {},
  originSpectrum: {},
  ratioSpectrums: []
}

export default {
  name: 'GearboxDiagModel',
  components: {
    SpectrumChart,
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
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    contentGearboxInfo() {
      return this.postForm.gearboxInfo.toString()
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
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
            // this.result = response.data
            // this.result.originSpectrum.title = '原始频谱';
            // this.result.originSpectrum.spectrum.
            console.log(this.result)

            // this.list.unshift(this.temp)
            // this.dialogFormVisible = false
            // this.$notify({
            //   title: 'Success',
            //   message: 'Created Successfully',
            //   duration: 2000
            // })
          })

          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    },
    // 导入设备，监听上传文件并读取
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
