<template>
	<!-- 注册弹窗开始 -->
	<div class="pop-register">
		<div class="close-btn" @mouseover="closeRotate(180)" @mouseout="closeRotate(0)" @click="closeMe" :style="{ transform: 'rotate('+cloaseRotate+'deg)'}"></div>
    <div class="header">
        <img src="../../../assets/images/public/living-logo.png" alt="">
        <span class="register-title">注册 | Register</span>
    </div>
		<el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item prop="telephone" label="手机号">
				<el-input v-model="ruleForm.telephone" placeholder="" clearable :maxlength="11"></el-input>
			</el-form-item>
			<el-form-item prop="password" label="密码">
				<el-input type="password" v-model="ruleForm.password" placeholder=""></el-input>
			</el-form-item>
			<el-form-item prop="passwordDouble" label="确认密码">
				<el-input type="password" v-model="ruleForm.passwordDouble" placeholder=""></el-input>
			</el-form-item>
			<el-form-item prop="companyName" label="企业名称">
				<el-input type="text" v-model.trim="ruleForm.companyName" placeholder=""></el-input>
			</el-form-item >
			<el-form-item prop="CAPTCHA" label="验证码">
				<el-input type="text" class="verification-input" v-model="ruleForm.CAPTCHA" placeholder="" @keyup.enter.native="submitForm('ruleForm')">
          <SIdentify  
            :idName='"s-canvas-regist"'
            slot="append"
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
			</el-form-item >
			<el-form-item prop="CAPTCHAofPNONE" label="手机验证码">
				<el-input type="text" placeholder="" v-model="ruleForm.CAPTCHAofPNONE" @keyup.enter.native="submitForm('ruleForm')">
          <el-button type="success" class="verification-btn" :disabled="countState" @click="getCAPTCHAofPNONE" slot="append">
            <span v-if="!countState">获取验证码</span>
            <span v-if="countState" class="count">{{count}}秒重新获取</span>
          </el-button>
        </el-input>
				</el-form-item >
			<div class="el-form-item">
				<el-checkbox v-model="readTerms">我同意并已阅读</el-checkbox>
				<a class="terms" href="javascript:void(0);" @click="goAgreement">朗云直播用户注册协议</a>
			</div>
    </el-form>
    <el-button type="primary" class="register-btn" :disabled="!readTerms" @click="submitForm('ruleForm')" :loading="loading">立即注册</el-button>
    <p class="footer">我已拥有账号， <a class="registerBtn" href="javascript:void(0);" @click="loginNow">马上登录</a></p>
	</div>
	<!-- 注册弹窗结束 -->
</template>
<script>
import { register, registerPhone } from '@/api/login'
import SIdentify from '../../../components/vendor/identify'
import { validateTelephone, validatePassword } from '@/utils/validate'
export default {
  name: 'regist',
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
    // 验证密码输入一致
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (this.ruleForm.password !== this.ruleForm.passwordDouble) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 手机号验证规则
    const validateTele = (rule, value, callback) => {
      const Telephone = validateTelephone(value)
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (Telephone === false) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    // 密码验证规则
    const validatePsd = (rule, value, callback) => {
      const Telephone = validatePassword(value)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码至少为6位，至多20位'))
      } else if (Telephone === false) {
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
        telephone: '',
        password: '',
        passwordDouble: '',
        companyName: '',
        CAPTCHA: '',
        CAPTCHAofPNONE: ''
      },
      rules: {
        telephone: [
          { required: true, validator: validateTele, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePsd, trigger: 'blur' }
        ],
        passwordDouble: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { min: 4, max: 30, message: '长度在 4 到 60 个字符', trigger: 'blur' }
        ],
        CAPTCHA: [
          { required: true, validator: validatePass, trigger: 'change' }
        ],
        CAPTCHAofPNONE: [
          { required: true, message: '请输入手机验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '请输入4位数字验证码', trigger: 'blur' }
        ]
      },
      // 验证码
      identifyCode: '',
      // 使用条款
      readTerms: true,
      countState: false,
      count: 299
    }
  },
  components: {
    'SIdentify': SIdentify
  },
  methods: {
    loginNow() {
      this.$emit('loginNow', true)
    },
    submitForm(ruleForm) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) { // 通过验证
          // 注册接口
          this.loading = true
          const params = {
            userPhone: this.ruleForm.telephone,
            userPassword: this.ruleForm.password,
            phoneVerifcode: this.ruleForm.CAPTCHAofPNONE,
            enterpriseName: this.ruleForm.companyName,
            // 第三方平台注册时需要
            platFormUserId: this.$route.query.pcode
          }
          register(Object.assign({}, params)).then(res => {
            this.$message({
              type: 'success',
              message: '注册成功!请登陆'
            })
            this.loginNow()
          }).catch(() => {
            this.loading = false
            this.refreshStatus = true
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
      // this.ruleForm.CAPTCHA = this.identifyCode;
    },
    chilCall(pars) { // 向父组件发送数据
      this.$emit('close', pars)
    },
    goAgreement() {
      var tempwindow = window.open()
      tempwindow.location = '/agreement'
    },
    getCAPTCHAofPNONE() {
      if (!this.countState) { // 未获取状态
        let validCAP = false
        let validPhone = false
        this.$refs.ruleForm.validateField('CAPTCHA', (errorMessage) => {
          if (errorMessage === '') {
            validCAP = true
          }
        })
        this.$refs.ruleForm.validateField('telephone', (errorMessage) => {
          if (errorMessage === '') {
            validPhone = true
          }
        })
        if (validCAP && validPhone) {
          this.countState = true
          let count = 299
          const timer = setInterval(() => {
            count -= 1
            this.count = count
            if (count <= 0) {
              clearInterval(timer)
              this.countState = false
              this.count = 299
            }
          }, 1000)
          const phone = this.ruleForm.telephone
          // 请求验证码
          registerPhone(phone)
        }
      }
    },
    // 关闭旋转过度
    closeRotate(edg) {
      this.cloaseRotate = edg
    }
  }
}
</script>
