
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

    $(document).on('popupOpened', this.popupOpened);
    $(document).on('popupClose', this.popupClose);
    $('.add-product').on('click', this.onAddProductClick);

    this.$typeahead = $('.find-product ul.results');

    this.$typeahead.typeahead({
      source: function(query, process) {
        return ["Deluxe Bicycle", "Super Deluxe Trampoline", "Super Duper Scooter"];
      }
    });

    $('.find-product input[name="title"]').change(this.autocomplete);
    // this.$$el.find('input[name="title"]').on('change', this.autocomplete);
  },


  autocomplete: function (e) {
    console.log('autocomplete');
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
  popupOpened: function () {
    console.log('findProductController opened');
    
    this.$$title.focus();
  },

  popupClose: function () {
    this.$$title.val('');
  }
};