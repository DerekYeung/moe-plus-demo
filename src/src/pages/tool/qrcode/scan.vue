<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow noShadow ref="header" />
  </div>
</template>

<script>
export default {
  name: 'qrcode-scan',
  data() {
    return {
      title: '扫码'
    };
  },
  mounted() {
    const current = this.Page.current;
    const top = this.$refs.header.$el.offsetHeight;
    const scaner = this.Page.create('/tool/qrcode/scaner', 'scaner-scan', {
      top
    });
    current.append(scaner);
    this.$root.$on('scaned', event => {
      const result = event.result;
      if (result.indexOf('http://') > -1 || result.indexOf('https://') > -1) {
        // if (result.indexOf('.ewsedu.com/') > -1) {
        this.Page.invoke('/webloader/browser/index', {
          url: result
        });
        // } else {
        //   this.Toast.show('您扫描的内容非学拓邦官方提供或不在学拓邦白名单中。');
        // }
      } else {
        this.Toast.show('扫描内容：' + result);
      }
      setTimeout(() => {
        this.Page.back(true);
      }, 300);
    });
  }
};
</script>
