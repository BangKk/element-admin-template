<template>
  <div id="app" class="layout">
    <div class="loading" v-if="loading" v-loading="loading" element-loading-background="#fff" />
    <el-container v-if="!loading">
      <template v-if="logined">
        <el-aside width="auto" class="aside--container">
          <AsideMenu :menus="menus" />
        </el-aside>
        <el-container>
          <el-header height="103px" style="padding: 0;">
            <Breadcrumb>
              <div class="logout" slot="right">
                <el-dropdown :show-timeout="150">
                  <span class="el-dropdown-link">
                    {{ $t('language.change') }}
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="loadLanguageAsync(CN)">{{ $t('language.cn') }}</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="loadLanguageAsync(EN)">{{ $t('language.en') }}</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown :show-timeout="150">
                  <span class="el-dropdown-link">
                    {{ user.name }}
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="logout">退出登录</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </Breadcrumb>
            <TagsView />
          </el-header>
          <el-main style="padding: 10px;">
            <transition name="fade" mode="out-in">
              <keep-alive :include="cachedViews">
                <router-view />
              </keep-alive>
            </transition>
          </el-main>
        </el-container>
      </template>
      <Login v-else />
    </el-container>
  </div>
</template>

<script>
import AsideMenu from '@/components/AsideMenu/';
import Breadcrumb from '@/components/Breadcrumb';
import TagsView from '@/components/TagsView';
import Login from '@/views/Login';
import apis from '@/apis';
import { getRouteByRole } from '@/router';
import { loadLanguageAsync, CN, EN } from '@/i18n';
export default {
  name: 'App',
  data() {
    return {
      loading: true,
      logined: false,
      menus: [],
      user: {}, // 登录的用户信息
      cachedViews: [],
      CN,
      EN
    };
  },
  created() {
    this.$bus.on('login', user => {
      this.user = user;
      this.logined = true;
      const routes = getRouteByRole(user.action_list);
      this.$router.addRoutes(routes);
      this.menus = routes;
    });
    this.$bus.on('user', () => {
      this.$bus.emit('getUser', this.user);
    });
    this.$bus.on('cachedViews', cachedViews => {
      this.cachedViews = cachedViews;
    });
  },
  mounted() {
    apis.me().then(
      res => {
        window.user = res;
        this.user = res;
        this.logined = true;
        const routes = getRouteByRole(res.action_list);
        this.$router.addRoutes(routes);
        this.menus = routes;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      },
      () => {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    );
  },
  computed: {
    roles: function() {
      if (this.user.role_list) {
        return this.user.role_list.map(item => item.role_name).join(',');
      }
    }
  },
  methods: {
    logout() {
      apis.logout().then(res => {
        window.location.reload();
      });
    },
    loadLanguageAsync
  },
  components: {
    AsideMenu,
    Breadcrumb,
    Login,
    TagsView
  }
};
</script>

<style>
#app {
  background: #f8f8f8;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

a {
  text-decoration: none;
}

.aside--container {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 1;
}

.el-button,
.el-checkbox {
  user-select: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
