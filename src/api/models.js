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
  constructor(sampling, y, delta, x = null,) {
    super()
    this.sampling = sampling
    this.delta = delta
    this.y = y
    this.lines = y.length
    if (x === null) {
      x = new Array(this.lines)
      for (let i = 1; i <= this.lines; i++) {
        x[i - 1] = delta * i
      }
    }
    this.x = x
  }
}
