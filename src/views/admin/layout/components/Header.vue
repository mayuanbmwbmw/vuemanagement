<template>
    <div class="header">
        <div class="user fr" @mouseenter ="showLoginInfo()" @mouseleave ="showLoginInfo()">
            <a href="#" target="mainFrame"><span class="avater"></span></a>
            <span class="username">{{login_user_name}}<i class="arrow"></i></span>
            <div class="user-drop" v-show="showInfo">
                <ul class="login-info-list" >
                    <div class="login-info-sign"></div>
                    <li class="login-info-list-item" v-if="showEnterprise">
                        <a href="#" @click="setEnterpriseProfile"><i class="iconfont icon-fl-zuzhi"></i>完善企业资料</a>
                    </li>
                    <li class="login-info-list-item">
                        <a  href="#" @click="dialogVisible=true"><i class="iconfont icon-tuichu"></i>修改个人信息</a>
                    </li>
                    <li class="login-info-list-item">
                        <router-link to="/roomIndex"><i class="iconfont icon-zhibo"></i>直播首页</router-link>
                    </li>
                    <li class="login-info-list-item">
                        <a  href="#" @click="logout()"><i class="iconfont icon-tuichu"></i>安全退出</a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 增删改操作对话框开始 -->
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="540px"
            :append-to-body="true"
            :close-on-click-modal="false"
            >
            <el-form class="ruleForm" :rules="rules" ref="rule_Form" :model='rule_Form' label-position="right" label-width="100px" :lock-scroll="false">
                <el-form-item prop="username" label="姓名：" placeholder="请输入姓名">
                <el-input  v-model="rule_Form.username"></el-input>
                </el-form-item>
                <el-form-item label="原密码：" placeholder="请输入原密码">
                <el-input type="password" v-model="rule_Form.oldPsd"></el-input>
                </el-form-item>
                <el-form-item prop="newPsd" label="新密码：" placeholder="请输入新密码">
                <el-input type="password" v-model="rule_Form.newPsd"></el-input>
                </el-form-item>
                <el-form-item prop="surePsd" label="确认密码：" placeholder="请输入确认密码">
                <el-input type="password" v-model="rule_Form.surePsd"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="dialog_submitPsd('rule_Form')" :loading="dialogLoading">确 定</el-button>
                <el-button @click="dialogVisible = false  " :disabled="dialogLoading">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 增删改操作对话框结束 -->
    </div>
</template>
<script>
import { validatePassword } from '@/utils/validate'
export default {
  data() {
    const validatePassold = async(rule, value, callback) => { // 验证旧密码
      if (!value) {
        callback()
      } else if (value.length < 6 || value.length > 30) {
        callback(new Error('限制在6-30字符内'))
      } else {
        callback()
      }
    }
    const validatePassNew = (rule, value, callback) => { // 验证新密码
      const Psd = validatePassword(value)
      if (!this.rule_Form.oldPsd) {
        callback()
      } else if (value === '') {
        callback(new Error('请输入密码'))
      } else if (Psd === false) {
        callback(new Error('数字或字母或者数字字母组合，符号包括@_ .! 6-30位'))
      } else if (this.rule_Form.oldPsd === this.rule_Form.newPsd) {
        callback(new Error('不可与旧密码相同'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => { // 验证密码输入一致
      if (this.rule_Form.newPsd !== this.rule_Form.surePsd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      showInfo: false,
      login_user_name: '',
      dialogVisible: false,
      dialogTitle: '修改个人信息',
      dialogLoading: false,
      rules: {

        newPsd: [
          { required: true, validator: validatePassNew, trigger: 'blur' }
        ],
        surePsd: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        oldPsd: [
          { required: true, validator: validatePassold, trigger: 'blur' }
        ]
      },
      rule_Form: {
        username: '',
        oldPsd: '',
        newPsd: '',
        surePsd: ''
      }
    }
  },
  computed: {
    showEnterprise: function() {
      // 企业管理员有权限
      if (this.$store.getters.userInfo.userType === 1) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible === false) {
        this.$refs['rule_Form'].resetFields()
      } else {
        this.rule_Form.username = this.$store.getters.userInfo.userName
      }
    }
  },
  methods: {
    showLoginInfo() {
      this.showInfo = !this.showInfo
    },
    setEnterpriseProfile() {
      location.href = '/admin/enterprise'
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    changeName() {
      this.$prompt('请输入姓名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.$store.getters.userInfo.userName,
        inputPattern: /[a-zA-Z0-9\u4e00-\u9fa5]{2,20}$/,
        inputErrorMessage: '姓名为2-30位字符不能包括空格'
      }).then(({ value }) => {
        // const params = {
        //   userId: this.$store.getters.userInfo.userId,
        //   userName: value
        // }
        // updateUserName(params).then(response => {
        //     //存入缓存
        //     let userInfo = this.$store.getters.userInfo
        //     userInfo.userName = value
        //     this.login_user_name = value
        //     this.$store.commit('SET_USERINFO',userInfo)
        //     setUserInfo(userInfo)
        // })
      })
    },
    dialog_submitPsd(formName) {
      // this.$refs[formName].validate((valid) => {
      // if(valid){
      //     this.dialogLoading = true
      //     let params = {
      //         userId:this.$store.getters.userInfo.userId,
      //         userName:this.rule_Form.username,
      //         oldPwd: this.rule_Form.oldPsd,
      //         newPwd: this.rule_Form.newPsd
      //     }
      //     updateUserName(params).then(response => {
      //         this.dialogLoading = false
      //         this.dialogVisible = false
      //         this.$message({message: '修改成功',type: 'success'});
      //          //存入缓存
      //         let userInfo = this.$store.getters.userInfo
      //         userInfo.userName = this.rule_Form.username
      //         this.login_user_name = this.rule_Form.username
      //         this.$store.commit('SET_USERINFO',userInfo)
      //         setUserInfo(userInfo)
      //         this.$refs['rule_Form'].resetFields()
      //         }).catch(err => {
      //             this.dialogLoading = false
      //             this.$refs[formName].clearValidate()
      //         })
      //     }
      // })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.login_user_name = this.$store.getters.userInfo.userName
    })
  }
}
</script>


