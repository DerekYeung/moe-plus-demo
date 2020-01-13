<style scoped rel="stylesheet/scss" lang="scss">
  .skeleton-index {
    .skeleton-area {
      display: block;
      padding: 10px;
      background-color: #fff;
      margin: 10px auto;
      box-shadow: 0 0 10px rgba(0,0,0,.1);

      .skeleton-block-wrap {
        display: inline-block;
        padding: 10px 10px 0 10px;
        width: 33.3%;
      }
    }
  }
</style>

<template>
  <div class="skeleton-index">
    <div class="skeleton-area">
      <skeleton-block
        height="100px"
        margin="0"
        width="auto"
        display="block"
        :style="{border:'1px solid #eee'}"
      />
    </div>
    <div class="skeleton-area">
      <div
        v-for="index in 12"
        class="skeleton-block-wrap"
        :key="index">
        <skeleton-block
          width="100%"
          height="80px"
          margin="0"
          display="inline-block"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'skeleton-index',
  data() {
    return {};
  },
  mounted() {

  }
};
</script>
