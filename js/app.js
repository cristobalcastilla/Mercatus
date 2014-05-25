function startApp () {
  console.log('Starting app');

  // inicializamos la libreria que gestiona la arquitectura de la app
  app = new Framework7({
    modalTitle: 'Mercatus'
  });

  // Inicializo las vistas principales
  mainView = app.addView('.view-main', { dynamicNavbar: true });
  popupView = app.addView('.view-popup', { dynamicNavbar: true });

  
  // Eventos de la vista Popup
  var $$popup = $$('.popup');
  $$popup.on('open', function () { 
    $$('body').addClass('with-popup');
    $$(this).trigger('popupOpen');
  });

  $$popup.on('opened', function () {
    $$(this).trigger('popupOpened');
  });

  $$popup.on('close', function () {
    $$('body').removeClass('with-popup');
    $$(this).trigger('popupClose');
  });

  // $$popup.find('.add-product').on('click', function (e) {   
  //   var name = $$('.popup input[name="title"]').val().trim();

  //   var products = listsCollection.currentList.get('products');
  //   products.add(new Backbone.Model({
  //     name: name,
  //     checked: ''
  //   }));

  //   app.closeModal();
  //   updateList();
  // });
}


function updateList () {
  if (!listsCollection.currentList) throw new Error('listsCollection.currentList undefined');

  var product = _.last(listsCollection.currentList.get('products').models);
  var template = _.template($$('#template-product-item').html(), product.toJSON());
  console.log('el list');
  console.log($$('[data-page="list"] ul'));
  $$('[data-page="list"] ul.list').append(template);
}


function renderFindProduct (e) {
  console.log('renderFindProduct');
}


function renderProductDetail (e) {
  var page = e.detail.page;
  
  // Add product
  $$('.popup .add-product-details').on('click', function () {
    console.log('popup add product details');
  });
}


function removeProductDetail (e) {
  var page = e.detail.page;
  $$('.popup .add-product-details').off('click');
}


