<template>
   <div class="pop-register"> 
     <div class="close-btn" @click="closeMe" @mouseover="closeRotate(180)" @mouseout="closeRotate(0)" :style="{ transform: 'rotate('+cloaseRotate+'deg)'}"></div>
     <div class="header">
      <img src="../../../assets/images/public/living-logo.png" alt="">
      <span class="register-title">登录 | Login</span>
    </div>
        <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" :disabled="loading">
          <el-form-item prop="username" label="手机号">
              <el-input v-model="ruleForm.username" placeholder="" clearable :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
          <el-input type="password" style="display:none;width:0;height:0;"></el-input>
            <el-input type="password" clearable v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
            <div class="remenber-psd">
                <el-checkbox v-model="rememberPsd">记住密码</el-checkbox>
            </div>
          </el-form-item >
          <el-form-item prop="CAPTCHA" label="验证码">
            <el-input type="text" placeholder="" class="verification-input" v-model="ruleForm.CAPTCHA" @keyup.enter.native="submitForm('ruleForm')">
              <SIdentify
                slot="append"
                :idName='"s-canvas-logo"'
                @identifyCode="parentLisen"
                :contentWidth="96"
                :contentHeight="38"
                :codeLength="4"
                :tips="true"
                :codeTemplate="'23456789'"
                :refreshStatus.sync="refreshStatus"
                >
              </SIdentify>
            </el-input>
            
          </el-form-item>
        </el-form>
    <el-button type="primary" class="register-btn" @click="submitForm('ruleForm')" :loading="loading">登录</el-button>
    <p class="footer">我还没有账号， <a class="registerBtn" href="javascript:void(0);" @click="registerNow">马上注册</a></p>
  </div>
</template>

<script>
import SIdentify from '../../../components/vendor/identify'
import { validateTelephone, validateEmail, validatePassword } from '@/utils/validate'
import { getCookie, setCookie, delCookie } from '@/utils/storage'

export default {
  name: 'login',
  data() {
  // 验证码验证规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value.toLowerCase() !== this.identifyCode) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    // 用户名验证规则(手机号或邮箱)
    const validateUsername = (rule, value, callback) => {
      const Telephone = validateTelephone(value)
      const Email = validateEmail(value)
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (Telephone === false && Email === false) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    // 密码
    const validatePsd = (rule, value, callback) => {
      const psd = validatePassword(value)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (psd === false) {
        callback(new Error('字母或者数字组合，长度6-35位'))
      } else {
        callback()
      }
    }
    return {
      cloaseRotate: 0,
      refreshStatus: false,
      loading: false,
      ruleForm: {
        username: '',
        password: '',
        CAPTCHA: ''
      },
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePsd, trigger: 'blur' }
        ],
        CAPTCHA: [
          { required: true, validator: validatePass, trigger: 'change' }
        ]
      },
      // 验证码
      identifyCode: '',
      // 记住密码
      rememberPsd: false
    }
  },
  components: {
    'SIdentify': SIdentify
  },
  mounted() {
    if (getCookie('monicker')) {
      this.rememberPsd = true
      this.ruleForm.username = getCookie('monicker')
      this.ruleForm.password = getCookie('command')
    }
  },
  methods: {
    registerNow() {
      this.$emit('registerNow', true)
    },
    submitForm(ruleForm) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.ruleForm).then(() => {
            this.loading = false
            // 记住密码开始
            if (this.rememberPsd) {
              setCookie('monicker', this.ruleForm.username)
              setCookie('command', this.ruleForm.password)
            } else {
              delCookie('monicker')
              delCookie('command')
            }
            // 记住密码结束
            this.$store.dispatch('GetInfo').then((res) => {
              var loginMsg = res.value
              this.$emit('loginMsg', loginMsg)
            }).catch(() => {
              this.refreshStatus = true
              this.loading = false
            })
          }).catch(() => {
            this.refreshStatus = true
            this.loading = false
          })
        } else {
          this.refreshStatus = true
          return false
        }
      })
    },
    closeMe() {
      this.chilCall(true)
    },
    // 验证码
    parentLisen(evtValue) {
      // evtValue 是子组件传过来的值
      this.identifyCode = evtValue
    },
    chilCall(pars) { // 向父组件发送数据
      this.$emit('close', pars)
    },
    // 关闭旋转过度
    closeRotate(edg) {
      this.cloaseRotate = edg
    }
  }
}
</script>
