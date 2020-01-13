<style scoped rel="stylesheet/scss" lang="scss">

</style>

<template>
  <div v-title data-title="首页">
    <view-header left-arrow title="Api"></view-header>
    <view-content>
      <Btn magic @click="startRequest">发起请求</Btn>
      <Btn magic @click="comboRequest">合并请求</Btn>
      <code>
        请求结果：{{result}}
      </code>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      result: ''
    };
  },
  mounted() {
  },
  methods: {
    singleRequest(url = '/test') {
      /*
        请求部分可通过app/main.js配置不同的请求实例
        针对app自身的请求，使用this.Api调用即可，其他服务的请求方式则通过 [this.Api.服务名] 这样的方式调用
        比如请求Passport部分的接口写法为：
        this.Api.Passport.get('...')
        同时也可以在main.js中针对不同的服务进行拦截，以便于监听、修改请求
      */
      return this.Api.get(url).promisify;
    },
    startRequest() {
      return this.singleRequest().then(json => {
        this.result = json.data.message || '';
      }).catch(e => {
        this.result = e.message;
      });
    },
    comboRequest() {
      return Promise.all([
        this.singleRequest('/test/index/primary'),
        this.singleRequest('/test/index/secondary')
      ]).then(result => {
        const [ primary, secondary ] = result;
        this.result = JSON.stringify({
          primary: primary.data.message,
          secondary: secondary.data.message
        });
      });
    }
  }
};
</script>
