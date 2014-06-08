

var ProductModel = Backbone.Model.extend({
  defaults: {
    name: undefined,
    category: undefined
  },

  getCategoryName: function () {
    return this.get('category').get('name');
  },

  getCategoryId: function () {
    return this.get('category').id;
  }
});