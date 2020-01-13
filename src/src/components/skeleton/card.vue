<style scoped rel="stylesheet/scss" lang="scss">
  .skeleton-card {
    position: relative;
    padding: 10px 0;
    margin: 10px 0;
    box-sizing: border-box;
    background: #fff;

    .skeleton-card-header {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;

      .skeleton-card-header-info {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    }

    .skeleton-card-simple-footer {
      text-align: right;
    }

    .skeleton-card-action-footer {
      display: flex;
      justify-content: space-around;
    }
  }
</style>

<template>
  <div class="skeleton-card">
    <div v-if="hasHeader" class="skeleton-card-header">
      <skeleton-block width="40px" height="40px" radius="50%" />
      <div class="skeleton-card-header-info">
        <skeleton-block width="40%" height="20px" />
        <skeleton-block width="30%" height="20px" />
      </div>
    </div>
    <helper-divider v-if="hasHeader" height="1px" color="#efefef" />
    <div class="skeleton-card-content">
      <skeleton-block width="90%" height="20px" />
      <skeleton-block width="75%" height="20px" />
    </div>
    <div v-if="hasFooter && footerStyle === 'simpleStyle' " class="skeleton-card-simple-footer">
      <skeleton-block width="15%" height="20px" display="inline-block" />
    </div>
    <div v-else-if="hasFooter && footerStyle === 'actionStyle' " class="skeleton-action-card-footer">
      <helper-divider height="1px" color="#efefef" />
      <skeleton-block width="25%" height="25px" display="inline-block" />
      <skeleton-block width="25%" height="25px" display="inline-block" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'skeleton-card',
  props: {
    hasHeader: {
      default: false
    },
    hasFooter: {
      default: false
    },
    footerStyle: {
      default: 'actionStyle'
    }
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
  }
};
</script>
