<style scoped rel="stylesheet/scss" lang="scss">
  .skeleton-comment-box {
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    text-align: left;
  }
</style>

<template>
  <div class="skeleton-comment-box">
    <skeleton-block height="24px" width="10%" display="inline-block" />
    <skeleton-block height="24px" width="10%" display="inline-block" />
    <helper-divider color="#efefef" />
    <skeleton-block width="24px" height="24px" radius="100%" display="inline-block" />
    <skeleton-block height="24px" width="20%" display="inline-block" />
    <skeleton-block height="20px" width="90%" />
    <skeleton-block height="20px" width="75%" />
    <helper-divider />
    <skeleton-block width="24px" height="24px" radius="100%" display="inline-block" />
    <skeleton-block height="24px" width="20%" display="inline-block" />
    <skeleton-block height="20px" width="90%" />
    <skeleton-block height="20px" width="75%" />
    <helper-divider color="#efefef" />
    <skeleton-block height="30px" width="35%" display="inline-block" />
    <skeleton-block height="30px" width="35%" display="inline-block" />
  </div>
</template>

<script>
export default {
  name: 'skeleton-comment-box',
  data() {
    return {};
  },
  mounted() {

  }
};
</script>
