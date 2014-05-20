function startApp () {
  $$ = Framework7.$; // Export selectors engine

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

    var products = listActive.get('products');
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

  var model = _.find(listsCollection.models,  function (list) {
    return list.get('slug') === page.query.id;
  });

  listActive = model;

  // añado items según la colección de lista
  _.each(model.get('products').models, function (product) {
    var template = _.template($$('#template-product-item').html(), product.toJSON());
    $$(page.container).find('ul').append(template);
  });
}


function updateList () {
  if (!listActive) throw new Error('listActive undefined');

  var product = _.last(listActive.get('products').models);
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

// var todoData = localStorage.td7Data? JSON.parse(localStorage.td7Data) : [];

// // Popup colors
// $$('.popup .color').on('click', function () {
//   $$('.popup .color.selected').removeClass('selected');
//   $$(this).addClass('selected');
// });

// // Add Task
// $$('.popup .add-product').on('click', function () {
//   console.log('add add-product');

//   var title = $$('.popup input[name="title"]').val().trim();
//   if (title.length === 0) { 
//     console.log('title empty');
//     myApp.closeModal('.popup');
//     return; 
//   }
//     // var color = $$('.popup .color.selected').attr('data-color');
//     todoData.push({
//       title: title,
//         // color: color,
//         checked: '',
//         id: (new Date()).getTime()
//       });
//     localStorage.td7Data = JSON.stringify(todoData);
//     buildTodoListHtml();
//     myApp.closeModal('.popup');
//   });

// // Build Todo HTML
// var todoItemTemplate = $$('#todo-item-template').html();
// function buildTodoListHtml() {
//   var html = '';
//   for (var i = 0; i < todoData.length; i++) {
//     var todoItem = todoData[i];
//     html += todoItemTemplate
//     .replace(/{{title}}/g, todoItem.title)
//                     // .replace(/{{color}}/g, todoItem.color)
//                     .replace(/{{checked}}/g, todoItem.checked)
//                     .replace(/{{id}}/g, todoItem.id);
//                   }
//                   $$('.todo-items-list ul').html(html);
//                 }
// // Build HTML on App load
// buildTodoListHtml();

// // Mark checked
// $$('.todo-items-list').on('change', 'input', function () {
//   var input = $$(this);
//   var checked = input[0].checked;
//   var id = input.parents('li').attr('data-id') * 1;
//   for (var i = 0; i < todoData.length; i++) {
//     if (todoData[i].id === id) todoData[i].checked = checked ? 'checked' : '';
//   }
//   localStorage.td7Data = JSON.stringify(todoData);
// });

// // Delete item
// $$('.todo-items-list').on('delete', '.swipeout', function () {
//   var id = $$(this).attr('data-id') * 1;
//   var index;
//   for (var i = 0; i < todoData.length; i++) {
//     if (todoData[i].id === id) index = i;
//   }
//   if (typeof(index) !== 'undefined') {
//     todoData.splice(index, 1);
//     localStorage.td7Data = JSON.stringify(todoData);
//   }
// });


