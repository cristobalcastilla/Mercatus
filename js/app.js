function startApp () {
  console.log('Starting app');

  // inicializamos la libreria que gestiona la arquitectura de la app
  app = new Framework7({
    modalTitle: 'Mercatus'
  });

  // Inicializo las vistas principales
  mainView = app.addView('.view-main', { dynamicNavbar: true });
  popupView = app.addView('.view-popup', { dynamicNavbar: true });

  
  // Eventos de la vista Popup
  var $$popup = $$('.popup');
  $$popup.on('open', function () { 
    $$('body').addClass('with-popup');
    $$(this).trigger('popupOpen');
  });

  $$popup.on('opened', function () {
    $$(this).trigger('popupOpened');
  });

  $$popup.on('close', function () {
    $$('body').removeClass('with-popup');
    $$(this).trigger('popupClose');
  });
}