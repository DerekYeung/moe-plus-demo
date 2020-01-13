<style scoped rel="stylesheet/scss" lang="scss">
  .skeleton-block {
    background: #eee;
    background-image: linear-gradient(90deg,rgba(255, 255, 255, 0.3) 25%, transparent 25%);
    background-size: 20rem 20rem;
    animation: skeleton-stripes 1s linear infinite;
    margin: 10px;

    @keyframes skeleton-stripes {
      from {
        background-position: 0 0 ;
      }
      to {
        background-position: 20rem 0;
      }
    }
  }
</style>

<template>
  <div class="skeleton-block"
      :style="{'width':width,'height':height,'margin':margin,'border-radius':radius,'display':display }">
  </div>
</template>

<script>
export default {
  name: 'skeleton-block',
  props: {
    width: {
      default: '50px'
    },
    height: {
      default: '50px'
    },
    margin: {
      default: '6px'
    },
    radius: {
      default: '0'
    },
    display: {
      default: 'block'
    }
  },
  data() {
    return {};
  },
  mounted(

  ) {
  }
};
</script>
