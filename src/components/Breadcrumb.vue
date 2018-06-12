<template>
  <div class="top-bar">
    <Hamburger />
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="'/'">{{ $t('views.home') }}</el-breadcrumb-item>
      <transition-group name="breadcrumb">
        <el-breadcrumb-item :class="{'item-hover': route.redirect }" v-for="(item, index) in $route.matched" :key="index" v-if="item.name !== 'home'">
          <span @click="to(item)">{{ $t(`views.${item.meta.title}`) }}</span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <slot name="right" />
  </div>
</template>
<script>
import Hamburger from '@/components/Hamburger';
export default {
  components: {
    Hamburger
  },
  data() {
    return {
      route: {}
    };
  },
  methods: {
    to(route) {
      !route.redirect && this.$router.push(name);
    }
  }
};
</script>
<style scoped>
.top-bar {
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  border-color: #eee;
  line-height: 62px;
  height: 60px;
  padding: 0 20px;
}
.top-bar .breadcrumb {
  display: inline-block;
}
.top-bar .item-hover {
  cursor: pointer;
  color: #409eff;
}
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}

.top-bar .logout {
  float: right;
  cursor: pointer;
  height: 100%;
  padding: 0 10px;
}

.top-bar .logout .el-dropdown {
  padding: 0 5px;
  height: 59px;
}

.top-bar .logout .el-dropdown:hover {
  background: #e6f7ff;
}

.top-bar .logout .el-dropdown .el-dropdown-link {
  display: inline-block;
  height: 100%;
  width: 100%;
}
</style>
