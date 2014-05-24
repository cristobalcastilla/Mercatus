
$(document).ready(function($) {
  console.log('jQuery is ready');

  // SETUP  
  $$ = Framework7.$; // Export selectors engine
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }; // para usar los templates tipo Mustache.js

  loadCounter = 0;
  loadingOrder = [loadTemplates, loadPages, loadInitialData, startApp];

  templates = [];
  pages = [];
  productsCollection = null;
  usersCollection = null;
  listsCollection = null;

  $(document).on('step-loaded', loadNext);
  loadNext();
});

function loadNext () {  
  var ret = loadingOrder[loadCounter].toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  
  console.log('load next', ret);
  loadingOrder[loadCounter]();
  loadCounter++;
}


function loadTemplates () {
  if (templates.length === 0) templates = $('script[type="template"]');

  for (var i=0, l=templates.length; i<l; i++) {
    var $item = $(templates[i]);

    if ($item.context.innerHTML === '') {      
      var fileName = $item.attr('id').substring(9);        
      $item.load('templates/'+fileName+'.html', loadTemplates);
      return;
    }
  }
  
  $(document).trigger('step-loaded');
}

function loadPages () {
  if (pages.length === 0) pages = $('[data-start-page]');

  for (var i=0, l=pages.length; i<l; i++) {
    var $item = $(pages[i]);

    if ($item.context.innerHTML === '') {
      var fileName = $item.attr('data-start-page');      
      $item.load('p-'+fileName+'.html', loadPages);
      return;
    }
  }

  $(document).trigger('step-loaded');
}

function loadInitialData () {
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
      name: product.name,
      slug: product.name.toSlug()
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
  $(document).trigger('step-loaded');
}