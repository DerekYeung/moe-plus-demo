import Vue from 'vue';

import Layer from '../components/layer.vue';

const createLayer = (options) => {
  let body = document.body;
  let bindPhone = document.createElement('div');

  bindPhone.setAttribute('id', 'layer');
  body.appendChild(bindPhone);

  return new Vue({ render: h => {
    return h(Layer, { props: { text: options.props.text } });
  } }).$mount('#layer');
};

export default createLayer;
