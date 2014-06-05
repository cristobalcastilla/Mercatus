

var listController = {

  pageBeforeInit: function (e) {
    _.bindAll(this);
  },


  pageInit: function (e) {
    console.log('listController pageInit');
    
    var page = e.detail.page;

    this.$$el = $$(page.container);
    this.$$ul = this.$$el.find('ul');

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

    // registro los eventos 
    this.items.on('add', this.renderList); // evento para cuando se añadan nuevos productos a la lista
    this.$$ul.on('delete', '.swipeout', this.deleteItem); // evento para cuando se borra con swipe
  },


  pageBeforeRemove: function (e) {
    // des-registro el evento
    this.items.off('add', this.renderList);
  },


  deleteItem: function (e) {
    console.log('deleteItem');

    var $$target = $$(e.target);
    var model = $$target.data('model');

    if (!model) throw new Error('deleteItem cannot find the model');

    // borro el modelo de la coleccion
    listsCollection.currentList.removeItem(model);
  },

  renderList: function (e) {
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
      var $$li = $$(this.$$ul.children()[index]);
      $$li.data('model', listItem);
    }, this);

    this.$$ul.on('click', '.item-media', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // console.log('j', $(e.target));
      console.log('e', $(e.target).parent().css({position:'relative', left:'10px'}));
      
    });

  }

};