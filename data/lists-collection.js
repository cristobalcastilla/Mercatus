

var ListsCollection = Backbone.Collection.extend({
  model: ListModel,
  
  currentList: undefined, // aquí guardamos la lista activa
  setCurrent: function (model) {
    if (!model) throw new Error('Model not defined');
    if (!model instanceof ListModel) throw new Error('Model must be an instance of ListModel');

    this.currentList = model;
  }
});