/**
 * 波形的对象模型
 */
export class Waveform extends Object {
  /**
   * 构造一个频谱对象
   * @param sampling : float 采样频率。单位：Hz
   * @param y : [float] Y值数组
   * @param delta : float  X 轴上点间的时间间隔。单位：s
   * @param x ：null||[float] X值数组。可以为空。内部自动构造需要的 X 轴数组
   */
  constructor(sampling, y, delta, x = null, yaUnit = '', rpm = 0, rms = 0) {
    super()
    this.sampling = sampling
    this.delta = delta
    this.yaUnit = yaUnit
    this.rpm = rpm
    this.rms = rms

    this.count = y.length
    this.y = y
    if (x === null) {
      x = new Array(this.count)
      for (let i = 1; i <= this.count; i++) {
        x[i - 1] = delta * i
      }
    }
    this.x = x
  }
}

/**
 * 频谱的对象模型
 */
export class Spectrum extends Object {
  /**
   * 构造一个频谱对象
   * @param sampling : float 采样频率。单位：Hz
   * @param y : [float] Y值数组
   * @param delta : float  X 轴上谱线分辨率。单位：Hz
   * @param x ：null||[float] X值数组。可以为空。内部自动构造需要的 X 轴数组
   */
  constructor(sampling, y, delta, x = null, yaUnit = '', rpm = 0, rms = 0) {
    super()
    this.sampling = sampling
    this.delta = delta
    this.yaUnit = yaUnit
    this.rpm = rpm
    this.rms = rms

    this.lines = y.length
    this.y = y
    if (x === null) {
      x = new Array(this.lines)
      for (let i = 1; i <= this.lines; i++) {
        x[i - 1] = delta * i
      }
    }
    this.x = x
  }
}

export class ChartDataWaveform {
  constructor(title, waveform) {
    this.title = title
    this.waveform = waveform
  }
}

export class ChartDataSpectrum {
  constructor(title, spectrum) {
    this.title = title
    this.spectrum = spectrum
  }
}
