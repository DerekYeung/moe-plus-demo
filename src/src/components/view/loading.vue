<style scoped>
  .loading-indicator.light .loader-dot{
    background-color: white;
  }

  .loading-indicator .loader-dot:nth-child(1) {
    -webkit-animation-delay: -.32s;
    -moz-animation-delay: -.32s;
    -ms-animation-delay: -.32s;
    -o-animation-delay: -.32s;
    animation-delay: -.32s
  }

  .loading-indicator .loader-dot:nth-child(2) {
    -webkit-animation-delay: -.16s;
    -moz-animation-delay: -.16s;
    -ms-animation-delay: -.16s;
    -o-animation-delay: -.16s;
    animation-delay: -.16s
  }

  @-webkit-keyframes bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0)
    }
    40% {
      -webkit-transform: scale(1)
    }
  }

  @-moz-keyframes bouncedelay {
    0%,
    80%,
    100% {
      -moz-transform: scale(0)
    }
    40% {
      -moz-transform: scale(1)
    }
  }

  @-ms-keyframes bouncedelay {
    0%,
    80%,
    100% {
      -ms-transform: scale(0)
    }
    40% {
      -ms-transform: scale(1)
    }
  }

  @-o-keyframes bouncedelay {
    0%,
    80%,
    100% {
      -o-transform: scale(0)
    }
    40% {
      -o-transform: scale(1)
    }
  }

  @keyframes bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0)
    }
    40% {
      transform: scale(1)
    }
  }

  .loading-indicator {
    margin: 10px auto;
    width: 70px;
    text-align: center;
    z-index: 9999
  }

  .loading-indicator .loader-dot {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #a6a6a6;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    -moz-animation: bouncedelay 1.4s infinite ease-in-out;
    -ms-animation: bouncedelay 1.4s infinite ease-in-out;
    -o-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    -moz-animation-fill-mode: both;
    -ms-animation-fill-mode: both;
    -o-animation-fill-mode: both;
    animation-fill-mode: both
  }

</style>

<template>
  <div class="loading-indicator" v-bind:class="{ light: light }"><span class="loader-dot"></span><span class="loader-dot"></span><span class="loader-dot"></span></div>
</template>

<script>
export default {
  name: 'view-loading',
  props: {
    light: {
      default: false
    }
  }
};
</script>
