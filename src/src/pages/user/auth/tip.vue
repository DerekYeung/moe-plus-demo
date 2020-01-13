<style scoped rel="stylesheet/scss" lang="scss">

  .index {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;

    &__text {
      text-align: center;
      padding: 16px;
      letter-spacing: 1px;
      background-color: #fff;
      margin: 10px;
      box-shadow: 0 0 6px rgba(177,177,177,.1);
    }

    &__button {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

</style>

<template>
  <div class="index" v-title data-title="学拓帮 - 提示">
    <div class="index__icon">
      <Pic src="tip/none.png" width="100px"/>
    </div>
    <div class="index__text">
      {{ text }}
    </div>
    <div class="index__button">
      <Btn
        magic
        width="90%"
        radius="4px"
        height="40px"
        fontSize="1.1rem"
        @click="reLogin()">
        重新登录
      </Btn>
    </div>
  </div>
</template>

<script>

export default {
  name: 'common-auth-index',
  data() {
    return {
      text: ''
    };
  },
  methods: {
    reLogin() {
      this.Page.open('/user/auth/index');
    }
  },
  mounted() {
    this.text = this.Page.Param.text;
  }
};
</script>
