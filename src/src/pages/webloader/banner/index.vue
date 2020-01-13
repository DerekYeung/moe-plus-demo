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
  name: 'webloader-banner',
  data() {
    return {
      bannerid: 0,
      title: '',
      content: ''
    };
  },
  methods: {
    onPageShow() {
      this.bannerid = this.Page.Param.bannerid;
      this.request(this.bannerid);
    },
    request(bannerid) {
      return this.Api.get('/home/banner', {
        bannerid
      }).on('success', json => {
        const banner = json.data.banner;
        this.title = banner.title || banner.name || '';
        this.content = banner.content;
      });
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
