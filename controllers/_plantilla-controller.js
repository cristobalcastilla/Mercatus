
// cambiar el nombre de la variable por un nombre único

var nameController = {

  // los controladores son el encargado de gestionar las páginas
  // los controladores responden a los eventos de Framework7:

  // Event will be triggered when Framework7 just inserts new page to DOM
  pageBeforeInit: function (e) {
    console.log('nameController pageBeforeInit');
  },

  // Event will be triggered after Framework7 initialize required page's components and navbar
  pageInit: function (e) {
    console.log('nameController pageInit');
  }

  // Event will be triggered when everything initialized and page (and navbar) is ready to be animated
  pageBeforeAnimation: function (e) {
    console.log('nameController pageBeforeAnimation');
  }

  // Event will be triggered after page (and navbar) animation
  pageAfterAnimation: function (e) {
    console.log('nameController pageAfterAnimation');    
  }

  // Event will be triggered right before Page will be removed from DOM. This event could be very useful if you need to detach some events / destroy some plugins to free memory
  pageBeforeRemove: function (e) {
    console.log('nameController pageBeforeRemove');
  }
};