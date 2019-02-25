<template>
  <div>
    <!-- 返回按钮开始 -->
    <div class="service-sidebar">
        <img @click="handleFeedback" src="../../../assets/images/public/service-icon.png" alt="">
        <img @mouseover="codeShow = true"  @mouseout="codeShow = false" class="code-icon" src="../../../assets/images/public/service-icon2.png" alt="">
        <img @click="backToTop" v-show='showTopStatus' src="../../../assets/images/public/back-to-top.png" alt="">
        <div class="code-wapper" v-show='codeShow'>
            <div class="code"><img :src="code.iosCode" alt=""><p>iOS客户端应用</p></div>
            <div class="code"><img :src="code.androidCode" alt=""><p>安卓客户端应用</p></div>    
        </div>
    </div>
    <!-- 返回按钮结束 -->
    <el-dialog
      title='咨询与反馈'
      :show-close='false'
      :visible.sync='feedbackShow'
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal='false'
      width='540px'>
      <div class='feedback-box'>
        <p>您在使用过程中遇到的问题或建议,请反馈给我们。</p>
        <el-form class='feedbackForm' :model='feedbackForm' :rules='rules' ref='feedbackForm'>
          <el-form-item prop='content'>
            <el-input type='textarea' :rows='5' placeholder='请输入您要反馈的内容...' v-model='feedbackForm.content'></el-input>
          </el-form-item>
          <el-form-item prop='telephone'>
            <el-input class='w306' type='text' :maxlength='11' placeholder='请输入您的手机号' v-model='feedbackForm.telephone'></el-input>
            <div class='drom-menu'>
              <el-select v-model='telephoneRegion' placeholder='请选择'>
                <el-option
                  v-for='item in regionList'
                  :key='item.value'
                  :label='item.label'
                  :value='item.value'>
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop='CAPTCHA'>
            <el-input class='w306' type='text' placeholder='请输入验证码' v-model='feedbackForm.CAPTCHA'></el-input>
            <div class='w170 captcha-box'  title='看不清？点击更换验证码'>
            <SIdentify
              :idName='"s-canvas2"'
              @identifyCode='parentLisen'
              :contentWidth='114'
              :contentHeight='38'
              :codeLength='4'
              :codeTemplate="'1234567890'"
              :refreshStatus.sync="refreshStatus"
              >
            </SIdentify>
            </div>
          </el-form-item>
        </el-form>
        <h5 class='tips-title'>温馨提示：</h5>
        <p class='tips'>1、客服会在一个工作日内与您联系（工作时间：周一至周五 8：30-17：30）</p>
        <p>2、紧急问题建议您拨打客服热线：400-005-2220</p>
      </div>
      
      <span slot='footer' class='dialog-footer'>
        <el-button @click='handlecancle'>取 消</el-button>
        <el-button type='primary' @click='dialogSubmit'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SIdentify from '@/components/vendor/identify'
import { validateTelephone, validateStringRealy } from '@/utils/validate'
import { addFeedback } from '@/api/roomIndex'
import { animate } from '@/uTils/scroll'

export default {
  name: 'feeodback',
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
    const validateContent = (rule, value, callback) => { // 反馈内容
      const str = validateStringRealy(value, 4, 100)
      if (value === '') {
        callback(new Error('请输入反馈内容'))
      } else if (str === false) {
        callback(new Error('长度在 4 到 100 个字符'))
      } else {
        callback()
      }
    }
    return {
      // 二维码
      code: {
        iosCode: require('@/assets/images/public/iosCode.png'),
        androidCode: require('@//assets/images/public/androidCode.png')
      },
      codeShow: false,
      showTopStatus: false,
      feedbackShow: false,
      refreshStatus: false,
      telephoneRegion: '选项1',
      regionList: [
        {
          value: '选项1',
          label: '中国大陆 +86'
        }
        // {
        //   value: '选项2',
        //   label: '美国 +87'
        // }
      ],
      feedbackForm: {
        content: '',
        telephone: '',
        CAPTCHA: ''
      },
      rules: {
        content: [
          { required: true, validator: validateContent, trigger: 'blur' }
        ],
        telephone: [
          { required: true, validator: validateTele, trigger: 'blur' }
        ],
        CAPTCHA: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      identifyCode: ''
    }
  },
  components: {
    SIdentify: SIdentify
  },
  props: {
    message: {
      type: String,
      required: false
    },
    toTopShow: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted() {
    if (this.toTopShow) {
      this.ScrollWrap = document.getElementsByClassName('main-content')[0]

      // 监控容器滚动
      this.ScrollWrap.addEventListener('scroll', this.handleSroll)
    }
  },
  methods: {
    backToTop() {
      animate(this.ScrollWrap, { scrollTop: 0 })
    },
    handleSroll() {
      // 监控滚动状态
      if (this.ScrollWrap.scrollTop > 200) {
        this.showTopStatus = true
      } else {
        this.showTopStatus = false
      }
    },
    handleFeedback() {
      this.feedbackShow = true
    },
    handlecancle() {
      this.resetFields()
      this.feedbackShow = false
    },
    dialogSubmit() {
      this.$refs.feedbackForm.validate(valid => {
        if (valid) {
          const content = this.feedbackForm.content
          const phoneNumber = this.feedbackForm.telephone
          addFeedback(content, phoneNumber)
            .then(res => {
              this.$message({ message: '反馈成功！', type: 'success' })
              this.feedbackShow = false
              this.resetFields()
              this.refreshStatus = true
            })
        } else {
          this.refreshStatus = true
          return false
        }
      })
    },
    resetFields() {
      this.$refs.feedbackForm.resetFields(() => {})
    },
    parentLisen(entValue) {
      this.identifyCode = entValue
    }
  }
}
</script>
<style>
@import '../../../assets/styles/public/common.css';
@import '../../../assets/styles/public/roomIndex.css';
@import '../../../assets/styles/public/index.css';
</style>
