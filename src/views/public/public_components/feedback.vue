<template>
  <div>
    <el-dialog
      title='咨询与反馈'
      :show-close='false'
      :visible.sync='message'
      :close-on-click-modal='false'
      :close-on-press-escape='false'
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
// import { addFeedback } from '@/api/roomIndex'

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
  props: ['message'],
  methods: {
    handlecancle() {
      this.resetFields()
      this.$emit('update:message', false)
    },
    dialogSubmit() {
      // this.$refs.feedbackForm.validate(valid => {
      //   if (valid) {
      //     const userId = parseInt(this.userId)
      //     const content = this.feedbackForm.content
      //     const phoneNumber = this.feedbackForm.telephone
      //     addFeedback(content, phoneNumber)
      //       .then(res => {
      //         this.$message({ message: '反馈成功！', type: 'success' })
      //         this.$emit('update:message',false)
      //         this.resetFields()
      //         this.refreshStatus = true
      //       })
      //   } else {
      //     this.$message({ message: '填写的信息有误！', type: 'warning' })
      //     this.refreshStatus = true
      //     return false
      //   }
      // })
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
</style>
