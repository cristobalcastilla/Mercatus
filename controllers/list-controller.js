

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

    // creo la lista
    this.renderList();

    // registro el evento para cuando se añadan nuevos productos a la lista
    this.items.on('add', this.renderList);
  },


  pageBeforeRemove: function (e) {
    // des-registro el evento
    this.items.off('add', this.renderList);
  },


  renderList: function (e) {
    // vacio la lista
    this.$$ul.html('');

    // relleno la lista usando una plantilla
    _.each(this.items.models, function (listItem) {
      var template = _.template($$('#template-product-item').html(), {
        name: listItem.productName(),
        checked: listItem.get('checked')
      });

      var $li = this.$$ul.append(template);
      $li.data('model', listItem);
    }, this);
  }

};