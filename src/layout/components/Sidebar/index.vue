<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in menu_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Logo from './Logo'
  import SidebarItem from './SidebarItem'
  import variables from '@/styles/variables.scss'

  export default {
    components: { SidebarItem, Logo },
    computed: {
      ...mapGetters(['menu_routes', 'sidebar']),
      activeMenu() {
        // if set path, the sidebar will highlight the path you set
        return this.$route.meta.activeMenu || this.$route.path
      },
      showLogo() {
        return this.$store.state.settings.sidebarLogo
      },
      variables() {
        return variables
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>
