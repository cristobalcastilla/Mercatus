

var listController = {

  pageBeforeInit: function (e) {
    _.bindAll(this);
  },

  pageInit: function (e) {
    console.log('listController pageInit');

    var page = e.detail.page;
    var $$ul = $$(page.container).find('ul');

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

      var $li = $$ul.append(template);
      $li.data('model', listItem);
    });
  }

};