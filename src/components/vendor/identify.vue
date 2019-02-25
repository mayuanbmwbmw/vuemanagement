<template>
    <div class="s-canvas" @click.stop="refreshCode">
        <canvas :id="idName" :width="contentWidth" :height="contentHeight"></canvas>
        <a v-if="tips" href="JavaScript:void(0)" class="clickChange">点击更换验证码</a>
    </div>
</template>
<script>
export default {
  name: 'SIdentify',
  data() {
    return {
      identifyCode: ''
    }
  },
  props: {
    refreshStatus: {
      type: Boolean,
      default: false
    },
    idName: {
      type: String,
      default: 's-canvas'
    },
    tips: {
      type: Boolean,
      default: false
    },
    fontSizeMin: {
      type: Number,
      default: 30
    },
    fontSizeMax: {
      type: Number,
      default: 30
    },
    backgroundColorMin: {
      type: Number,
      default: 240
    },
    backgroundColorMax: {
      type: Number,
      default: 240
    },
    colorMin: {
      type: Number,
      default: 50
    },
    colorMax: {
      type: Number,
      default: 50
    },
    lineColorMin: {
      type: Number,
      default: 40
    },
    lineColorMax: {
      type: Number,
      default: 40
    },
    dotColorMin: {
      type: Number,
      default: 255
    },
    dotColorMax: {
      type: Number,
      default: 255
    },
    contentWidth: {
      type: Number,
      default: 112
    },
    contentHeight: {
      type: Number,
      default: 38
    },
    codeLength: {
      type: Number,
      default: 4
    },
    codeTemplate: {
      type: String,
      default: '123456789'
    }
  },
  methods: {
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机字母或者数字
    // 大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
    // 小写字母'a'的ASCII是97，a~z的ASCII码就是97 + 0~25
    // 可选范围为：10个数字+26*2个字母 共62个可选择的item
    // random（）大于等于 0.0 且小于 1.0
    randomItem() {
      const type = Math.floor(Math.random() * 62)
      let item = ''// 0-61的范围
      // 规定0-9为数字，10-35为小写字母，36-61为大写字母
      if (type <= 9) {
        item = Math.floor(Math.random() * 10)
      } else if (type <= 35) {
        item = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      } else {
        item = String.fromCharCode(97 + Math.floor(Math.random() * 26))
      }
      // 屏蔽字母o/O/0,容易造成干扰
      if (item === 'O' || item === 'o' || item === '0') { item = 'A' }
      return item
    },
    // 生成一个随机的颜色
    randomColor(min, max) {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    drawPic() {
      const canvas = document.getElementById(this.idName)
      const ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    },
    drawText(ctx, txt, i) {
      ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
      const x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      const y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      var deg = this.randomNum(-15, 15)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    },
    drawLine(ctx) {
    // 绘制干扰线
      for (let i = 0; i < 1; i++) {
        ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.stroke()
      }
    },
    drawDot(ctx) {
    // 绘制干扰点
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    },

    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        // this.identifyCode +=  this.randomNum(0, o.length) ;
        this.identifyCode += this.randomItem()
      }
    },
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.codeTemplate, this.codeLength)
    },
    chilCall(pars) { // 向父组件发送数据
      this.$emit('identifyCode', pars)
    }

  },
  watch: {
    identifyCode() {
      this.drawPic()
      const Lower = this.identifyCode.toLowerCase()
      this.chilCall(Lower)
    },
    refreshStatus() {
      if (this.refreshStatus) {
        this.refreshCode()
        this.$emit('update:refreshStatus', false)
      }
    }
  },
  mounted() {
    this.makeCode(this.codeTemplate, this.codeLength)
    this.drawPic()
  }
}
</script>
<style scoped>
.s-canvas{
  position: relative;
  height: 40px;
  cursor: pointer;
}
  .clickChange{
    display: block;
    font-size: 12px;
    width: 100%;
    text-align: center;
    text-decoration: underline;
  }
</style>
