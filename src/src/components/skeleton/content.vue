<style scoped rel="stylesheet/scss" lang="scss">
  .skeleton-content {
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    text-align: left;
  }
</style>

<template>
  <div class="skeleton-content">
    <skeleton-block height="24px" width="70%" />
    <skeleton-block width="24px" height="24px" radius="100%" display="inline-block" />
    <skeleton-block height="24px" width="35%" display="inline-block" />
    <helper-divider />
    <skeleton-block height="20px" width="75%" />
    <skeleton-block height="20px" width="90%" />
    <skeleton-block height="20px" width="85%" />
    <skeleton-block height="20px" width="90%" />
    <skeleton-block height="20px" width="90%" />
    <skeleton-block height="20px" width="75%" />
  </div>
</template>

<script>
export default {
  name: 'skeleton-list',
  data() {
    return {};
  },
  mounted() {

  }
};
</script>
