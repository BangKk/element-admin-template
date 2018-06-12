<template>
  <div class="tags-view-container">
    <scroll-pane class="tags-view-wrapper" ref="scrollPane">
      <router-link ref="tag" class="tags-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
                   :to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        <span class="tag-dot" />
        <span class="tag-text">{{ $t(`views.${tag.title}`) }}</span>
        <span class="tag-close el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul class="contextmenu" v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">{{ $t('tagsView.close') }}</li>
      <li @click="closeOthersTags">{{ $t('tagsView.closeOthers') }}</li>
      <li @click="closeAllTags">{{ $t('tagsView.closeAll') }}</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane';

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      visitedViews: [],
      cachedViews: []
    };
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    },
    cachedViews() {
      this.$bus.emit('cachedViews', this.cachedViews);
    }
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route.name) {
        return false;
      }
      this.actionAddVisitedViews(route);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      tags &&
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el);
              break;
            }
          }
        });
    },
    closeSelectedTag(view) {
      this.actionDelVisitedViews(view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView.path);
          } else {
            this.$router.push('/');
          }
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path);
      this.actionDelOthersViews(this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.actionDelAllViews();
      this.$router.push('/');
    },
    openMenu(tag, e) {
      this.visible = true;
      this.selectedTag = tag;
      this.left = e.clientX;
      this.top = e.clientY;
    },
    closeMenu() {
      this.visible = false;
    },
    ADD_VISITED_VIEWS(view) {
      if (this.visitedViews.some(v => v.path === view.path)) return;
      const newView = {
        name: view.name,
        path: view.path,
        title: view.meta.title
      };
      const sameTab = this.visitedViews.filter(v => v.name === view.name);
      sameTab.length > 0 &&
        (newView.title = `${newView.title}(${sameTab.length})`);
      this.visitedViews.push(newView);
      if (!view.meta.noCache) {
        this.cachedViews.push(view.name);
      }
    },
    DEL_VISITED_VIEWS(view) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1);
          break;
        }
      }
      for (const i of this.cachedViews) {
        if (i === view.name) {
          const index = this.cachedViews.indexOf(i);
          this.cachedViews.splice(index, 1);
          break;
        }
      }
    },
    DEL_OTHERS_VIEWS(view) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews = this.visitedViews.slice(i, i + 1);
          break;
        }
      }
      for (const i of this.cachedViews) {
        if (i === view.name) {
          const index = this.cachedViews.indexOf(i);
          this.cachedViews = this.cachedViews.slice(index, i + 1);
          break;
        }
      }
    },
    DEL_ALL_VIEWS() {
      this.visitedViews = [];
      this.cachedViews = [];
    },
    actionAddVisitedViews(view) {
      this.ADD_VISITED_VIEWS(view);
    },
    actionDelVisitedViews(view) {
      return new Promise(resolve => {
        this.DEL_VISITED_VIEWS(view);
        resolve([...this.visitedViews]);
      });
    },
    actionDelOthersViews(view) {
      return new Promise(resolve => {
        this.DEL_OTHERS_VIEWS(view);
        resolve([...this.visitedViews]);
      });
    },
    actionDelAllViews() {
      return new Promise(resolve => {
        this.DEL_ALL_VIEWS();
        resolve([...this.visitedViews]);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.tags-view-container {
  .tags-view-wrapper {
    margin-top: 3px;
    height: 40px;
    overflow: hidden;
    background: #f0f0f0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border-color: #eee;
    .tags-item {
      height: 32px;
      line-height: 32px;
      border: 1px solid #e9eaec;
      color: #495060;
      background: #fff;
      padding: 0 12px;
      display: inline-block;
      margin: 2px 4px 2px 0;
      border-radius: 3px;
      font-size: 12px;
      vertical-align: middle;
      opacity: 1;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        opacity: 0.85;
      }
      &:first-of-type {
        margin-left: 10px;
      }
      .tag-dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 8px;
        border-radius: 50%;
        background: #e9eaec;
        position: relative;
        top: 1px;
      }
      .tag-text {
        color: #495060;
      }
      .tag-close {
        display: inline-block;
        font-size: 14px;
        cursor: pointer;
        margin-left: 8px;
        color: #666;
        opacity: 0.66;
        position: relative;
        top: 1px;
        &:hover {
          opacity: 1;
        }
      }
    }
    .tags-item.active {
      .tag-dot {
        background: #2d8cf0;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
