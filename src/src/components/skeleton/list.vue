<style scoped rel="stylesheet/scss" lang="scss">
  .skeleton-list {
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    text-align: left;
  }
</style>

<template>
  <div class="skeleton-container">
    <div v-for="item in number" :key="item" class="skeleton-list">
      <skeleton-block height="24px" width="90%" margin="6px" />
      <skeleton-block height="18px" width="65%" margin="6px" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'skeleton-list',
  props: {
    number: {
      default: 1
    }
  },
  data() {
    return {};
  },
  mounted() {

  }
};
</script>
