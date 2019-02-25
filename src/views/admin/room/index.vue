<template>
  <div class="list-page">
      <span class="list-title">直播间管理</span>
      <span class="list-desc">共有<i>{{pager_total}}</i>个直播间</span>
      <span class="list-operations">
        <el-button @click="addNew()" type="success" icon="iconfont icon-add" size="medium" v-if="allowApplyRoom">购买直播间</el-button>
        <el-button @click="queryBoxShow()" icon="iconfont icon-magnifier" size="medium">查询</el-button>
      </span>
      <div class="clearfix line"></div>
      <transition name="el-fade-in">
        <div class="list-query-box" v-show="query_show">

          <el-form ref="search_form" :model="search_form" label-position="top">
            <el-form-item class="fl" label="" prop="liveRoomId">
              <el-input
                      placeholder="请输入直播间ID"
                      v-model="search_form.liveRoomId"
                      clearable
                      class=""
                      size="small">
              </el-input>
            </el-form-item>

            <el-form-item class="fl" label="" prop="liveRoomName">
              <el-input
                      placeholder="请输入直播间名称"
                      v-model="search_form.liveRoomName"
                      clearable
                      class=""
                      size="small">
              </el-input>
            </el-form-item>

            <el-form-item class="fl" label="" prop="status">
              <el-select v-model="search_form.status" clearable placeholder="请选择直播间状态">
                  <el-option
                    v-for="item in status_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <div class="buttons">
            <el-button @click="queryBoxHide()" size="medium">取消</el-button>
            <el-button @click="queryBoxReset()" size="medium">重置</el-button>
            <el-button type="primary" @click="submitSearchForm('search_form')" size="medium">确定</el-button>
          </div>
          <div class="clearfix"></div>
        </div>
      </transition>

      <div class="list-table">
        <template>
          <el-table
            :data="list"
            style="width: 100%"
            border
            :default-sort = "{prop: 'date', order: 'descending'}" 
            >
            <el-table-column
              width="100"
              prop="liveRoomId"
              label="直播间ID"
              align="center">
            </el-table-column>

            <el-table-column
              prop="liveRoomName"
              label="直播间名称"
              align="center">
            </el-table-column>

            <el-table-column
              prop="createTime"
              label="创建日期"
              align="center">
              <template slot-scope="scope">
                  {{timestampToTime(scope.row.createTime)}}
              </template>
            </el-table-column>
            
            <el-table-column
              prop="liveRoomUrl"
              label="观看地址"
              align="center" width="255">
            </el-table-column>

            <el-table-column
              prop="expirationDate"
              label="有效截止日期"
              align="center" width="190">
              <template slot-scope="scope">
                  {{timestampToTime(scope.row.expirationDate)}}
                  <span class="renewal blue" @click="Renewal(scope.row.liveRoomId,scope.row.liveRoomName,scope.row.audienceLimit)">续费</span>

              </template>
            </el-table-column>

            <el-table-column
              prop="audienceLimit"
              label="观众上限"
              align="center">
            </el-table-column>

            <el-table-column
              prop="status"
              label="直播间状态"
              align="center" width="100">
              <template slot-scope="scope">
                  <span class="icon-usable" v-if="scope.row.status==0">空闲</span>
                  <span class="icon-occupied" v-if="scope.row.status==1">占用</span>
                  <span class="icon-stopped" v-if="scope.row.status==2">停止</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="170">
                  <template slot-scope="scope">
                    <span
                      class="operation red" @click="handleDisable(scope.$index, scope.row)" v-if="scope.row.status==0 ||scope.row.status==1 "><i class="iconfont icon-kaiguan" ></i> 停用</span>

                    <span
                      class="operation blue" @click="handleEnable(scope.$index, scope.row)" v-if="scope.row.status==2"><i class="iconfont icon-kaiguan" ></i> 恢复</span>
                  </template>
            </el-table-column>

          </el-table>
        </template>
      </div>
      <div class="list-pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pager_current_page"
          :page-size="pager_page_size"
          layout="prev, pager, next, total"
          :total="pager_total">
        </el-pagination>
      </div>

      <el-dialog title="购买直播间" :visible.sync="dialogPurchaseVisible" width="545px" :close-on-click-modal="false">
        <el-form :model="edit_form" label-width="120px" ref="edit_form" :rules="rules">
          <el-form-item label="直播间名称：" prop="liveRoomName">
            <el-input v-model="edit_form.liveRoomName" auto-complete="off" placeholder="请输入直播间名称" class="w390"></el-input>
          </el-form-item>
          <el-form-item label="直播观众上限：" prop="rechargeId">
            <el-select v-model="edit_form.rechargeId" placeholder="请选择直播观众人限" class="w335">
              <el-option
                    v-for="item in audienceLimitOptions"
                    :key="item.rechargeId"
                    :label="item.rechargeLimit"
                    :value="item.rechargeId">
              </el-option>
            </el-select>
            <span>  人</span>
          </el-form-item>


          <el-form-item label="购买时长：" prop="">
            <el-radio-group v-model="edit_form.durationId" class="payDuration">
                 <el-radio border 
                    v-for="item in payDurationOptions"
                    :key="item.durationId"
                    :label="item.durationId"
                    >{{item.durationShowName}}</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="参考价格：">
            <span><b class="red">{{purchasePrice|keepTwoNum}}</b> 元</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleRoomPurchase" icon="iconfont icon-cart" size="medium"> 确认购买</el-button>
          <el-button @click="dialogPurchaseVisible = false" size="medium">取消</el-button>
        </div>
      </el-dialog>


      <el-dialog title="直播间续费" :visible.sync="dialogRenewalVisible" width="545px" :close-on-click-modal="false">
        <el-form :model="renewal_form" label-width="120px" ref="renewal_form">
          <el-form-item label="直播间名称：">
            <span>{{renewal_form.liveRoomName}}</span>
          </el-form-item>

          <el-form-item label="直播观众上限：">
            <span>{{renewal_form.rechargeLimit}}</span><span>  人</span>
          </el-form-item>


          <el-form-item label="购买时长：" prop="">
            <el-radio-group v-model="renewal_form.durationId" class="payDuration">
                 <el-radio border 
                    v-for="item in payDurationOptions"
                    :key="item.durationId"
                    :label="item.durationId"
                    >{{item.durationShowName}}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="参考价格：">
            <span><b class="red">{{renewalPrice|keepTwoNum}}</b> 元</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleRenewal" icon="iconfont icon-cart" size="medium"> 确认购买</el-button>
          <el-button @click="dialogRenewalVisible = false" size="medium">取消</el-button>
        </div>
      </el-dialog>


      <el-dialog title="提示信息" :visible.sync="dialogPayVisible" width="540px" :close-on-click-modal="false">
        <div class="message">您是否已成功支付款项？</div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlePayDialogSuccess" size="medium">支付成功</el-button>
          <el-button type="info" @click="handlePayDialogClose" size="medium">暂不支付</el-button>
        </div>
      </el-dialog>

      <el-dialog title="支付信息" :visible.sync="dialogPayFailVisible" width="540px" :close-on-click-modal="false">
        <div class="message">
           <h4 class="yellow">抱歉，您的支付未能完成，请刷新页面查看最新支付结果！</h4>
           <div class="order-detail">
              <p>收款方：天津卓朗科技发展有限公司</p>
              <p>订单号：<span class="blue bold">{{orderNum}}</span></p>
              <p>商品名称：{{orderTitle}}</p>
              <p>商品描述：{{orderBody}}</p>
              <p>交易金额：<span class="red bold">{{orderPayablePrice}}</span>元</p>
           </div>
           <h4 class="blue">温馨提示：</h4>
           <p>如果您本次购买直播间尚未成功，请稍后进行查询。</p>
           <p>如果24小时内查询结果仍未成功，请致电客服热线 <span class="blue bold">400-005-2220</span>。</p>

        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlePayDialogClose" size="medium">我知道了</el-button>
        </div>
      </el-dialog>

  </div>
</template>

<script>
import { getList, getListAll, payOrder, checkOrder, updateRoomStatus, getPayRecharge, getPayDuration, addRenew } from '@/api/room'
import { validateStringRealy } from '@/utils/validate'

export default {
  data() {
    const validatedepRoomName = (rule, value, callback) => { // 部门名称
      const str = validateStringRealy(value, 2, 10)
      if (value === '') {
        callback(new Error('请输入直播间名称'))
      } else if (str === false) {
        callback(new Error('长度在 2 到 10 个字符'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      query_show: false,
      table_data: [],
      // 分页组件
      pager_current_page: 1,
      pager_page_size: 10,
      pager_total: 0,
      dialogPurchaseVisible: false,
      dialogRenewalVisible: false,
      dialogPayVisible: false,
      dialogPayFailVisible: false,

      // 查询数据表单
      search_form: {
        status: ''
      },
      renewal_form: {
        liveRoomName: '',
        rechargeLimit: '',
        durationId: ''
      },
      audienceLimitOptions: {},
      payDurationOptions: {},
      status_options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '空闲'
      }, {
        value: '1',
        label: '占用'
      }, {
        value: '2',
        label: '停止'
      }],
      edit_form: {
        liveRoomName: '',
        rechargeId: '',
        durationId: ''
      },
      // 订单信息
      orderId: '',
      orderNum: '',
      orderTitle: '',
      orderBody: '',
      orderPayablePrice: 0,
      durationPrice: 0,
      rechargeMultiple: 0,

      // 表单验证规则
      rules: {
        liveRoomName: [
          { required: true, validator: validatedepRoomName, trigger: 'blur' }
        ],
        rechargeId: [
          { required: true, message: '请选择观众上限', trigger: 'blur change' }]
      }
    }
  },
  computed: {
    allowApplyRoom: function() {
      // 只有企业管理员有权限创建直播间
      if (this.$store.getters.userInfo.userType === '1') {
        return true
      } else {
        return false
      }
    },
    purchasePrice: function() {
      if (this.edit_form.rechargeId !== '') {
        let multiple = 0
        let durationPrice = 0
        // 取得选择的并发量
        for (const key in this.audienceLimitOptions) {
          if (this.audienceLimitOptions[key].rechargeId === this.edit_form.rechargeId) {
            multiple = this.audienceLimitOptions[key].rechargeMultiple
          }
        }
        // 取得选择的时长价格
        for (const key in this.payDurationOptions) {
          if (this.payDurationOptions[key].durationId === this.edit_form.durationId) {
            durationPrice = this.payDurationOptions[key].durationPrice
          }
        }
        return multiple * durationPrice
      } else {
        return '0'
      }
    },
    renewalPrice: function() {
      if (this.renewal_form.rechargeId !== '') {
        let multiple = 0
        let durationPrice = 0
        // 取得选择的并发量
        for (const key in this.audienceLimitOptions) {
          if (this.audienceLimitOptions[key].rechargeLimit === this.renewal_form.rechargeLimit) {
            multiple = this.audienceLimitOptions[key].rechargeMultiple
          }
        }
        // 取得选择的时长价格
        for (const key in this.payDurationOptions) {
          if (this.payDurationOptions[key].durationId === this.renewal_form.durationId) {
            durationPrice = this.payDurationOptions[key].durationPrice
          }
        }
        return multiple * durationPrice
      } else {
        return '0'
      }
    }
  },
  created() {
    this.fetchData(1)
    getPayRecharge().then(response => {
      this.audienceLimitOptions = response.value.list
    })

    getPayDuration().then(response => {
      this.payDurationOptions = response.value.list
      this.edit_form.durationId = this.payDurationOptions[0].durationId
    })
  },
  methods: {
    fetchData(currentPage) {
      const params = {
        enterpriseId: this.$store.getters.userInfo.enterpriseId,
        currentPage: currentPage,
        liveRoomId: this.search_form.liveRoomId,
        liveRoomName: this.search_form.liveRoomName,
        status: this.search_form.status
      }

      // 超管
      if (this.$store.getters.userInfo.userType === 0) {
        getListAll(Object.assign({}, params)).then(response => {
          this.list = response.value.list
          this.pager_current_page = currentPage
          if (currentPage === 1) {
            this.pager_total = parseInt(response.value.totalCounts)
          }
        })
      } else { // 企业管理
        getList(Object.assign({}, params)).then(response => {
          this.list = response.value.list
          this.pager_current_page = currentPage
          if (currentPage === 1) {
            this.pager_total = parseInt(response.value.totalCounts)
          }
        })
      }
    },
    queryBoxShow() {
      const that = this
      that.query_show = true
    },

    queryBoxHide() { // 搜索框隐藏
      const that = this
      that.query_show = false
      that.queryBoxReset()
      // this.fetchData(1)
    },
    queryBoxReset() { // 搜索框清空
      const that = this
      for (const i in that.search_form) {
        that.search_form[i] = ''
      }
    },
    submitSearchForm(formName) { // 搜索提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fetchData(1)
        } else {
          return false
        }
      })
    },
    Renewal(liveRoomId, liveRoomName, rechargeLimit) {
      this.renewal_form.liveRoomId = liveRoomId
      this.renewal_form.liveRoomName = liveRoomName
      this.renewal_form.rechargeLimit = rechargeLimit
      this.dialogRenewalVisible = true
    },

    handleRenewal() {
      this.$refs.renewal_form.validate(valid => {
        if (valid) {
          addRenew(Object.assign({ 'userId': this.$store.getters.userId, 'liveRoomId': this.renewal_form.liveRoomId, 'durationId': this.renewal_form.durationId }, {})).then(response => {
            var tempwindow = window.open()
            tempwindow.location = response.value.payUrl
            this.orderId = response.value.orderId
            this.dialogRenewalVisible = false
            this.dialogPayVisible = true
          })
        }
      })
    },
    handleRoomPurchase() {
      this.$refs.edit_form.validate(valid => {
        if (valid) {
          payOrder(Object.assign({ 'enterpriseId': this.$store.getters.userInfo.enterpriseId, 'userId': this.$store.getters.userId }, this.edit_form)).then(response => {
            var tempwindow = window.open()
            tempwindow.location = response.value.payUrl
            this.orderId = response.value.orderId
            this.dialogPurchaseVisible = false
            this.dialogPayVisible = true
          })
        }
      })
    },
    handleDisable(index, row) {
      const id = row['id']
      const userId = this.$store.getters.userId
      const status = 2
      updateRoomStatus(id, status, userId).then(response => {
        this.fetchData(this.pager_current_page)
      })
    },

    handleEnable(index, row) {
      const id = row['id']
      const userId = this.$store.getters.userId
      const status = 0
      updateRoomStatus(id, status, userId).then(response => {
        this.fetchData(this.pager_current_page)
      })
    },

    handleCurrentChange(val) { // 换页
      this.pager_current_page = val
      this.fetchData(this.pager_current_page)
    },
    handlePayDialogClose() {
      this.dialogPayVisible = false
      this.dialogPayFailVisible = false

      this.fetchData(1)
    },
    handlePayDialogSuccess() {
      checkOrder(this.orderId).then(response => {
        // 已付款
        if (response.value.orderState === 1) {
          this.dialogPayVisible = false
          this.dialogPayFailVisible = false
          this.fetchData(1)
        } else { // 未付款
          this.orderNum = response.value.orderNum
          this.orderTitle = response.value.orderTitle
          this.orderBody = response.value.orderBody
          this.orderPayablePrice = response.value.orderPayablePrice
          this.dialogPayVisible = false
          this.dialogPayFailVisible = true
        }
      })
    },
    addNew() {
      this.dialogPurchaseVisible = true
    },
    timestampToTime(timestamp) {
      const date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
      const h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
      const m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
      const s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
      return Y + M + D + h + m + s
    },
    resetFields(ruleForm) {
      this.$refs[ruleForm].resetFields(() => {
      })
    }
  },
  watch: {
    dialogPurchaseVisible: function() { // 侦听dialog状态，重置表单验证
      if (this.dialogPurchaseVisible === false) {
        this.resetFields('edit_form')
        this.edit_form.durationId = this.payDurationOptions[0].durationId
      }
    }
  }
}
</script>
