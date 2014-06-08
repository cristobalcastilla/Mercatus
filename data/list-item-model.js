

var ListItemModel = Backbone.Model.extend({
  defaults: {
    product: undefined,

    checked: '',
    amount: 0,
    units: undefined,
    notes: ''
  },

  productName: function () { 
    return this.get('product').get('name'); 
  },

  getUnitsAbbr: function () {
    if (!this.get('units')) throw new Error('Units not defined');
    return unitsCollection.get(this.get('units')).get('abbr');
  },

  hasAmount: function () {
    return (this.get('amount') && _.isNumber(this.get('amount')))? true : false;
  }
});