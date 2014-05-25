
// los controladores responden a los eventos de Framework7:

var findProductController = {

  pageBeforeInit: function (e) {
    console.log('findProductController pageBeforeInit');
    _.bindAll(this);
  },
  
  
  pageInit: function (e) {
    console.log('findProductController pageInit');

    var page = e.detail.page;
    this.$$el = $$(page.container);
    this.$$title = this.$$el.find('input[name="title"]');

    $(document).on('popupOpened', this.opened);
    $('.add-product').on('click', this.onAddProductClick);
  },


  pageBeforeRemove: function (e) {
    console.log('findProductController pageBeforeRemove');

    $(document).off('popupOpened', this.opened);
    this.$$title.blur().val('');
  },

  // eventos de los botones
  onAddProductClick: function (e) {
    console.log('onAddProductClick');

    var name = this.$$title.val().trim();
    if (name === '') return;

    listsCollection.currentList.addItem({ name: name });

    // var products = listsCollection.currentList.get('products');
    // products.add(new Backbone.Model({
    //   name: name,
    //   checked: ''
    // }));
    // updateList();

    app.closeModal();
  },

  // eventos que recibe de la vista
  opened: function () {
    console.log('findProductController opened');
    
    this.$$title.focus();
  }
};