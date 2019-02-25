<template>
    <div class="sidebar">
        <div class="logo" @click="toFront"></div>
        <div class="menu">
          <ul class="menu-list">
            <!-- 一级菜单 开始-->
            <li class="menu-item" v-for="(item,index) in items">

                <div class="menu-main" :class="item.active?'menu-active':''" @click="openSub(index)">
                  <span class="icon" :class="item.icon"></span>
                  <span class="menu-name">{{ item.title }}</span>
                  <span class="arrow"></span>
                </div>

              <!-- 所属二级菜单 开始-->
              <transition name="move" mode="out-in">
              <ul class="menu-sublist"  v-if="item.subs" v-show="item.sub_show">
                <li class="menu-subitem" :class="subItem.active?'menu-active':''"
                    v-for="(subItem,i) in item.subs"
                    @click="linkTo(subItem.index)">
                   {{subItem.title}}
                </li>
              </ul>
              </transition>
              <!-- 所属二级菜单 结束-->
            </li>
            <!-- 一级菜单 结束-->
        </ul>
        </div>

    </div>
</template>

<script>
    export default {
      data() {
        return {
          items: [
            {
              icon: 'iconfont icon-zhibo',
              index: 'admin/room',
              title: '直播间管理',
              sub_show: false,
              active: true,
              subs: [

              ]
            }
          ]
        }
      },
      computed: {
        onRoutes() {
          return this.$route.path.replace('/', '')
        }
      },
      created() {
        // 获取路由信息，高亮相关sidebar
        const fullPath = this.$router.currentRoute.fullPath
        this.items.forEach((val, index, array) => {
          const count = fullPath.indexOf(val.index)
          if (count > 0) {
            val.active = true
          } else {
            val.active = false
          }
        })
      },
      methods: {
        openSub(index) {
          const that = this
          for (const i in that.items) {
            if (i === index) {
              if (that.items[i].subs.length > 0) {
                that.items[i].sub_show = !that.items[i].sub_show
              } else {
                this.linkTo(that.items[i].index)
              }

              that.items[i].active = true
            } else {
              that.items[i].sub_show = false
              that.items[i].active = false
            }
          }
        },
        linkTo(index) {
          this.$router.push('/' + index)
        },
        toFront() {
          this.$router.push('/')
        }
      }
    }
</script>

<style scoped>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {  transition: all .1s ease;}
    .slide-fade-leave-active {  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
    .slide-fade-enter, .slide-fade-leave-active {  padding-left: 10px;  opacity: 0;}
</style>

