<style scoped rel="stylesheet/scss" lang="scss">
input {
  border: none;
  outline: none;
}
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <div>{{msg}}</div>
      <helper-margin-block height="16px" />
      <biscuit-item action="请求Channels" @tap="getChannels">
        <template slot="left">
          请求Channels
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="绑定">
        <template slot="left">支付金额：<input v-model="amount" type="number" /></template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="绑定" @tap="alipay">
        <template slot="left">
          支付宝
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="解绑" @tap="wxpay">
        <template slot="left">
          微信
        </template>
      </biscuit-item>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-connect',
  data() {
    return {
      amount: 0.01,
      title: '支付',
      pusher: '',
      msg: '',
      channels: []
    };
  },
  mounted() {
    this.$root.$on('push/click', () => {
      console.log('click');
    });
    this.$root.$on('push/receive', msg => {
      console.log('receive');
      this.msg = JSON.stringify(msg);
    });
  },
  methods: {
    onPageShow() {
      this.pusher = JSON.stringify(this.Runtime.Client.pusher);
    },
    getChannel(id = '') {
      return this.channels.find(data => {
        return data.id == id;
      });
    },
    getChannels() {
      console.log(this.Runtime.Payment);
      this.Runtime.Payment.getChannels().then(channels => {
        this.channels = channels;
        this.msg = JSON.stringify(channels);
      });
    },
    alipay() {
      this.Api.get('/test/payment/alipay', {
        amount: this.amount
      }).on('success', json => {
        const statement = json.data.statement;
        this.Runtime.Payment.request(this.getChannel('alipay'), statement).then(channels => {
          console.log('asdasd');
        });
      });
    },
    wxpay() {
      this.Api.get('/test/payment/wxpay').on('success', json => {
        const statement = json.data.statement;
        const message = {
          statement
        };
        this.Runtime.Payment.request(this.getChannel('wxpay'), statement).then(channels => {
          message.result = channels;
          this.msg = JSON.stringify(message);
        }).catch(e => {
          message.e = e;
          this.msg = JSON.stringify(message);
        });
      });
    },
    postPush() {
      this.Api.get('/test/push/post').on('success', json => {
        console.log(JSON.stringify(json.data));
      });
    },
    delayPush() {
      this.Api.get('/test/push/post', {
        delay: 5
      }).on('success', json => {
        console.log(JSON.stringify(json.data));
      });
    },
    longDelayPush() {
      this.Api.get('/test/push/post', {
        delay: 30
      }).on('success', json => {
        console.log(JSON.stringify(json.data));
      });
    }
  }
};
</script>
