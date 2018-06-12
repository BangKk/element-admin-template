<template>
  <div
    class="menu-wrap">
    <el-menu
      ref="menu"
      :default-active="active_menu"
      class="aside-menu"
      background-color="#001529"
      text-color="hsla(0,0%,100%,.65)"
      active-text-color="#fff"
      :collapse="isCollapse"
      :unique-opened="true">
      <div class="aside-menu-head">
        <div class="aside-menu-head--logo" @click="toHome">
          <img :src="logo" class="logo" alt="logo">
          {{ $t('appName') }}
        </div>
      </div>
      <sidebar-item :routes="menus" />
    </el-menu>
  </div>
</template>
<script>
import SidebarItem from './SidebarItem';
import logo from '../../assets/logo.png';
export default {
  components: { SidebarItem },
  data() {
    return {
      isCollapse: false,
      logo
    };
  },
  props: ['menus'],
  created() {
    this.$bus.on('isCollapse', this.isCollapseCb);
  },
  beforeDestroy() {
    this.$bus.off('isCollapse', this.isCollapseCb);
  },
  methods: {
    isCollapseCb() {
      this.isCollapse = !this.isCollapse;
    },
    toHome() {
      this.$router.push({ name: 'home' });
    }
  },
  computed: {
    active_menu() {
      return this.$route.name;
    }
  }
};
</script>
<style>
.menu-wrap {
  position: relative;
  height: 100%;
}
.aside-menu {
  height: 100%;
  min-height: 100vh;
  font-weight: 200;
  border-right: none;
  overflow: hidden;
}
.aside-menu:not(.el-menu--collapse) {
  width: 220px;
}
.el-menu-item:hover,
.el-submenu__title:hover {
  color: #fff !important;
}
.aside-menu-head {
  height: 60px;
  line-height: 60px;
  background: #002140;
  overflow: hidden;
}
.aside-menu li.is-opened .el-menu li.el-menu-item.is-active {
  background-color: #1890ff !important;
}
.aside-menu li.is-opened .el-menu li.el-menu-item {
  background: #000c17 !important;
}
.aside-menu-head--logo {
  color: #f5f5f5;
  font-size: 1.5em;
  font-weight: 700;
  padding-left: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  cursor: pointer;
}
.aside-menu-head--logo .logo {
  height: 30px;
  vertical-align: text-top;
}

.menu-wrap .aside-menu.el-menu--collapse .el-submenu__title span {
  display: none;
}
</style>
