
$(document).ready(function($) {
  console.log('jQuery is ready');

  // SETUP  
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }; // para usar los templates tipo Mustache.js

  templates = [];
  productsCollection = null;
  usersCollection = null;
  listsCollection = null;
  data = {};

  loadTemplates();
});

function loadTemplates (response) {
  if (templates.length === 0) templates = $('script[type="template"]');

  for (var i=0, l=templates.length; i<l; i++) {
    var $item = $(templates[i]);

    if ($item.context.innerHTML === '') {
      var id = $item.attr('id');
      var src = id.substring(9);
      $('#'+id).load('templates/'+src+'.html', loadTemplates);
      return;
    }
  }
  
  loadInitialData();
}

function loadInitialData (response) {
  if (!usersCollection || !productsCollection || !listsCollection) {
    $.ajax({
      url: 'data/data.json',
      dataType: 'json',
      success: createDataCollections,
      error: function onLoadInitialDataError () { console.log('ERROR loading data', xhr, textStatus, errorThrown) }
    });
  }
}

function createDataCollections (data) {
  console.log('SUCCESS loading data');

  // PRODUCTS (RAW) COLLECTION
  // creamos una colección para guardar los productos
  productsCollection = new Backbone.Collection();

  _.each(data.products, function (product) {
    var productModel = new Backbone.Model({ 
      id: product.name,
      name: product.name 
    });
    productsCollection.add(productModel);
  });

  // USERS COLLECTION
  // creamos una colección para guardar los datos de los usuarios
  usersCollection = new Backbone.Collection();

  _.each(data.users, function (user) {
    var userModel = new Backbone.Model(user, { parse: true });
    usersCollection.add(userModel);
  });

  // LISTS COLLECTION
  // inicializamos la colección que tendrá todas las listas
  listsCollection = new Backbone.Collection();
  
  _.each(data.lists, function (list) {
    // creamos el modelo que contendrá los datos de 1 lista
    var listModel = new Backbone.Model(list, { parse: true });
    listModel.set('slug', listModel.get('name').toSlug());
  
    var listProducts = new Backbone.Collection();
    _.each(list.products, function (product) {
      var productModel = new Backbone.Model(product, { parse: true });
      listProducts.add(productModel);
    });
    listModel.set('products', listProducts);

    // relleno los usuarios a la lista
    var listUsers = new Backbone.Collection();
    _.each(list.users, function (user) {
      listUsers.add(usersCollection.get(user));
    });
    listModel.set('users', listUsers);

    // añado la nueva lista a la colección
    listsCollection.add(listModel);
  });

  // inicio la aplicación!!!
  startApp();
}