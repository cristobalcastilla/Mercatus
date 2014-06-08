

var ListModel = Backbone.Model.extend({
  defaults: {
    name: undefined,
    slug: undefined, 

    items: undefined, // ListItemsCollection(),
    users: undefined, // UsersCollection(),

    created: moment(),
    modified: undefined
  },

  addItem: function (options) {
    if (!options || !options.name) throw new Error('addItem needs at least a name of product');

    var name = options.name;
    var product = productsCollection.findWhere({ id: name.toSlug() });
    
    var category;
    if (!product) { // si no existe el producto creo uno nuevo
      var defaultCategory = 'other';

      product = new ProductModel({
        name: options.name,
        category: defaultCategory,
        categoryId: categoriesCollection.findWhere({ slug: defaultCategory }).id
      });
    }

    // creo el modelo
    var item = new ListItemModel({
      product: product,
      checked: '',
      options: options.amount || 0,
      units: options.unit || undefined,
      notes: options.notes || undefined
    });

    this.get('items').add(item); // añado el modelo a la lista
  },

  removeItem: function (model) {
    if (!model || model instanceof ListItemModel === false) throw new Error('removeItem needs a ListItemModel model');

    this.get('items').remove(model);
  },

  getCompletedPercent: function () {
    var items = this.get('items');
    var percent = items.where({ checked: 'checked' }).length / items.length;
    return percent;
  },

  getItemsByCategory: function () {
    var items = this.get('items');

    // creo un array con todos los ids de las categorias
    var categoriesIds = [];
    items.each(function (item) {
      categoriesIds.push(item.get('product').get('category').id);
    });

    // agrupo los ids
    categoriesIds = _.uniq(categoriesIds, false);

    // creo la coleccion que contendra los items agrupados
    var itemsByCategory = new Backbone.Collection();

    _.each(categoriesIds, function (categoryId) {      
      // creo un array con los productsModel de cada categoria
      var itemsOfCategory = [];
      items.each(function (item) {  
        if (item.get('product').get('category').id === categoryId) {
          itemsOfCategory.push(item);          
        }
      });

      var group = new Backbone.Model({
        categoryName: categoriesCollection.get(categoryId).get('name'),
        category: categoriesCollection.get(categoryId),
        items: new Backbone.Collection(itemsOfCategory)
      });

      itemsByCategory.add(group);
    });

    return itemsByCategory;
  }
});