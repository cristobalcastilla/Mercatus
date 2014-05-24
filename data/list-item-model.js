

var ListItemModel = Backbone.Model.extend({
  defaults: {
    product: undefined,

    checked: '',
    amount: 0,
    units: undefined,
    notes: ''
  },

  productName: function () { return this.get('product').get('name'); }
});