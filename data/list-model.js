

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
  }
});