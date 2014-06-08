

var listController = {

  pageBeforeInit: function (e) {
    _.bindAll(this);
    this.isListWithCategories = true;
  },


  pageInit: function (e) {
    console.log('listController pageInit');
    
    var page = e.detail.page;

    this.$$el = $$(page.container);
    this.$$simpleList = this.$$el.find('.simple-list').find('ul');    

    // obtengo la lista que voy a mostrar
    this.model = listsCollection.findWhere({slug: page.query.id});
    if (!this.model) throw new Error('Model not found');

    // dejo guardada la lista
    listsCollection.setCurrent(this.model); 
    this.items = this.model.get('items'); // coleccion con los items de esta lista
    
    // cambio el nombre de la lista
    var navBar = _.last( $$('.view-main').find('.navbar-inner') );
    $$(navBar).find('.center').html( this.model.get('name') );

    // creo la lista
    this.renderList();

    // evento para cuando se añadan nuevos productos a la lista y 
    this.items.on('add', this.renderList); 
    // evento para cuando se borra con swipe
    this.$$simpleList.on('delete', '.swipeout', this.deleteItem);
  },


  pageBeforeRemove: function (e) {
    // des-registro los eventos
    this.items.off('add', this.renderList);
    this.$$simpleList.off('delete', '.swipeout', this.deleteItem);
    this.$$simpleList.off('click', 'li', this.listItemClicked);
    this.$$simpleList.off('click', '.item-media', this.itemMediaClicked);
  },


  deleteItem: function (e) {
    console.log('deleteItem');

    var $$target = $$(e.target);
    var model = $$target.data('model');

    if (!model) throw new Error('deleteItem cannot find the model');

    // borro el modelo de la coleccion
    listsCollection.currentList.removeItem(model);
  },


  renderList: function () {
    if (this.isListWithCategories) {
      this.renderListWithCategories();
      return;
    }

    console.log('Rendering Simple List');

    this.$$simpleList.html(''); // vacio la lista    

    // relleno la lista usando una plantilla
    _.each(this.items.models, function (listItem, index) {
      var units = '';
      var amount = (listItem.get('amount') != 0)? ' - '+listItem.get('amount') : '';
      if (amount) {
        units = (listItem.get('units') != undefined)? unitsCollection.get(listItem.get('units')).get('abbr') : '';
      }

      var template = _.template($$('#template-product-item').html(), {
        name: listItem.productName(),
        amount: amount,
        units: units,
        checked: listItem.get('checked')
      });

      this.$$simpleList.append(template);
      var $li = $(this.$$simpleList.children()[index]);
      $li.data('model', listItem);
    }, this);
    
    this.setEvents();
  },


  renderListWithCategories: function () {
    console.log('Rendering List With Categories');

    // obtengo el div donde pondre todo la lista con titulos
    this.$$categorizedList = this.$$el.find('.categorized-list');

    // obtengo la coleccion ordenada por categorias
    var itemsByCategory = this.model.getItemsByCategory();

    itemsByCategory.each(function (group) {
      // creo el template con el titulo y el ul
      var titleTemplate = _.template(getTemplate('category-list'), {
        title: group.get('title')
      });

      this.$$categorizedList.append(titleTemplate);

      // referencio el ul
      var $$ul = $$(_.last(this.$$categorizedList.children())).find('ul');
      
      // creo los items
      var items = group.get('items');
      items.each(function (listItem) {
        var amount = '';
        var units = '';

        if (listItem.hasAmount()) {
          amount = ' - ' + listItem.get('amount');
          units = listItem.getUnitsAbbr();
        }

        var productTemplate = _.template(getTemplate('product-item'), {
          name: listItem.productName(),
          amount: amount,
          units: units,
          checked: listItem.get('checked')
        });

        $$ul.append(productTemplate);
      }, this);
    }, this);


    // relleno la lista usando una plantilla
    // _.each(this.items.models, function (listItem, index) {
    //   var units = '';
    //   var amount = (listItem.get('amount') != 0)? ' - '+listItem.get('amount') : '';
    //   if (amount) {
    //     units = (listItem.get('units') != undefined)? unitsCollection.get(listItem.get('units')).get('abbr') : '';
    //   }

    //   var template = _.template($$('#template-product-item').html(), {
    //     name: listItem.productName(),
    //     amount: amount,
    //     units: units,
    //     checked: listItem.get('checked')
    //   });

    //   this.$$simpleList.append(template);
    //   var $li = $(this.$$simpleList.children()[index]);
    //   $li.data('model', listItem);
    // }, this);   
  },


  setEvents: function () {
    // eventos de los list items
    this.$$simpleList.on('click', 'li', this.listItemClicked);

    // eventos de los checkboxes
    this.$$simpleList.on('click', '.item-media', this.itemMediaClicked);
  },


  listItemClicked: function (e) {
    e.preventDefault();
    e.stopPropagation();
  },


  itemMediaClicked: function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    var $icon = $(e.target);
    $icon.toggleClass('checked');

    var $li = $icon.parent().parent().parent();
    var itemModel = $li.data('model');
    
    itemModel.set('checked', $icon.hasClass('checked')?'checked':'');
  }
};