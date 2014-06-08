

var listController = {

  pageBeforeInit: function (e) {
    _.bindAll(this);
    this.isListWithCategories = false;
  },


  pageInit: function (e) {
    console.log('listController pageInit');
    
    var page = e.detail.page;

    this.$$el = $$(page.container);
    this.$$ul = this.$$el.find('.simple-list').find('ul');    

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
    this.$$ul.on('delete', '.swipeout', this.deleteItem);
  },


  pageBeforeRemove: function (e) {
    // des-registro los eventos
    this.items.off('add', this.renderList);
    this.$$ul.off('delete', '.swipeout', this.deleteItem);
    this.$$ul.off('click', 'li', this.listItemClicked);
    this.$$ul.off('click', '.item-media', this.itemMediaClicked);
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

    this.$$ul.html(''); // vacio la lista    

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

      this.$$ul.append(template);
      var $li = $(this.$$ul.children()[index]);
      $li.data('model', listItem);
    }, this);
    
    this.setEvents();
  },


  renderListWithCategories: function () {
    console.log('Rendering List With Categories');

    // this.$$ul.html(''); // vacio la lista

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

    //   this.$$ul.append(template);
    //   var $li = $(this.$$ul.children()[index]);
    //   $li.data('model', listItem);
    // }, this);   
  },


  setEvents: function () {
    // eventos de los list items
    this.$$ul.on('click', 'li', this.listItemClicked);

    // eventos de los checkboxes
    this.$$ul.on('click', '.item-media', this.itemMediaClicked);
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