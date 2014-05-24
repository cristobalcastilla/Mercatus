
$(document).ready(function($) {
  console.log('jQuery is ready');

  // SETUP  
  $$ = Framework7.$; // Export selectors engine
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }; // para usar los templates tipo Mustache.js

  loadCounter = 0;
  loadingOrder = [loadTemplates, loadPages, loadInitialData, startApp];

  templates = [];
  pages = [];

  categoriesCollection = null;
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


  // CATEGORIES COLLECTION
  categoriesCollection = new CategoriesCollection();
  _.each(data.categories, function (category) {    
    var categoryModel = new CategoryModel({
      id: category.id,
      name: category.name,
      slug: category.name.toSlug()
    });
    categoriesCollection.add(categoryModel);
  });
  

  // PRODUCTS (RAW) COLLECTION
  // creamos una colección para guardar los productos
  productsCollection = new ProductsCollection();

  _.each(data.products, function (product) {
    var productModel = new ProductModel({
      id: product.name.toSlug(),
      name: product.name,
      category: categoriesCollection.get(product.category)
    });
    productsCollection.add(productModel);
  });


  // USERS COLLECTION
  // creamos una colección para guardar los datos de los usuarios
  usersCollection = new UsersCollection();

  _.each(data.users, function (user) {
    var userModel = new UserModel(user, { parse: true });
    usersCollection.add(userModel);
  });


  // LISTS COLLECTION
  // inicializamos la colección que tendrá todas las listas
  listsCollection = new ListsCollection();
  
  _.each(data.lists, function (list) {
    // creamos el modelo que contendrá los datos de 1 lista
    var listModel = new ListModel({
      name: list.name,
      created: moment(list.created),
      slug: list.name.toSlug()
    });
    
    // añadimos los items a la lista
    _.each(list.items, function (item) {
      var listItemModel = new ListItemModel({
        product: productsCollection.get(item.slug),
        checked: item.checked,
        amount: item.amount,
        units: item.units
      });
      listModel.get('items').add(listItemModel);
    });

    // relleno los usuarios a la lista
    _.each(list.users, function (user) {
      listModel.get('users').add(usersCollection.get(user));
    });

    // añado la nueva lista a la colección
    listsCollection.add(listModel);
  });

  // inicio la aplicación!!!
  $(document).trigger('step-loaded');
}