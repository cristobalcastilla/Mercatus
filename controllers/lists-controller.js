

var listsController = {

  pageInit: function (e) {
    console.log('listsController pageInit');

    var page = e.detail.page;
    var $$container = $$(page.container);
    var $$ul = $$container.find('ul');

    if ($$ul.children().length !== listsCollection.models.length) {
      $$ul.html('');

      // añado items según la colección de listas
      _.each(listsCollection.models, function (list) {

        // genero el li mediante la plantilla        
        var template = _.template($$('#template-list-item').html(), {
          name: list.get('name'),
          slug: list.get('slug')
        });
        
        $$ul.append(template); // añado el li a la lista en la página
      }, this);
    }
  }

};