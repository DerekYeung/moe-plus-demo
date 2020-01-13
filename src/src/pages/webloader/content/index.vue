<style scoped rel="stylesheet/scss" lang="scss">
  body, .ui-app-view, .web-content-view {
    background: white;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .web-content-view {
    padding: 20px;
  }
  .web-content-view img{
    max-width: 100%;
    height: auto;
  }
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow noShadow />
    <view-content>
      <view-scroll>
        <section class="web-content-view" v-html="content" @click="onClick($event)"></section>
      </view-scroll>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'webloader-content',
  data() {
    return {
      title: '',
      content: ''
    };
  },
  methods: {
    onPageShow() {
      const item = this.Page.Param.item || {};
      this.title = item.title || item.name || '';
      this.content = item.content;
    },
    onClick(event) {
      const nodeName = (event.target.nodeName || '').toLowerCase();
      if (nodeName === 'a') {
        event.preventDefault();
        event.stopPropagation();
        const href = event.target.getAttribute('href');
        if (href) {
          this.Page.invoke('/webloader/browser/index', {
            url: href
          });
        }
        return false;
      }
    }
  }
};
</script>
