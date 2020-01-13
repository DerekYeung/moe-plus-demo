module.exports = {
  primaryKey: 'id',
  index: [{
    name: 'id',
    options: {
      unique: true
    }
  }, {
    name: 'name',
    options: {
      unique: false
    }
  }]
};