<template>

    <div class="admin-wrapper">
        
        <v-sidebar v-on:foldChange="foldChange"></v-sidebar>
        <v-head></v-head>
        <el-scrollbar class="page-component__scroll">
        <div :class="fold?'fold':''" class="content">
            <transition name="move" mode="out-in">
                <keep-alive include="customer">
                    <router-view class="scroll-content"></router-view>
                </keep-alive>
            </transition>
        </div>
       </el-scrollbar>
    </div>
</template>

<script>
    import vHead from './components/Header.vue'
    import vSidebar from './components/Sidebar.vue'

    export default {
      components: {
        vHead, vSidebar
      },
      data() {
        return {
          fold: false
        }
  },

      methods: {
        // 监听菜单折叠事件
        foldChange() {
          this.fold = !this.fold
        }
      }
    
    }
</script>
<style>

    @import "../../../assets/styles/admin/index.css";

    #app,.admin-wrapper{
        height: 100%;
        width: 100%;
        /*overflow: hidden;*/
    }
    /*全局滚动条美化*/
    .admin-wrapper .page-component__scroll{
        height: 100%;
        width: 100%;
    }

    .admin-wrapper .page-component__scroll .el-scrollbar__wrap{
        overflow: auto;
    }
    .admin-wrapper .page-component__scroll .el-scrollbar__bar.is-vertical{
        top:75px !important;
    }
</style>

