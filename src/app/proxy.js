'use strict';
const helper = require('./build-helper');
const args = process.argv.splice(2) || [];

const target = args[0];
const action = args[1];
const params = args[2] ? JSON.parse(decodeURIComponent(args[2])) : [];
const response = helper[action] ? helper[action].apply(helper, params) : null;
console.log(JSON.stringify(response));
