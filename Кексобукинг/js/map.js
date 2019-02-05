'use strict';
(function () {
  var cityMap = document.querySelector('.map');
  var mapPinMain = cityMap.querySelector('.map__pin--main');
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = 750;
  var MAIN_PIN_TAIL = 20;
  var MAIN_PIN_HEIGHT = 60;
  var X_MAX_COORD = 1170;
  var X_MIN_COORD = 30;
  var Y_MAX_COORD = 660;
  var Y_MIN_COORD = 130;

window.map = {
  // Получение координат основной метки
    'getMainPinCoord': function () {
      return mapPinMain.offsetLeft + ', ' + (mapPinMain.offsetTop + window.utils.getHalf(MAIN_PIN_HEIGHT) + MAIN_PIN_TAIL);
    },
    // Деактивация карты
    'disabledMap': function () {
      cityMap.classList.add('map--faded');
      disabledPins(getPins());
      setMainPinCoordsDefault();
      closePopup();
    }
  };

  // Активация карты и формы для подачи объявления
  var enabledMap = function () {
    cityMap.classList.remove('map--faded');
    window.form.enabledForm();
    addEventToPin(enabledPins(getPins()));
    getPins();
  };

  // Взаимодействие с метками объявления
  // Добавление метки объявления на карту
  var addOfferMark = function (offerPin) {
    var mapPins = cityMap.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offerPin.length; i++) {
      fragment.appendChild(window.getPin(offerPin[i]));
      mapPins.appendChild(fragment);
    }
  };

  window.backend.loadData(addOfferMark);

  // Получение Элементов метки после активации карты
  var getPins = function () {
    var offerPins = cityMap.querySelectorAll('.map__pin');
    return offerPins;
  };

  // Активация меток на карте
  var enabledPins = function (noActivPin) {
    for (var i = 1; i < noActivPin.length; i++) {
      noActivPin[i].classList.remove('hidden');
    }
    return noActivPin;
  };

  // Деактивация меток на карте
  var disabledPins = function (activPin) {
    for (var i = 1; i < activPin.length; i++) {
      activPin[i].classList.add('hidden');
    }
  };

  // Маркировка выбранной на карте метки
  var markPin = function (unmarkPin) {
    unmarkPin.classList.add('map__pin--active');
  };

  // Снятие маркировки с метки
  var unmarkPin = function (markPins) {
    for (var i = 1; i < markPins.length; i++) {
      markPins[i].classList.remove('map__pin--active');
    }
  };

  // Сброс координат основной метки по умолчанию
  var setMainPinCoordsDefault = function () {
    mapPinMain.style.left = window.utils.getHalf(MAP_WIDTH) + 'px';
    mapPinMain.style.top = window.utils.getHalf(MAP_HEIGHT) + 'px';
  };

  // Взаимодействие с карточками объявления
  // Добавление объявления в DOM
  var addAdvertising = function (element) {
    var mapFilters = cityMap.querySelector('.map__filters-container');
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.getCard(element));
    cityMap.insertBefore(fragment, mapFilters);
  };

  // Открыть попап с объявлением
  var openPopup = function (popupOffer) {
    addAdvertising(popupOffer);
    document.addEventListener('keydown', onPopupPressEsc);
    var popupClose = cityMap.querySelector('.popup__close');
    popupClose.addEventListener('click', closePopup);
  };

  // Закрыть попап с объявлением
  var closePopup = function () {
    if (cityMap.querySelector('.popup')) {
      var popup = cityMap.querySelector('.popup');
      cityMap.removeChild(popup);
      unmarkPin(getPins());
    }
    document.removeEventListener('keydown', onPopupPressEsc);
  };

  // Закрытие попап по нажатию на ESC
  var onPopupPressEsc = function (escEvent) {
    window.utils.isEscPressEvent(escEvent, closePopup);
  };

  // Добавление обработчиков событий для открытия объявления по щелчку на каждую метку
  var addOnPinClickOpen = function (pin, offer) {
    pin.addEventListener('click', function () {
      openPopup(offer);
      markPin(pin);
    });
  };

  // Добавление обработчиков событий для закрытия объявления по щелчку на другую метку
  var addOnPinClickClose = function (mark) {
    mark.addEventListener('click', function () {
      closePopup();
    });
  };

  var addEventToPin = function (pins) {
    for (var i = 0; i < window.data.length; i++) {
      addOnPinClickClose(pins[i + 1]);
      addOnPinClickOpen(pins[i + 1], window.data[i]);
    }
  };

  // Drag and drop основной метки объявления
  mapPinMain.addEventListener('mousedown', function (evt) {

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (mapPinMain.offsetTop < Y_MIN_COORD) {
        mapPinMain.style.top = Y_MIN_COORD + 'px';
      } if (mapPinMain.offsetTop > Y_MAX_COORD) {
        mapPinMain.style.top = Y_MAX_COORD + 'px';
      } if (mapPinMain.offsetLeft < X_MIN_COORD) {
        mapPinMain.style.left = X_MIN_COORD + 'px';
      } if (mapPinMain.offsetLeft > X_MAX_COORD) {
        mapPinMain.style.left = X_MAX_COORD + 'px';
      } else {
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      enabledMap();

      window.form.getMainPinAdress();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
