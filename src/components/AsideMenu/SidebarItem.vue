<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.meta.hidden">
      <router-link v-if="!item.children && item.meta.access" :to="{name: item.name}" :key="item.name">
        <el-menu-item :index="item.name">
          <i v-if="item.meta&&item.meta.icon" :class="`el-icon-${item.meta.icon}`" />
          <span slot="title" v-if="item.meta&&item.meta.title">{{ $t(`views.${item.meta.title}`) }}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-if="item.children && allChildHasAccessFail(item.children)" :index="item.meta.title" :key="item.meta.title">
        <template slot="title">
          <i v-if="item.meta&&item.meta.icon" :class="`el-icon-${item.meta&&item.meta.icon}`" />
          <span slot="title" v-if="item.meta&&item.meta.title">{{ $t(`views.${item.meta.title}`) }}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path" />

          <router-link v-else-if="child.meta.access" :to="{name :child.name}" :key="child.name">
            <el-menu-item :index="child.name">
              <i v-if="child.meta&&child.meta.icon" :class="`el-icon-${child.meta.icon}`" />
              <span v-if="child.meta&&child.meta.title">{{ $t(`views.${child.meta.title}`) }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  },
  methods: {
    allChildHasAccessFail(routes) {
      return routes.some(route => route.meta.access);
    }
  }
};
</script>
