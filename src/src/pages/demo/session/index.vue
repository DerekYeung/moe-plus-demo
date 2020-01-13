<style scoped rel="stylesheet/scss" lang="scss">

</style>

<template>
  <div v-title data-title="首页">
    <view-header left-arrow title="Session"></view-header>
    <view-content>
      <Btn magic @click="set">写Session</Btn>
      <Btn magic @click="get">读Session</Btn>
      <Btn magic @click="del">删Session</Btn>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      isHtml5Plus: false
    };
  },
  mounted() {
  },
  methods: {
    set() {
      this.Session.set('test', 'ok');
      this.Toast.show('已写入');
    },
    get() {
      const test = this.Session.get('test');
      if (test) {
        this.Toast.show(`读取到内容:${test}`);
      } else {
        this.Toast.show('未读取到内容');
      }
    },
    del() {
      this.Session.del('test');
      this.Toast.show('已删除');
    }
  }
};
</script>
