<style scoped rel="stylesheet/scss" lang="scss">
.pre {
  width: 100%;
  height: auto;
  word-break: break-all;
  overflow: scroll;
  padding: 16px;
  padding-top: 0px;
}
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <biscuit-item action="截图" @tap="getAddressBook">
        <template slot="left">
          读取通讯录
        </template>
      </biscuit-item>
      <div class="pre">
        {{message}}
      </div>
      <div class="item" v-for="(item, index) in contacts" :key="index">{{item.displayName}}</div>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-connect',
  data() {
    return {
      title: '通讯录',
      contacts: [],
      message: '',
      img: ''
    };
  },
  methods: {
    getAddressBook() {
      const engine = this.Runtime.engine;
      this.message = '读取中';
      this.contacts = [];
      engine.contacts.getAddressBook(engine.contacts.ADDRESSBOOK_PHONE, addressbook => {
        addressbook.find(null, contacts => {
          this.message = '读取成功';
          this.contacts = contacts;
        }, e => {
          this.message = 'error:' + JSON.stringify(e);
        });
      }, e => {
        this.message = 'error:' + JSON.stringify(e);
      });
    }
  }
};
</script>
