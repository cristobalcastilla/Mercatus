function startApp () {
  // ---
  // VIEW EVENTS
  $$('.popup').on('open', function () {    
    $$('body').addClass('with-popup');    
  });

  $$('.popup').on('opened', function () {
    $$(this).find('input[name="title"]').focus();
  });

  $$('.popup').on('close', function () {
    $$('body').removeClass('with-popup');
    $$(this).find('input[name="title"]').blur().val('');
  });
  
  // ---
  // PAGE EVENTS
  $$(document).on('pageBeforeInit', function (e) {
    var page = e.detail.page;
    console.log('pageBeforeInit', page.name, page.query);

    switch(page.name) {
      case 'lists':
        renderLists(e);
        break;
      case 'list':
        renderList(e);
        break;
      case 'find-product':
        renderFindProduct(e);
        break;
      case 'product-detail':
        renderProductDetail(e);
        break;
      default:
        console.log('page not found in pageBeforeInit');
    }
  });

  $$(document).on('pageInit', function (e) {
    var page = e.detail.page;
  });

  $$(document).on('pageBeforeRemove', function (e) {
    var page = e.detail.page;

    switch(page.name) {
      case 'product-detail':
        removeProductDetail(e);
        break;
      default:
        console.log('page not found in pageBeforeRemove');
    }
  });

  // ---
  // BUTTON EVENTS
  $$('.popup .add-product').on('click', function (e) {
    console.log('popup add product');
    var name = $$('.popup input[name="title"]').val().trim();

    var products = listsCollection.currentList.get('products');
    products.add(new Backbone.Model({
      name: name,
      checked: ''
    }));

    app.closeModal();
    updateList();
  });

  // ---
  // APP & VIEWS
  // inicializamos la libreria que gestiona la arquitectura de la app
  app = new Framework7({
    modalTitle: 'Mercatus'
  });

  // Inicializo las vistas
  mainView = app.addView('.view-main', { dynamicNavbar: true });
  popupView = app.addView('.view-popup', { dynamicNavbar: true });
}

// ---
// PAGES
function renderLists (e) {
  var page = e.detail.page;

  // añado items según la colección de listas
  _.each(listsCollection.models, function (list) { 
    var template = _.template($$('#template-list-item').html(), list.toJSON());
    $$(page.container).find('ul').append(template);
  });
}


function renderList (e) {
  var page = e.detail.page;

  // obtengo la lista que voy a mostrar
  var model = listsCollection.findWhere({slug: page.query.id});
  if (!model) throw new Error('Model not found');
  
  listsCollection.setCurrent(model); // dejo guardada la lista

  // añado items según la colección de lista
  _.each(model.get('items').models, function (listItem) {
    var template = _.template($$('#template-product-item').html(), {
      name: listItem.productName(),
      checked: listItem.get('checked')
    });

    var $li = $$(page.container).find('ul').append(template);
    $li.data('model', listItem);
  });

  // $$(page.container).find('.swipeout').on('delete', function () {
    // var model = $$(this).data('model');
    // console.log('model', model);
    // var index;
    // for (var i = 0; i < todoData.length; i++) {
    //     if (todoData[i].id === id) index = i;
    // }
    // if (typeof(index) !== 'undefined') {
    //     todoData.splice(index, 1);
    //     localStorage.td7Data = JSON.stringify(todoData);
    // }
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


