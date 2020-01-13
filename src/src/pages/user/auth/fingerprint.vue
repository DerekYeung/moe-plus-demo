<style scoped rel="stylesheet/scss" lang="scss">
body, .ui-app-loader, .ui-app-view{
  background: transparent !important;
}
</style>

<template>
  <Fingerprint :show="showFingerprint" @close="showFingerprint = !showFingerprint"></Fingerprint>
</template>

<script>

export default {
  name: 'common-auth-index',
  data() {
    return {
      showFingerprint: true
    };
  },
  methods: {
  }
};
</script>
